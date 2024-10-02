import os
from dotenv import load_dotenv
load_dotenv(os.path.join('./llm_deploy/workflows/','.env'))

from llama_index.core.workflow import (
    step, 
    Context, 
    Workflow, 
    StartEvent, 
    StopEvent
)
 
from llama_index.core.agent import ReActAgentWorker
from llama_index.llms.gemini import Gemini

from llama_deploy import (
    deploy_workflow,
    WorkflowServiceConfig,
    ControlPlaneConfig,
)
from llama_index.core.schema import Document
from llama_index.core import VectorStoreIndex
from llama_index.core.response_synthesizers import CompactAndRefine
from llama_index.core import SimpleDirectoryReader
from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
from llama_index.core.response_synthesizers import CompactAndRefine
from llama_index.core.postprocessor.llm_rerank import LLMRerank
from llm_deploy.workflows.utils.pydantic_models import RetrieverEvent, RerankEvent 

from llm_deploy.workflows.utils.llms import models
from llm_deploy.workflows.utils.pydantic_models import RagTutorEvent, TutorEvent, SynthesizerEvent
from llm_deploy.workflows.utils.funcs import convert_to_chat_history
from llm_deploy.workflows.utils.prompts import tutor_system_prompt

from colorama import Fore, Back, Style

class TutorWorkflow(Workflow):
    
    @step(pass_context=True)
    async def initialize(self, ctx: Context, ev: StartEvent) -> TutorEvent | RagTutorEvent:
        print("Starting Workflow.")
        ctx.data["model"] = ev.get('model','gemini-1.5-flash-001')
        ctx.data["llm"] = models[ctx.data["model"]]
        ctx.data['chat_history']= ev.get('chat_history', [{'role':'user','content':'Hi'}]) # chat_history in string format.
        ctx.data['chat_history'], ctx.data['user_message'] = convert_to_chat_history(ctx.data['chat_history'])
        ctx.data["docs"] =  ev.get('docs', None)
        print("Started Workflow.")
        if ctx.data["docs"]:
            print(type(ctx.data["docs"]))
            docs = []
            for text in list(ctx.data["docs"]):
                docs.append(Document(text=text))
            ctx.data["docs"] = docs
            return RagTutorEvent()
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
    
    @step(pass_context=True)
    async def ingest(self, ctx: Context, ev: RagTutorEvent) -> RetrieverEvent | None:
        """Entry point to ingest a document, triggered by a StartEvent with `dirname`."""
        embeddings_model = models["BAAI/bge-small-en-v1.5"]
        ctx.data["index"] = VectorStoreIndex.from_documents(
            documents=ctx.data["docs"],
            embed_model=embeddings_model,
        )
        return RetrieverEvent()

    @step
    async def retrieve(
        self, ctx: Context, ev: RetrieverEvent
    ) -> RerankEvent | StopEvent:
        "Entry point for RAG, triggered by a StartEvent with `query`."
        query = ctx.data['user_message']
        index = ctx.data["index"]
        ctx.data["model"] = ev.get("model")
        
        if not query:
            return StopEvent(response={"response":"No query!"})

        print(f"Query the database with: {query}")

        # store the query in the global context
        ctx.data["query"] = query

        # get the index from the global context
        if index is None:
            print("Index is empty, load some documents before querying!")
            return None

        retriever = index.as_retriever(similarity_top_k=2)
        nodes = await retriever.aretrieve(query)
        print(f"Retrieved {len(nodes)} nodes.")
        ctx.data["nodes"] = nodes
        return RerankEvent()

    @step
    async def rerank(self, ctx: Context, ev: RerankEvent) -> SynthesizerEvent:
        # Rerank the nodes
        ranker = LLMRerank(
            choice_batch_size=5, top_n=3, 
            llm=Gemini(os.getenv('GOOGLE_API_KEY'), model='models/gemini-1.5-flash-001')
            # llm=models[ctx.data["model"]]
        )
        print(await ctx.get("query", default=None), flush=True)
        new_nodes = ranker.postprocess_nodes(
            ctx.data["nodes"], query_str=await ctx.get("query", default=None)
        )
        print(f"Reranked nodes to {len(new_nodes)}")
        ctx.data["nodes"] = new_nodes
        return SynthesizerEvent(nodes=new_nodes)

    @step
    async def synthesize(self, ctx: Context, ev: SynthesizerEvent) -> StopEvent:
        """Return a streaming response using reranked nodes."""
        llm = Gemini(os.getenv('GOOGLE_API_KEY'), model='models/gemini-1.5-flash-001')
        summarizer = CompactAndRefine(llm=llm, streaming=True, verbose=True)
        query = await ctx.get("query", default=None)

        response = await summarizer.asynthesize(query, nodes=ctx.data["nodes"])
        print(response)
        return StopEvent(result={"response":response})


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
        control_plane_config=ControlPlaneConfig(host="0.0.0.0"),
    )

if __name__ == "__main__":
    import asyncio, time

    time.sleep(5)

    asyncio.run(deploy_agentic_workflow())