from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
import random

import chainlit as cl
from utils.pydantic_models import *
from workflows.concierge_orchestrator import ConciergeWorkflow

from llama_index.core.workflow import StartEvent

from utils.pydantic_models import *
from chainlit.utils import mount_chainlit

import os
from dotenv import load_dotenv
load_dotenv(os.path.join('./config/','.env'))


MONGODB_CONN_STR  = os.getenv('MONGODB_CONN_STR')
client = MongoClient(MONGODB_CONN_STR)
db = client["quantum-tutor-test"]
chat_sessions = db["chat_sessions"]
messages = db["messages"]
modules = db["modules"]

# chat_sessions.delete_many({})
# messages.delete_many({})
# modules.delete_many({})

app = FastAPI()

@cl.on_chat_start
async def on_chat_start():
    app = ConciergeWorkflow(
        verbose = True, 
        timeout = 6000
    ) #The app times out if it runs for 6000s without any result
    cl.user_session.set("app", app)
    await cl.Message("Hello! Ask me anything!").send()
    
@cl.on_message
async def on_message(message: Message):
    app = cl.user_session.get("app")
    result = await app.run(query = message.text)
    print(result)
    await cl.Message(content = result).send()

@app.get("/chats")
def get_chats():
    return list(chat_sessions.find({}, {"_id": 1, "title": 1, "createdAt": 1}))

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)