from llama_index.core.llms import MessageRole

response_schema = {
    "type": "object",
    "properties": {
        "response": {"type": "string", "description": "The response to the query."},
        "isModule": {
            "type": "boolean",
            "description": "Indicates if the response belongs to a module.",
        },
        "moduleTitle": {
            "type": "string",
            "description": "The title of the module based on the current conversation.",
        },
    },
    "required": ["response", "isModule", "moduleTitle"],
}
generation_config = {
    "response_mime_type": "application/json",
    "response_schema": response_schema,
}

roles = {
    "user": MessageRole.USER,
    "system": MessageRole.SYSTEM,
    "bot": MessageRole.ASSISTANT,
    "tool": MessageRole.TOOL,
}
