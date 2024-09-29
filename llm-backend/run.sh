#!/bin/bash

# Function to start a Python server in the background
start_server() {
  python3 "$1" &
  echo "Started server for $1"
}

# Start the first server
start_server "llama_deploy/core_systems/main.py"

# Start the second server
start_server "llama_deploy/workflows/concierge.py"

start_server "python server/server.py "

# Wait for both servers to finish (optional)
wait