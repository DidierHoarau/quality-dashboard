# BUILD
FROM node:12-alpine as builder

RUN apk add --no-cache bash git python perl alpine-sdk

WORKDIR /opt/app

COPY . .

RUN export CYPRESS_INSTALL_BINARY=0 && \
  npm ci && \
  npm run lint && \
  npm run build

# Running
FROM nginx:latest

RUN rm -fr /etc/nginx/site-enabled/default.conf
RUN rm -fr /etc/nginx/conf.d/default.conf

COPY --from=builder /opt/app/dist /usr/share/nginx/html
COPY docker/nginx/default.conf /etc/nginx/site-enabled/
COPY docker/nginx/default.conf /etc/nginx/conf.d/
COPY docker/entrypoint.sh /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]