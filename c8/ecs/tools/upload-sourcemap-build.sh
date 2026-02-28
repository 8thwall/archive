#!/bin/bash
set -e

cd "$(dirname "$0")/.."

rm -rf dist
npm ci
npm run runtime:build:sourcemaps

aws s3 cp \
  dist \
  s3://<REMOVED_BEFORE_OPEN_SOURCING>/web/ecs/sourcemap-m2ozhexg/ \
  --recursive \
  --cache-control 'public,max-age=0'
  
echo "Uploaded sourcemap build to https://cdn-dev.8thwall.com/web/ecs/sourcemap-m2ozhexg/runtime.js"

rm -rf dist
npm run runtime:build

timestamp=$(echo "console.log(Date.now().toString(36))" | node)

gzip -c dist/runtime.js > dist/runtime.js.gz

aws s3 cp \
  dist/runtime.js.gz \
  s3://<REMOVED_BEFORE_OPEN_SOURCING>/web/ecs/stamped/$timestamp/runtime.js \
  --cache-control 'public,max-age=31536000' \
  --content-encoding gzip
  
echo "Uploaded stamped production build to https://cdn.8thwall.com/web/ecs/stamped/$timestamp/runtime.js"
