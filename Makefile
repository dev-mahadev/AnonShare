# Docker Makefile with Variables

# Variables
COMPOSE_FILE=docker-compose-development.yml
COMPOSE_FLAGS=-f $(COMPOSE_FILE)
BACKEND_CONTAINER=02-shortner-django-1


# 1. Build with no cache
build-no-cache:
	docker compose $(COMPOSE_FLAGS) build --no-cache

# 2. Regular build
build:
	docker compose $(COMPOSE_FLAGS) build

# 3. Up the containers
up:
	docker compose $(COMPOSE_FLAGS) up 

# 4. Enter the backend shell
backend-shell:
	docker exec -it $(BACKEND_CONTAINER) bash

# 5. Start the server
start-server:
	docker exec -it $(BACKEND_CONTAINER) python manage.py runserver 0.0.0.0:8000