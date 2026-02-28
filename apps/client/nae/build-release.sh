#!/bin/bash

# The following variables are expected to be set in the environment:
# - BAZEL_APK_OUTPUT
# - SOLSTICE_APP_ID
# - RELEASE_VERSION
# - NAE_TRIGGER
# - CI_JOB_ID
# - START_DATE
# - CONFIG_FILE_PATH
# - VERSION_CODE_INDEX_OFFSET
# - NAE_SHELL_PLATFORM

# - SOLSTICE_UPLOAD_KEYSTORE (optional)
# - SOLSTICE_UPLOAD_KEYSTORE_PASSWORD (optional)
# - SOLSTICE_UPLOAD_KEYSTORE_ALIAS (optional)

# The following ENV vars are optional if you have your own credentials.
# These are used in 'reality/app/nae/packager/html-app-packager.ts' to download assets from AWS
# - SOLSTICE_AWS_ACCESS_KEY_ID
# - SOLSTICE_AWS_ACCESS_KEY_SECRET

# Set up the helper functions
source "apps/client/nae/build-helpers.sh"

# Set default values, so the script can be run locally without setting all the env vars
# Even if these aren't the desired values, it should be easy to change them here
set_default BAZEL_APK_OUTPUT bazel-bin/apps/client/nae/doty-run/android/doty-run-release-prod.apk
set_default CONFIG_FILE_PATH apps/client/nae/doty-run/android/config-prod.json
set_default CI_JOB_ID 0
set_default VERSION_CODE 1
set_default RELEASE_VERSION 0.0.1
set_default APP_DISPLAY_NAME "Doty Run"

TODAY_FORMAT=$(date +%Y%m%d%H%M)
if [[ -n "$START_DATE" ]]; then
  # Max version code is 2100000000, maxValue / (24 * BUILD_CODES_PER_HOUR) is still a large number
  # Allocate a number of builds per hour, since meta doesn't allow apks with the same version code
  BUILD_CODES_PER_HOUR=2

  DIFF_IN_HOURS=$(date_diff_in_hours "$START_DATE" "$(date +%Y%m%d%H%M%S)")
  VERSION_CODE=$(( ($DIFF_IN_HOURS * $BUILD_CODES_PER_HOUR) + $VERSION_CODE_INDEX_OFFSET ))

  echo "Using VERSION_CODE=$VERSION_CODE"
fi

if [[ "$BUILD_PREFIX" == "prod" ]]; then
  VERSION_NAME="$RELEASE_VERSION";
else
  VERSION_NAME="$RELEASE_VERSION.$TODAY_FORMAT";
fi

echo "Using VERSION_NAME=$VERSION_NAME"

# Set up the keystore file options
# NOTE: SOLSTICE_UPLOAD_* will be set in the GitLab CI/CD settings, but KEYSORE_FILE is optional set
# in the GitLab job yml file.
if [[ -n "$KEYSTORE_FILE" ]]; then
  echo $SOLSTICE_UPLOAD_KEYSTORE | base64 -d > $KEYSTORE_FILE
  KEYSTORE_FILE_PATH=$(realpath $KEYSTORE_FILE)
  KS_PATH_OPTION="--android.ksPath=$KEYSTORE_FILE_PATH --android.ksPass=$SOLSTICE_UPLOAD_KEYSTORE_PASSWORD --android.ksAlias=$SOLSTICE_UPLOAD_KEYSTORE_ALIAS"
else
  KS_PATH_OPTION=""
fi

COPTS="--copt=-DNAE_OPT"
if [[ "$NAE_SHELL_PLATFORM" == "quest" ]]; then
  # TODO(lreyna): Different apps will need different app ids, this means that we'll need the app ID
  # as a config option for the packager. Right now, the entire packager is being compiled with
  # the app ID as a copt.
  COPTS="$COPTS --copt=-DOCULUS_APP_ID=\"$SOLSTICE_APP_ID\""
fi
echo "COPTS=$COPTS"

# TODO(alvinp): See if we're able to reuse html-app-packager.sh somehow.
bazel run $COPTS \
  --config=release \
  --@node//:strip-libnode \
  --run_under="cd $PWD && " //reality/app/nae/packager:packager -- \
  --config=$CONFIG_FILE_PATH \
  --appInfo.versionCode=$VERSION_CODE \
  --appInfo.versionName=$VERSION_NAME \
  $KS_PATH_OPTION \
  --out=$BAZEL_APK_OUTPUT

if [[ $? -ne 0 ]]; then
  echo "Build failed";
  exit 1;
fi

if [[ ! -f $BAZEL_APK_OUTPUT ]]; then
  echo "File $BAZEL_APK_OUTPUT does not exist";
  exit 1;
fi

# Display contents of APK in job console
unzip -l $BAZEL_APK_OUTPUT

# Get the size of the APK file and set it as an environment variable
APK_SIZE_BYTES=$(stat -f%z "$BAZEL_APK_OUTPUT")
APK_SIZE_HUMAN=$(human_readable_byte_size $APK_SIZE_BYTES)

# Format Extra Information String
EXTRA_INFO="APK Size: $APK_SIZE_HUMAN"

if [[ $CI_JOB_ID -ne 0 ]]; then
  ARTIFACT_URL="https://gitlab.<REMOVED_BEFORE_OPEN_SOURCING>.com/repo/<REMOVED_BEFORE_OPEN_SOURCING>/-/jobs/${CI_JOB_ID}/artifacts/download"
  echo "ARTIFACT_URL=${ARTIFACT_URL}" > $BUILD_OUTPUT
  echo "APP_DISPLAY_NAME=\"${APP_DISPLAY_NAME}\"" >> $BUILD_OUTPUT
  echo "VERSION_NAME=${VERSION_NAME}" >> $BUILD_OUTPUT
  echo "BUILD_PREFIX=${BUILD_PREFIX}" >> $BUILD_OUTPUT
  echo "EXTRA_INFO=\"${EXTRA_INFO}\"" >> $BUILD_OUTPUT

  SANITIZED_APP_NAME=$(echo $APP_DISPLAY_NAME | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

  # Use the correct AWS credentials for NAE
  export AWS_ACCESS_KEY_ID=$SOLSTICE_AWS_ACCESS_KEY_ID
  export AWS_SECRET_ACCESS_KEY=$SOLSTICE_AWS_ACCESS_KEY_SECRET
  export AWS_DEFAULT_REGION="us-west-2"

  # Upload to S3
  aws s3 cp $BAZEL_APK_OUTPUT \
    s3://<REMOVED_BEFORE_OPEN_SOURCING>/$SANITIZED_APP_NAME/$BUILD_PREFIX/$SANITIZED_APP_NAME-$CI_COMMIT_SHORT_SHA.apk

  # Clear the AWS credentials
  unset AWS_ACCESS_KEY_ID
  unset AWS_SECRET_ACCESS_KEY
  unset AWS_DEFAULT_REGION
fi
