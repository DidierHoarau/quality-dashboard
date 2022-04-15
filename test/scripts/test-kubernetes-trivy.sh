#!/bin/bash

echo "Testing Container Images"

UPLOAD_SERVER="http://localhost:8080/api"

rm -f /tmp/test-trivy-html.tpl
wget -O /tmp/test-trivy-html.tpl https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/html.tpl

for IMAGE in $(kubectl describe pod -A | grep 'Image:' | tr -s ' ' | cut -d' ' -f3); do
    echo "---"
    echo "Scanning Image: ${IMAGE}"
    IMAGE_ID=$(echo ${IMAGE} | sed "s@/@_@g")
    IMAGE_ID=$(echo ${IMAGE_ID} | sed "s@:@_@g")
    IMAGE_ID=$(echo ${IMAGE_ID} | sed "s@\.@@g")

    rm -fr /tmp/test-trivy
    mkdir -p /tmp/test-trivy
    # docker pull didierhoarau/${SERVICE}
    trivy image \
        -format template \
        --template "@/tmp/test-trivy-html.tpl" \
        -o /tmp/test-trivy/report.html \
        ${IMAGE}

    curl -X POST \
        -F report=@"/tmp/test-trivy/report.html" \
        ${UPLOAD_SERVER}/reports/quality-dashboard/container-images/live/${IMAGE_ID}/trivy-html

    rm -fr /tmp/test-trivy

done


