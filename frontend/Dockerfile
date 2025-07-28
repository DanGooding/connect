ARG NODE_VERSION=22.17
ARG NGINX_VERSION=1.29

FROM node:${NODE_VERSION}-alpine AS build-static
WORKDIR /app
COPY client/package.json client/package-lock.json ./
RUN \
  --mount=type=cache,target=/root/.npm \
  npm clean-install --omit=dev
COPY client/ ./
RUN npm run build

FROM nginx:${NGINX_VERSION}-alpine AS static-server
WORKDIR /app
COPY --from=build-static /app/build static/
COPY nginx.conf /etc/nginx/nginx.conf
