FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y netcat-openbsd gcc libpq-dev && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# ---------------------------------------------------
# NEW: Explicit Start Command
# 1. We use "python -m uvicorn" to avoid path issues.
# 2. We use ${PORT:-8000} to use Render's port (usually 10000) or default to 8000.
# ---------------------------------------------------
CMD ["sh", "-c", "python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]