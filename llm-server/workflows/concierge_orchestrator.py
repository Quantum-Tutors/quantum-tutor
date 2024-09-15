import os

from llama_index.core.workflow import (
    step, 
    Context, 
    Workflow, 
    Event, 
    StartEvent, 
    StopEvent
)
from llama_index.llms.groq import Groq
from llama_index.llms.ollama import Ollama
from llama_index.llms.azure_openai import AzureOpenAI
from llama_index.llms.gemini import Gemini

from llama_index.core.agent import ReActAgentWorker
from llama_index.core.agent import FunctionCallingAgentWorker
from llama_index.core.tools import FunctionTool
from llama_index.core.llms import ChatMessage, MessageRole


from agents.concierge import ConciergeAgent
from utils.pydantic_models import *
from utils.prompts import *

from typing import Optional, Any, List
from colorama import Fore, Back, Style

class ConciergeWorkflow(Workflow):
    
    def add_to_chat_history(self, chat_history: List[ChatMessage], user_content: Any, bot_content: Any) -> List[ChatMessage]:
        chat_history.extend([
            ChatMessage(role=MessageRole.USER, content=user_content),
            ChatMessage(role=MessageRole.ASSISTANT, content=bot_content)
        ])
        return chat_history

    @step(pass_context=True)
    async def initialize(self, ctx: Context, ev: InitializeEvent) -> ConciergeEvent:
        ctx.data["llm"] = Gemini()
        ctx.data["chat_history"] = []
        print("Initializing Workflow.")
        return ConciergeEvent()
    
    @step(pass_context=True)
    async def concierge(self, ctx: Context, ev: ConciergeEvent | StartEvent, user_msg_str: str) -> StopEvent:
        print('started')
        if "llm" not in ctx.data:
            return InitializeEvent()
        if ("concierge" not in ctx.data):
            ctx.data['concierge'] = ReActAgentWorker.from_tools(
                tools=[],
                llm=ctx.data["llm"]
            )
            ctx.data['concierge'].update_prompts({"system_prompt": concierge_system_prompt})
            ctx.data['concierge'] = ctx.data['concierge'].as_agent()
        
        response = ctx.data["concierge"].chat(message=user_msg_str, chat_history=ctx.data['chat_history'])
        ctx.data['chat_history'] = self.add_to_chat_history(ctx.data['chat_history'], user_content=user_msg_str, bot_content=response)
        
        print(Fore.MAGENTA + str(response) + Style.RESET_ALL)
        return StopEvent()