#!/bin/bash

ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/../.." && pwd )"

mkdir -p ${ROOT_DIR}/.tmp

if [ "$UPLOAD_SERVER" = "" ]; then
    UPLOAD_SERVER="http://localhost:8080/api"
fi
echo "Report Server: ${UPLOAD_SERVER}"


function testService {
    SERVICE=${1}
    echo "Testing ${SERVICE}"
    rm -fr ${ROOT_DIR}/.tmp
    mkdir -p ${ROOT_DIR}/.tmp
    wget -O ${ROOT_DIR}/.tmp/html.tpl https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/html.tpl
    # docker pull didierhoarau/${SERVICE}
    trivy image \
        -format template \
        --template "@${ROOT_DIR}/.tmp/html.tpl" \
        -o ${ROOT_DIR}/.tmp/report.html \
        didierhoarau/${SERVICE}

    curl -X POST \
        -F report=@"${ROOT_DIR}/.tmp/report.html" \
        ${UPLOAD_SERVER}/reports/quality-dashboard/server/master/container/trivy-html


    # rm -fr ${ROOT_DIR}/.tmp
}

testService quality-dashboard-server


