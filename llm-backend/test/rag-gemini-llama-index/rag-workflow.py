from llama_index.core import VectorStoreIndex
from llama_index.core.schema import NodeWithScore
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
    Event
)
from llama_index.core.workflow.utils import get_steps_from_class, get_steps_from_instance
from llama_index.llms.groq import Groq
from llama_index.llms.gemini import Gemini
from llama_index.embeddings.huggingface import HuggingFaceEmbedding

import os
from dotenv import load_dotenv
load_dotenv(os.path.join('./','.env'))

class RetrieverEvent(Event):
    """Result of running retrieval"""
    nodes: list[NodeWithScore]

class RerankEvent(Event):
    """Result of running reranking on retrieved nodes"""
    nodes: list[NodeWithScore]
    
class RAGWorkflow(Workflow):
    @step
    async def ingest(self, ctx: Context, ev: StartEvent) -> StopEvent | None:
        """Entry point to ingest a document, triggered by a StartEvent with `dirname`."""
        dirname = ev.get("dirname")
        if not dirname:
            return None

        documents = SimpleDirectoryReader(dirname).load_data()
        index = VectorStoreIndex.from_documents(
            documents=documents,
            embed_model=HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5"),
        )
        return StopEvent(result=index)

    @step
    async def retrieve(
        self, ctx: Context, ev: StartEvent
    ) -> RetrieverEvent | None:
        "Entry point for RAG, triggered by a StartEvent with `query`."
        query = ev.get("query")
        index = ev.get("index")

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
            llm=Gemini(api_key=os.getenv('GOOGLE_API_KEY'))
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
        # llm = Groq(model="llama-3.1-70b-versatile")
        llm = Gemini(api_key=os.getenv('GOOGLE_API_KEY'))
        summarizer = CompactAndRefine(llm=llm, streaming=True, verbose=True)
        query = await ctx.get("query", default=None)

        response = await summarizer.asynthesize(query, nodes=ev.nodes)
        return StopEvent(result=response)


# # Check if steps have __step_config attribute
# workflow = RAGWorkflow()
# steps = get_steps_from_class(RAGWorkflow)
# if not steps:
#     steps = get_steps_from_instance(workflow)
# print(f"steps class :{steps}")
# for step_name, step_func in steps.items():
#     step_config = getattr(step_func, "__step_config", None)
#     print(f"step config :{step_config}")
#     if step_config is None:
#         print(f"Step {step_name} is missing __step_config")
        
# import nest_asyncio
# nest_asyncio.apply()

# # Visualization
# from llama_index.utils.workflow import draw_all_possible_flows, draw_most_recent_execution

# # Draw all possible flows
# draw_all_possible_flows(RAGWorkflow, filename="multi_step_workflow.html")

# Draw the most recent execution
async def run():
    w = RAGWorkflow()
    # Ingest the documents
    index = await w.run(dirname="./data")
    # result = await w.run(query="Summarize the document", index=index)
    # async for chunk in result.async_response_gen():
    #     print(chunk, end="", flush=True)
    result = await w.run(query="who are the passengers?", index=index)
    async for chunk in result.async_response_gen():
        print(chunk, end="", flush=True)
    # draw_most_recent_execution(w, filename="rag_flow_recent.html")
from llama_index.core.schema import Document

import asyncio

asyncio.run(run())