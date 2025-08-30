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

# S3 storage
# 1. if using seperate storage, the internal and external url(Same as DOMAIN) 
# 	will be s3 storage's endpoint  
AWS_ENDPOINT_URL='http://localhost:80/'
AWS_INTERNAL_URL='http://s3:9000/'
AWS_ACCESS_KEY_ID='django-user'
AWS_SECRET_ACCESS_KEY='django-user'
AWS_STORAGE_BUCKET_NAME='anon-files'
AWS_REGION='ap-south-1'
```

### 3. Frontend .env (for nextjs specific )
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:80
INTERNAL_API_BASE_URL=http://django:8000
```

### 4. Minio setup
```env(same as the root env)
# S3, through 'Minio'
# MinIO Admin
MINIO_ROOT_USER='adminadmin'
MINIO_ROOT_PASSWORD='adminadmin'

# MinIO Server
MINIO_SERVER_URL='http://localhost:9000'

# Enabled for local development
# remove: for set false when deploying
MINIO_BROWSER='on'
MINIO_CONSOLE_UI_DISABLED='false'

# App S3 Credentials (for Django, Next.js, etc.)
AWS_ACCESS_KEY_ID='django-user'
AWS_SECRET_ACCESS_KEY='django-user'
AWS_STORAGE_BUCKET_NAME='anon-files'
AWS_REGION='ap-south-1'

# MC Host Alias (for init container)
MC_HOST_local='http://s3:9000'

```
#### chmod the script
```
chmod +x ./s3/setup/01-bucket-creation-and-user-addition.sh
```
#### Start MinIO
```
docker-compose up -d s3
```
