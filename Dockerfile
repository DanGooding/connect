ARG NODE_VERSION=22.17

FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /app
COPY client/package.json client/package-lock.json ./
RUN \
  --mount=type=cache,target=/root/.npm \
  npm clean-install --omit=dev
COPY client/ ./
RUN npm run build

FROM node:${NODE_VERSION}-alpine AS production

ENV NODE_ENV=production

WORKDIR /app
COPY server/package.json server/package-lock.json ./
RUN \
  --mount=type=cache,target=/root/.npm \
  npm clean-install --omit=dev
COPY server/ .
COPY --from=build /app/build static/

ARG PORT=3000
EXPOSE ${PORT}
ENV PORT=${PORT}

CMD ["npm", "start"]
