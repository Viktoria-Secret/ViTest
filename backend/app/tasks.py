import os
import random
import string
import logging
from datetime import datetime
from celery import Task
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
import routeros_api

from .celery_app import celery_app

# Set up logging
logger = logging.getLogger(__name__)

# Connect to the database
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg://viktor:viktor_secret@db:5432/viktor")
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

# MikroTik connection details
MIKROTIK_HOST = os.getenv("MIKROTIK_HOST", "router.local")
MIKROTIK_USER = os.getenv("MIKROTIK_USER", "admin")
MIKROTIK_PASSWORD = os.getenv("MIKROTIK_PASSWORD", "password")

class DatabaseTask(Task):
    """Task with database session handling."""
    _session = None

    def after_return(self, *args, **kwargs):
        if self._session is not None:
            self._session.close()
            self._session = None

    @property
    def session(self):
        if self._session is None:
            self._session = Session()
        return self._session


@celery_app.task(base=DatabaseTask, bind=True)
def issue_pin(self, rank, mac=None):
    """
    Issue a new PIN for the given rank and device MAC address.
    Inserts a new row in the vouchers table and returns the generated PIN.
    
    Args:
        rank: The crew rank code (e.g., 'CPT', '2E', etc.)
        mac: Optional MAC address of the device
        
    Returns:
        dict: Response with PIN and status
    """
    session = self.session
    
    try:
        # Check if rank is allowed to get a PIN
        query = text("SELECT allowed FROM crew_members WHERE role_code = :rank")
        result = session.execute(query, {"rank": rank}).fetchone()
        
        if not result or not result[0]:
            logger.warning(f"Rank {rank} not allowed access")
            return {"success": False, "message": "Access denied for this rank"}
            
        # Generate a random 8-character PIN
        pin = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
        
        # Get current timestamp
        now = datetime.utcnow()
        
        # Insert the new voucher
        insert_query = text("""
            INSERT INTO vouchers (pin, rank, mac_address, created_at, expires_at)
            VALUES (:pin, :rank, :mac, :created_at, :created_at + INTERVAL '30 days')
            RETURNING id
        """)
        
        result = session.execute(
            insert_query, 
            {
                "pin": pin,
                "rank": rank,
                "mac": mac,
                "created_at": now
            }
        ).fetchone()
        
        voucher_id = result[0] if result else None
        
        # Commit the transaction
        session.commit()
        
        # Try to create the voucher in MikroTik if needed
        try:
            create_mikrotik_voucher(pin)
        except Exception as e:
            logger.error(f"Failed to create MikroTik voucher: {e}")
            # Don't fail the task if MikroTik integration fails
        
        logger.info(f"Generated PIN {pin} for rank {rank}")
        return {"success": True, "pin": pin, "id": voucher_id}
        
    except Exception as e:
        session.rollback()
        logger.error(f"Error generating PIN: {e}")
        return {"success": False, "message": str(e)}


@celery_app.task(base=DatabaseTask, bind=True)
def reset_quotas(self):
    """
    Reset monthly data quotas for all crew members.
    This task is scheduled to run on the 1st of each month.
    """
    session = self.session
    
    try:
        # Reset quota used in the database
        query = text("UPDATE vouchers SET data_used = 0 WHERE active = TRUE")
        result = session.execute(query)
        
        # Reset vouchers in MikroTik if needed
        try:
            reset_mikrotik_vouchers()
        except Exception as e:
            logger.error(f"Failed to reset MikroTik vouchers: {e}")
            # Don't fail the task if MikroTik integration fails
        
        session.commit()
        
        logger.info(f"Reset quotas for {result.rowcount} vouchers")
        return {"success": True, "count": result.rowcount}
        
    except Exception as e:
        session.rollback()
        logger.error(f"Error resetting quotas: {e}")
        return {"success": False, "message": str(e)}


def create_mikrotik_voucher(pin):
    """Create a voucher in MikroTik router."""
    try:
        # Connect to MikroTik
        connection = routeros_api.RouterOsApiPool(
            MIKROTIK_HOST,
            username=MIKROTIK_USER,
            password=MIKROTIK_PASSWORD,
            plaintext_login=True
        )
        api = connection.get_api()
        
        # Add the voucher to HotSpot
        hotspot = api.get_resource('/ip/hotspot/user')
        hotspot.add(
            name=pin,
            password=pin,
            profile="crew",
            limit_uptime="720h",  # 30 days
            comment=f"Auto-generated by Vik.tor"
        )
        
        connection.disconnect()
        logger.info(f"Created MikroTik voucher for PIN {pin}")
        
    except Exception as e:
        logger.error(f"MikroTik error: {e}")
        raise


def reset_mikrotik_vouchers():
    """Reset MikroTik voucher quotas."""
    try:
        # Connect to MikroTik
        connection = routeros_api.RouterOsApiPool(
            MIKROTIK_HOST,
            username=MIKROTIK_USER,
            password=MIKROTIK_PASSWORD,
            plaintext_login=True
        )
        api = connection.get_api()
        
        # Reset quotas for all users in the crew profile
        users = api.get_resource('/ip/hotspot/user')
        user_list = users.get(profile="crew")
        
        for user in user_list:
            user_id = user.get('id', None)
            if user_id:
                users.set(id=user_id, limit_bytes_total="10000000000")  # Reset to 10GB
        
        connection.disconnect()
        logger.info(f"Reset {len(user_list)} MikroTik vouchers")
        
    except Exception as e:
        logger.error(f"MikroTik error: {e}")
        raise