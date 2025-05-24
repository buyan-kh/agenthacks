from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
import json
from datetime import datetime
import asyncio
from openai import AsyncOpenAI
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv
import uuid

# Load environment variables first
load_dotenv()

# Verify required environment variables
required_env_vars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL', 
    'FIREBASE_PRIVATE_KEY',
    'OPENAI_API_KEY'
]

for key in required_env_vars:
    if not os.getenv(key):
        print(f"Missing environment variable {key}. Please add it to .env")
        exit(1)

# Initialize Firebase Admin SDK
service_account_info = {
    "type": "service_account",
    "project_id": os.getenv('FIREBASE_PROJECT_ID'),
    "client_email": os.getenv('FIREBASE_CLIENT_EMAIL'),
    "private_key": os.getenv('FIREBASE_PRIVATE_KEY').replace('\\n', '\n'),
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{os.getenv('FIREBASE_CLIENT_EMAIL')}"
}

if not firebase_admin._apps:
    cred = credentials.Certificate(service_account_info)
    firebase_admin.initialize_app(cred)

db = firestore.client()

# Initialize FastAPI app
app = FastAPI(title="Lesson Planner API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class UserPromptRequest(BaseModel):
    userId: str
    prompt: str

class UserPromptGetResponse(BaseModel):
    userId: str
    lessons: List[Dict[str, Any]]

class UserPromptPostResponse(BaseModel):
    success: bool
    message: str
    userId: str
    prompt: str

# Routes
@app.get("/")
async def root():
    return {"message": "Lesson Planner API is running"}

# GET ENDPOINT - Get prompt from user and call POST
@app.get("/api/user-prompt")
async def get_user_prompt(userId: str, prompt: str):
    """Get prompt from user and forward it to the POST endpoint"""
    
    if not userId:
        raise HTTPException(status_code=400, detail="Missing userId")
    
    if not prompt:
        raise HTTPException(status_code=400, detail="Missing prompt")
    
    try:
        print(f"GET received - User: {userId}, Prompt: {prompt}")
        
        # Create request object for POST endpoint
        request_data = UserPromptRequest(userId=userId, prompt=prompt)
        
        # Call the POST endpoint internally
        post_response = await post_user_prompt(request_data)
        
        print(f"POST response: {post_response}")
        return post_response
        
    except Exception as e:
        print(f"Error in GET /api/user-prompt: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# POST ENDPOINT - Receive prompt from partners
@app.post("/api/user-prompt", response_model=UserPromptPostResponse)
async def post_user_prompt(request: UserPromptRequest):
    """Receive prompt from frontend partners"""
    
    if not request.userId:
        raise HTTPException(status_code=400, detail="Missing userId")
    
    if not request.prompt:
        raise HTTPException(status_code=400, detail="Missing prompt")
    
    try:
        print(f"Received prompt from user {request.userId}: {request.prompt}")
        
        # Store the prompt locally (in memory for this request)
        local_data = {
            "userId": request.userId,
            "prompt": request.prompt,
            "timestamp": datetime.utcnow()
        }
        
        # Process the prompt here or forward it somewhere else
        # For now, just acknowledge receipt
        
        return UserPromptPostResponse(
            success=True,
            message="Prompt received successfully",
            userId=request.userId,
            prompt=request.prompt
        )
        
    except Exception as e:
        print(f"Error in POST /api/user-prompt: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)