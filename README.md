# AnonShare (Share8)
**Anonshare** is a lightweight, privacy-first web application that lets users:

🔹 **Shorten URLs** — Turn long links into compact, shareable ones — anonymously.  
🔹 **Create Pastes** — Instantly share text, logs, or code snippets without accounts or tracking.  
🔹 **Upload Files** — Securely upload and distribute files with auto-generated anonymous links.

Built as a full-stack application, Anonshare is ideal for developers and users who value **simplicity, speed, and privacy**.  
 🔹No signups.  
 🔹No logs.  
 🔹No tracking.  
Just paste, upload, and share.

---
***Shorten URLs, create pastes, and upload files - all anonymously***

✨ _Anonymous by design. Useful by default._

---


## TechStack:
### Frontend:

![My Skills](https://skillicons.dev/icons?i=html,css,javascript,react,next)<br>
HTML, CSS, Javascript, React, Nextjs


### Backend
![My Skills](https://skillicons.dev/icons?i=python,django,mysql,redis,docker,nginx,aws)<br>

Python, Django, Mysql, Redis, Docker, Nginx, S3(MinIO)


## Preview
![Demo](/assets/gif/03-anonuploads-optimized.gif)


## Overview
![Overview](/assets/png/01-overview.png)

## Setup

### .env files
#### 1. Root .env (for all infrastructure related environment) 
```
# path: /.env
DB_NAME='shortner'
DB_USER='admin'
DB_PASSWORD='admin'
DB_PORT='3306'

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

#### 2.Backend .env (for all django specific and backend)
```
# path: backend/shortner/.env
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

# Celery related
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
# path: /frontend/.env
NEXT_PUBLIC_API_BASE_URL=http://localhost:80
INTERNAL_API_BASE_URL=http://django:8000
```

### Starting local setup
#### Grant execute permission to the script
```
chmod +x ./s3/setup/01-bucket-creation-and-user-addition.sh
```

#### Build the services
```
make build
```

### Start the services
```
make up
```

## Future Improvements

- This project was developed primarily to experiment with Django as the core backend.
- Improvements in testing, scalability and performance can be achieved.
- Security and authentication features can be enhanced.
- Infrastructure upgrades such as CI/CD pipelines and more robust container orchestration can be considered.
