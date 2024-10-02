from typing import Optional, Any
from pydantic import BaseModel, Field
from pydantic import BaseModel, Field
from llama_index.core.workflow import Event

class InitializeEvent(Event):
    pass

class ConciergeEvent(Event):
    request: Optional[str] = None
    
class ModelResponse(BaseModel):
    response: str
    moduleTitle: str