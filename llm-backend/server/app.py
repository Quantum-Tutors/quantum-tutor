from llama_deploy import LlamaDeployClient
from llama_deploy import (
    LlamaDeployClient,
    AsyncLlamaDeployClient,
    ControlPlaneConfig,
)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from server.data.mongo_client import get_mongo_client

from server.utils.pydantic_models import ChatSession, Message, Module
from server.utils.funcs import generate_id
from server.utils.constants import available_models

import json

chat_sessions, messages, modules = get_mongo_client()

app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llama_deploy_aclient = LlamaDeployClient(ControlPlaneConfig())


@app.post("/chat")
def chat_with_bot(user_message: Message):
    user_message = user_message.model_dump()

    chat_id = user_message["chatId"]
    user_id = user_message["userId"]
    model = user_message["model"]

    session = llama_deploy_aclient.get_or_create_session(chat_id)
    # session = llama_deploy_aclient.get_or_create_session(chat_id)
    chat_history = []

    if not chat_id:
        chat_id = generate_id("chat")
        chat_session = ChatSession(
            chatId=chat_id, userId=user_id, title="New Chat Session"
        )
        chat_sessions.insert_one(chat_session.model_dump())
        user_message["chatId"] = chat_id
        user_message["sequence"] = 1
        messages.insert_one(user_message)
        chat_sessions.update_one(
            {"chatId": chat_id}, {"$push": {"messages": user_message["msgId"]}}
        )
        chat_history.append({"role": "user", "content": user_message["text"]})

    else:
        chat_session_data = chat_sessions.find_one({"chatId": chat_id})
        if not chat_session_data:
            raise HTTPException(status_code=404, detail="Chat session not found")
        chat_session = ChatSession(**chat_session_data)
        user_message["sequence"] = len(list(messages.find({"chatId": chat_id}))) + 1
        messages.insert_one(user_message)
        chat_sessions.update_one(
            {"chatId": chat_id}, {"$push": {"messages": user_message["msgId"]}}
        )

        for message in list(messages.find({"chatId": chat_id}).sort("sequence")):
            chat_history.append(
                {
                    "role": message["sender"],
                    "content": message["text"]
                    + f"""Module Details:is the above message a Module: {True if message["moduleId"] else False},Title of above module: {modules.find_one({"moduleId": message["moduleId"]}, {"title": 1}) if message["moduleId"] else None}""",
                }
            )

    model_output = session.run(
        "concierge_workflow", chat_history=chat_history, model=model
    )
    model_output = json.loads(model_output)

    if not getattr(chat_session, "currentModule", None) and bool(
        model_output["isModule"]
    ):
        module = Module(
            chatId=chat_id,
            title=model_output["moduleTitle"],
            sequence=len(list(modules.find({"chatId": chat_id}))) + 1,
        )
        modules.insert_one(module.model_dump())
        current_module = module.moduleId

        bot_message = Message(
            chatId=chat_id,
            moduleId=current_module,
            sender="bot",
            text=model_output["response"],
            model=model,
            sequence=len(list(messages.find({"chatId": chat_id}))) + 1,
        )
        messages.insert_one(bot_message.model_dump())
        modules.update_one(
            {"moduleId": current_module}, {"$push": {"messages": bot_message.msgId}}
        )
        chat_sessions.update_one(
            {"chatId": chat_id}, {"$push": {"modules": current_module}}
        )
        chat_sessions.update_one(
            {"chatId": chat_id}, {"$set": {"currentModule": module.moduleId}}
        )

        response = {
            "module": {
                "moduleId": current_module,
                "status": model_output["isModule"],
                "messages": [bot_message.model_dump()],
            }
        }

    elif getattr(chat_session, "currentModule", None):
        bot_message = Message(
            chatId=chat_id,
            moduleId=user_message["moduleId"],
            sender="bot",
            text=model_output["response"],
            model=model,
            sequence=len(list(messages.find({"chatId": chat_id}))) + 1,
        )
        messages.insert_one(bot_message.model_dump())
        modules.update_one(
            {"moduleId": user_message["moduleId"]},
            {"$push": {"messages": bot_message.msgId}},
        )
        chat_sessions.update_one(
            {"chatId": chat_id}, {"$push": {"modules": bot_message.msgId}}
        )
        response = {
            "module": {
                "moduleId": user_message["moduleId"],
                "status": model_output["isModule"],
                "messages": [bot_message.model_dump()],
            }
        }

        if not bool(model_output["isModule"]):
            chat_sessions.update_one(
                {"chatId": chat_id}, {"$unset": {"currentModule": ""}}
            )

    else:
        bot_message = Message(
            userId=user_id,
            chatId=chat_id,
            sender="bot",
            text=model_output["response"],
            model=model,
            sequence=len(list(messages.find({"chatId": chat_id}))) + 1,
        )
        messages.insert_one(bot_message.model_dump())
        chat_sessions.update_one(
            {"chatId": chat_id}, {"$push": {"messages": bot_message.msgId}}
        )
        response = {"message": bot_message.model_dump()}

    return response


@app.get("/chats/{user_id}")
def get_chats(user_id: str):
    return list(
        chat_sessions.find(
            {"userId": user_id}, {"chatId": 1, "title": 1, "modules": 1, "createdAt": 1, "_id":0}
        )
    )


@app.get("/modules")
def get_chats(module_id: str):
    return list(modules.find({"moduleId": module_id}))


@app.get("/chat/{chat_id}/module-titles")
def get_module_titles(chat_id: str):
    chat_session = chat_sessions.find_one({"chatId": chat_id}, {"modules": 1})
    if not chat_session:
        return {"error": "Chat session not found"}
    module_ids = chat_session.get("modules", [])
    _modules = modules.find({"moduleId": {"$in": module_ids}}, {"title": 1, "_id": 0})
    # print(list(_modules))
    return {"moduleTitles": [module["title"] for module in _modules]}


@app.get("/available_models")
def get_available_models():
    return {"available_models": available_models}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=5000)
