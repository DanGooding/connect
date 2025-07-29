#!/bin/bash

set -euo pipefail
set -x

if [ -z "${TAG:+x}" ]; then
  echo missing TAG variable >&2
  exit 1
fi
if [ -z "${REGISTRY:+x}" ]; then
  echo missing REGISTRY variable >&2
  exit 1
fi

PLATFORM=linux/amd64

build() {
  REPO=$1
  DIR=$2
  docker buildx build $DIR --tag $REGISTRY/$REPO:$TAG --platform $PLATFORM --push
}

build connect-static-server frontend/
build connect-api-server    api-server/

docker image prune --force --filter "until=24h"
