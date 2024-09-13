from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from pymongo import MongoClient
import random
import uuid

import os
from dotenv import load_dotenv
load_dotenv(os.path.join('../config/','.env'))  

app = FastAPI()

MONGODB_CONN_STR  = os.getenv('MONGODB_CONN_STR')
client = MongoClient(MONGODB_CONN_STR)
db = client["quantum-tutor-test"]
chat_sessions = db["chat_sessions"]
messages = db["messages"]
modules = db["modules"]

chat_sessions.delete_many({})
messages.delete_many({})
modules.delete_many({})

class Message(BaseModel):
    msgId: str = Field(default_factory=lambda: generate_id("msg"))
    chatId: Optional[str] = None
    sender: str
    text: str
    moduleId: Optional[str] = None
    createdAt: Optional[str] = Field(default_factory=lambda: current_timestamp())
    sequence: Optional[int] = None

class Module(BaseModel):
    moduleId: str = Field(default_factory=lambda: generate_id("module"))
    chatId: str
    title: str
    messages: List[str] = Field(default_factory=list)
    createdAt: Optional[str] = Field(default_factory=lambda: current_timestamp())
    sequence: Optional[int] = None

class ChatSession(BaseModel):
    chatId: str = Field(default_factory=lambda: generate_id("chat"))
    userId: str
    title: str
    createdAt: Optional[str] = Field(default_factory=lambda: current_timestamp())
    messages: List[str] = Field(default_factory=list)
    modules: List[str] = Field(default_factory=list)
    currentModule: Optional[str] = None

class UserPrompt(BaseModel):
    message: Message

def generate_id(prefix):
    return f"{prefix}_{uuid.uuid4().hex[:6]}"

def current_timestamp():
    return datetime.now().isoformat() + "Z"

def should_start_module():
    return random.choices([True, False], weights=[60, 40])[0]

def should_end_module(current_module_length):
    return random.choices([True, False], weights=[40, 60])[0] if current_module_length >= 3 else False


















@app.get("/chats")
def get_chats():
    return list(chat_sessions.find({}, {"_id": 1, "title": 1, "createdAt": 1}))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)