# Quality-Dashboard-UI

## Image

didierhoarau/quality-dashboard-ui

## Linked Images

Server: https://hub.docker.com/r/didierhoarau/quality-dashboard-server

## Environment variable

By default the user interface runs on the root path.

To change the base path, use the `BASEPATH` variable.

Example (docker-compose file):

```
version: '3.7'

services:
  ui:
    image: didierhoarau/quality-dashboard-ui
    environment:
      - BASEPATH=/quality-dashboard/

```

## Documentation

[https://github.com/DidierHoarau/quality-dashboard]
