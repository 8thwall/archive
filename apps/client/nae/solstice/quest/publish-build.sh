#!/bin/bash

# The following variables are expected to be set in the environment:
# - SOLSTICE_APP_ID
# - SOLSTICE_APP_SECRET
# - RELEASE_CHANNEL
# - BAZEL_APK_OUTPUT
# - UPLOAD_OUTPUT
# - TAG_TYPE (Only for tag pipelines)

# https://developers.meta.com/horizon/resources/publish-reference-platform-command-line-utility/#upload-quest
OVR_PLAT_UTIL_URL="https://storage.googleapis.com/<REMOVED_BEFORE_OPEN_SOURCING>/OculusPlatformUtility/1.96.0/osx/ovr-platform-util"

echo "Downloading ovr-platform-util... $OVR_PLAT_UTIL_URL"
curl $OVR_PLAT_UTIL_URL -o ovr-platform-util
chmod +x ovr-platform-util
ovr-platform-util version

if [[ -z "$RELEASE_CHANNEL" ]]; then
    echo "No release channel specified, exiting...";
    exit 0;
elif [[ "$RELEASE_CHANNEL" == "test" ]]; then
    echo "Test builds do not need to be published to Meta";
    exit 0;
fi

if [[ -n "$TAG_TYPE" && "$TAG_TYPE" != "release" ]]; then
    echo "Tag type is not 'release', exiting...";
    exit 0;
fi

echo "Publishing $BAZEL_APK_OUTPUT to Meta $RELEASE_CHANNEL Release channel..."

ovr-platform-util upload-quest-build \
    --age-group TEENS_AND_ADULTS \
    --app_id "$SOLSTICE_APP_ID" \
    --app_secret "$SOLSTICE_APP_SECRET" \
    --apk "$BAZEL_APK_OUTPUT" \
    --channel $RELEASE_CHANNEL \
    --disable-progress-bar true | tee ${UPLOAD_OUTPUT}
