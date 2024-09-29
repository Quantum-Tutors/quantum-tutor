from llama_deploy import LlamaDeployClient
from llama_deploy import (
    LlamaDeployClient,
    AsyncLlamaDeployClient,
    ControlPlaneConfig,
)

from fastapi import FastAPI, HTTPException
from llm_server.utils.pydantic_models import ChatSession, Message
from llm_server.utils.funcs import generate_id
from llm_server.data.mongo_client import get_mongo_client

chat_sessions, messages, modules = get_mongo_client()

app = FastAPI()

llama_deploy_aclient = LlamaDeployClient(ControlPlaneConfig())

@app.post("/chat")
def chat_with_bot(user_message: Message):
    user_message = user_message.model_dump()
    
    chat_id = user_message["chatId"]
    user_id = user_message['userId']
    session = llama_deploy_aclient.get_or_create_session(chat_id)
    # session = llama_deploy_aclient.get_or_create_session(user_message.get("userId","temp"))
    chat_history = []
    
    if not chat_id:
        chat_id = generate_id("chat")
        chat_session = ChatSession(
            chatId=chat_id,
            userId=user_id,
            title="New Chat Session"
        )
        chat_sessions.insert_one(chat_session.model_dump())
        user_message["chatId"] = chat_id
        user_message["sequence"] = 1
        messages.insert_one(user_message)
        chat_sessions.update_one({"chatId": chat_id}, {"$push": {"messages": user_message["msgId"]}})
        chat_history.append({'role': 'user', 'content': user_message['text']})
        
    else:
        chat_session_data = chat_sessions.find_one({"chatId": chat_id})
        if not chat_session_data:
            raise HTTPException(status_code=404, detail="Chat session not found")
        chat_session = ChatSession(**chat_session_data)
        user_message["sequence"] = len(list(messages.find({"chatId": chat_id}))) + 1
        messages.insert_one(user_message)
        chat_sessions.update_one({"chatId": chat_id}, {"$push": {"messages": user_message["msgId"]}})

        for msg_id in chat_session_data['messages']:
            message = messages.find_one({"msgId": msg_id})
            if message:
                chat_history.append({'role': message['sender'], 'content': message['text']})
        print('existing chat session, chat history: ',chat_history)
            
    response = session.run("concierge_workflow", chat_history=chat_history, chat_id=chat_id)
    
    bot_message = Message(
        userId=user_id,
        chatId=chat_id,
        sender="bot",
        text= response,
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
    uvicorn.run(app, host="0.0.0.0", port=5000)