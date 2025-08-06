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
    &&mkdir /logs/ -p \
    && mkdir /app/staticfiles/ -p

# Copy the application code
COPY . .
RUN pip install --no-cache-dir -r requirements.txt

# This is commented for local develpoment
# CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]

# Expose port and run server
CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && python manage.py collectstatic --noinput && gunicorn shortner.wsgi:application --bind 0.0.0.0:8000 "]

