#!/bin/bash

# The following variables are expected to be set in the environment:
# - BUILD_OUTPUT
# - NAE_TRIGGER
# - POST_STATUS_SLACK_WEBHOOK_URL
# - TAG_TYPE (Only for tag pipelines)

# Set up the helper functions
source "apps/client/nae/build-helpers.sh"

if [[ "$NAE_TRIGGER" == "nae_nightly" || ( "$NAE_TRIGGER" == "nae_release_tag" && "$TAG_TYPE" == "release" ) ]]; then
  # POST_STATUS_SLACK_WEBHOOK_URL provided by yml
  # SLACK_TRASH_WEBHOOK_URL provided as CI/CD Secret
  set_default POST_STATUS_SLACK_WEBHOOK_URL $SLACK_TRASH_WEBHOOK_URL
else
  POST_STATUS_SLACK_WEBHOOK_URL=$SLACK_TRASH_WEBHOOK_URL
fi

# The following variables are expected to be set in the $BUILD_OUTPUT:
# - ARTIFACT_URL
# - APP_DISPLAY_NAME
# - VERSION_NAME
# - BUILD_PREFIX

# export the variables, so they can be used for subprocesses
source $BUILD_OUTPUT

if [[ -z "$ARTIFACT_URL" ]]; then
  echo "Artifact URL is empty";
  exit 1;
fi
echo "Posting to slack..."

SCHEDULED_PIPELINE_NAME="Solstice Nightly" # TODO(lreyna): Change the Pipeline Name to NAE Nightly
bazel run //apps/client/nae:slack-post-build --config=python3_9 -- \
  --pipeline-name="$SCHEDULED_PIPELINE_NAME" \
  --webhook-url=$POST_STATUS_SLACK_WEBHOOK_URL \
  --build-prefix=$BUILD_PREFIX \
  --nae-trigger=$NAE_TRIGGER \
  --version-name=$VERSION_NAME \
  --artifact-url=$ARTIFACT_URL \
  --app-display-name="$APP_DISPLAY_NAME" \
  --extra-info="$EXTRA_INFO"
