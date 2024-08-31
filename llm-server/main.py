from langchain_community.llms import Ollama
from langchain.prompts import SystemMessagePromptTemplate, HumanMessagePromptTemplate, ChatPromptTemplate
from langchain.agents import AgentExecutor, initialize_agent
from langchain.tools import Tool

from langchain.tools import Tool
from langchain.llms import Ollama

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
    prompt = """
        Analyze the following conversation history:
        {chat_history}

        Determine the current conversation state. Consider factors such as the topic, depth of discussion, and user engagement. Possible states include:
        * **Initial**
        * **Exploring**
        * **Probing**
        * **Concluding**
    """
    response = llm(prompt)
    print(response)
    return response.strip()

# Wrap the function as a Tool using Tool.from_function
conversation_state_tracker_tool = Tool.from_function(
    func=conversation_state_tracker, 
    name="conversation_state_tracker", 
    description="Tracks the current state of the conversation based on the chat history."
)

# Create conversation state tracker tool
tools = [conversation_state_tracker_tool]

# Create system prompt and initial messages
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

# Initialize Ollama model
llm = Ollama(model="llama3.1")

# Create chat template and agent executor
chat_template = ChatPromptTemplate.from_messages([system_prompt,HumanMessagePromptTemplate.from_template("Hello! I'm ready to start our Socratic learning session.. Shall we start?")])
# Initialize an agent using the tools and the conversation chain
agent = initialize_agent(
    tools=tools, 
    llm=llm, 
    agent="zero-shot-react-description",  # Example agent type, adjust as needed
    chat_prompt=chat_template
)

# Create an AgentExecutor with the initialized agent
agent_executor = AgentExecutor(agent=agent, tools=tools)


user_chat_history = []
# Start the conversation
while True:
    user_input = input("You: ")
    if user_input.lower() == "quit":
        break

    # Update conversation history
    user_chat_history.append(user_input)

    # Determine conversation state using the tool
    conversation_state = agent_executor.invoke({"input": user_input})

    # user_chat_history.append()
    # Respond to the user based on the conversation state
    # (Implement logic to generate appropriate responses based on the state)

    print(f"Current Conversation State: {conversation_state}")
