#!/bin/bash
set -e
# Build XCode project, this isn't strictly needed (the next rule will do this for you) but it can
# be helpful to see the directory of the XCode project output to the command line for debugging.
bazel build -c opt --platforms=//bzl:ios_arm64 //apps/client/exploratory/datarecorder/ios:data-recorder-ios
# Build the iOS app and the script to run it on an attached device.
bazel build -c opt --platforms=//bzl:ios_arm64 //apps/client/exploratory/datarecorder/ios:data-recorder
# Install the iOS app on an attached device.
bazel-bin/apps/client/exploratory/datarecorder/ios/run-data-recorder
