FROM python:3.11-slim

WORKDIR /app

# Install minimal system dependencies (no postgresql-client for SQLite)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create directory for SQLite database
RUN mkdir -p /app/data

# CRITICAL: Set database path to persistent volume
# Database will be stored in /app/data/neointegratech.db
# This directory MUST be mounted as a volume in production
ENV DATABASE_URL="sqlite:////app/data/neointegratech.db"

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
