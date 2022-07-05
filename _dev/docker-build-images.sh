#!/bin/bash

set -e

REPO_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd ${REPO_DIR}

function buildService {
    SERVICE_NAME="quality-dashboard-${1}"
    cd ${REPO_DIR}/${SERVICE_NAME}
    SERVICE_VERSION=$(cat package.json | jq -r '.version')
    echo "Building ${SERVICE_NAME}/${SERVICE_VERSION}"
    docker build -f Dockerfile -t didierhoarau/${SERVICE_NAME}:${SERVICE_VERSION} .
}


buildService server
buildService ui