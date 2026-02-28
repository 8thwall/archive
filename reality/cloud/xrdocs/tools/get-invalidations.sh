#!/usr/bin/env bash
PREFIX=$1

aws s3 ls "s3://<REMOVED_BEFORE_OPEN_SOURCING>/$PREFIX/" --recursive | \
  sed "s|^.* $PREFIX/|/|g" | \
  sed "s|/index.html$||g" | \
  grep -E -v "^\s*$" | \
  sed 's/^/\/docs/'
echo "/docs/"
