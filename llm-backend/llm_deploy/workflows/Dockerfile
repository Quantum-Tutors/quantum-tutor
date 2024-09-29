
FROM python:3.12-slim AS runtime

EXPOSE 8002

WORKDIR /

RUN apt-get update && apt-get --no-install-recommends install build-essential python3-dev libpq-dev -y && \
    pip install --no-cache-dir --upgrade pip && \
    apt-get -yq update && apt-get -yqq install ssh

COPY ./llama_deploy/workflows/requirements.txt ./
RUN pip install -r requirements.txt

RUN apt-get update && apt-get install -y wget

RUN apt-get update -y && \
    apt-get install --no-install-recommends libpq5 -y && \
    rm -rf /var/lib/apt/lists/*

RUN groupadd -r appuser && useradd --no-create-home -g appuser -r appuser
USER appuser

WORKDIR /
COPY ./llama_deploy/workflows ./workflows