#!/usr/bin/env bash

docker run \
  --env-file "/Users/jenkins/algolia.env" \
  -e "CONFIG=$(cat search.config.json | jq -r tostring)" \
  algolia/docsearch-scraper
