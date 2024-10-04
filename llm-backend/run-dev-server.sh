start_server() {
  python -m "$1" &
  echo "Server started for $1"
}

pip_install(){
  pip install -r "$1"
}

pip_install "./server/requirements.txt"
pip_install "./llm_deploy/core_systems/requirements.txt"
pip_install "./llm_deploy/workflows/tutor.py"

start_server "llm_deploy.core_systems.main"
start_server "llm_deploy.workflows.tutor"
start_server "server.app"

wait