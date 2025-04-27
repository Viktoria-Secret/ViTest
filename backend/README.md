# Vik.tor Backend

## Google Sheets Integration Setup

This backend now includes integration with Google Sheets to validate crew ranks for PIN requests.

### 1. Setup Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Google Sheets integration
ROLES_SHEET_ID=your_google_sheet_id_here
```

### 2. Setup Service Account

1. Create a Google Cloud Platform project
2. Enable the Google Sheets API
3. Create a service account and download the JSON key
4. Place the service account key in `backend/keys/service_account.json`
5. Share your Google Sheet with the service account email

### 3. Create the Roles Sheet

Create a Google Sheet with the following structure:

- Name the worksheet "roles"
- Column A: `role_code` (e.g. "4E", "3E", "CE")
- Column B: `title` (e.g. "Fourth Engineer")
- Column C: `allowed` (value: "TRUE" or "FALSE")

### 4. Start the Application

With these configurations in place, the `/request_pin` endpoint will now validate ranks against Google Sheets. 