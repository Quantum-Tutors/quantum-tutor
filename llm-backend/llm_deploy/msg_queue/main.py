from llama_deploy import (
    deploy_core,
    ControlPlaneConfig,
    SimpleMessageQueueConfig,
)
import os
from dotenv import load_dotenv
load_dotenv(os.path.join('./config/','.env'))

async def main():
    await deploy_core(
        control_plane_config=ControlPlaneConfig(host=str(os.getenv('CONTROL_PLANE_URL'))),
        message_queue_config=SimpleMessageQueueConfig(host='0.0.0.0'),
    )


import asyncio

asyncio.run(main())