# Bazel Performance & Caching
This directory holds tools to investigation Bazel performance and caching. At a high level:

* `cache-test-ci.ts`: Kicks off a job defined by `cache-test-ci.yml` on GitLab. This job will run the `bazel build //foo:bar` command which you specify, and you can also add flags, i.e. `--config=debug`. It will build with `--execution_log_json_file=/tmp/exec.json` and download that JSON locally. You'll then build the same `bazel build //foo:bar` locally with the same flags and compare the two `execution_log_json_file` files. This is the most useful tool for Bazel cache investigation and should be the first thing you run. It will confirm that the GitLab CI system can upload remote cache artifacts that will work for developers on their laptops.

* `inspect-remote-cache-data.ts`: Downloads information about the remote cache artifacts on GCS. No one but the build team has access to view this GCS bucket on the GCP website, so you can instead use this to check that it is not empty. Use this if you suspect nothing is being uploaded to the remote cache.

* `object_file_diff.sh`: If you use `cache-test-ci.ts` it may show you that two object files (i.e. `hello-cc-test_existing.pic.o`) are different depending on whether they were built on a CI machine or your laptop (this might also mean they will differ between two laptops, though we don't have a way to check that). If that is the case you can use this script to look at what the difference between those two files is. You can also do this manually with `otool -l file1.o file2.o`, but this script makes it easier to do that many times while you're changing Bazel toolchains or configuration. What this script lets you do it first specify the existing object file (i.e the one built on CI) in `existing_object_file_path`. Note that this will be downloaded for you by `cache-test-ci.ts` - look in `bazel_out_ci.tar.gz` or `bazel_bin_ci.tar.gz`. Then you specify the build command to run locally and where that object file will end up. We then compare the two files.

* `summarize_bazel_build_event_file.py`: Use this to format the output of `--build_event_text_file=/tmp/build_event_text_file.txt` in a nice readable way. Not incredibly useful but can tell you about how many actions hit the remote cache.

* `cache_test_local.sh`: The precursor to `cache-test-ci.ts`. We have a dedicated remote cache just used by this script which we authenticate to with `ci-support/bazel-cache-tools/cache_test_local_service_account_key.json`. Before each run we delete everything from it. Then we first build `bazel build //foo:bar` locally and upload to the remote cache. Then we do `bazel clean` and run again - this time we should be able to use the newly added artifacts from the remote cache. Useful to make sure that a single machine can produce artifacts that it can later use, i.e. to verify that timestamps or uuids aren't being introduced into build artifacts.

## Manually Debugging Bazel performance
The scripts above build on the following Bazel flags. You can try adding these flags to a `bazel build //foo:bar`:
* `--execution_log_json_file=/tmp/exec.json` will log a file of your different actions and their inputs / outputs.
* `--build_event_text_file=/tmp/build_event_text_file.txt` will log a summary file about your build. You can then read it manually or use `ci-support/bazel-cache-tools/summarize_bazel_build_event_file.py` to summarize it.
* `--explain=/tmp/explain.log --verbose_explanations` will log a file with some info about what is being run.
* `--show_timestamps` will add timestamps.
* `--profile=/tmp/profile.gz` will log a profile which you then load into `chrome://tracing/` to see timing of different Bazel steps + memory use.
  * It is useful out of the box, but even better if you add some or all of the `experimental_profile_additional_tasks` flags: https://docs.bazel.build/versions/main/command-line-reference.html#flag--experimental_profile_additional_tasks
  * Example: `--profile=profile.gz --experimental_profile_additional_tasks=remote_cache_check --experimental_profile_additional_tasks=remote_download`

## Remote Caching
The monorepo has a remote cache set up.
* By default we will only read from the remote cache. This is configured by `remote_cache` in `.bazelrc`.
* On CI we write to the remote cache. This is configured by `remote_upload_local_results` and `google_credentials` in `ci-support/generate_ci_bazelrc.sh`.

To view the contents of the remote cache, run:
* `gcloud auth activate-service-account --key-file $HOME/repo/niantic/runners-bazel-cache-readers.json`
* Double check that `runners-bazel-cache-us-west2` is the bucket we are reading from by checking `.bazelrc` under `build --remote_cache=`.
* View all contents with: `gsutil ls -r -L -b  gs://runners-bazel-cache-us-west2`
* View info about the bucket with: `gsutil ls -L -b  gs://runners-bazel-cache-us-west2`
  * You can read me about the structure of the cache here: https://bazel.build/remote/caching#http-caching

### Debugging Remote Caching: Is it working?
* When running a build you will see something like `19 processes: 1 internal, 18 darwin-sandbox`. This may tell you that the remote cache was hit.
* To get more information on this you can also run `bazel clean && bazel build --build_event_text_file=/tmp/hello-cc-be.txt //bzl/examples:hello-cc-test && python3 ci-support/summarize_bazel_build_event_file.py --file /tmp/hello-cc-be.txt`. Then look in `runner_count`. If you see `remote cache hit` this means the remote cache was used.

The goal of remote caching is to make the build hermetic so that Bazel can write to the cache on CI and developers can read from it on their local machines. If it is not working you can use the scripts outlined at the top of this file to find out why, or you can read on below to see how to do it manually:

### Debugging Remote Caching: Execution logs
First start by reading this: https://bazel.build/docs/remote-execution-caching-debug. Now we can follow those steps to investigate remote caching. We'll build a target locally and in CI and then diff the logs.
* Comment out the disk cache in `.bazelrc`
* Add something similar to this to CI (adding in flags like `--config=ci` though to match what other CI jobs are doing). Also add these output files to the `artifacts:` section so you can download them after.
  ```
    bazel clean && bazel build \
      --build_event_text_file=$(pwd)/hello_cc_bep_ci.txt \
      --execution_log_json_file=$(pwd)/hello_cc_execution_ci.log \
      --execution_log_binary_file=$(pwd)/hello_cc_execution_binary_ci.log \
      //bzl/examples:hello-cc-test
  ```
* Push your changes to a PR, run a CI job, and download the artifacts.
* Run the same command locally (but change the names of the log files).
* Now there are several outputs to analyze:
  1. First diff the `build_event_text_file` files. `vimdiff file1.txt file2.txt` may be useful.
  2. Next diff the `execution_log_json_file` files.
  3. To make #2 easier you can instead Bazel's execlog parser to first format the files. This will put things in better order and generally make the log easier to read. Find the tool and how to use it here: https://cs.opensource.google/bazel/bazel/+/master:src/tools/execlog/. You'll need to clone the repo and then run something like:
    ```
    bazel build --java_runtime_version=remotejdk_11 //src/tools/execlog:parser && \
    bazel-bin/src/tools/execlog/parser \
      --log_path=$HOME/hello_cc_execution_binary_local.log \
      --log_path=$HOME/hello_cc_execution_binary_ci.log \
      --output_path=$HOME/hello_cc_execution_binary_local.log.txt \
      --output_path=$HOME/hello_cc_execution_binary_ci.log.txt
    ```
    After that you can run: `vimdiff $HOME/hello_cc_execution_binary_local.log.txt $HOME/hello_cc_execution_binary_ci.log.txt`

### Debugging Remote Caching: WORKSPACE rules
Another thing to look into is the WORKSPACE rules. First start by reading this: https://bazel.build/docs/workspace-log. Then:
* Run `bazel clean && bazel build --experimental_workspace_rules_log_file=/tmp/workspacelog //bzl/examples:hello-cc-test`
* Run `bazel build --java_runtime_version=remotejdk_11 src/tools/workspacelog:parser && bazel-bin/src/tools/workspacelog/parser --log_path=/tmp/workspacelog > /tmp/workspacelog.txt`
* Take a look at `/tmp/workspacelog.txt` and follow the instructions from the docs above.
