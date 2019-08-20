#!/bin/bash

set -e
set +x


export DOCKER_REGISTRY=127.0.0.1:5000
export REGISTRY_NAMESPACE=default

# Service
if [ "$1" == "" ]; then
  echo "Missing parameter: SERVICE_DIR"
  exit 1
fi
SERVICE_DIR=$1
cd ${SERVICE_DIR}


# Stage
if [ "$2" == "" ]; then
  STAGE="default"
else
  STAGE=${2}
  echo "Stage: ${STAGE}"
fi


# Service Name
export SERVICE=$(cat info | grep name= | cut -f2 -d"=")
export SERVICE_VERSION=$(cat info | grep version= | cut -f2 -d"=")



# -----------------------------------------------
# Build

docker-compose build
docker-compose push



# -----------------------------------------------
# Deploy

docker stack deploy --compose-file docker-compose.yml ${SERVICE}
