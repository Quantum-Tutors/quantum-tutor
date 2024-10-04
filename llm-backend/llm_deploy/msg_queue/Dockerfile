FROM python:3.12-slim AS runtime

EXPOSE 8000

WORKDIR /

RUN apt-get update && \
    apt-get --no-install-recommends install -y \
    build-essential python3-dev libpq-dev wget ssh libpq5 && \
    pip install --no-cache-dir --upgrade pip && \
    rm -rf /var/lib/apt/lists/*

# Set up a non-root user
RUN groupadd -r appuser && useradd --no-create-home -g appuser -r appuser

# Copy the core_systems code to the working directory
COPY . .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Switch to the non-root user
USER appuser

# Default command to run the Control Plane
CMD ["python", "-m", "main"]