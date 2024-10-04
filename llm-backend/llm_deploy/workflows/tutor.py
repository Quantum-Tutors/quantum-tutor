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
from utils.llms import models
from utils.pydantic_models import TutorEvent
from utils.funcs import convert_to_chat_history
from utils.prompts import tutor_system_prompt

from colorama import Fore, Back, Style

class TutorWorkflow(Workflow):
    
    @step(pass_context=True)
    async def initialize(self, ctx: Context, ev: StartEvent) -> TutorEvent:
        print("Starting Workflow.")
        ctx.data["model"] = ev.get('model','gemini-1.5-flash-001')
        ctx.data["llm"] = models[ctx.data["model"]]
        ctx.data['chat_history']= ev.get('chat_history', [{'role':'user','content':'Hi'}]) # chat_history in string format.
        ctx.data['chat_history'], ctx.data['user_message'] = convert_to_chat_history(ctx.data['chat_history'])
        print("Started Tutor Workflow.")
        return TutorEvent()
    
    @step(pass_context=True)
    async def tutor(self, ctx: Context, ev: TutorEvent) -> StopEvent:
        
        if ("tutor" not in ctx.data):
            ctx.data['tutor'] = ReActAgentWorker.from_tools(
                tools=[],
                llm=ctx.data["llm"]
            )
            ctx.data['tutor'].update_prompts({"system_prompt": tutor_system_prompt})
            ctx.data['tutor'] = ctx.data['tutor'].as_agent()
        
        user_message = ctx.data['user_message']
        response = ctx.data["tutor"].chat(message=user_message, chat_history=ctx.data['chat_history'])

        print(Fore.MAGENTA + str(response) + Style.RESET_ALL)

        return StopEvent(result=response)
    
def build_tutor_workflow() -> TutorWorkflow:
    return TutorWorkflow(timeout=180, verbose=True)


async def deploy_agentic_workflow():
    tutor_workflow = build_tutor_workflow()

    await deploy_workflow(
        tutor_workflow,
        workflow_config=WorkflowServiceConfig(
            host="0.0.0.0",
            port=8002, 
            service_name="tutor_workflow"
        ),
        control_plane_config=ControlPlaneConfig(host=str(os.getenv("CONTROL_PLANE_URL")),port=None),
    )

if __name__ == "__main__":
    import os
    from dotenv import load_dotenv
    load_dotenv(os.path.join('./','.env'))
    print(str(os.getenv("CONTROL_PLANE_URL")))
    import asyncio, time

    time.sleep(5)

    asyncio.run(deploy_agentic_workflow())