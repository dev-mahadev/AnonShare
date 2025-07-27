FROM docker.io/nginx:1.27.0-alpine3.19-slim

RUN rm /etc/nginx/conf.d/default.conf 

# Rate limiting html file
COPY ./rate_limit.html /usr/share/nginx/html/rate_limit.html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf