from typing import Optional, Any
from pydantic import BaseModel, Field
from llama_index.core.workflow import Event
from llama_index.core.schema import NodeWithScore

class TutorEvent(Event):
    pass
    
class ModelResponse(BaseModel):
    response: str
    moduleTitle: str

class RagTutorEvent(Event):
    pass

class RagTutorEvent(Event):
    pass

class SynthesizerEvent(Event):
    pass

class RetrieverEvent(Event):
    # """Result of running retrieval"""
    # nodes: list[NodeWithScore]
    pass

class RerankEvent(Event):
    # """Result of running reranking on retrieved nodes"""
    # nodes: list[NodeWithScore]
    pass