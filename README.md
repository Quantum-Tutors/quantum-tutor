# Quantum Tutor

## Overview

This project integrates LangChain, LangGraph, Ollama, Next.js, MongoDB, and Llama3 to build a sophisticated AI application. It leverages the strengths of each technology to provide an efficient, scalable, and interactive platform for AI-driven solutions.

## Tech Stack

- **LangChain**: Framework for developing applications powered by language models.
- **LangGraph**: For creating and managing complex language workflows.
- **Ollama**: To host and manage the Llama3 models locally or on-premises.
- **Next.js**: For server-side rendering and building the frontend.
- **MongoDB**: A NoSQL database for storing application data.
- **Llama3**: Advanced language model for generating human-like text responses.

## Prerequisites

- Node.js >= 14.x
- MongoDB >= 4.4
- Python >= 3.8
- Git
- Docker (for Ollama)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Quantum-Tutors/quantum-tutor.git
   ```
2. **Navigate to project**
   ```bash
   cd quantum-tutor-web
   ```
   ```bash
   cd llm-server
   ```

# LLM SERVER & LLAMA DEPLOY
1. Install Docker
2. cd llama_deploy/
3. docker compose -f ./docker-compose.yml --project-directory ./ up --build -d --remove-orphans
4. cd ../
5. python server.py


## PAYLOAD:

### URL: http://0.0.0.0:5000/chat

1. **First Request**:
```json
{
    "sender": "user",
    "text": "Hii, I wanna learn Data structures?"
}
```
2. **Second Request**:
```json
{
    "sender": "user",
    "text": "yeah, I have heard about arrays",
    "userId": "usr_e23ce7", //get it from the previous response
    "chatId": "chat_429c87" //get it from the previous response
}
```