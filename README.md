# Microservices API Platform

A modern microservices-based API platform built with TypeScript, Express, and MongoDB. This project uses Turborepo to manage the monorepo structure and Docker for containerization.

## What's inside?

This platform includes the following microservices:

### Services

- `auth-api`: Authentication and authorization service
- `users-api`: User management service
- `events-api`: Event management service
- `transactions-api`: Transaction processing service

Each service is 100% [TypeScript](https://www.typescriptlang.org/) and follows a consistent architecture pattern.

## Development

### Prerequisites

- Node.js (v16+)
- pnpm
- Docker and Docker Compose

### Local Development

To develop all services locally, run:

```bash
# Install dependencies
pnpm install

# Start all services in development mode
pnpm dev
```

### Building

To build all services:

```bash
pnpm build
```

### Testing

To run tests across all services:

```bash
pnpm test
```

## Docker Deployment

### Local Docker Compose

For local testing with Docker Compose:

```bash
# Build and start all services
docker-compose up -d

# Stop all services
docker-compose down
```

## Docker Swarm Deployment

### Prerequisites

- A Docker Swarm cluster (can be a single-node swarm for testing)
- Docker registry access (Docker Hub or private registry)

### Initialize Docker Swarm

If you haven't already initialized a swarm:

```bash
docker swarm init
```

### Build and Push Images

Before deploying to the swarm, build and push your images:

```bash
# Build all service images
./scripts/docker-build.sh

# Tag images for your registry
docker tag auth-api:latest yourregistry/auth-api:latest
docker tag users-api:latest yourregistry/users-api:latest
docker tag events-api:latest yourregistry/events-api:latest
docker tag transactions-api:latest yourregistry/transactions-api:latest

# Push images to registry
docker push yourregistry/auth-api:latest
docker push yourregistry/users-api:latest
docker push yourregistry/events-api:latest
docker push yourregistry/transactions-api:latest
```

### Deploy to Swarm

Create a `docker-stack.yml` file for swarm deployment:

```yaml
version: '3.8'

services:
  auth-api:
    image: yourregistry/auth-api:latest
    deploy:
      replicas: 2
      restart_policy:
        condition: on-failure
    ports:
      - "3001:3001"
    networks:
      - api-network
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/auth

  users-api:
    image: yourregistry/users-api:latest
    deploy:
      replicas: 2
      restart_policy:
        condition: on-failure
    ports:
      - "3002:3002"
    networks:
      - api-network
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/users

  events-api:
    image: yourregistry/events-api:latest
    deploy:
      replicas: 2
      restart_policy:
        condition: on-failure
    ports:
      - "3003:3003"
    networks:
      - api-network
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/events

  transactions-api:
    image: yourregistry/transactions-api:latest
    deploy:
      replicas: 2
      restart_policy:
        condition: on-failure
    ports:
      - "3004:3004"
    networks:
      - api-network
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/transactions

  mongodb:
    image: mongo:latest
    deploy:
      placement:
        constraints:
          - node.role == manager
    volumes:
      - mongodb_data:/data/db
    networks:
      - api-network

networks:
  api-network:
    driver: overlay

volumes:
  mongodb_data:
```

Deploy the stack to your swarm:

```bash
docker stack deploy -c docker-stack.yml api-platform
```

### Managing the Swarm Deployment

```bash
# List all running services
docker service ls

# Scale a specific service
docker service scale api-platform_users-api=3

# View logs for a service
docker service logs api-platform_users-api

# Remove the stack
docker stack rm api-platform
```

## Monitoring and Management

For production deployments, consider adding:

- Prometheus for metrics
- Grafana for visualization
- Traefik or Nginx for API gateway/load balancing

## Useful Links

- [Docker Swarm documentation](https://docs.docker.com/engine/swarm/)
- [Turborepo documentation](https://turbo.build/repo/docs)
