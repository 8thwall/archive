#!/bin/bash

# C++ dependency scanning script for monorepo and Bazel
# In case of issues, please reach out to @btroster

set -o pipefail

# Temporary directory for dependency files
temp_dir="./sec-scan-temp"
trap 'rm -rf "$temp_dir"' EXIT

# Function to handle file copying to the temporary directory
handle_file() {
    local file_path="$1"
    if [ -f "$file_path" ]; then
        rel_path="${file_path#*/external/}"
        rel_path="${rel_path#/}"
        mkdir -p "$temp_dir/$(dirname "$rel_path")"
        cp "$file_path" "$temp_dir/$rel_path"
    fi
}

# Ensure the script is invoked with the correct number of arguments
if [ "$#" -lt 2 ]; then
    echo "Usage: $0 bazel build [bazel build options and targets]"
    exit 1
fi

full_command="$@"
bazel_command="$1"
bazel_subcommand="$2"
shift 2
bazel_args=("$@")

# Check that the command is 'bazel build' if not, just run the command and exit the script
if [ "$bazel_command" != "bazel" ] || [ "$bazel_subcommand" != "build" ]; then
    echo "Warning: This script must be run with 'bazel build'. Command will be executed without any dependency checks."
    "${full_command}"
    exit_status=$?
    exit $exit_status
fi

target=""
exclusion_list=()
for arg in "${bazel_args[@]}"; do
    if [[ "$arg" == //* ]]; then
        if [ -z "$target" ]; then
            target="$arg"
        else
            exclusion_list+=("$arg")
        fi
    fi
done

if [ -z "$target" ]; then
    echo "No Bazel target found in the command arguments."
    exit 1
fi

bazel_cmd=("bazel" "build" "${bazel_args[@]}")
echo -e "\033[1;34mExecuting Bazel command:\033[0m ${bazel_cmd[*]}"
"${bazel_cmd[@]}"
bazel_exit_code=$?

case $bazel_exit_code in
    0)
        echo "Bazel build completed successfully."
        ;;
    1)
        echo "Bazel build failed."
        exit 1
        ;;
    2)
        echo "Bazel command line problem or bad environment variables."
        exit 2
        ;;
    3)
        echo "Bazel build OK, but some tests failed or timed out."
        ;;
    4)
        echo "Bazel build successful but no tests were found."
        ;;
    8)
        echo "Bazel build interrupted with an orderly shutdown."
        exit 8
        ;;
    9)
        echo "The server lock is held and --noblock_for_lock was passed."
        exit 9
        ;;
    32)
        echo "External environment failure not on this machine."
        exit 32
        ;;
    33)
        echo "Bazel ran out of memory and crashed."
        exit 33
        ;;
    36)
        echo "Local environmental issue, suspected permanent."
        exit 36
        ;;
    37)
        echo "Unhandled exception or internal Bazel error."
        exit 37
        ;;
    38)
        echo "Transient error publishing results to the Build Event Service."
        exit 38
        ;;
    39)
        echo "Blobs required by Bazel are evicted from Remote Cache."
        exit 39
        ;;
    45)
        echo "Persistent error publishing results to the Build Event Service."
        exit 45
        ;;
    *)
        echo "Unhandled Bazel exit code: $bazel_exit_code"
        exit $bazel_exit_code
        ;;
esac

# skip if this is not running in a scheduled pipeline
if [[ "$CI_PIPELINE_SOURCE" != "schedule" || "$SCHEDULE" != "nightly" ]]; then
    echo "Job ran in \"$CI_PIPELINE_SOURCE\" pipeline. Skipping dependency scan."
    exit $bazel_exit_code
fi

# Dependency scanning
snyk_monitor_start_time=$(date +%s)

rm -rf "$temp_dir" # this should never be needed, but just in case

# Normalize exclusions to handle trailing '...'
normalized_exclusion_list=()
for exclusion in "${exclusion_list[@]}"; do
    normalized_exclusion="${exclusion%...}"
    normalized_exclusion_list+=("$normalized_exclusion")
done

# Run Bazel query to gather source files
source_files=$(bazel query "filter(\"\.[CcpxmhHi1\+n]{1,3}$\", kind(\"source file\", deps($target)))" --notool_deps --output=location --keep_going)

# Filter out unwanted targets
if [ ${#normalized_exclusion_list[@]} -gt 0 ]; then
    exclusion_pattern=$(printf "|%s" "${normalized_exclusion_list[@]}")
    exclusion_pattern=${exclusion_pattern:1}  # Remove leading '|'
    filtered_source_files=$(echo "$source_files" | grep -v -E "$exclusion_pattern")
else
    filtered_source_files="$source_files"
fi

echo "$filtered_source_files" | awk -F':' '{print $1}' | uniq | while read -r file; do
    handle_file "$file"
done

# Snyk
pushd $temp_dir > /dev/null
cleared_bzl=$(echo "$target" | sed 's@^[./]*@@;s@[./]*$@@')
snyk monitor --unmanaged --org=$SNYK_ORG --project-name="${cleared_bzl##*:}" --target-reference="${cleared_bzl%%:*}" || true
snyk test --unmanaged || true
popd > /dev/null

echo "Completed dependency scanning in $(( $(date +%s) - snyk_monitor_start_time )) seconds"

exit $bazel_exit_code
