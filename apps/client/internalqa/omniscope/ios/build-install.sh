#!/bin/bash
set -e
# Build XCode project, this isn't strictly needed (the next rule will do this for you) but it can
# be helpful to see the directory of the XCode project output to the command line for debugging.
bazel build -c opt --platforms=//bzl:ios_arm64 //apps/client/internalqa/omniscope/ios:omniscope-ios --config=angle
# Build the iOS app and the script to run it on an attached device.
bazel build -c opt --platforms=//bzl:ios_arm64 //apps/client/internalqa/omniscope/ios:omniscope --config=angle
# Install the iOS app on an attached device.
bazel-bin/apps/client/internalqa/omniscope/ios/run-omniscope
