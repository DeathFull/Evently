FROM node:18-alpine

WORKDIR /app

COPY ./services/transactions-api/package*.json ./
RUN npm install

COPY ./services/transactions-api/ .

EXPOSE 3000
CMD ["npm", "start"]
