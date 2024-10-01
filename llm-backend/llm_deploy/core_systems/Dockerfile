
FROM python:3.12-slim AS runtime

EXPOSE 8000

WORKDIR /

RUN apt-get update && \
    apt-get --no-install-recommends install build-essential python3-dev libpq-dev wget ssh libpq5 -y && \
    pip install --no-cache-dir --upgrade pip && \
    rm -rf /var/lib/apt/lists/*

RUN groupadd -r appuser && useradd --no-create-home -g appuser -r appuser

# RUN mkdir llm_deploy
COPY ./llm_deploy/core_systems ./llm_deploy/core_systems
RUN pip install -r ./llm_deploy/core_systems/requirements.txt 

USER appuser