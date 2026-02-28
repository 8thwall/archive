#!/bin/bash
set -e

# Usage: ./reality/scripts/check-nested-builds.sh

# Find bazel packages that don't resolve to their expected path. This can happen if there is a 
# symlinked directory to elsewhere in the repository that contains BUILD files.

root_dir=$(git rev-parse --show-toplevel)

bazel query //... --output=package | while read folder_name; do
  expected_path="$root_dir/$folder_name"
  actual_path=$(realpath "$expected_path")
  if [[ "$expected_path" != "$actual_path" ]]; then
    echo "$folder_name maps to $actual_path"
  fi
done
