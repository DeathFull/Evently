docker build -t ghcr.io/deathfull/evently-auth-api:dev --platform linux/amd64,linux/arm64 \
  --build-context main=../ -f ./services/auth-api/Dockerfile .
docker build -t ghcr.io/deathfull/evently-events-api:dev --platform linux/amd64,linux/arm64 \
  --build-context main=../ -f ./services/events-api/Dockerfile .
docker build -t ghcr.io/deathfull/evently-transactions-api:dev --platform linux/amd64,linux/arm64 \
  --build-context main=../ -f ./services/transactions-api/Dockerfile .
docker build -t ghcr.io/deathfull/evently-users-api:dev --platform linux/amd64,linux/arm64 \
  --build-context main=../ -f ./services/users-api/Dockerfile .

docker push ghcr.io/deathfull/evently-auth-api:dev
docker push ghcr.io/deathfull/evently-events-api:dev
docker push ghcr.io/deathfull/evently-transactions-api:dev
docker push ghcr.io/deathfull/evently-users-api:dev