import os
import gspread
from google.oauth2.service_account import Credentials
from pathlib import Path

# Define the scopes
SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets.readonly',
    'https://www.googleapis.com/auth/drive.readonly'
]

def get_sheet_client():
    """Connect to Google Sheets API and return the client"""
    key_file = Path(__file__).parent / "keys" / "service_account.json"
    
    if not key_file.exists():
        raise FileNotFoundError(
            f"Service account key file not found at {key_file}. "
            "Please place your service_account.json file in the backend/keys directory."
        )
    
    credentials = Credentials.from_service_account_file(
        str(key_file), scopes=SCOPES
    )
    return gspread.authorize(credentials)

def is_rank_allowed(rank: str) -> bool:
    """
    Check if the given rank is allowed to request a PIN
    
    Args:
        rank: The rank code (e.g., "CE", "4E", "3E")
        
    Returns:
        bool: True if the rank is allowed, False otherwise
    """
    try:
        # Get the sheet ID from environment variable
        sheet_id = os.getenv("ROLES_SHEET_ID")
        if not sheet_id:
            # If no sheet ID is provided, log a warning and allow all ranks for now
            print("WARNING: ROLES_SHEET_ID environment variable not set. Allowing all ranks.")
            return True
            
        # Connect to Google Sheets
        client = get_sheet_client()
        spreadsheet = client.open_by_key(sheet_id)
        
        # Get the roles worksheet
        roles_sheet = spreadsheet.worksheet("roles")
        
        # Get all the data
        all_data = roles_sheet.get_all_values()
        
        # Skip header row if it exists
        data_rows = all_data[1:] if len(all_data) > 0 else []
        
        # Find the rank in the data
        for row in data_rows:
            # Check if we have at least 3 columns
            if len(row) >= 3:
                role_code, _, allowed = row[0], row[1], row[2]
                if role_code.strip().lower() == rank.strip().lower():
                    # Convert the allowed value to a boolean
                    return allowed.strip().upper() == "TRUE"
        
        # If rank not found, default to not allowed
        return False
        
    except Exception as e:
        # Log the error and default to not allowed
        print(f"Error checking rank {rank}: {str(e)}")
        return False 