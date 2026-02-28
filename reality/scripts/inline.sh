#!/bin/bash
set -e

build_files=$(
  git ls-tree -r --name-only HEAD | \
  grep "/BUILD$" | \
  grep -E "^(c8/ecs|c8/dom|bzl/presubmit|bzl/examples/js|reality)"
)

echo "Building inliner"

bazel build //apps/client/inlinerjs

echo $build_files | xargs -n 100 -P 10 bazel-bin/apps/client/inlinerjs/inlinerjs --no-new

echo $build_files | xargs buildifier -lint=fix

echo "Done."
