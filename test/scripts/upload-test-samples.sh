#!/bin/bash

APP_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/../.." && pwd )"
cd "${APP_DIR}"

if [ -f .env-dev.sh ]; then
    echo "Loading dev env file"
    . .env-dev.sh
fi

if [ "$UPLOAD_SERVER" = "" ]; then
    UPLOAD_SERVER="http://localhost"
fi
echo "Report Server: ${UPLOAD_SERVER}"


# --------------------------------------------------
# Test Json Processor
# --------------------------------------------------
curl -X POST \
    -d '{"link":"https://github.com/DidierHoarau/quality-dashboard", "success": 10, "error": 9, "warning": 8, "total": 27, "coverage": 80 }' \
    -H "Content-Type: application/json" \
    ${UPLOAD_SERVER}/api/reports/quality-dashboard/integration/master/test-processors/json

curl -X POST \
    -d '{"success": 10, "error": 9, "warning": 8, "total": 27, "coverage": 80 }' \
    -H "Content-Type: application/json" \
    ${UPLOAD_SERVER}/api/reports/quality-dashboard/integration/master/test-processors-2/json

curl -X POST \
    -d '{"link":"./TEST/", "success": 10, "error": 9, "warning": 8, "total": 27, "coverage": 80 }' \
    -H "Content-Type: application/json" \
    ${UPLOAD_SERVER}/api/reports/quality-dashboard/integration/master/test-processors-3/json

curl -X POST \
    -d '{"link":"./TEST/", "success": 10, "error": 9, "warning": 8, "total": 27, "coverage": 80, "duration": 1038 }' \
    -H "Content-Type: application/json" \
    ${UPLOAD_SERVER}/api/reports/quality-dashboard/integration-2/master/test-processors-3/json
