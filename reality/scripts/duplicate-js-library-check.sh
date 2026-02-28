#!/bin/bash
set -e

# Usage: ./reality/scripts/duplicate-js-library-check.sh

duplicate_builds=$(bazel query 'kind(js_library, //reality/...)' \
  | sed 's|.*:||g' \
  | sort | uniq -c  | grep -v " 1 ")

set +e
unexpected_duplicate_builds=$(echo "$duplicate_builds" \
  | grep -vE " common$" \
  | grep -vE " types$" \
  | grep -vE " index$" \
  | grep -vE " 2 hubspot-mock-impl$" \
  | grep -vE " 2 load-models$" \
  | grep -vE " 2 sqs$" \
  | grep -vE " 2 dynamodb$" \
  | grep -vE " 2 studio-api$" \
  | grep -vE " 2 constants$"
)
set -e

if [ -n "$unexpected_duplicate_builds" ]; then
  echo "ERROR: Unexpected duplicate builds found:"
  echo "$unexpected_duplicate_builds"
  exit 1
else 
  echo "No unexpected duplicate builds found."
fi
