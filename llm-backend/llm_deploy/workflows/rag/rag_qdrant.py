from llama_index.core import VectorStoreIndex
from llama_index.core.response_synthesizers import CompactAndRefine
from llama_index.core import SimpleDirectoryReader
from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
from llama_index.core.response_synthesizers import CompactAndRefine
from llama_index.core.postprocessor.llm_rerank import LLMRerank
from llama_index.core.workflow import (
    Context,
    Workflow,
    StartEvent,
    StopEvent,
    step,
)

from llama_deploy import (
    deploy_workflow,
    WorkflowServiceConfig,
    ControlPlaneConfig,
)

from llm_deploy.workflows.utils.pydantic_models import RetrieverEvent, RerankEvent 
from llm_deploy.workflows.utils.llms import models

class RAGWorkflow(Workflow):
    
    @step
    async def ingest(self, ctx: Context, ev: StartEvent) -> StopEvent | None:
        """Entry point to ingest a document, triggered by a StartEvent with `dirname`."""
        dirname = ev.get("dirname")
        if not dirname:
            return None
        embeddings_model = models["BAAI/bge-small-en-v1.5"]
        documents = SimpleDirectoryReader(dirname).load_data()
        index = VectorStoreIndex.from_documents(
            documents=documents,
            embed_model=embeddings_model,
        )
        return StopEvent(result=index)

    @step
    async def retrieve(
        self, ctx: Context, ev: StartEvent
    ) -> RetrieverEvent | None:
        "Entry point for RAG, triggered by a StartEvent with `query`."
        query = ev.get("query")
        index = ev.get("index")
        ctx.data["model"] = ev.get("model")
        if not query:
            return None

        print(f"Query the database with: {query}")

        # store the query in the global context
        await ctx.set("query", query)

        # get the index from the global context
        if index is None:
            print("Index is empty, load some documents before querying!")
            return None

        retriever = index.as_retriever(similarity_top_k=2)
        nodes = await retriever.aretrieve(query)
        print(f"Retrieved {len(nodes)} nodes.")
        return RetrieverEvent(nodes=nodes)

    @step
    async def rerank(self, ctx: Context, ev: RetrieverEvent) -> RerankEvent:
        # Rerank the nodes
        ranker = LLMRerank(
            choice_batch_size=5, top_n=3, 
            # llm=Groq(model="llama-3.1-70b-versatile"),
            llm=models[ctx.data["model"]]
        )
        print(await ctx.get("query", default=None), flush=True)
        new_nodes = ranker.postprocess_nodes(
            ev.nodes, query_str=await ctx.get("query", default=None)
        )
        print(f"Reranked nodes to {len(new_nodes)}")
        return RerankEvent(nodes=new_nodes)

    @step
    async def synthesize(self, ctx: Context, ev: RerankEvent) -> StopEvent:
        """Return a streaming response using reranked nodes."""
        llm = models[ctx.data["model"]]
        summarizer = CompactAndRefine(llm=llm, streaming=True, verbose=True)
        query = await ctx.get("query", default=None)

        response = await summarizer.asynthesize(query, nodes=ev.nodes)
        return StopEvent(result=response)


def build_rag_workflow() -> RAGWorkflow:
    return RAGWorkflow(timeout=180, verbose=True)


async def deploy_rag_workflow():
    rag_workflow = build_rag_workflow()

    await deploy_workflow(
        rag_workflow,
        workflow_config=WorkflowServiceConfig(
            host="0.0.0.0",
            port=8003, 
            service_name="rag_workflow"
        ),
        control_plane_config=ControlPlaneConfig(host="0.0.0.0"),
    )

if __name__ == "__main__":
    import asyncio, time

    time.sleep(5)

    asyncio.run(deploy_rag_workflow())