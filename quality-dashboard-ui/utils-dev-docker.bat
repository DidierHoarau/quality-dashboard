set DOCKER_REGISTRY=127.0.0.1:5000
set REGISTRY_NAMESPACE=default
set SERVICE=quality-dashboard-ui
set SERVICE_VERSION=dev

docker-compose -f docker-compose-dev.yml build
docker-compose -f docker-compose-dev.yml push
docker stack deploy --compose-file docker-compose-dev.yml

sleep 2000