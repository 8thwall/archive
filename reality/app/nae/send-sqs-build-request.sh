#!/bin/bash

function verify_value() {
  local arg=$1
  local arg_name=$2
  local default_value=$3

  if [ -z "$arg" ]; then
    if [ -n "$default_value" ]; then
      arg="$default_value"
    else
      echo "Error: Missing $arg_name value." >&2
      return 1
    fi
  fi

  echo "$arg"
}

# "nae-lambda-builder-queue-qa" is the default queue to test the deployed nae-lambda-builder on AWS.
#  If you want to test with a different CDK which has been deployed, you should change the queue url to one of these:
# a. (Default) The qa queue, i.e. "https://sqs.us-west-2.amazonaws.com/<REMOVED_BEFORE_OPEN_SOURCING>/nae-lambda-builder-queue-qa"
# b. Your test queue name, i.e. "https://sqs.us-west-2.amazonaws.com/<REMOVED_BEFORE_OPEN_SOURCING>/nae-lambda-builder-queue-test-paris"
#    Note that this queue will be deployed by the CDK - see reality/cloud/aws/cdk/nae-lambda-builder/README.md.
# c. The prod queue, i.e. "https://sqs.us-west-2.amazonaws.com/<REMOVED_BEFORE_OPEN_SOURCING>/nae-lambda-builder-queue-prod"
SQS_QUEUE_URL="$(verify_value "$SQS_QUEUE_URL" "sqs-url" "https://sqs.us-west-2.amazonaws.com/<REMOVED_BEFORE_OPEN_SOURCING>/nae-lambda-builder-queue-qa")"

# Path to the request data file, which contains the build request data in JSON format.
# If not provided, it defaults to "reality/app/nae/nae-build-request-data/dragondash-android-prod.json".
# To add a new request data file, you can copy an existing one and modify it as needed.
# Include "ignore" in the file name to prevent git from tracking it.
REQUEST_DATA_FILE_PATH="$(verify_value \
  "$REQUEST_DATA_FILE_PATH" \
  "config-file-path" \
  "reality/app/nae/nae-build-request-data/dragondash-android-prod.json")"

AWS_REGION="$(verify_value "$AWS_REGION" "aws-region" "us-west-2")"
AWS_ACCESS_KEY_ID="$(verify_value "$AWS_ACCESS_KEY_ID" "aws-access-key")"
AWS_SECRET_ACCESS_KEY="$(verify_value "$AWS_SECRET_ACCESS_KEY" "aws-secret-access-key")"

# Test Data
# NOTE: May need to `brew install jq` to parse JSON, if not installed by default.
GENERAL_CONFIG_DATA="$(cat "$REQUEST_DATA_FILE_PATH")"
if [ -z "$GENERAL_CONFIG_DATA" ]; then
  echo "Error: Failed to read config file at $REQUEST_DATA_FILE_PATH" >&2
  exit 1
fi

PROJECT_URL="$(echo "$GENERAL_CONFIG_DATA" | jq '.projectUrl')"
SHELL_TYPE="$(echo "$GENERAL_CONFIG_DATA" | jq '.shell')"
ANDROID_CLIENT_CONFIG="$(echo "$GENERAL_CONFIG_DATA" | jq '.android')"
APPLE_CLIENT_CONFIG="$(echo "$GENERAL_CONFIG_DATA" | jq '.apple')"
APP_INFO="$(echo "$GENERAL_CONFIG_DATA" | jq '.appInfo')"
APP_UUID="$(echo "$GENERAL_CONFIG_DATA" | jq '.appUuid')"
EXPORT_TYPE="$(echo "$GENERAL_CONFIG_DATA" | jq '.exportType')"
ICON_ID="$(echo "$GENERAL_CONFIG_DATA" | jq '.iconId')"
REPO_ID="$(echo "$GENERAL_CONFIG_DATA" | jq '.repoId')"
REQUEST_REF="$(echo "$GENERAL_CONFIG_DATA" | jq '.requestRef')"
SHELL_VERSION="$(echo "$GENERAL_CONFIG_DATA" | jq '.shellVersion')"
REMOVE_EXISTING_SHELL_VERSION="$(echo "$GENERAL_CONFIG_DATA" | jq '.removeExistingShellVersion')"

BUILD_REQUEST_TIMESTAMP=$(date +%s%N | cut -b1-13) # Date in milliseconds
REQUEST_UUID=\"$(uuidgen)\"

# Must match the API listed in reality/shared/nae/nae-types.ts
MESSAGE_BODY=$(
  cat <<EOF
{
  "projectUrl": $PROJECT_URL,
  "shell": $SHELL_TYPE,
  "android": $ANDROID_CLIENT_CONFIG,
  "apple": $APPLE_CLIENT_CONFIG,
  "appInfo": $APP_INFO,
  "appUuid": $APP_UUID,
  "buildRequestTimestampMs": $BUILD_REQUEST_TIMESTAMP,
  "requestUuid": $REQUEST_UUID,
  "exportType": $EXPORT_TYPE,
  "iconId": $ICON_ID,
  "repoId": $REPO_ID,
  "requestRef": $REQUEST_REF,
  "shellVersion": $SHELL_VERSION,
  "removeExistingShellVersion": $REMOVE_EXISTING_SHELL_VERSION
}
EOF
)

echo "Sending $MESSAGE_BODY to SQS queue $SQS_QUEUE_URL"

aws sqs send-message \
  --queue-url "$SQS_QUEUE_URL" \
  --message-body "$MESSAGE_BODY"
