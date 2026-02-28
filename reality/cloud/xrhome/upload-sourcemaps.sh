#!/usr/bin/env bash

BUCKET=8w-internal-90d-ttl

which aws > /dev/null

if [ $? -ne 0 ]; then
  echo aws not found
  exit
fi

aws s3 cp dist/sourcemaps s3://${BUCKET}/sourcemaps --recursive
