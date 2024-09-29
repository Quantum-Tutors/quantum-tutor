#!/bin/bash

# Function to start a Python server in the background
start_server() {
  python "$(pwd)/$1" &
  echo "$(pwd) Started server for $1"
}

# Start the first server
start_server "llama_deploy/core_systems/main.py"

# Start the second server
start_server "llama_deploy/workflows/concierge.py"

# Start the third server
start_server "server/app.py"

# Wait for all servers to finish
wait
