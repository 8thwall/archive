#!/bin/bash
set -e

BUCKET='s3://<REMOVED_BEFORE_OPEN_SOURCING>'
NOW=$(date +"%Y%m%d%H%M%S")
FOLDER="$1"
DRYRUN=""

echo "Upload new data to ${NOW} folder"
aws s3 cp ${DRYRUN} --recursive --exclude 'static/*' --exclude '*.js' --exclude '*.js.map' --exclude 'google-fonts/*' --exclude '.DS_Store' public "${BUCKET}/${NOW}/"

echo "Delete current folder ${FOLDER}"
aws s3 rm ${DRYRUN} --recursive "${BUCKET}/${FOLDER}"

echo "Copy new data to current folder ${FOLDER}"
aws s3 cp ${DRYRUN} --recursive "${BUCKET}/${NOW}" "${BUCKET}/${FOLDER}"
