# Quality-Dashboard-Server

## Image

didierhoarau/quality-dashboard-server

## Volumes

Database volume: `/opt/data/db`
Report volume: `/opt/data/reports`

## Customisation

The folder for custom processor folder is: `/opt/data/processor`

Recommendation is to add copy custom processors with Dockerfile like follows:

```Dockerfile
FROM didierhoarau/quality-dashboard-server

COPY processors /opt/data/processors
```

## Documentation

[https://github.com/DidierHoarau/quality-dashboard]
