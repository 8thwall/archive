#!/bin/bash
set -e

# NOTE(paris): If you add support for remote caching, you should uncomment this line.
# bash "$(dirname "${BASH_SOURCE[0]}")/../../ci-support/generate-ci-bazelrc.sh"

# We alias dev8 to the current version most internal 8th Wall devs use.
# Last checked was 14.20.1 on 11/16
. ~/.nvm/nvm.sh
nvm use dev8

BUILD_CONFIG="--noshow_progress --output_filter=DONT_MATCH_ANYTHING"
TEST_CONFIG="$BUILD_CONFIG --jobs=5 --test_output=errors --verbose_failures --build_tests_only"

echo "============================================================================================="
echo "[nightly] Building native code"
bazel build $BUILD_CONFIG //c8/... //reality/... //apps/...
bazel build $BUILD_CONFIG --config=release --strip=always //c8/... //reality/... //apps/...

# Run tests with asan.
# NOTE(paris): It is unexpected that any of these fail. It would be good to investigate and fix.
# NOTE(dat): The angle test (//c8/dom:dom-test) is missing some spirv method. It's not clear why.
echo "============================================================================================="
echo "[nightly] Testing with asan"
bazel test $TEST_CONFIG --config=asan -- //apps/... //bzl/... //c8/... //reality/... \
  -//bzl/unity/... \
  -//bzl/examples:node-addon-test \
  -//bzl/glfw:glfw-node-init-test \
  -//c8/pixels:base64-test \
  -//c8/io:image-io-test \
  -//c8/pixels/opengl:gl-headers-with-angle \
  -//c8/dom/image-decoding:image-decoding-test \
  -//c8/dom:dom-test \
  -//reality/app/xr/capnp:xr-capnp-test \
  -//reality/engine/ears:ear-detector-local-test \
  -//reality/engine/executor:xr-engine-test \
  -//reality/engine/executor:xr-request-executor-test \
  -//reality/engine/features:feature-set-request-executor-test \
  -//reality/engine/hittest:hit-test-performer-test \
  -//reality/engine/pose:pose-request-executor-test \
  -//reality/engine/tracking:tracker-test \
  -//reality/quality/benchmark/cvlite:fast-score-benchmark-test \
  -//reality/quality/benchmark/cvlite:fast-score-benchmark-test.js \
  -//reality/quality/datasets/measuredpose:measured-pose-eval-test \

echo "============================================================================================="
echo "[nightly] Testing with release"
bazel test $TEST_CONFIG --config=release -- //apps/... //bzl/... //c8/... //reality/... \
  -//bzl/examples/js/import:wildcard-external-test \

echo "============================================================================================="
echo "[nightly] Testing with angle"
bazel test $TEST_CONFIG --config=angle -- //apps/... //c8/... //reality/... \
  -//apps/client/internalqa/omniscope/imgui/... \
  -//c8/dom/webgl/... \

echo "============================================================================================="
echo "[nightly] Building Omniscope."
bazel build $BUILD_CONFIG --verbose_failures //apps/client/internalqa/omniscope/imgui:omniscope
bazel build $BUILD_CONFIG --verbose_failures //apps/client/internalqa/omniscope/headless:omniscope
bazel build $BUILD_CONFIG --verbose_failures --platforms=//bzl:wasm32 //apps/client/internalqa/omniscope/js/server:server

echo "============================================================================================="
echo "[nightly] Building engine."
bazel build $BUILD_CONFIG --verbose_failures --platforms=//bzl:wasm32 //reality/app/xr/js:serve-xr
bazel build $BUILD_CONFIG --verbose_failures --config=wasmrelease //reality/app/xr/js:serve-xr
bazel build $BUILD_CONFIG --verbose_failures --config=wasmreleasesimd //reality/app/xr/js:serve-xr
bazel build $BUILD_CONFIG --verbose_failures --config=wasmreleasesimd --copt=-fexceptions --copt=-fcxx-exceptions //reality/app/xr/js:serve-xr

