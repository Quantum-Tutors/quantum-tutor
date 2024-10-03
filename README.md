# Quantum Tutor

## Overview

Quantum Tutor is an AI-powered teaching assistant that uses the Socratic method to guide students through learning Data Structures and Algorithms, with a specific focus on sorting algorithms. The system is capable of performing retrieval-augmented generation (RAG) on user-provided documents, making the learning experience tailored to individual needs. This project integrates Next.js, FastAPI, LlamaIndex, Gemini LLM, Groq open-source LLMs, MongoDB, and Docker, leveraging the strengths of these technologies to provide an efficient, scalable, and interactive platform for AI-driven Socratic learning.

## Tech Stack

- **Next.js**: For server-side rendering and building the frontend.
- **FastAPI**: Lightweight Python-based backend for handling API requests.
- **LlamaIndex**: For indexing and retrieving relevant document content.
- **LlamaDeploy**: For deploying Llama-based models.
- **Gemini LLM**: Large language model used for generating human-like responses.
- **Groq LLM**: Open-source LLM for efficient language model processing.
- **MongoDB**: A NoSQL database for storing user sessions and application data.
- **Docker**: Containerization for the FastAPI server and Llama components.

## Prerequisites

- Node.js >= 14.x
- MongoDB >= 4.4
- Python >= 3.8
- Git
- Docker

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Quantum-Tutors/quantum-tutor.git
2. **Navigate to project**
    ```bash
    cd quantum-tutor-web
    cd llm-backend
### LLM SERVER & LLAMA DEPLOY
3. **Install Docker**
4. **Docker Compose**
    ```bash
    docker compose -f ./docker-compose.yml --project-directory ./ up --build -d --remove-orphans

5. **Install dependencies For frontend (Next.js):**
    ```bash
    cd quantum-tutor-web
    npm install
6. **Run the application Frontend:**
    ```bash
    npm run dev