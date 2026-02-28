#!/bin/bash
set -euo pipefail

# Clean and set up output directory
rm -rf lib
rm -rf bin
mkdir -p lib
mkdir -p bin

# Copy Bazel build lib/ output
cp bazel-out/lib/* lib/

# Copy Bazel output bin/ output
cp bazel-out/bin/* bin/

# Copy static entry file
cp entry.js lib/

# Copy bin file
cp build-scripts/8w-build.js bin/8w-build.js
cp build-scripts/8w-validate-ecs.js bin/8w-validate-ecs.js

npm pack
