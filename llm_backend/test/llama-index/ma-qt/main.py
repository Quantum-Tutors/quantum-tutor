import os
from dotenv import load_dotenv
load_dotenv(os.path.join('./config/','.env'))  

from llama_index.utils.workflow import draw_all_possible_flows

from workflow.concierge import ConciergeWorkflow


# draw_all_possible_flows(ConciergeWorkflow,filename="concierge_flows.html")

async def main():
    c = ConciergeWorkflow(timeout=120, verbose=True)
    result = await c.run()
    print(result)

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
