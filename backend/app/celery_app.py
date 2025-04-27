import os
from celery import Celery
from celery.schedules import crontab
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get Celery configuration from environment variables
CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://redis:6379/0")
CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", 
                                   "db+postgresql://viktor:viktor_secret@db:5432/viktor")

# Create Celery app
celery_app = Celery(
    "viktor_app",
    broker=CELERY_BROKER_URL,
    backend=CELERY_RESULT_BACKEND,
    include=["app.tasks"]
)

# Configure Celery
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

# Define Celery Beat schedule
celery_app.conf.beat_schedule = {
    "reset-quotas-monthly": {
        "task": "app.tasks.reset_quotas",
        # Run on the 1st day of every month at midnight
        "schedule": crontab(day_of_month=1, hour=0, minute=0),
    },
}

# Optional: Add additional configurations
celery_app.conf.update(
    task_routes={
        "app.tasks.issue_pin": {"queue": "pins"},
        "app.tasks.reset_quotas": {"queue": "maintenance"},
    }
)

if __name__ == "__main__":
    celery_app.start()