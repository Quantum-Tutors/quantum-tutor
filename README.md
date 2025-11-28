# ⚛️ Quantum Tutor: AI Socratic Teaching Assistant

**Quantum Tutor** is an AI-powered teaching assistant utilizing the **Socratic method** to guide students through **Data Structures and Algorithms**, with a focus on sorting algorithms. It features **Retrieval-Augmented Generation (RAG)** on user-provided documents for a personalized learning experience.

---

## ✨ Features

-   🧑‍🏫 **Socratic Learning**: Guides students through DSA concepts using interactive questioning.
-   🧠 **RAG Personalization**: Tailors content by performing RAG on user-provided documents.
-   📚 **DSA Focus**: Specialized in Data Structures and Algorithms, particularly sorting algorithms.
-   🗣️ **Multiple LLMs**: Integrates Gemini LLM and Groq open-source LLMs for diverse AI interactions.
-   🌐 **Full-Stack Architecture**: Built with Next.js (frontend) and FastAPI (backend).

---

## 🧰 Tech Stack

| Component         | Tech                              |
|-------------------|-----------------------------------|
| Frontend          | Next.js                           |
| Backend           | FastAPI, Python                   |
| RAG Framework     | LlamaIndex                        |
| LLMs              | Gemini LLM, Groq LLMs             |
| Database          | MongoDB                           |
| Containerization  | Docker                            |
| Deployment        | LlamaDeploy (for LLM backend)     |
| Language          | JavaScript/TypeScript, Python     |

---

## 🚀 Setup Instructions

This project consists of two main parts: the `llm-backend` (FastAPI) and `quantum-tutor-web` (Next.js frontend).

### Prerequisites

-   **Node.js** (>= 14.x)
-   **MongoDB** (>= 4.4)
-   **Python** (>= 3.8)
-   **Git**
-   **Docker**

### 1. Clone the Repository

```bash
git clone https://github.com/Quantum-Tutors/quantum-tutor.git # Replace with actual repo URL if different
cd quantum-tutor
```

### 2. Set up LLM Backend (FastAPI with Docker)

Navigate to the `llm-backend` directory and use Docker Compose:

```bash
cd llm-backend
docker compose -f ./docker-compose.yml --project-directory ./ up --build -d --remove-orphans
# This will start your FastAPI server and Llama components in Docker containers.
cd ..
```

### 3. Set up Frontend (Next.js)

Navigate to the `quantum-tutor-web` directory and install dependencies:

```bash
cd quantum-tutor-web
npm install
cd ..
```

### ⚙️ Configuration

-   Ensure **MongoDB** is running and accessible.
-   Set up any necessary environment variables (e.g., API keys for Gemini/Groq, MongoDB connection strings) in both `llm-backend` and `quantum-tutor-web` (typically via `.env` files).

---

## 🧑‍💻 Run the Application

### 1. Start LLM Backend

The backend should already be running via Docker Compose (from setup step 2).

### 2. Start Frontend

Navigate to the `quantum-tutor-web` directory and start the Next.js development server:

```bash
cd quantum-tutor-web
npm run dev
```

The frontend application will typically be accessible at `http://localhost:3000`.

---

## 📂 Project Structure

```
.
├── llm-backend/                # FastAPI backend for LLM integration and RAG
│   ├── Dockerfile              # Dockerfile for backend
│   ├── docker-compose.yml      # Docker Compose for services (FastAPI, Llama)
│   ├── main.py                 # FastAPI application entry point
│   ├── requirements.txt        # Python dependencies
│   └── ...
├── quantum-tutor-web/          # Next.js frontend application
│   ├── public/                 # Static assets
│   ├── src/                    # React components, pages, API integrations
│   ├── package.json            # Frontend dependencies and scripts
│   └── ...
├── README.md                   # Project overview and documentation
├── .gitignore                  # Git ignore rules
├── start_llm_server.sh         # Convenience script for LLM backend
└── start_next_server.sh        # Convenience script for Next.js frontend
```

---

Built for **AI-powered Education**, **Socratic Learning**, and **Personalized Tutoring**.
