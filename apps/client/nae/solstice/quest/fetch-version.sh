#!/bin/bash

# The following variables are expected to be set in the environment:
# - BUILD_PREFIX

SCRIPT_TAG_PREFIX="app8"

# TODO: Get the url from the studio config
if [[ $BUILD_PREFIX == "staging" ]]; then
  STAGING_PASSCODE="moonshot"
  OUTPUT=$(bazel run //apps/client/nae/solstice/quest:fetch-version -- 'https://niantic.staging.8thwall.app/intothescaniverse/' $SCRIPT_TAG_PREFIX $STAGING_PASSCODE)
elif [[ $BUILD_PREFIX == "prod" ]]; then
  OUTPUT=$(bazel run //apps/client/nae/solstice/quest:fetch-version -- 'https://www.intothescaniverse.com/' $SCRIPT_TAG_PREFIX)
else
  echo "Could not fetch version from Studio URL, falling back to default"
fi

export RELEASE_VERSION=$(echo "$OUTPUT")

if [[ -n "$RELEASE_VERSION" ]]; then
  echo "Fetched version RELEASE_VERSION=$RELEASE_VERSION"
fi
