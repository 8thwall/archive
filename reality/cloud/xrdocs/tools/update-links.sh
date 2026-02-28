#!/usr/bin/env bash
set -e

BUCKET='s3://<REMOVED_BEFORE_OPEN_SOURCING>'
FROM="$1"
TO="$2"
DRYRUN=""

echo "Syncing from ${FROM} to ${TO} with deletion"
aws s3 sync ${DRYRUN} --delete "${BUCKET}/${FROM}/" "${BUCKET}/${TO}/"

curl -s -X POST https://slack.com/api/chat.postMessage \
  --data-urlencode "channel=8w-release-active" \
  --data-urlencode "token=${SLACK_TOKEN}" \
  --data-urlencode "username=xrhome.bot" \
  --data-urlencode "text=$(whoami) synced xrdocs version from '${FROM}' to '${TO}'"