echo "============================================================================================="
echo "[nightly] Building Data Recorder."
bazel build $BUILD_CONFIG --verbose_failures --platforms=//bzl:ios_arm64 -c opt //apps/client/exploratory/datarecorder/ios:data-recorder-ios
bazel build $BUILD_CONFIG --verbose_failures --platforms=//bzl:android_arm64 -c opt //apps/client/exploratory/datarecorder/android:data-recorder

echo "============================================================================================="
echo "[nightly] Building tools."
bazel build $BUILD_CONFIG --verbose_failures //reality/quality/benchmark:tune-parameters
bazel build $BUILD_CONFIG --verbose_failures //apps/client/internalqa/omniscope/headless:stitcher

echo "============================================================================================="
echo "[nightly] Building NAE Android apps."
bazel build $BUILD_CONFIG --verbose_failures --platforms=//bzl:android_arm64 //apps/client/nae/...
bazel build $BUILD_CONFIG --verbose_failures --platforms=//bzl:android_arm64 --config=release //apps/client/nae/...

echo "============================================================================================="
echo "[nightly] Building NAE iOS apps."
bazel build $BUILD_CONFIG --verbose_failures --platforms=//bzl:ios_arm64 --config=angle --//bzl/node:source-built=True --//bzl/xcode:ios-min-version=14.0 //apps/client/nae/...
bazel build $BUILD_CONFIG --verbose_failures --platforms=//bzl:ios_arm64 --config=angle --//bzl/node:source-built=True --//bzl/xcode:ios-min-version=14.0 --config=release //apps/client/nae/...

# TODO(paris): Fix below error and re-enable:
#   ERROR: /private/var/tmp/_bazel_jenkins/e3c65bd41abf5d81077e3ad33f889cd2/external/node/BUILD.bazel:919:11: Compiling src/large_pages/node_large_page.cc failed: (Exit 1): clang-xcwrapper.sh failed: error executing CppCompile command (from target @@node//:large-pages)
#   fatal error: 'debug_utils-inl.h' file not found
# echo "[nightly] Building NAE OSX apps."
# bazel build $BUILD_CONFIG --verbose_failures --config=angle --//bzl/node:source-built=True //apps/client/nae/...
# bazel build $BUILD_CONFIG --verbose_failures --config=angle --//bzl/node:source-built=True --config=release //apps/client/nae/...

echo "============================================================================================="
echo "[nightly] Testing conformance with angle."
bazel test //c8/dom/webgl/conformance/... --config=angle --test_summary=detailed || true

echo "============================================================================================="
echo "[nightly] Testing conformance2 with angle."
bazel test //c8/dom/webgl/conformance2/... --config=angle --test_summary=detailed --test_timeout=1000 || true

# Note(lreyna): NAE has seen `--config=release` break certain tests in the past.
echo "============================================================================================="
echo "[nightly] Testing //c8/dom/... with angle."
bazel test --config=angle --config=release --test_lang_filters=-webgl_conformance --test_summary=detailed //c8/dom/...

echo "============================================================================================="
echo "[nightly] Building the OSX Tauri shell"
bazel build //c8/html-shell-tauri:html-shell-osx
bazel build --config=release //c8/html-shell-tauri:html-shell-osx

echo "============================================================================================="
echo "[nightly] Building the iOS Tauri shell"
bazel build --platforms=//bzl:ios_arm64 //c8/html-shell-tauri:html-shell-ios
bazel build --platforms=//bzl:ios_arm64 --config=release //c8/html-shell-tauri:html-shell-ios

echo "============================================================================================="
echo "[nightly] Building the c8/dom Tauri shell"
bazel build --platforms=//bzl:ios_arm64 --config=angle --//bzl/node:source-built=True --//bzl/xcode:ios-min-version=18.0 //c8/html-shell/apple/ios:html-shell-ios
bazel build --config=angle --//bzl/node:source-built=True --//bzl/xcode:osx-min-version=14.0 //c8/html-shell/apple/osx:html-shell-osx
bazel build --platforms=//bzl:android_arm64 --config=angle //c8/html-shell/android/android:html-shell-android
bazel build --platforms=//bzl:android_arm64 --config=angle //c8/html-shell/android/quest:html-shell-quest
