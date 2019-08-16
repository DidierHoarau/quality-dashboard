#!/bin/bash

APP_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/../.." && pwd )"
cd "${APP_DIR}"

mkdir -p "${APP_DIR}/tmp"
rm -fr "${APP_DIR}/tmp/coverage*"
cd "${APP_DIR}/quality-dashboard-server"
npm run test
cp -R coverage "${APP_DIR}/tmp"
cd "${APP_DIR}/tmp"
tar czf coverage.tar.gz coverage

curl -X POST -F report=@coverage.tar.gz http://localhost/api/reports/qa-dash-server/1.0.0/unit-test-coverage/lcov-coverage
curl -X POST -F report=@"${APP_DIR}/quality-dashboard-server/test-report.html" http://localhost/api/reports/qa-dash-server/1.0.0/unit-test/jest-html-reporter
