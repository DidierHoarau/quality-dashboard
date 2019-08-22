# Quality-Dashboard-Server

## Image

didierhoarau/quality-dashboard-server

## Volumes

Parent volume: `/opt/data`
Database volume: `/opt/data/db`
Report volume: `/opt/data/reports`

## Customisation

The folder for custom processor folder is: `/opt/app/plugins-user/processors`

Recommendation is to add copy custom processors with Dockerfile like follows:

```Dockerfile
FROM didierhoarau/quality-dashboard-server

COPY processors /opt/app/plugins-user/processors
```

## Linked Images

User Interface: https://hub.docker.com/r/didierhoarau/quality-dashboard-ui

## Documentation

https://github.com/DidierHoarau/quality-dashboard
