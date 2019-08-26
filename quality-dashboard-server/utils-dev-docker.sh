#!/bin/bash

SERVICE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "${SERVICE_DIR}"

if [ -f ../.env-dev.sh ]; then
    . ../.env-dev.sh
fi

export DOCKER_REGISTRY=127.0.0.1:5000
export REGISTRY_NAMESPACE=default
export SERVICE=$(cat info | grep name= | cut -f2 -d"=")
export SERVICE_VERSION=$(cat info | grep version= | cut -f2 -d"=")

if [  "${CUSTOM_DOCKER_CONTEXT}" = "" ]; then
    export CUSTOM_DOCKER_CONTEXT=.
fi
export CUSTOM_DOCKER_CONTEXT=${CUSTOM_DOCKER_CONTEXT}

docker-compose -f docker-compose-dev.yml build
docker-compose -f docker-compose-dev.yml push
docker stack deploy --compose-file docker-compose-dev.yml ${SERVICE}

sleep 15

docker exec -ti $(docker ps | grep ${SERVICE} | cut -f1 -d" ") npm ci
docker exec -ti $(docker ps | grep ${SERVICE} | cut -f1 -d" ") npm run build
docker exec -ti $(docker ps | grep ${SERVICE} | cut -f1 -d" ") npm run dev
