
FROM --platform=linux/amd64 python:3.12-slim AS runtime


WORKDIR /app

RUN apt-get update && apt-get --no-install-recommends install build-essential python3-dev libpq-dev -y && \
    pip install --no-cache-dir --upgrade pip && \
    apt-get -yq update && apt-get -yqq install ssh

COPY ./_app/workflows/requirements.txt ./
RUN pip install -r requirements.txt

RUN apt-get update && apt-get install -y wget

RUN apt-get update -y && \
    apt-get install --no-install-recommends libpq5 -y && \
    rm -rf /var/lib/apt/lists/*

RUN groupadd -r appuser && useradd --no-create-home -g appuser -r appuser
USER appuser

WORKDIR /app
COPY ./_app/ ./app