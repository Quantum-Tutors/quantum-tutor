from typing import Optional, Any
from llama_index.core.workflow import Event
from pydantic import BaseModel, Field
from typing import Optional, List, Any

from llm_backend.server.utils.funcs import *

class Message(BaseModel):
    msgId: str = Field(default_factory=lambda: generate_id("msg"))
    userId: str = Field(default_factory=lambda: generate_id("usr"))
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