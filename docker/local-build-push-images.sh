#!/bin/bash

set -euo pipefail

USER_ID=196481062593
REGION=eu-west-2
REGISTRY=$USER_ID.dkr.ecr.$REGION.amazonaws.com

aws ecr get-login-password \
  --region $REGION \
| docker login $REGISTRY \
  --username AWS \
  --password-stdin \

(
  export TAG="dev"
  export REGISTRY
  ./build-push-images.sh
)
