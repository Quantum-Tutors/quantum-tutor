import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv(os.path.join('./server/config','.env'))
# print(os.getenv('MONGODB_CONN_STR'))
def get_mongo_client():
    MONGODB_CONN_STR = os.getenv('MONGODB_CONN_STR')
    # print(MONGODB_CONN_STR)
    client = MongoClient(MONGODB_CONN_STR)
    db = client["quantum-tutor-test"]
    chat_sessions = db["chat_sessions"]
    messages = db["messages"]
    modules = db["modules"]
    return chat_sessions, messages, modules