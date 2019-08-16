# BUILD
FROM node:12-alpine as builder

RUN apk add --no-cache bash git python perl alpine-sdk

WORKDIR /opt/app

COPY . .

RUN npm ci && \
    npm run test && \
    npm build


# RUN
FROM node:12-alpine

COPY --from=builder /opt/app/dist /opt/app/dist
COPY --from=builder /opt/app/node_modules /opt/app/node_modules

WORKDIR /opt/app

CMD [ "node", "src/app.js" ]
