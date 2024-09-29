from llama_index.core.llms import MessageRole

roles = {
    'user': MessageRole.USER, 
    'system':MessageRole.SYSTEM, 
    'bot': MessageRole.ASSISTANT, 
    'tool': MessageRole.TOOL
}
