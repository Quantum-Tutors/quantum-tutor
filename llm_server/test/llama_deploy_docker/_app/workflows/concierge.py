import sys, os, logging
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))

import os
from dotenv import load_dotenv
load_dotenv(os.path.join('../','.env'))

from llama_index.core.workflow import (
    step, 
    Context, 
    Workflow, 
    Event, 
    StartEvent, 
    StopEvent
)
# from llama_index.llms.groq import Groq
# from llama_index.llms.ollama import Ollama
# from llama_index.llms.azure_openai import AzureOpenAI
from llama_index.llms.gemini import Gemini

from llama_index.core.agent import ReActAgentWorker
# from llama_index.core.agent import FunctionCallingAgentWorker
# from llama_index.core.tools import FunctionTool
from llama_index.core.llms import ChatMessage, MessageRole

from llama_deploy import (
    deploy_workflow,
    WorkflowServiceConfig,
    ControlPlaneConfig,
)

from app.workflows.utils.pydantic_models import *
from app.workflows.utils.prompts import *

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
    async def initialize(self, ctx
                         : Context, ev: InitializeEvent) -> ConciergeEvent:
        print(os.getenv('GOOGLE_API_KEY'))
        ctx.data["llm"] = Gemini()
        # ctx.data["llm"] = Groq(
        #     model="llama3-groq-8b-8192-tool-use-preview", 
        #     temperature = 0.4
        # )
        ctx.data["chat_history"] = []
        print("Initializing Workflow.")
        return ConciergeEvent()
    
    @step(pass_context=True)
    async def concierge(self, ctx: Context, ev: ConciergeEvent | StartEvent) -> InitializeEvent | StopEvent:
        if isinstance(ev, StartEvent):
            ctx.data['current_user_message'] = ev.get('user_message', 'Hi')
            print(str(ev))
            return InitializeEvent()
        if ("concierge" not in ctx.data):
            ctx.data['concierge'] = ReActAgentWorker.from_tools(
                tools=[],
                llm=ctx.data["llm"]
            )
            ctx.data['concierge'].update_prompts({"system_prompt": concierge_system_prompt})
            ctx.data['concierge'] = ctx.data['concierge'].as_agent()
        
        user_message = ctx.data['current_user_message']
        
        response = ctx.data["concierge"].chat(message=user_message, chat_history=ctx.data['chat_history'])
        ctx.data['chat_history'] = self.add_to_chat_history(ctx.data['chat_history'], user_content=user_message, bot_content=response)
        
        print(Fore.MAGENTA + str(response) + Style.RESET_ALL)
        print(str(ctx.data))

        return StopEvent(result=str(response))

def build_concierge_workflow() -> ConciergeWorkflow:
    return ConciergeWorkflow(timeout=60, verbose=True)


async def deploy_agentic_workflow():
    concierge_workflow = build_concierge_workflow()

    await deploy_workflow(
        concierge_workflow,
        workflow_config=WorkflowServiceConfig(
            host="localhost", port=8002, service_name="concierge_workflow"
        ),
        control_plane_config=ControlPlaneConfig(),
    )


if __name__ == "__main__":
    import asyncio, time

    time.sleep(5)

    asyncio.run(deploy_agentic_workflow())