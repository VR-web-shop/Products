FROM node:14-slim

WORKDIR /app

COPY package*.json ./
COPY .env* ./
COPY .npmrc* ./

RUN npm install

COPY . .

EXPOSE 3002

CMD ["node", "index.js"]
