from llama_deploy import LlamaDeployClient
from llama_deploy import (
    LlamaDeployClient,
    AsyncLlamaDeployClient,
    ControlPlaneConfig,
)

from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from server.data.mongo_client import get_mongo_client

from server.utils.pydantic_models import ChatSession, Message, Module
from server.utils.funcs import extract_text_from_pdf
from server.utils.constants import available_models

import json, logging

logger = logging.getLogger(__name__)

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

llama_deploy_aclient = LlamaDeployClient(ControlPlaneConfig(), timeout=180)


@app.post("/chat")
def chat_with_bot(user_message: Message):
    user_message = user_message.model_dump()
    chat_id, user_id, model = (
        user_message["chatId"],
        user_message["userId"],
        user_message["model"],
    )

    session = llama_deploy_aclient.create_session()
    chat_history = []

    try:
        if not chat_id:
            try:
                chat = ChatSession(userId=user_id, title="New Chat Session")
                chat_id = chat.chatId
                logging.info(
                    f"New chat session created with chatId: {chat_id}, userId: {user_id}"
                )
                chat_sessions.insert_one(chat.model_dump())
                user_message["chatId"], user_message["sequence"] = chat_id, 1
                messages.insert_one(user_message)
                chat_sessions.update_one(
                    {"chatId": chat_id}, {"$push": {"messages": user_message["msgId"]}}
                )
                logging.info(
                    f"User message inserted and updated. chatId: {chat_id}, messageId: {user_message['msgId']}"
                )
                chat_history.append({"role": "user", "content": user_message["text"]})
            except Exception as e:
                logging.error(f"Error in creating new chat session: {str(e)}")
                raise HTTPException(
                    status_code=500, detail="Error creating new chat session"
                )
        else:
            try:
                chat_session_data = chat_sessions.find_one({"chatId": chat_id})
                if not chat_session_data:
                    logging.error(f"Chat session {chat_id} not found")
                    raise HTTPException(
                        status_code=404, detail="Chat session not found"
                    )
                chat = ChatSession(**chat_session_data)
                user_message["sequence"] = (
                    messages.count_documents({"chatId": chat_id}) + 1
                )
                messages.insert_one(user_message)
                if chat.currentModule:
                    modules.update_one(
                        {"moduleId": chat.currentModule},
                        {"$push": {"messages": user_message["msgId"]}},
                    )
                else:
                    chat_sessions.update_one(
                        {"chatId": chat_id},
                        {"$push": {"messages": user_message.msgId}},
                    )
                logging.info(
                    f"User message inserted. chatId: {chat_id}, messageId: {user_message['msgId']}, sequence: {user_message['sequence']}"
                )

                for message in messages.find({"chatId": chat_id}).sort("sequence"):
                    chat_history.append(
                        {
                            "role": message["sender"],
                            "content": f'{message["text"]} ModuleTitle: {modules.find_one({"moduleId": message["moduleId"]}, {"title": 1, "_id": 0}) if message["moduleId"] else None}',
                        }
                    )
                logging.info(f"Chat history updated for chatId: {chat_id}")
            except Exception as e:
                logging.error(f"Error in retrieving chat session: {str(e)}")
                raise HTTPException(
                    status_code=500, detail="Error retrieving chat session"
                )

        try:
            docs = None
            # print(user_message)
            if user_message["isRag"]:
                docs = chat_sessions.find_one(
                    {"chatId": chat.chatId}, {"files": 1, "_id": 0}
                )
                # print(docs['files'])

            model_output = session.run(
                "tutor_workflow", chat_history=chat_history, model=model, docs=docs
            )
            if not model_output:
                logging.error("Model output is empty")
                raise HTTPException(
                    status_code=500, detail="Model failed to generate output"
                )
            model_output = json.loads(model_output)
            logging.info(
                f"Model output generated successfully. modelOutput: {model_output}"
            )
        except Exception as e:
            logging.error(f"Error in model generation: {str(e)}")
            raise HTTPException(status_code=500, detail="Error generating model output")

        if chat.currentModule:
            current_module_title = modules.find_one(
                {"moduleId": chat.currentModule}, {"title": 1, "_id": 0}
            )

            if current_module_title != model_output["moduleTitle"]:
                chat_sessions.update_one(
                    {"chatId": chat_id}, {"$unset": {"currentModule": ""}}
                )
                chat.currentModule = None

        if chat.currentModule == None and model_output["moduleTitle"]:
            try:
                module = Module(
                    chatId=chat_id,
                    title=model_output["moduleTitle"],
                    sequence=modules.count_documents({"chatId": chat_id}) + 1,
                )
                modules.insert_one(module.model_dump())
                modules.update_one(
                    {"moduleId": module.moduleId},
                    {"$push": {"messages": user_message["msgId"]}},
                )
                messages.update_one(
                    {"msgId": user_message["msgId"]},
                    {"$set": {"moduleId": module.moduleId}},
                )
                logging.info(
                    f"Module created and updated. moduleId: {module.moduleId}, messageId: {user_message['msgId']}"
                )

                bot_message = Message(
                    chatId=chat_id,
                    moduleId=module.moduleId,
                    sender="bot",
                    text=model_output["response"],
                    model=model,
                    isRag=user_message["isRag"],
                    sequence=messages.count_documents({"chatId": chat_id}) + 1,
                )
                messages.insert_one(bot_message.model_dump())
                modules.update_one(
                    {"moduleId": module.moduleId},
                    {"$push": {"messages": bot_message.msgId}},
                )
                chat_sessions.update_one(
                    {"chatId": chat_id},
                    {
                        "$set": {"currentModule": module.moduleId},
                        "$push": {"modules": module.moduleId},
                    },
                )
                logging.info(
                    f"Bot message inserted for new module. botMessageId: {bot_message.msgId}, moduleId: {module.moduleId}"
                )

                response = {
                    "module": {
                        "moduleId": module.moduleId,
                        "messages": [bot_message.model_dump()],
                    }
                }
            except Exception as e:
                logging.error(f"Error in creating/updating module: {str(e)}")
                raise HTTPException(status_code=500, detail="Error processing module")
        elif chat.currentModule:
            try:
                bot_message = Message(
                    chatId=chat_id,
                    moduleId=user_message["moduleId"],
                    sender="bot",
                    text=model_output["response"],
                    model=model,
                    isRag=user_message["isRag"],
                    sequence=messages.count_documents({"chatId": chat_id}) + 1,
                )
                messages.insert_one(bot_message.model_dump())
                modules.update_one(
                    {"moduleId": user_message["moduleId"]},
                    {"$push": {"messages": bot_message.msgId}},
                )
                messages.update_one(
                    {"msgId": user_message["msgId"]},
                    {"$set": {"moduleId": chat.currentModule}},
                )
                logging.info(
                    f"Bot message inserted for existing module. botMessageId: {bot_message.msgId}, moduleId: {chat.currentModule}"
                )

                response = {
                    "module": {
                        "moduleId": user_message["moduleId"],
                        "messages": [bot_message.model_dump()],
                    }
                }
                if not model_output["moduleTitle"]:
                    chat_sessions.update_one(
                        {"chatId": chat_id}, {"$unset": {"currentModule": ""}}
                    )
                    logging.info(f"Module completed for chat session {chat_id}")
            except Exception as e:
                logging.error(f"Error in updating module: {str(e)}")
                raise HTTPException(status_code=500, detail="Error updating module")
        else:
            try:
                bot_message = Message(
                    userId=user_id,
                    chatId=chat_id,
                    sender="bot",
                    text=model_output["response"],
                    model=model,
                    isRag=user_message["isRag"],
                    sequence=messages.count_documents({"chatId": chat_id}) + 1,
                )
                messages.insert_one(bot_message.model_dump())
                chat_sessions.update_one(
                    {"chatId": chat_id}, {"$push": {"messages": bot_message.msgId}}
                )
                logging.info(
                    f"Bot message inserted for chat session without module. botMessageId: {bot_message.msgId}, chatId: {chat_id}"
                )

                response = {"message": bot_message.model_dump()}
            except Exception as e:
                logging.error(f"Error in inserting bot message: {str(e)}")
                raise HTTPException(
                    status_code=500, detail="Error inserting bot message"
                )

        return response

    except Exception as e:
        logging.error(f"Overall error occurred: {str(e)}")
        return {
            "message": {
                "text": f"Overall error occurred: {str(e)}",
                "msgId": None,
                "chatId": chat_id,
                "moduleId": None,
                "userId": user_id,
                "sender": "bot",
            }
        }


