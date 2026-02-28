# Bazel Remote Cache

To set up the Bazel Remote Cache from scratch, we do:

 * Create a new Cloud Storage bucket

 * `<REMOVED_BEFORE_OPEN_SOURCING>` (GCP Storage bucket console URL)

 * Create a new _Readers_ Service Account

 * `<REMOVED_BEFORE_OPEN_SOURCING>` (GCP Readers service account console URL)

 * Create a new _Writers_ Service Account

 * `<REMOVED_BEFORE_OPEN_SOURCING>` (GCP Writers service account console URL)

 * On your bucket, click “Grant Access” and add these Service Accounts with these permissions:

 * _Readers_ : Storage Legacy Bucket Reader, Storage Legacy Object Reader

 * _Writers_ : Storage Legacy Bucket Reader, Storage Legacy Bucket Writer, Storage Legacy Object Reader

 *

 * For the _Readers_ Service Account, create a new JSON key. Check it into the repo root and in your `.bazelrc`, set `build --remote_cache=<REMOVED_BEFORE_OPEN_SOURCING> --remote_upload_local_results=false --google_credentials=./runners-bazel-cache-readers.json`. This lets anyone who clones the repo read from this bucket.

 *
 * For the _Writers_ Service Account, create a new JSON key.

 * Upload it to Jenkins with `~/repo/code8 scp <file> <internal-server>:<destination>

 * Go to the Jenkins management console and set the path to the key as an environment variable (we set as `BAZEL_REMOTE_CACHE_CODE8_JENKINS_SERVICE_ACCOUNT_KEY_PATH`)

 * Write a bash script which generates an override `.bazelrc` with `--google_credentials=$BAZEL_REMOTE_CACHE_CODE8_JENKINS_SERVICE_ACCOUNT_KEY_PATH` \- see `ci-support/generate-ci-bazelrc.sh` for ours. Then run that bash script on Jenkins in any CI job which you want to upload to the remote cache.

Extra notes:

 * We use GCP as the cache because using AWS requires setting up Cloudfront or a dedicated server. See: <https://github.com/bazelbuild/bazel/discussions/25918>
