## CTODO-4

## Tech stack  
    - Individual Services
        - Backend (api)
            - Shorten URL
            
        - Frontend
            - Nextjs
        
        - Database,
            - Mysql (Django supports **mostly** SQL)       
        
        - Nginx(Mainly Reverse proxy)

        - Redis (Caching)
            


# Setup

## .env files and exmples
### 1. Root .env (for all infrastructure related environment)
path : /.env
```
DB_NAME='shortner'
DB_USER='admin'
DB_PASSWORD='admin'
DB_PORT='3306'
```

### 2.Backend .env (for all django specific and backend)
path: backend/shortner/.env
```
# General settings
DJANGO_ENV='DEVELOPMENT'
DOMAIN=http://localhost:80/
DEBUG=True
SECRET_KEY='hello_there_ki_haal_chaal'
CORS_ALLOWED_ORIGINS=[]


# Database related,
# NOTE : Always copy the DB related content from the root .env, not the other way around
DB_NAME='shortner'
DB_USER='admin'
DB_PASSWORD='admin'
DB_HOST='database'
DB_PORT='3306'

# REDIS RELATED
# Ensure the logical database are not conflicting 
# with different services
REDIS_LOCATION="redis://redis:6379/0"

# Celery relaed
CELERY_BROKER_URL="redis://redis:6379/1"
CELERY_RESULT_BACKEND="redis://redis:6379/2"
```

### 3. Frontend .env (for nextjs specific )
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:80
```