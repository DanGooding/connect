#!/bin/bash

set -euo pipefail
set -x

build() {
  REPO=$1
  DIR=$2
  docker buildx build $DIR --tag $REPO:latest --load
}

build connect-static-server frontend/
build connect-api-server    api-server/
