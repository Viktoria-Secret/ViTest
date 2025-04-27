import os
from fastapi import FastAPI, Depends, HTTPException, Request
from pin_schema import PinRequest, PinResponse, RequestPinSchema
from auth_store import store
from sheets_helper import is_rank_allowed
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

API_KEY=os.getenv('VIKTOR_API_KEY','change')
app=FastAPI()

def guard(r:Request):
    if r.headers.get('x-api-key')!=API_KEY: raise HTTPException(401)
@app.post('/submit',response_model=PinResponse,dependencies=[Depends(guard)])
async def submit(p:PinRequest):
    return store.validate_pin(p.pin,p.mac)
@app.post('/generate/{rank}',response_model=PinResponse,dependencies=[Depends(guard)])
async def gen(rank:str):
    return store.issue_new(rank)
@app.post('/request_pin',response_model=PinResponse)
async def request_pin(request:RequestPinSchema):
    # Check if the rank is authorized to get a PIN using Google Sheets
    if not is_rank_allowed(request.rank):
        raise HTTPException(status_code=403, detail="Access denied for this rank")
    
    # If rank is allowed, proceed with PIN generation
    return store.issue_new(request.rank)
