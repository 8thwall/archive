#!/bin/bash
# Builds and tests code in bzl/ and third_party/ - see: http://jenkins.8thwall.com:8080/job/bzl
set -e
set -v

# NOTE(paris): If you add support for remote caching, you should uncomment this line.
# bash "$(dirname "${BASH_SOURCE[0]}")/../../ci-support/generate-ci-bazelrc.sh"

TEST_CONFIG="--jobs=5 --nocache_test_results --test_output=errors"

TARGETS_TO_SKIP="
-//bzl/crosstool/... \
-//bzl/stamp:release-build-id-stamped \
-//bzl/examples/pybind11/... \
"

NON_NATIVE_TARGETS_TO_SKIP="
$TARGETS_TO_SKIP \
-//bzl/docker/... \
"

# Native.
bazel test $TEST_CONFIG -- //third_party/...
bazel test $TEST_CONFIG -- //bzl/... $TARGETS_TO_SKIP

# iOS.
bazel build --platforms=//bzl:ios_arm64 -- //bzl/... $NON_NATIVE_TARGETS_TO_SKIP

# Android.
bazel build --platforms=//bzl:android_arm64 -- //bzl/... $NON_NATIVE_TARGETS_TO_SKIP

# Node.
# NOTE(paris): Most of these fail because exceptions are disabled in wasm but present in tests. If we enable exceptions we can enable many of these.
bazel test $TEST_CONFIG --config=node -- //bzl/... \
  -//bzl/examples/unity/... \
  -//bzl/examples/windows/... \
  $NON_NATIVE_TARGETS_TO_SKIP \
  -//bzl/examples/grpc/... \
  -//bzl/examples/proto/... \
  -//bzl/examples/ios/... \
  -//bzl/examples:hello-exceptions \
  -//bzl/examples/libwebsockets:websocket_test \
  -//bzl/examples:bio-hello-c \
  -//bzl/examples/unity/... \
  -//bzl/examples/js/emscripten:hello-emscripten

# Ensure that all targets are queriable. Required for vscode-bazel.
bazel query '//third_party/...:*' --output=package
bazel query '//bzl/...:*' --output=package
