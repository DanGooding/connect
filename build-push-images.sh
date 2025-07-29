#!/bin/bash

set -euo pipefail

if [ -z "${TAG:+x}" ]; then
  echo missing TAG variable >&2
  exit 1
fi
if [ -z "${REGISTRY:+x}" ]; then
  echo missing REGISTRY variable >&2
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo unclean git status - not building >&2
  exit 1
fi

PLATFORM=linux/amd64

STATIC_SERVER_REPO=connect-static-server
API_SERVER_REPO=connect-api-server

docker buildx build frontend/   -t $STATIC_SERVER_REPO --platform $PLATFORM --tag $TAG
docker buildx build api-server/ -t $API_SERVER_REPO    --platform $PLATFORM --tag $TAG

for IMAGE_PATH in $STATIC_SERVER_REPO $API_SERVER_REPO; do
  docker tag $IMAGE_PATH:$TAG $REGISTRY/$IMAGE_PATH:$TAG
  docker push $REGISTRY/$IMAGE_PATH:$TAG
done

docker image prune --force --filter "until=24h"
