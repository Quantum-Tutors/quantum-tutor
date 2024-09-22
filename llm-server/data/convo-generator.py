from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from pymongo import MongoClient
import random
import uuid
from fastapi.middleware.cors import CORSMiddleware

import os
from dotenv import load_dotenv
load_dotenv(os.path.join('../config/','.env'))

app = FastAPI()

# Allow all origins, methods, and headers (unsafe, for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

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

@app.post("/chat")
def chat_with_bot(user_prompt: UserPrompt):
    user_message = user_prompt.message.model_dump()
    chat_id = user_message.get("chatId")

    if not chat_id:
        chat_id = generate_id("chat")
        chat_session = ChatSession(
            chatId=chat_id,
            userId=generate_id("user"),
            title="New Chat Session"
        )
        chat_sessions.insert_one(chat_session.model_dump())
        user_message["chatId"] = chat_id
        user_message["sequence"] = 1
        messages.insert_one(user_message)
        chat_sessions.update_one({"chatId": chat_id}, {"$push": {"messages": user_message["msgId"]}})
    else:
        chat_session_data = chat_sessions.find_one({"chatId": chat_id})
        if not chat_session_data:
            raise HTTPException(status_code=404, detail="Chat session not found")
        chat_session = ChatSession(**chat_session_data)
        user_message["sequence"] = len(list(messages.find({"chatId": chat_id}))) + 1
        messages.insert_one(user_message)
        chat_sessions.update_one({"chatId": chat_id}, {"$push": {"messages": user_message["msgId"]}})

    if should_start_module() and not getattr(chat_session, "currentModule", None):
        module = Module(
            chatId=chat_id,
            title="Random Module Title"
        )
        modules.insert_one(module.model_dump())
        current_module = module.moduleId
        bot_message = Message(
            chatId=chat_id,
            moduleId=current_module,
            sender="bot",
            text="This is the start of a module.",
            sequence=len(list(messages.find({"chatId": chat_id}))) + 1
        )
        messages.insert_one(bot_message.model_dump())
        modules.update_one({"moduleId": current_module}, {"$push": {"messages": bot_message.msgId}})
        chat_sessions.update_one({"chatId": chat_id}, {"$set": {"currentModule": module.moduleId}})
        response = {"module": {"moduleId": current_module, "messages": [bot_message.model_dump()]}}

        response = {"module": {"moduleId": current_module, "status":True, "messages": [bot_message.model_dump()]}}

    else:
        current_module = getattr(chat_session, "currentModule", None)
        if current_module:
            module_length = len(modules.find_one({"moduleId": current_module})["messages"])
            bot_message = Message(
                chatId=chat_id,
                moduleId=current_module,
                sender="bot",
                text="This is a module-specific response.",
                sequence=len(list(messages.find({"chatId": chat_id}))) + 1
            )
            messages.insert_one(bot_message.model_dump())
            modules.update_one({"moduleId": current_module}, {"$push": {"messages": bot_message.msgId}})
            chat_sessions.update_one({"chatId": chat_id}, {"$push": {"messages": bot_message.msgId}})
            response = {"module": {"moduleId": current_module, "status":True, "messages": [bot_message.model_dump()]}}
            if should_end_module(module_length):
                chat_sessions.update_one({"chatId": chat_id}, {"$unset": {"currentModule": ""}})
                response["status"] = False
        else:
            bot_message = Message(
                chatId=chat_id,
                sender="bot",
                text="This is a normal bot response.",
                sequence=len(list(messages.find({"chatId": chat_id}))) + 1
            )
            messages.insert_one(bot_message.model_dump())
            chat_sessions.update_one({"chatId": chat_id}, {"$push": {"messages": bot_message.msgId}})
            response = {"message": bot_message.model_dump()}

    return response

@app.get("/chats")
def get_chats():
    return list(chat_sessions.find({}, {"_id": 1, "title": 1, "createdAt": 1}))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
