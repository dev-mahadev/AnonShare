# Base image
from python:3.11-slim-bookworm

# Setting workign directory
WORKDIR /app

# Install system dependencies (for mysqlclient)
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    gcc \
    pkg-config \
    && rm -rf /var/lib/apt/lists/* \
    mkdir /logs/ 




COPY . .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
# This is commented for local develpoment

# Expose port and run server
# remove : for local development
# CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && tail -f /dev/null"]

