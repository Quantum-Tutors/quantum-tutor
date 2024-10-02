import os
from dotenv import load_dotenv
load_dotenv(os.path.join('./','.env'))

from llama_index.core import SimpleDirectoryReader
from llama_index.core import Settings

documents = SimpleDirectoryReader('./data').load_data()
nodes = Settings.node_parser.get_nodes_from_documents(documents)

from llama_index.embeddings.gemini import GeminiEmbedding
from llama_index.llms.gemini import Gemini
from llama_index.llms.ollama import Ollama
from llama_index.embeddings.ollama import OllamaEmbedding
from llama_index.llms.groq import Groq

# Settings.embed_model = GeminiEmbedding(
#     model_name="models/embedding-001", api_key=os.getenv('GOOGLE_API_KEY')
# )
Settings.llm = Gemini(api_key=os.getenv('GOOGLE_API_KEY'))

Settings.llm = Ollama(model=os.environ['OLLAMA_LLM_MODEL'], base_url=os.environ['OLLAMA_BASE_URL'],
                    request_timeout=600)

Settings.llm = Groq('llama-3.1-70b-versatile')

Settings.embed_model = OllamaEmbedding(model_name=os.environ['OLLAMA_EMBED_MODEL'],
                                    base_url=os.environ['OLLAMA_BASE_URL'])

from llama_index.core import StorageContext

storage_context = StorageContext.from_defaults()
storage_context.docstore.add_documents(nodes)

from llama_index.core import SimpleKeywordTableIndex, VectorStoreIndex

vector_index = VectorStoreIndex(nodes, storage_context=storage_context)
keyword_index = SimpleKeywordTableIndex(nodes, storage_context=storage_context)

from llama_index.core import QueryBundle
from llama_index.core.schema import NodeWithScore

from llama_index.core.retrievers import (
    BaseRetriever,
    VectorIndexRetriever,
    KeywordTableSimpleRetriever,
)

from typing import List

class CustomRetriever(BaseRetriever):
    def __init__(
        self,
        vector_retriever: VectorIndexRetriever,
        keyword_retriever: KeywordTableSimpleRetriever,
        mode: str = "AND") -> None:
       
        self._vector_retriever = vector_retriever
        self._keyword_retriever = keyword_retriever
        if mode not in ("AND", "OR"):
            raise ValueError("Invalid mode.")
        self._mode = mode
        super().__init__()

    def _retrieve(self, query_bundle: QueryBundle) -> List[NodeWithScore]:
        vector_nodes = self._vector_retriever.retrieve(query_bundle)
        keyword_nodes = self._keyword_retriever.retrieve(query_bundle)
        print(keyword_nodes)
        
        vector_ids = {n.node.node_id for n in vector_nodes}
        keyword_ids = {n.node.node_id for n in keyword_nodes}
        print(vector_ids,keyword_ids)
        
        combined_dict = {n.node.node_id: n for n in vector_nodes}
        combined_dict.update({n.node.node_id: n for n in keyword_nodes})
        print(combined_dict)

        if self._mode == "AND":
            retrieve_ids = vector_ids.intersection(keyword_ids)
        else:
            retrieve_ids = vector_ids.union(keyword_ids)

        retrieve_nodes = [combined_dict[r_id] for r_id in retrieve_ids]
        print(retrieve_nodes)
        return retrieve_nodes
    
from llama_index.core import get_response_synthesizer
from llama_index.core.query_engine import RetrieverQueryEngine

vector_retriever = VectorIndexRetriever(index=vector_index, similarity_top_k=2)
keyword_retriever = KeywordTableSimpleRetriever(index=keyword_index)

# custom retriever => combine vector and keyword retriever

custom_retriever = CustomRetriever(vector_retriever, keyword_retriever)

# define response synthesizer
response_synthesizer = get_response_synthesizer()

custom_query_engine = RetrieverQueryEngine(
    retriever=custom_retriever,
    response_synthesizer=response_synthesizer,
)

print(custom_query_engine.query("what does the data context contain?"))
print(custom_query_engine.query("what are the names of the passengers?"))