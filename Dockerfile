ARG NODE_VERSION=22.17

FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /app
# TODO: bind package(lock)-json (and below)
# TODO: cache /root/.npm
COPY client/package.json client/package-lock.json ./
# TODO: --omit=dev (and below)
RUN npm clean-install
COPY client/ ./
RUN npm run build

FROM node:${NODE_VERSION}-alpine AS production

ENV NODE_ENV=production

WORKDIR /app
COPY server/package.json server/package-lock.json ./
RUN npm clean-install
COPY server/ .
COPY --from=build /app/build static/

ARG PORT=3000
EXPOSE ${PORT}
ENV PORT=${PORT}

CMD ["npm", "start"]
