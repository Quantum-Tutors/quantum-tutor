from llama_deploy import (
    deploy_core,
    ControlPlaneConfig,
    SimpleMessageQueueConfig,
)


async def main():
    await deploy_core(
        control_plane_config=ControlPlaneConfig(host='0.0.0.0'),
        message_queue_config=SimpleMessageQueueConfig(host='0.0.0.0'),
    )


import asyncio

asyncio.run(main())