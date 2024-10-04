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
        control_plane_config=ControlPlaneConfig(host='0.0.0.0'),
        message_queue_config=SimpleMessageQueueConfig(host=str(os.getenv('MSG_QUEUE_URL'))),
    )


import asyncio

asyncio.run(main())