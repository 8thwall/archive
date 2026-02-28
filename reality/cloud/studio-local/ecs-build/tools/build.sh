#!/bin/bash
set -e

mkdir -p bazel-out/lib bazel-out/bin

bazel build //reality/cloud/studio-local/ecs-build/loaders:asset-loader
cp ../../../../bazel-bin/reality/cloud/studio-local/ecs-build/loaders/asset-loader.js bazel-out/lib

bazel build //reality/cloud/studio-local/ecs-build:webpack-local
cp ../../../../bazel-bin/reality/cloud/studio-local/ecs-build/webpack-local.js bazel-out/lib

bazel build //reality/cloud/studio-local/ecs-build/build-scripts:main
cp ../../../../bazel-bin/reality/cloud/studio-local/ecs-build/build-scripts/main.js bazel-out/bin

bazel build //reality/cloud/studio-local/ecs-build/build-scripts:validate-ecs-main
cp ../../../../bazel-bin/reality/cloud/studio-local/ecs-build/build-scripts/validate-ecs-main.js bazel-out/bin
