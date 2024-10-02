from llama_index.core.workflow import (
    step, 
    Context, 
    Workflow, 
    StartEvent, 
    StopEvent
)
 
from llama_index.core.agent import ReActAgentWorker

from llama_deploy import (
    deploy_workflow,
    WorkflowServiceConfig,
    ControlPlaneConfig,
)

from llm_deploy.workflows.utils.llms import models
from llm_deploy.workflows.utils.pydantic_models import InitializeEvent, ConciergeEvent, ModelResponse
from llm_deploy.workflows.utils.funcs import convert_to_chat_history
from llm_deploy.workflows.utils.prompts import *

from colorama import Fore, Back, Style

class ConciergeWorkflow(Workflow):

    @step(pass_context=True)
    async def initialize(self, ctx: Context, ev: InitializeEvent) -> ConciergeEvent:
        ctx.data["llm"] = models[ctx.data["model"]]
        ctx.data['chat_history'], ctx.data['user_message'] = convert_to_chat_history(ctx.data['chat_history'])
        print("Initializing Workflow.")
        return ConciergeEvent()
    
    @step(pass_context=True)
    async def concierge(self, ctx: Context, ev: ConciergeEvent | StartEvent) -> InitializeEvent | StopEvent:
        if isinstance(ev, StartEvent):
            ctx.data["model"] = ev.get('model','gemini-1.5-flash-002')
            ctx.data['chat_history']= ev.get('chat_history', [{'role':'user','content':'Hi'}]) # chat_history in string format.
            return InitializeEvent()
        
        if ("concierge" not in ctx.data):
            ctx.data['concierge'] = ReActAgentWorker.from_tools(
                tools=[],
                llm=ctx.data["llm"]
            )
            ctx.data['concierge'].update_prompts({"system_prompt": concierge_system_prompt})
            ctx.data['concierge'] = ctx.data['concierge'].as_agent()
        
        user_message = ctx.data['user_message']
        response = ctx.data["concierge"].chat(message=user_message, chat_history=ctx.data['chat_history'])

        print(Fore.MAGENTA + str(response) + Style.RESET_ALL)

        return StopEvent(result=response)

def build_concierge_workflow() -> ConciergeWorkflow:
    return ConciergeWorkflow(timeout=180, verbose=True)


async def deploy_agentic_workflow():
    concierge_workflow = build_concierge_workflow()

    await deploy_workflow(
        concierge_workflow,
        workflow_config=WorkflowServiceConfig(
            host="0.0.0.0",
            port=8002, 
            service_name="concierge_workflow"
        ),
        control_plane_config=ControlPlaneConfig(host="0.0.0.0"),
    )

if __name__ == "__main__":
    import asyncio, time

    time.sleep(5)

    asyncio.run(deploy_agentic_workflow())