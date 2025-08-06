FROM node:18

WORKDIR /frontend

COPY package*.json ./
RUN npm install
COPY . .
CMD npm run build && npm run start