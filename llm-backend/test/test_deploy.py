from llama_deploy import LlamaDeployClient
from llama_deploy import (
    LlamaDeployClient,
    AsyncLlamaDeployClient,
    ControlPlaneConfig,
)

from llama_deploy.types import TaskDefinition

llama_deploy_aclient = LlamaDeployClient(ControlPlaneConfig())

session = llama_deploy_aclient.create_session()
print(session.session_id)
chat_history = None

response = session.run("concierge_workflow", chat_history=chat_history, user_message="Hi I wanna learn Data structures!")
print(response)

# print(session.session_id)
# chat_history = session.run("concierge_workflow", chat_history=chat_history, user_message="I'm have almost no exposure to this, list some important concepts in that.")
# print(chat_history[-1], type(chat_history))
