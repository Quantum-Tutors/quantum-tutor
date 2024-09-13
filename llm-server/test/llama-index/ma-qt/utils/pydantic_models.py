from typing import Optional, Any
from llama_index.core.workflow import Event


class InitializeEvent(Event):
    pass

class ConciergeEvent(Event):
    request: Optional[str] = None