Here's the updated `README.md` with the new information:

# FastAPI Conversation Generator API

This FastAPI application generates random chat session data with regular and module-based conversations. It can be used to populate your frontend during development by simulating chat interactions between a user and a bot.

## Features

- Returns random chat sessions with 3-5 conversations.
- Includes module-based conversations displayed within MUI accordions on the frontend.
- Generates random IDs and timestamps for entities.

## Prerequisites

- Python 3.12 (minimum)
- FastAPI
- Uvicorn

## Setup Instructions

### 1. Create a Virtual Environment

Create a virtual environment named `.venv` in the project directory:

```bash
python -m venv .venv
```

### 2. Activate the Virtual Environment

Activate the virtual environment:

**Windows**:
```bash
.venv\Scripts\activate
```

**macOS/Linux**:
```bash
source .venv/bin/activate
```

### 3. Install Dependencies

Install the required packages from the `requirements.txt` file:

```bash
pip install -r requirements.txt
```

Or, just for `convo-generator`:

```bash
pip install fastapi uvicorn pydantic
```

### 4. Run the FastAPI Server

Start the FastAPI server using Uvicorn:

```bash
cd llm-server/data/
uvicorn convo-generator:app --reload
```

The server will run on [http://127.0.0.1:8000](http://127.0.0.1:8000).

### 5. Access the API

You can access the random chat session API at:

- [http://127.0.0.1:8000/chat](http://127.0.0.1:8000/chat)

### 6. API Documentation

FastAPI automatically generates interactive API documentation that you can access at:

- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

## Example Requests and Responses

### New Chat Request

**Request Body:**

```json
{
    "message": {
        "sender": "user",
        "text": "Hii, hello0000?",
    }
}
```

**Response Example (Normal Message):**

```json
{
    "message": {
        "msgId": "msg_da587d",
        "chatId": "chat_931a8c",
        "sender": "bot",
        "text": "This is a normal bot response.",
        "moduleId": null,
        "createdAt": "2024-09-10T02:09:04.536539Z",
        "sequence": 38
    }
}
```

**Response Example (Module Started):**

```json
{
    "module": {
        "moduleId": "module_3cc513",
        "messages": [
            {
                "msgId": "msg_848dfa",
                "chatId": "chat_cc525b",
                "sender": "bot",
                "text": "This is the start of a module.",
                "moduleId": "module_3cc513",
                "createdAt": "2024-09-10T02:22:34.023473Z",
                "sequence": 2
            }
        ]
    }
}
```

### Continuing a Chat Request

**Request Body:**

```json
{
    "message": {
        "sender": "user",
        "text": "Hii, hello0000?",
        "chatId": "chat_cc525b"
    }
}
```

## Project Structure

- `convo-generator.py`: The main FastAPI application.
- `.venv/`: The virtual environment directory.
- `requirements.txt`: File listing the required Python packages.

## Usage

Use this API to generate random chat sessions with various message types to test your frontend implementations. Customize the message content and module interactions as needed for your specific development requirements.

---

Happy coding!