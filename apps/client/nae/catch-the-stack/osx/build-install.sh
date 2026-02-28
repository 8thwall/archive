#!/bin/bash

set -e

source "apps/client/nae/build-helpers.sh"

bazel build //apps/client/nae/catch-the-stack/osx:catch-the-stack \
  --config=angle \
  --//bzl/node:source-built=True \
  --verbose_failures \
  --sandbox_debug

open bazel-bin/apps/client/nae/catch-the-stack/osx/catch-the-stack.app
