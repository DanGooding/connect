#!/bin/bash

set -ex

git checkout production
git merge master

cd client
npm run build
cd ..
rm -rf server/static
mv client/build server/static

git add .
git commit -m"deploy"
git subtree push --prefix server heroku master
git checkout master
    