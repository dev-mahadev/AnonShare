# 02-short-url
A url shortner application

## Overall features/requirements : 
    - Should be able to shorten 10 Million urls
    - Handle 100 RPS(cached+non-cached)
    - Rate limiting on known and unknown users
    - Data analytics & visualization
    - Prevent scrapping of shortened url


## Phase-1 Features: 
1. Shorten a given url
    - Validate the actual url
    - shortened url (can copy the generated code)
    - QR code scanner (can download the generated image)
2. Access the actual url 
    - Redirect to the actual url
    - Error handling for incorrect shortened url
3. Unique ip address can
    - shorten 10 urls a day
    - Access upto 3 shortened url a second


## Phase-2 Features:
1. Signup
2. Login
    - Permissions implementation
3. Logged in users can 
    - create upto 50 short url a day
    - Delete their created urls (multiple-allowed)
    - Update them

4. User based simple anaylitics through db queries
    - Data analytics (listing, filtering, )

## Phase-3 features : 
1. Cache implementation for accessing the shorened url
    - Through redis (need to learn this)
2. CI/CD pipeline setup (need to learn this)
3. Shortened URL additional features:
    - Time limits (valid for 'N' days)
    - Access limits (can be accessed by first 'N' users)
    



### Tech stack 
    - Setup the entire structure for local development
        - Seperate Docker containers for services
    
    - Individual Services
        - Backend (api)
            - Connect with database
            - Signup, Login, shorten_url, 
            
        - Frontend
            - Nextjs
            - Redux
        
        - Database,
            - Mysql       
        
        - Nginx
            


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
DEBUG=True
SECRET_KEY='hello_there_ki_haal_chaal'

# Database related,
# NOTE : Always copy the DB related content from the root .env, not the other way around
DB_NAME='shortner'
DB_USER='admin'
DB_PASSWORD='admin'
DB_HOST='database'
DB_PORT='3306'
```