from llama_deploy import LlamaDeployClient
from llama_deploy import (
    LlamaDeployClient,
    AsyncLlamaDeployClient,
    ControlPlaneConfig,
)

llama_deploy_aclient = LlamaDeployClient(ControlPlaneConfig())

session = llama_deploy_aclient.get_or_create_session('ef263961-538a-4784-9aef-4c38cea92272')
print(session.session_id)

result = session.run("concierge_workflow", user_message="Hi I wanna learn Data structures!")
print(result)

print(session.session_id)
result = session.run("concierge_workflow", user_message="I'm have almost no exposure to this, list some important concepts in that.")
print(result) 