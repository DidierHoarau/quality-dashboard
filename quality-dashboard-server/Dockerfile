# BUILD
FROM node:16 as builder

WORKDIR /opt/app

COPY . .

RUN npm ci && \
    npm audit  && \
    npm run lint && \
    npm run test && \
    npm run build


# RUN
FROM node:16-alpine

COPY --from=builder /opt/app/dist /opt/app/dist
COPY --from=builder /opt/app/node_modules /opt/app/node_modules
COPY --from=builder /opt/app/plugins /opt/app/plugins

WORKDIR /opt/app

CMD [ "node", "dist/app.js" ]
