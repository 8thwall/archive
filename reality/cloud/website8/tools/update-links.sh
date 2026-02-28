#!/bin/bash
set -e

BUCKET='s3://<REMOVED_BEFORE_OPEN_SOURCING>'
FROM="$1"
TO="$2"
DRYRUN=""

echo "Sycning from ${FROM} to ${TO} with deletion"
aws s3 sync ${DRYRUN} --delete "${BUCKET}/${FROM}/" "${BUCKET}/${TO}/"

