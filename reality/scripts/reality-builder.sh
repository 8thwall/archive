#!/bin/bash
# Builds and tests code in reality/, c8/, and apps/ - see: http://jenkins.8thwall.com:8080/job/reality
set -e

# NOTE(paris): If you add support for remote caching, you should uncomment this line.
# bash "$(dirname "${BASH_SOURCE[0]}")/../../ci-support/generate-ci-bazelrc.sh"

TEST_CONFIG="--jobs=5 --nocache_test_results --test_output=errors --build_tests_only"
WASM_ENABLE_EXCEPTIONS="--copt=-fexceptions --copt=-UC8_NO_EXCEPT --copt=-UKJ_NO_EXCEPTIONS --linkopt=-sNO_DISABLE_EXCEPTION_CATCHING "

# Native.
echo "[reality] Building native"
bazel build //c8/... //reality/... //apps/...
echo "[reality] Testing native"
bazel test $TEST_CONFIG //c8/... //reality/... //apps/...

# iOS.
echo "[reality] Building ios"
OBJC_TARGETS=$(bazel query "kind(".*nia_objc_library", reality/...)")
bazel build --platforms=//bzl:ios_arm64 $OBJC_TARGETS

# Wasm / Node.
# xr-js-cc cannot be build by itself without emscripten in JS mode
# TODO(paris): Re-enable //reality/app/xr/js:semantics-worker-cc once fixed
echo "[reality] Building wasm"
bazel build --config=wasm -- //reality/app/xr/js/... \
  -//reality/app/xr/js:xr-js-cc \
  -//reality/app/xr/js:xr-slam-cc \
  -//reality/app/xr/js:semantics-worker-cc
# TODO(paris): Fix and enable several of these tests that should be able to pass. Many are failing
# because they need the FETCH=1 empot, but that doesn't get set correctly in cc_binary's. Most
# others are failing with `Error: Cannot find module 'canvas'`.
echo "[reality] Testing wasm"
bazel test $TEST_CONFIG --config=node -- //reality/...  \
  -//reality/app/analytics/android/... \
  -//reality/app/validation/android/... \
  -//reality/app/xr/capnp:xr-capnp-test \
  -//reality/app/xr/streaming:remote-service-thread-test \
  -//reality/cloud/imageprocessor:calc-score-test \
  -//reality/engine/executor:xr-engine-test \
  -//reality/engine/executor:xr-request-executor-test \
  -//reality/engine/features:agate-descriptor-test \
  -//reality/engine/features:agate-histogram-test \
  -//reality/engine/features:agate-multi-histogram-test \
  -//reality/engine/features:agate-pca-test \
  -//reality/engine/features:descriptor-bit-counter-test \
  -//reality/engine/features:feature-detector-test \
  -//reality/engine/features:feature-manager-test \
  -//reality/engine/features:feature-set-request-executor-test \
  -//reality/engine/features:gr8-feature-shader-test \
  -//reality/engine/features:gr8gl-test \
  -//reality/engine/features:majority-image-descriptor-test \
  -//reality/engine/geometry:bundle-test \
  -//reality/engine/imagedetection:detection-image-loader-test \
  -//reality/engine/imagedetection:detection-image-tracker-test \
  -//reality/engine/logging:xr-log-preparer-test \
  -//reality/engine/pose:pose-request-executor-test \
  -//reality/engine/semantics:semantics-classifier-test \
  -//reality/engine/semantics:semantics-cubemap-renderer-test \
  -//reality/engine/tracking:tracker-test \
  -//reality/engine/vps/... \
  -//reality/quality/benchmark/cvlite:fast-score-benchmark-test.js \
  -//reality/quality/synthetic:synthetic-scenes-test \
  -//reality/quality/training:vlfeat-test
echo "[reality] Testing wasm with exceptions"
bazel test $TEST_CONFIG --config=node $WASM_ENABLE_EXCEPTIONS -- //c8/... \
  -//c8/git/... \
  -//c8/events/... \
  -//c8/protolog/... \
  -//c8/network/... \
  -//c8/qr/... \
  -//c8:process-test \
  -//c8/pixels/... \
  -//c8/io:image-io-test \
  -//c8/io:file-io-test \
  -//c8:staged-ring-buffer-test \
  -//c8/geometry:decode-mesh-test \
  -//c8/io:capnp-messages-test \

# NOTE(dat): There is a build error with turning on exception on node.
#   `error: undefined symbol: __cxa_current_exception_type`
# These tests don't use exception anyway. Disable them in the bazel test above and put them here.
echo "[reality] Testing wasm capnp"
bazel test $TEST_CONFIG --config=node -- //c8/io:capnp-messages-test

# Ensure that all targets are queriable.
echo "[reality] Querying"
bazel query '//reality/...:*' --output=package
bazel query '//c8/...:*' --output=package
bazel query '//apps/...:*' --output=package
