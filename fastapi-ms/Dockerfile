FROM python:3.11-slim

RUN apt update && apt install -y curl && \
    python3 -m ensurepip && \
    pip install pipx && \
    pipx ensurepath && \
    pipx install uv

# Install deps
COPY package*.json ./
RUN npm install

WORKDIR /app
COPY . .

RUN pipx run uv pip install fastapi uvicorn pydantic

EXPOSE 8001
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
