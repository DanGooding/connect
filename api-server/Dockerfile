FROM node:22.17-alpine AS api-server
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
RUN \
  --mount=type=cache,target=/root/.npm \
  npm clean-install --omit=dev
COPY . .

ENV PORT=3000
CMD ["npm", "start"]
