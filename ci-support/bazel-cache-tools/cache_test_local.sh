#!/bin/sh

# This script can be used to test how well remote caching will work on a single computer. We first
# upload something to a remote cache and then verify we can get a 100% cache hit when running again.
# To run:
# - First download the GCP Service Account key so that you can write to the test remote cache:
#   1. Go to https://console.cloud.google.com/iam-admin/serviceaccounts/details/108266254675959742315/keys?inv=1&invt=AbxNyQ&project=bazel-remote-cache-457802
#   2. Under `Keys`, select `Add Key` -> `Create new key` -> `JSON` -> `Create`.
#      - Note that we should not check this key into the repo! It should be gitignored - if you see issues with this, please fix them.
#   3. Move the downloaded file to `~/repo/code8/ci-support/bazel-cache-tools/bazel-remote-cache-457802-5615c675b23b.json`.
# - Update the `command` and `platform` below to the target you want to test.
# - (Optionally) Delete all the data in the remote cache: https://console.cloud.google.com/storage/browser/bazel-remote-cache-testing
# - cd ~/repo/code8 && ./ci-support/bazel-cache-tools/cache_test_local.sh

####################################################################################################
#### 1. Configuration
####################################################################################################
command="//bzl/examples:hello-cc-test"
platform="--platforms=//bzl:osx_arm64"
repo_root="$HOME/repo/code8"

####################################################################################################
#### 2. Constants and helpers
####################################################################################################
date=$(date '+%m-%d-%I-%M%p-%S')
save_path="$HOME/code8_cache_test_local/${date}"
disk_cache_path="$HOME/code8_cache_test_local/disk_cache"

red='\033[0;31m'
green='\033[0;32m'
yellow='\033[0;33m'
reset='\033[0m'

function join_by {
  local d=${1-} f=${2-}
  if shift 2; then
    printf %s "$f" "${@/#/$d}"
  fi
}

# Create output folder.
mkdir -p $save_path

# Create output file.
touch ${save_path}/output.txt
chmod u+x ${save_path}/output.txt

{
####################################################################################################
#### 3. Set up the disk cache and the remote cache
####################################################################################################
echo "${green}Set up - saving results to ${save_path}${reset}"

# Use a new disk cache which we delete before each run.
disk_options="--disk_cache=${disk_cache_path} --incompatible_remote_results_ignore_disk --spawn_strategy=sandboxed"

# Set the remote cache to point at a bucket on AWS that our local machines have read + write access
# to. See here for the service account which we use and the bucket we upload to. Note that these are
# only used in this test.
# - https://console.cloud.google.com/storage/browser/bazel-remote-cache-testing
# TODO(paris): It would be good to delete everything from the remote cache each time we run.

# NOTE(dat): The key cache_test_local_service_account_key.json was at https://console.cloud.google.com/iam-admin/serviceaccounts/details/108429910743541266045/keys?project=build8
# You would want to create a new key when you want to use this script. Do NOT check it in. Keep it
# on your machine with limited permission.
remote_options="--remote_cache=https://storage.googleapis.com/bazel-remote-cache-testing --google_credentials=$repo_root/ci-support/bazel-cache-tools/bazel-remote-cache-457802-5615c675b23b.json"

build_options="${disk_options} ${remote_options} ${platform} ${command} --experimental_guard_against_concurrent_changes --show_timestamps"

####################################################################################################
#### 4. Build and populate the remote cache
####################################################################################################
echo "${green}Build and populate the remote cache${reset}"

rm -rf "${disk_cache_path}"
bazel clean
bazel build  \
  --remote_upload_local_results=true  \
  ${build_options}  \
  --execution_log_json_file="${save_path}/execution_log_json_file_upload.json" \

# ####################################################################################################
# #### 5. Build and only read from the remote cache
# ####################################################################################################
echo "${green}Build and only read from the remote cache${reset}"

# Specify that all profile tasks should be included in the profile.
# https://docs.bazel.build/versions/main/command-line-reference.html#flag--experimental_profile_additional_tasks
# join_by() joins a list on a delimiter string: https://stackoverflow.com/a/17841619/4979029
profile_options=$(join_by ' --experimental_profile_additional_tasks=' --experimental_profile_additional_tasks=action action_check action_lock action_release action_update action_complete info create_package remote_execution local_execution scanner local_parse upload_time local_process_time remote_process_time remote_queue remote_setup fetch vfs_stat vfs_dir vfs_readlink vfs_md5 vfs_xattr vfs_delete vfs_open vfs_read vfs_write vfs_glob vfs_vmfs_stat vfs_vmfs_dir vfs_vmfs_read wait thread_name thread_sort_index skyframe_eval skyfunction critical_path critical_path_component handle_gc_notification action_counts local_cpu_usage system_cpu_usage local_memory_usage system_memory_usage starlark_parser starlark_user_fn starlark_builtin_fn starlark_user_compiled_fn starlark_repository_fn action_fs_staging remote_cache_check remote_download remote_network filesystem_traversal worker_execution worker_setup worker_borrow worker_working worker_copying_outputs)

rm -rf "${disk_cache_path}"
bazel clean
bazel build \
  --remote_upload_local_results=false \
  ${build_options} \
  --build_event_text_file="${save_path}/build_event_text_file.txt" \
  --execution_log_json_file="${save_path}/execution_log_json_file.json" \
  --explain="${save_path}/explain.log" \
  --verbose_explanations \
  --profile="${save_path}/profile.gz" \
  ${profile_options} \

####################################################################################################
#### 6. Analyze logs
####################################################################################################
echo "${green}Analyze logs${reset}"

python3 $repo_root/ci-support/bazel-cache-tools/summarize_bazel_build_event_file.py --file "${save_path}/build_event_text_file.txt"

# This both saves console output to a file as well as prints it to the console.
} 2>&1 | tee "${save_path}/output.txt"

echo "${green}Done${reset}"
