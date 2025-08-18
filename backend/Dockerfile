# Base image
from python:3.11-slim-bookworm

# Setting workign directory
WORKDIR /app

# OTODO-2: User creation related

# Install system dependencies (for mysqlclient)
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    gcc \
    pkg-config \
    && rm -rf /var/lib/apt/lists/* \
    &&mkdir /logs/ -p \
    && mkdir /app/staticfiles/ -p

# Copy the application code
COPY . .
RUN pip install --no-cache-dir -r requirements.txt
