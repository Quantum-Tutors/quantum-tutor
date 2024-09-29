#!/bin/bash

# Function to start a Python server in the background
start_server() {
  python -m "$1" &
  echo "Server started for $1"
}

# Start the first server
start_server "llm_backend.llama_deploy.core_systems.main"

# Start the second server
start_server "llm_backend.llama_deploy.workflows.concierge"

# Start the third server
start_server "llm_backend.server.app"

# Wait for all servers to finish
wait
