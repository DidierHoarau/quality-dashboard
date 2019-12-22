# Quality-Dashboard

This project is born out of the need to centralise reports that are generated in a typical CI/CD flow: unit tests, coverage, integration tests, UI tests, ...

This is made to be as simple and as light as possible.

![alt text](https://github.com/DidierHoarau/quality-dashboard/raw/master/_shared/img/screenshot.png "Quality Dashboard Screenshot")

## Installation

The recommended aproach is to deploy the services as Docker container. A deployment is composed of the following services:

- Server: this is the backend service holding the data and the reports
- UI: this is the web frontend to display the reports
- A Reverse Proxy: you can use any reverse proxy but examples are given here with Traefik

Depending on your preferred deployment target, You will find examples of deployment files in the examples directory:

- Docker: [examples/docker]
- Docker Swarm [examples/docker-swarm]
- Kubernetes: [examples/kubernetes]

## User Interface

Once started the user interface will he accessible at the address `http://<hostname>/quality-dashboard`

## APIs

### Get Reports

`GET /quality-dashboard/api/reports/`

### Add Report

`POST /quality-dashboard/api/reports/<group_name>/<project_name>/<version_name>/<report_name>/<processor_name>`

The following are arbitrary value: `group_name`, `project_name`, `version_name`, `report_name`
The following is a value that should match one of the exising processsor: `processor_name`
This function should upload a file:

- The field is: `report`
- The file is either a `.html` file or a `.tar.gz` file

Examples:

```bash
# Send Archive
curl -X POST \
    -F report=@coverage.tar.gz \
    http://localhost/quality-dashboard/api/reports/qa-dash/server/1.0.0/unit-test-coverage/lcov-coverage

# Send File
curl -X POST \
    -F report=@test-report.html \
    http://localhost/quality-dashboard/api/reports/qa-dash/server/1.0.0/unit-test/jest-html-reporter

# JSON
curl -X POST \
    -d '{"link":"https://github.com/DidierHoarau/quality-dashboard", "success": 10, "error": 9, "warning": 8, "total": 27, "coverage": 80 }' \
    -H "Content-Type: application/json" \
    http://localhost/quality-dashboard/api/reports/qa-dash/server/1.0.0/test-json/json

# JSON (alternate)
curl -X POST \
    -H "Content-Type: application/json" \
    http://localhost/quality-dashboard/api/reports/qa-dash/server/1.0.0/test-json-alt/json?data_json=%7B\"success\"%3A10,\"error\"%3A9,\"warning\"%3A8,\"total\"%3A27,\"coverage\"%3A80%7D

# JSON and Html Report
curl -X POST \
    -H "Content-Type: application/json" \
    -F report=@"./report.html" \
    http://localhost/quality-dashboard/api/reports/qa-dash/server/1.0.0/test-json-file/json?data_json=%7B\"success\"%3A10,\"error\"%3A9,\"warning\"%3A8,\"total\"%3A27,\"coverage\"%3A80%7D


```

### Processors

The analysis of reports is done by `Processors`. Processors are JavaScript files that must be put in the following folders:

- `/opt/data/processors`: For custom user-defined processors
- `/opt/app/plugins/processors`: For build-in report

The processor to be used is defined in the `Add Report` API.

A processor must have the following characteristic:

- Its name is the file name (without extension)
- It should export a function called `analyse`
- The analyse function will be passed a string for the location of the report (uncompressed)
- This function should return a Promise
- This Promise should resolve an object with the following fields (all fields are optional):
  - `link`: Relative link to the html page
  - `success`: Number of successful items
  - `warning`: Number of not fully successful items
  - `error`: Number of failed items
  - `total`: Total number of items
  - `coverage`: String representing the coverage

Example:

```javascript
module.exports = {
  analyse: async reportFolder => {
    console.log(`Analysing ${reportFolder}`);
    return {
      link: "report.html",
      success: 0,
      warning: 0,
      error: 0,
      total: 0,
      coverage: "0%"
    };
  }
};
```
