import json
from typing import List, Tuple

from llama_index.core.llms import ChatMessage

from utils.pydantic_models import *
from utils.constants import roles

def convert_to_chat_history(chat_history: str) -> Tuple[List[ChatMessage], str] | Tuple[None, str]:
    messages=None
    if isinstance(chat_history, str):
        messages = json.loads(chat_history)
    if isinstance(chat_history, list):
        messages = chat_history
    if len(messages)==1:
        return None, messages[-1]['content']
    chat_history = [ChatMessage(role=roles[message['role']], content=f"""{message['content']}""") for message in messages[:-1]]
    return chat_history, messages[-1]['content']
