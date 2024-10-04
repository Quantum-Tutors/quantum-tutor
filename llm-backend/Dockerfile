
FROM python:3.12-slim AS runtime

EXPOSE 5000

WORKDIR /

COPY . .

RUN apt-get update && \
    apt-get --no-install-recommends install build-essential python3-dev libpq-dev wget ssh libpq5 -y && \
    pip install --no-cache-dir --upgrade pip && \
    rm -rf /var/lib/apt/lists/* &&\
    pip install -r ./requirements.txt 

RUN chmod +x ./run-dev-server.sh

RUN groupadd -r appuser && useradd --no-create-home -g appuser -r appuser
USER appuser

CMD ["./run-dev-server.sh"]