# Microservices API Platform

A modern microservices-based API platform built with TypeScript, Express, and MongoDB. This project uses Turborepo to
manage the monorepo structure and Docker for containerization.

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
# Before you have to edit the docker-build.sh file to set the correct registry
./scripts/docker-build.sh
```

### Deploy to Swarm

Deploy the stack to your swarm:

```bash
pnpm docker:deploy
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
docker stack rm evently
```

## Monitoring and Management

For production deployments, consider adding:

- Prometheus for metrics
- Grafana for visualization

## Useful Links

- [Docker Swarm documentation](https://docs.docker.com/engine/swarm/)
- [Turborepo documentation](https://turbo.build/repo/docs)
