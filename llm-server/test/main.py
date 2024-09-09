# from langchain_community.llms import Ollama
from langchain_ollama import ChatOllama
from langchain.prompts import SystemMessagePromptTemplate, HumanMessagePromptTemplate, ChatPromptTemplate, MessagesPlaceholder
# from langchain.agents import AgentAction, AgentExecutor, initialize_agent, create_tool_calling_agent
from langchain_core.messages import BaseMessage
from langchain.tools import Tool
from typing import TypedDict, Annotated, List, Union


def conversation_state_tracker(chat_history):
    """
    Analyzes the conversation history to determine the current state of the conversation.
    
    Parameters:
    - chat_history (str): The entire conversation history up to the current point.
    
    Returns:
    - str: The current state of the conversation, which could be one of the following:
        * **Initial** - The beginning stage of the conversation.
        * **Exploring** - In-depth discussion and exploration of topics.
        * **Probing** - Asking deeper questions to uncover more information.
        * **Concluding** - Wrapping up the conversation and reaching a conclusion.
    """
    prompt = f"""
        Analyze the following conversation history:
        {chat_history}
        Determine the current conversation state in Socratic learning Method to decide what to do next. 
        Consider factors such as the topic, depth of discussion, and user engagement. 
        Respond with only on of the possible states:
        * **Initial**
        * **Exploring**
        * **Probing**
        * **Concluding**
    """
    response = model.invoke(prompt)
    return response.strip()

conversation_state_tracker_tool = Tool.from_function(
    func=conversation_state_tracker, 
    name="conversation_state_tracker", 
    description="Tracks the current state of the conversation based on the chat history."
)
tools=[conversation_state_tracker_tool]

system_prompt = SystemMessagePromptTemplate.from_template("""
    You will act as a Socratic tutor, guiding the user towards understanding their own errors or misconceptions or in learning a new concept.

    Your role:

        Questioning: Ask probing questions to challenge the user's assumptions and encourage deeper thinking.
        Clarification: Request clarification when the user's responses are unclear or contradictory.
        Counter-arguments: Present counter-arguments to the user's claims to help them identify flaws in their reasoning.
        Guidance: Provide hints or suggestions to nudge the user towards the correct understanding.
        New Concepts: If learning new concepts, then list some related concepts to the given concept and ask the user whether he knows it or not. 
        Based on his existing knowledge, ask questions on the concpets he knows and converge on the new concept.

    Focus:

        Concept understanding: Help the user grasp the underlying concepts and principles.
        Error identification: Assist the user in recognizing and correcting their mistakes.
        Critical thinking: Encourage the user to think critically and evaluate their own arguments.
        
    Example Questions: (Ask such questions with respect to the context the user has provided.)

        "Can you explain why you chose this approach?"
        "What are the potential drawbacks of this solution?"
        "How could you test your code to verify its correctness?"
        "Can you think of a simpler or more efficient way to achieve the same result?"
        
    Remember: Your primary goal is to facilitate learning, not to provide answers. 
    By asking thought-provoking questions, you can help the user develop a deeper understanding of the topic and improve their problem-solving skills.

    """
)


from langchain_core.messages import HumanMessage
from langgraph.checkpoint.memory import MemorySaver

# Create the agent
memory = MemorySaver()
model = ChatOllama(model="llama3.1")

model = model.bind_tools(tools)

response = model.invoke([HumanMessage(content="hi!")])