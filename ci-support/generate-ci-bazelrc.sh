#!/bin/sh
# This script generates a .bazelrc file for CI builds. It should only be run on Jenkins, which has
# BAZEL_REMOTE_CACHE_CODE8_JENKINS_SERVICE_ACCOUNT_KEY_PATH set. To learn more, see:
# - https://<REMOVED_BEFORE_OPEN_SOURCING>.atlassian.net/wiki/spaces/AR/pages/3665985678/Bazel+Remote+Cache

if [ -z "$BAZEL_REMOTE_CACHE_CODE8_JENKINS_SERVICE_ACCOUNT_KEY_PATH" ]; then
  echo "WARNING: BAZEL_REMOTE_CACHE_CODE8_JENKINS_SERVICE_ACCOUNT_KEY_PATH is not set. Skipping ci-support/ci.bazelrc generation."
  exit 0
fi

echo "Executing ci-support/ci.sh"
echo ">>> build --remote_upload_local_results=true --google_credentials=$BAZEL_REMOTE_CACHE_CODE8_JENKINS_SERVICE_ACCOUNT_KEY_PATH --announce_rc"

cat << EOF > ci-support/ci.bazelrc
build --remote_upload_local_results=true --google_credentials=$BAZEL_REMOTE_CACHE_CODE8_JENKINS_SERVICE_ACCOUNT_KEY_PATH --announce_rc
EOF
