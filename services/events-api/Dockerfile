FROM node:18-alpine

WORKDIR /app

COPY ./services/events-api/package*.json ./
RUN npm install

COPY ./services/events-api/ .

EXPOSE 3000
CMD ["npm", "start"]
