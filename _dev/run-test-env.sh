#!/bin/bash

set -e

REPO_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

pm2 delete all || true

# Server
cd "${REPO_DIR}/quality-dashnoard-server"
if [ ! -d node_modules ]; then
    npm ci
fi

# Agent
cd "${REPO_DIR}/quality-dashnoard-ui"
if [ ! -d node_modules ]; then
    npm ci
fi

# Start
cd "${REPO_DIR}"
pm2 start ecosystem.config.js --env development
