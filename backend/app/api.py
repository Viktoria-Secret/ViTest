from fastapi import FastAPI, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv

from .database import get_supabase
from .tasks import issue_pin

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="Vik.tor API",
    description="API for Vik.tor Internet Access Management",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You should restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class PinRequest(BaseModel):
    rank: str
    code: str
    mac_address: Optional[str] = None

class PinResponse(BaseModel):
    success: bool
    pin: Optional[str] = None
    message: Optional[str] = None

class ValidatePinRequest(BaseModel):
    pin: str
    mac_address: Optional[str] = None

class ValidatePinResponse(BaseModel):
    valid: bool
    rank: Optional[str] = None
    role_name: Optional[str] = None
    mac_address: Optional[str] = None
    data_used: Optional[int] = None
    data_limit: Optional[int] = None
    message: Optional[str] = None


@app.get("/")
async def read_root():
    return {"message": "Welcome to Vik.tor API", "status": "operational"}


@app.post("/request-pin", response_model=PinResponse)
async def request_pin(request: PinRequest = Body(...)):
    """
    Request a PIN for internet access based on crew rank.
    """
    try:
        # Use the synchronous Celery task to handle database operations
        result = issue_pin.delay(request.code, request.mac_address)
        task_result = result.get(timeout=10)  # Wait for the task to complete
        
        if task_result["success"]:
            return PinResponse(
                success=True,
                pin=task_result["pin"]
            )
        else:
            return PinResponse(
                success=False,
                message=task_result.get("message", "Failed to generate PIN")
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/validate-pin", response_model=ValidatePinResponse)
async def validate_pin(request: ValidatePinRequest = Body(...)):
    """
    Validate a PIN and check if it's valid for internet access.
    """
    try:
        supabase = get_supabase()
        
        # Query the pin_codes table to check if the PIN exists and is active
        result = supabase.table('pin_codes') \
            .select('*, crew_members(*, crew_ranks(*))') \
            .eq('pin_code', request.pin) \
            .eq('is_active', True) \
            .filter('expires_at', 'gt', 'now()') \
            .execute()
        
        if not result.data or len(result.data) == 0:
            return ValidatePinResponse(
                valid=False, 
                message="Invalid or expired PIN"
            )
        
        pin_data = result.data[0]
        crew_member = pin_data['crew_members']
        crew_rank = crew_member['crew_ranks']
        
        # Return validation result
        return ValidatePinResponse(
            valid=True,
            rank=crew_rank['name'],
            role_name=crew_rank['name'],
            mac_address=request.mac_address,
            data_used=pin_data['usage_bytes'],
            data_limit=crew_rank['daily_quota']
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health_check():
    """Check API health"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)