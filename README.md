# Quality-Dashboard

This project is born out of the need to centralise reports that are generated in a typical CI/CD flow: unit test, coverage, integration test, UI tests, ...

This is made to be as simple and as light as possible.

## Installation

The recommended aproach is to deploy the servces as Docker container. A deployment is composed of the following services:

- Server: this is the backend service holding the data and the reports
- UI: this is the web frontend to display the reports
- A Reverse Proxy: you can use any reverse proxy but examples are given here with Traefik

Depending on your preferred deployment target, You will find examples of deployment files in the examples directory:

- Docker: [examples/docker]
- Docker Swarm [examples/docker-swarm]
- Kunernetes: [examples/kubernetes]

## User Interface

## API
