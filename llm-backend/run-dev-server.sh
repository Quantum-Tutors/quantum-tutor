start_server() {
  python -m "$1" &
  echo "Server started for $1"
}

# start_server "llm_deploy.core_systems.main"
# start_server "llm_deploy.workflows.tutor"
# start_server "server.app"

# wait