@app.get("/chats/{user_id}")
def get_chats(user_id: str):
    return list(
        chat_sessions.find(
            {"userId": user_id},
            {"chatId": 1, "title": 1, "modules": 1, "createdAt": 1, "_id": 0},
        )
    )


@app.post("/rag/upload-pdf/{chat_id}")
async def upload_pdf(chat_id: str, file: UploadFile):

    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400, detail="Invalid file type. Only PDF files are allowed."
        )

    text = await extract_text_from_pdf(file)
    chat_sessions.update_one({"chatId": chat_id}, {"$push": {"files": text}})
    return {"message": "File Upload successful"}


@app.get("/modules/{module_id}")
def get_chats(module_id: str):
    return list(modules.find({"moduleId": module_id}, {"_id": 0}))


@app.get("/chat/{chat_id}/module-titles")
def get_module_titles(chat_id: str):
    chat = chat_sessions.find_one({"chatId": chat_id}, {"modules": 1, "_id": 0})
    if not chat:
        return {"error": "Chat session not found"}
    module_ids = chat.get("modules", [])
    _modules = modules.find({"moduleId": {"$in": module_ids}}, {"title": 1, "_id": 0})
    # print(list(_modules))
    return {"moduleTitles": [module["title"] for module in _modules]}


@app.get("/available_models")
def get_available_models():
    return {"available_models": available_models}


@app.get("/wipe_db")
def wipe_db():

    print(f"Deleting Chats: {chat_sessions.count_documents({})}")
    chat_sessions.delete_many({})

    print(f"Deleting Modules: {modules.count_documents({})}")
    modules.delete_many({})

    print(f"Deleting Messages: {messages.count_documents({})}")
    messages.delete_many({})
    return {}


async def start_fastapi_server():
    import uvicorn

    config = uvicorn.Config(app, host="0.0.0.0", port=5000)
    server = uvicorn.Server(config)
    await server.serve()


async def main():
    from server.llm_deploy.workflows.tutor import deploy_tutor_workflow
    from server.llm_deploy.core_systems.main import deploy_core_systems

    print("Starting core systems server...")
    core_system_task = asyncio.create_task(deploy_core_systems())

    # Wait until core_systems is up before proceeding
    await asyncio.sleep(5)  # Simulate waiting for core systems to initialize

    print("Starting tutor workflow server...")
    tutor_workflow_task = asyncio.create_task(deploy_tutor_workflow())

    # Wait until tutor workflow is up before proceeding
    await asyncio.sleep(5)  # Simulate waiting for tutor to initialize

    print("Starting FastAPI server...")
    fastapi_server_task = asyncio.create_task(start_fastapi_server())

    # Run all servers indefinitely
    await asyncio.gather(core_system_task, tutor_workflow_task, fastapi_server_task)

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
