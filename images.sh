#!/bin/bash

set -euo pipefail
set -x

PLATFORM=linux/amd64

USER_ID=196481062593
REGION=eu-west-2
REPO_BASE_URL=$USER_ID.dkr.ecr.$REGION.amazonaws.com
TAG=latest

PROXY_PATH=connect-proxy
API_SERVER_PATH=connect-api-server

docker buildx build .       -t $PROXY_PATH      --platform $PLATFORM
docker buildx build server/ -t $API_SERVER_PATH --platform $PLATFORM

aws ecr get-login-password \
  --region $REGION \
| docker login $REPO_BASE_URL \
  --username AWS \
  --password-stdin \

for IMAGE_PATH in $PROXY_PATH $API_SERVER_PATH; do
  docker tag $IMAGE_PATH:$TAG $REPO_BASE_URL/$IMAGE_PATH:$TAG
  docker push $REPO_BASE_URL/$IMAGE_PATH:$TAG
done
