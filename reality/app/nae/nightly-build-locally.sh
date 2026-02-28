#!/bin/bash

set -e

BUILD_LOCALLY_TARGET="//reality/app/nae:run-build-locally"

# Catch the Stack
echo "Building Catch the Stack for Android..."
bazel run $BUILD_LOCALLY_TARGET -- --config=catch-the-stack-android-prod

echo "Building Catch the Stack for iOS..."
bazel run $BUILD_LOCALLY_TARGET -- --config=catch-the-stack-ios-prod

echo "Building Catch the Stack for HTML Export..."
bazel run $BUILD_LOCALLY_TARGET -- --config=catch-the-stack-html-prod

# Face Effects (Staging)
# TODO(lreyna): Add Android Build

echo "Building Face Effects (Staging) for iOS..."
bazel run $BUILD_LOCALLY_TARGET -- --config=face-effects-ios-staging

# TODO(lreyna): Add HTML Export Build
