import os

from llama_index.llms.gemini import Gemini
from llama_index.llms.groq import Groq

from llm_deploy.workflows.utils.pydantic_models import ModelResponse
from llm_deploy.workflows.utils.constants import response_schema, generation_config


models = {
    "gemini-1.5-flash-001":Gemini(os.getenv('GOOGLE_API_KEY'), model='models/gemini-1.5-flash-001', generation_config=generation_config).as_structured_llm(output_cls=ModelResponse),
    "gemini-1.5-flash-002":Gemini(os.getenv('GOOGLE_API_KEY'), model='models/gemini-1.5-flash-002', generation_config=generation_config).as_structured_llm(output_cls=ModelResponse),
    "llama3-groq-70b-8192-tool-use-preview":Groq('llama3-groq-70b-8192-tool-use-preview').as_structured_llm(output_cls=ModelResponse),
    "llama-3.1-8b-instant":Groq('llama-3.1-8b-instant').as_structured_llm(output_cls=ModelResponse),
    "llama-3.1-70b-versatile":Groq('llama-3.1-70b-versatile').as_structured_llm(output_cls=ModelResponse),
}