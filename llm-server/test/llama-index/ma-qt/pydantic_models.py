from typing import Optional
from llama_index.core.workflow import Event


class InitializeEvent(Event):
    pass

class ConciergeEvent(Event):
    request: Optional[str] = None
    just_completed: Optional[str] = None
    need_help: Optional[bool] = None

class OrchestratorEvent(Event):
    request: str

class OrchestratorEvent(Event):
    request: str
