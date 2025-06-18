#!/bin/bash

set -ex

rm -rf build
rm -f build.zip

rsync -av server/* build --exclude node_modules --exclude .env --exclude .gitignore
(cd client; npm run build)
cp -r client/build build/static
cp -r .platform build

(cd build; zip -r ../build.zip .)
