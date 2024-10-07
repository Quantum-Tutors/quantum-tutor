from llama_deploy import (
    deploy_core,
    ControlPlaneConfig,
    SimpleMessageQueueConfig,
)

async def deploy_core_systems():
    await deploy_core(
        control_plane_config=ControlPlaneConfig(host='0.0.0.0'),
        message_queue_config=SimpleMessageQueueConfig(host='0.0.0.0'),
    )


# import asyncio

# asyncio.run(deploy_core_systems())