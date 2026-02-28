#!/bin/bash
set -e

cd $(bazel info workspace 2>/dev/null)

build_files=$(find reality/cloud/studio-local \
-path reality/cloud/studio-local/node_modules -prune -o \
-path reality/cloud/studio-local/src -prune -o \
-path reality/cloud/studio-local/dist -prune -o \
-name "BUILD" -print)

echo "$build_files" | xargs bazel run --run_under="cd $PWD && " //apps/client/inlinerjs

if type buildifier &> /dev/null; then
  echo "$build_files" | xargs buildifier -lint=fix
else
  echo "buildifier not found, skipped formatting."
fi
