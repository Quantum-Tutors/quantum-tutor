from llama_index.core.workflow import (
    step, 
    Context, 
    Workflow, 
    Event, 
    StartEvent, 
    StopEvent
)
from llama_index.llms.groq import Groq

from ..pydantic_models import *

class ConciergeWorkflow(Workflow):

    @step(pass_context=True)
    async def initialize(self, ctx: Context, ev: InitializeEvent) -> ConciergeEvent:
        ctx.data["llm"] = Groq(model="llama3-groq-tool-use:latest", temperature = 0.4)
        ctx.data["chat_history"]