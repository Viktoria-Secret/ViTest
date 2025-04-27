FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Set Python to buffer stdout and stderr
ENV PYTHONUNBUFFERED 1

# Default command, but will be overridden by docker-compose
CMD ["uvicorn", "app.api:app", "--host", "0.0.0.0", "--port", "8000"]