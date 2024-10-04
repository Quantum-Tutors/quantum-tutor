from typing import Optional, Any
from pydantic import BaseModel, Field
from typing import Optional, List, Dict

from server.utils.funcs import *

class Message(BaseModel):
    msgId: str = Field(default_factory=lambda: generate_id("msg"))
    chatId: Optional[str] = None
    moduleId: Optional[str] = None
    userId: str = Field(default_factory=lambda: generate_id("usr"))
    sender: str
    text: str
    model: str
    isRag: Optional[bool] = False
    createdAt: Optional[str] = Field(default_factory=lambda: current_timestamp())
    sequence: Optional[int] = None

class Module(BaseModel):
    moduleId: Optional[str] = Field(default_factory=lambda: generate_id("module"))
    chatId: str
    title: str
    messages: List[str] = Field(default_factory=list)
    createdAt: Optional[str] = Field(default_factory=lambda: current_timestamp())
    sequence: Optional[int] = None

class ChatSession(BaseModel):
    chatId: Optional[str] = Field(default_factory=lambda: generate_id("chat"))
    userId: str
    title: str
    createdAt: Optional[str] = Field(default_factory=lambda: current_timestamp())
    messages: List[str] = Field(default_factory=list)
    modules: List[str] = Field(default_factory=list)
    currentModule: Optional[str] = None
    files: Optional[List[str]] = Field(default_factory=list)
