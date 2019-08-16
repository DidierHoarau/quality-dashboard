# BUILD
FROM node:12-alpine as builder

RUN apk add --no-cache bash git python perl alpine-sdk

WORKDIR /opt/app

COPY . .

RUN npm ci && \
    npm build


# RUN
FROM node:12-alpine

COPY --from=builder /opt/app /opt/app

WORKDIR /opt/app

CMD [ "node", "src/app.js" ]
