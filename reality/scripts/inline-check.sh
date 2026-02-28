#!/bin/bash
set -e

build_files=$(
  git ls-tree -r --name-only HEAD | \
  grep "/BUILD$" | \
  grep -E "^(c8/ecs|c8/dom|bzl/presubmit|bzl/examples/js|reality)"
)

echo "Building inliner"

bazel build //apps/client/inlinerjs

set +e
echo $build_files | xargs -n 100 -P 10 bazel-bin/apps/client/inlinerjs/inlinerjs --no-new --check
if [ $? -ne 0 ]; then
  echo "FIXABLE with: ./reality/scripts/inline.sh"
  exit 1
else
  echo "Done."
fi
