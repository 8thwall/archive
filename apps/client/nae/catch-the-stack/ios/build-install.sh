#!/bin/bash

# Builds and runs Catch the Stack (https://www.8thwall.com/8w/catch-the-stack) on iOS.
# - To automatically find a device, run: ~/repo/code8 ./apps/client/nae/catch-the-stack/ios/build-install.sh
# - To pass in a device id to use, run: ~/repo/code8 ./apps/client/nae/catch-the-stack/ios/build-install.sh <device_id>

set -e

source "apps/client/nae/build-helpers.sh"

bazel build //apps/client/nae/catch-the-stack/ios:catch-the-stack \
  --config=angle \
  --//bzl/node:source-built=True \
  --platforms=//bzl:ios_arm64 \
  --//bzl/xcode:ios-min-version=14.0 \
  --verbose_failures \
  --sandbox_debug \

device_id=${1:-$(ios_device_id)}
if [ -z "$device_id" ]; then
  echo "No device found. Please connect a device and try again."
  exit 1
fi
echo "Using device: $device_id"

xcrun devicectl device install app --device $device_id bazel-bin/apps/client/nae/catch-the-stack/ios/catch-the-stack.ipa

xcrun devicectl device process launch --console --device $device_id com.the8thwall.catchthestack
