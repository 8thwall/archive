#!/bin/bash --norc
#
# Generate a top-level compile-commands.json file for a specific set of bazel build targets (and configuration flags).
#
# Syntax:
#   generate-compile-commands-json.sh [bazel_flag ...] -- [//bazel_target ...] [-//bazel_negative_target ...]
#
# Example Usage:
#   generate-compile-commands-json.sh -c opt --platforms=//bzl:osx_arm64 -- //c8:all //bzl/examples/... -//bzl/examples/unity/...

set -eu


function join_strings {
  local delim=${1-} arr=${2-}
  if shift 2; then
    printf %s "${arr}" "${@/#/$delim}"
  fi
}

# Change to the directory containing this script.
cd "$(dirname "$0")"

FLAGS=()
TARGETS=()
BOTH_TARGETS=()
EXCEPT_TARGETS=()
ONFILES=0

while [ $# -gt 0 ]; do
  case "$1" in
    --) ONFILES=1
      ;;
    -*) if [ $ONFILES -ge 1 ]; then
         EXCEPT_TARGETS+=("${1:1}")
         BOTH_TARGETS+=($1)
       else
         FLAGS+=($1)
       fi
      ;;
    *) if [ $ONFILES -ge 1 ]; then
         TARGETS+=($1)
         BOTH_TARGETS+=($1)
       else
         FLAGS+=($1)
       fi
      ;;
  esac
  shift
done

ccFiles=()

echo Using bazel flags: [${FLAGS[@]+"${FLAGS[@]}"}]
echo Using targets: "${TARGETS[@]}"

# Use the Bazel aspect "compile_commands" defined in
# //bzl/llvm:compile-commands.bzl to traverse the dependency tree and generate
# individual compilation_commands.json for each target. This build rule will
# expand target wildcards and correctly apply negative filters.
bazel build --aspects //bzl/llvm:compile-commands.bzl%compile_commands --output_groups=compile_commands ${FLAGS[@]+"${FLAGS[@]}"} -- "${BOTH_TARGETS[@]}"

target_string=$(join_strings " + " "${TARGETS[@]}")

if [ ${#EXCEPT_TARGETS[@]} -ne 0 ]; then
  target_string="${target_string} - $(join_strings " -" ${EXCEPT_TARGETS[@]})"
fi

# Use 'bazel cquery' to expand the wild-card bazel targets and negative filters
# into a full list of individual bazel targets. As 'cquery' does not ignore
# incompatible platforms (unlink 'build') we exclude them here.
expanded_targets=$(bazel cquery --output=starlark --starlark:expr="\"\" if \"IncompatiblePlatformProvider\" in providers(target) else target.label" "filter(\".*\", ${target_string}) except attr(\"tags\", \"manual\", ${target_string})" 2>/dev/null)

# Use 'bazel aquery' to find all of the paths to the compile_commands.json for
# the expanded set of targets. Since 'aquery' does not apply negative target
# filters as expected, we pass in the explicit list of expanded targets.
ccFiles=($(bazel aquery --aspects //bzl/llvm:compile-commands.bzl%compile_commands --output_groups=compile_commands ${FLAGS[@]+"${FLAGS[@]}"} "outputs(\".*compile_commands.json\", set(${expanded_targets}))" 2>&1 | sed -n 's/  Outputs: \[\(.*\)\]/\1/p' | tr '\n' ' '))

WORKSPACE=$(bazel info workspace 2>/dev/null)
BAZEL_OUTPUT_BASE=$(bazel info output_base 2>/dev/null)

# Merge and output the compile_commands.sh file, updating the "directory" to
# the WORKSPACE containing the device-specific path to the repo.
bazel run --run_under="cd $PWD && " //bzl/llvm:merge-compile-commands -- "${WORKSPACE}" "${ccFiles[@]}"  2>/dev/null

# Replace '/{toolchain}' placeholder strings with the output base.
sed -i.bak "s|/{{toolchain}}|${BAZEL_OUTPUT_BASE}|g" compile_commands.json
rm -f compile_commands.json.bak
