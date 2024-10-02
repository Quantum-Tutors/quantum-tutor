from typing import Optional, Any
from pydantic import BaseModel, Field
from llama_index.core.workflow import Event
from llama_index.core.schema import NodeWithScore

class InitializeEvent(Event):
    pass

class ConciergeEvent(Event):
    request: Optional[str] = None
    
class ModelResponse(BaseModel):
    response: str
    moduleTitle: str


class RetrieverEvent(Event):
    """Result of running retrieval"""
    nodes: list[NodeWithScore]

class RerankEvent(Event):
    """Result of running reranking on retrieved nodes"""
    nodes: list[NodeWithScore]