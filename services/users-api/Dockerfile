FROM node:18-alpine

WORKDIR /app

COPY ./services/users-api/package*.json ./
RUN npm install

COPY ./services/users-api/ .

EXPOSE 3000
CMD ["npm", "start"]
