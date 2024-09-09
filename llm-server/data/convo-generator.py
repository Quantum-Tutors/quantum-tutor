from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime, timedelta
import random
import uuid

app = FastAPI()

# Models
class Message(BaseModel):
    id: str
    chatId: str
    sender: str
    text: str
    createdAt: str

class Module(BaseModel):
    id: str
    chatId: str
    title: str
    messages: list

class ChatSession(BaseModel):
    id: str
    userId: str
    title: str
    createdAt: str
    messages: list

# Utility functions
def generate_random_id(prefix):
    return f"{prefix}_{uuid.uuid4().hex[:6]}"

def get_current_time():
    return datetime.utcnow().isoformat() + "Z"

def create_random_message(chat_id, sender):
    return Message(
        id=generate_random_id("msg"),
        chatId=chat_id,
        sender=sender,
        text=f"{sender.capitalize()}: This is a sample message from {sender}.",
        createdAt=get_current_time()
    )

def create_random_module(chat_id):
    module_id = generate_random_id("module")
    messages = [
        create_random_message(module_id, "user").model_dump(),
        create_random_message(module_id, "bot").model_dump()
    ]
    return Module(
        id=module_id,
        chatId=chat_id,
        title="**Introduction to Machine Learning**",
        messages=[msg["id"] for msg in messages]
    ), messages

def create_random_chat_session():
    chat_id = generate_random_id("cs")
    messages = []
    module_messages = []

    for i in range(random.randint(3, 5)):
        if random.choice([True, True, True, False]):
            message = create_random_message(chat_id, "user").model_dump()
            messages.append(message["id"])
            module, mod_msgs = create_random_module(chat_id)
            module_messages.extend(mod_msgs)
            messages.append(module.id)
        else:
            message_user = create_random_message(chat_id, "user").model_dump()
            message_bot = create_random_message(chat_id, "bot").model_dump()
            messages.extend([message_user["id"], message_bot["id"]])
            module_messages.extend([message_user, message_bot])

    return ChatSession(
        id=chat_id,
        userId=generate_random_id("user"),
        title="**Bot Tutorial**",
        createdAt=get_current_time(),
        messages=messages
    ), module_messages

@app.get("/random-chat-session")
async def get_random_chat_session():
    chat_session, messages = create_random_chat_session()
    response = {
        "chatSession": chat_session.model_dump(),
        "messages": messages
    }
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
