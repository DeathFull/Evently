FROM node:18-alpine

WORKDIR /app

COPY ./services/auth-api/package*.json ./
RUN npm install

COPY ./services/auth-api/ .

EXPOSE 3000
CMD ["npm", "start"]
