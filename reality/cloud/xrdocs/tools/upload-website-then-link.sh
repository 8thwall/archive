#!/usr/bin/env bash
set -e

BUCKET='s3://<REMOVED_BEFORE_OPEN_SOURCING>'
NOW=$(date +"%Y%m%d%H%M%S")
FOLDER="$1"
DRYRUN=""

echo "Upload new data to ${NOW} folder"
aws s3 cp ${DRYRUN} --recursive build "${BUCKET}/${NOW}/"

echo "Delete current folder ${FOLDER}"
aws s3 rm ${DRYRUN} --recursive "${BUCKET}/${FOLDER}"

echo "Copy new data to current folder ${FOLDER}"
aws s3 cp ${DRYRUN} --recursive "${BUCKET}/${NOW}" "${BUCKET}/${FOLDER}"

curl -s -X POST https://slack.com/api/chat.postMessage \
  --data-urlencode "channel=8w-release-active" \
  --data-urlencode "token=${SLACK_TOKEN}" \
  --data-urlencode "username=xrhome.bot" \
  --data-urlencode "text=$(whoami) uploaded new '${FOLDER}' xrdocs version '${NOW}'"
