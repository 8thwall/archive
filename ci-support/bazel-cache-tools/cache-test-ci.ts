/* eslint-disable no-console, max-len */
// This script can be used to test how well remote caching will work between a local machine and
// GitLab CI. We first build something on GitLab CI and then build locally. Then we compare logs
// and look for any differences.
//
// Set up:
// - brew install diffoscope
// - cd ~/repo && git clone --depth 10 https://github.com/bazelbuild/bazel.git
// - Create a GitLab trigger token (https://gitlab.<REMOVED_BEFORE_OPEN_SOURCING>.com/help/ci/triggers/index#create-a-trigger-token)
//   and then save is as an environment variable with key: REPO_NIANTIC_TRIGGER_TOKEN
// - Make sure you have saved a GitLab PAT in the osx keychain:
//   https://<REMOVED_BEFORE_OPEN_SOURCING>.atlassian.net/wiki/spaces/AR/pages/1902314535/g8+Basics+Codelab#GitLab-https-credentials-and-g8-Installation
//
// To run:
// - bazel run //ci-support/bazel-cache-tools:cache-test-ci
// - Then let it run and complete.
// - If you want you can cancel the script (ctrl + c) and come back later. When you do so you should
//   record the pipeline id, i.e. 1425157, and set it in `const PIPELINE_ID = ""`. Then just run the script again.
//
// TODO(someone):
// - Only run sed stripper for the execution log.
// - Make a new log function which will also write to the output file.


import {exec} from 'child_process'
import {promisify} from 'util'
import {makeDir, doFetch, sleep, getRemoteBranch} from '../helpers'
import {pipelineStatus, getJobs, downloadArtifact, getCredentialsFromSecureStorageForHost, getDownstreamPipeline}
  from '../gitlab-service'
import fs from 'fs'
import path from 'path'

const execPromise = promisify(exec)

////////////////////////////////////////////////////////////////////////////////////////////////////
//// 1. User configuration.
////////////////////////////////////////////////////////////////////////////////////////////////////
enum Platform {
  WINDOWS = '//bzl:windows_x86_64',
  MAC_x86_64 = '//bzl:osx_x86_64',
  MAC_ARM64 = '//bzl:osx_arm64',
  IOS_ARM64 = '//bzl:ios_arm64',
  ANDROID_x86_32 = '//bzl:android_x86_32',
  ANDROID_x86_64 = '//bzl:android_x86_64',
  ANDROID_ARM32 = '//bzl:android_arm32',
  ANDROID_ARM64 = '//bzl:android_arm64',
}

const COMMAND = "//bzl/examples:hello-cc-test"
const CI_HOST_PLATFORM = Platform.MAC_ARM64
const TARGET_PLATFORM = Platform.MAC_ARM64
const BUILD_OPTIONS = `--platforms=${TARGET_PLATFORM} --config=fastbuild ${COMMAND}`

// Set this to use an existing pipeline instead of triggering a new one. Careful with this as if the
// pipeline was created with different BUILD_OPTIONS then there will be a mismatch.
const PIPELINE_ID = "1425157"

////////////////////////////////////////////////////////////////////////////////////////////////////
//// 2. Constants and set up.
////////////////////////////////////////////////////////////////////////////////////////////////////
const PROJECT_ID = "3220"
const GITLAB_URL = `https://gitlab.<REMOVED_BEFORE_OPEN_SOURCING>.com/api/v4/projects/${PROJECT_ID}`

const PIPELINE_STATUS_DELAY_MS = 30 * 1000

const HOME = process.env.HOME || ''
const REPO_DIR = path.join(HOME, 'repo')
const NIANTIC_REPO_DIR = path.join(HOME, 'repo', 'niantic')
const BAZEL_REPO_DIR = path.join(HOME, 'repo', 'bazel')

const DATE = new Date().toLocaleString().replace(/,/g, "").replace(/[\:\/ \-]/g, "_");

const DIR = path.join(HOME, 'niantic_cache_test_ci')
const SAVE_DIR = `${DIR}/${DATE}_${TARGET_PLATFORM.split(":")?.pop()}`

const BUILD_EVENT_TEXT_FILE = `build_event_text_file`
const EXEC_LOG_BINARY_FILE = `execution_log_binary_file`
const EXEC_LOG_JSON_FILE = `execution_log_json_file`
const OBJECT_FILE_HASHES = `object_file_hashes`

const BUILD_EVENT_TEXT_FILE_PATH_CI = `${SAVE_DIR}/${BUILD_EVENT_TEXT_FILE}_ci.txt`
const EXEC_LOG_BINARY_FILE_PATH_CI = `${SAVE_DIR}/${EXEC_LOG_BINARY_FILE}_ci.log`
const EXEC_LOG_JSON_FILE_PATH_CI = `${SAVE_DIR}/${EXEC_LOG_JSON_FILE}_ci.json`
const OBJECT_FILE_HASHES_CI = `${SAVE_DIR}/${OBJECT_FILE_HASHES}_ci.txt`

const BUILD_EVENT_TEXT_FILE_PATH_LOCAL = `${SAVE_DIR}/${BUILD_EVENT_TEXT_FILE}_local.txt`
const EXEC_LOG_BINARY_FILE_PATH_LOCAL = `${SAVE_DIR}/${EXEC_LOG_BINARY_FILE}_local.log`
const EXEC_LOG_JSON_FILE_PATH_LOCAL = `${SAVE_DIR}/${EXEC_LOG_JSON_FILE}_local.json`
const OBJECT_FILE_HASHES_LOCAL = `${SAVE_DIR}/${OBJECT_FILE_HASHES}_local.txt`

const runDiffoscopeAndOpenResult = async (name: string, filePath1: string, filePath2: string) : Promise<string> => {
  const diffoscopeDir = `${SAVE_DIR}/${name}_diffoscope`
  makeDir(diffoscopeDir)
  // We first replace the walltime block and // `runner: "disk cache hit" remote_cache_hit: true remote_cacheable: true`
  // blocks from the output. We do this with sed b/c difoscope regex did not work.
  const sedCommand = "sed -e ':a' -e 'N' -e '$!ba' -e 's/runner: \"[a-z -]*\"\\n[^w]*/[stripped]\\n/g' -e 's/walltime {\\n[^}]*}/[stripped]/g'"
  const newFilePath1 = filePath1.replace('.', '_stripped.')
  const newFilePath2 = filePath2.replace('.', '_stripped.')
  await execPromise(`${sedCommand} ${filePath1} > ${newFilePath1}`)
  await execPromise(`${sedCommand} ${filePath2} > ${newFilePath2}`)
  try {
    // This throws a `shell-init: error retrieving current directory: getcwd: cannot access parent
    // directories: No such file or directory` error but still succeeds, so just catch and ignore.
    // Configure output limits with these flags: https://www.mankier.com/1/diffoscope#Description-output_limits
    const command = `diffoscope --html-dir=${diffoscopeDir}/ --no-default-limits --max-page-size=83886080 --max-report-size=83886080 --max-diff-block-lines=10240 --max-page-diff-block-lines=512 --output-empty ${newFilePath1} ${newFilePath2}`
    console.log(command)
    await execPromise(command)
  } catch (ignore) {}
  const diffoscopeFile = `${diffoscopeDir}/index.html`
  await execPromise(`open ${diffoscopeFile}`)
  return diffoscopeFile
}

const cacheTestCi = async () => {
  // Not above because we cannot await in top-level code.
  const PAT = await getCredentialsFromSecureStorageForHost()
  const TRIGGER_TOKEN = process.env.REPO_NIANTIC_TRIGGER_TOKEN
  if (!TRIGGER_TOKEN) {
    console.error('Missing "REPO_NIANTIC_TRIGGER_TOKEN" environment variable.')
    return
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  //// 3. Build on GitLab.
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  const remoteBranch = await getRemoteBranch(NIANTIC_REPO_DIR)
  console.log(`Using remote branch ${remoteBranch}`)

  let pipelineId = PIPELINE_ID
  if (!PIPELINE_ID?.length) {
    // Trigger a pipeline.
    const pipeline = await doFetch(`${GITLAB_URL}/trigger/pipeline`, {
      queryParams: {
        'token': TRIGGER_TOKEN,
        'ref': remoteBranch,
        'variables[BUILD_OPTIONS]': BUILD_OPTIONS,
        'variables[CI_HOST_PLATFORM]': CI_HOST_PLATFORM,
        'variables[TRIGGERER]': 'CACHE_TEST_CI'
      },
      method: 'post'
    })
    if (!pipeline.id) {
      console.error('Failed to trigger pipeline', pipeline)
      return
    }
    pipelineId = pipeline.id
    console.log(`Successfully triggered pipeline ${pipeline.id}: ${pipeline.web_url}`)
  } else {
    console.log(`Using hard-coded pipeline ${PIPELINE_ID}: https://gitlab.<REMOVED_BEFORE_OPEN_SOURCING>.com/repo/<REMOVED_BEFORE_OPEN_SOURCING>/-/pipelines/${PIPELINE_ID}`)
  }

  // Check if there is a downstream pipeline we should be using instead.
  const downstreamPipeline = await getDownstreamPipeline(PAT, PROJECT_ID, pipelineId)
  if (downstreamPipeline) {
    console.log(`Pipeline ${pipelineId} has child Pipeline ${downstreamPipeline?.id} which we will use instead: ${downstreamPipeline.url}`)
    pipelineId = downstreamPipeline.id
  }

  // Wait for pipeline to finish.
  while (true) {
    const status = await pipelineStatus(PAT, PROJECT_ID, pipelineId, remoteBranch)
    if (status === 'success') {
      console.log(`Pipeline ${pipelineId} finished with status "${status}"\n`)
      break
    }
    if (status === 'failed' || status === 'canceled') {
      console.log(`Pipeline ${pipelineId} failed with status "${status}"`)
      return
    }
    console.log(`Pipeline ${pipelineId} has status "${status}", sleeping for ${PIPELINE_STATUS_DELAY_MS / 1000} seconds...`)
    await sleep(PIPELINE_STATUS_DELAY_MS)
  }

  // Get the job from the pipeline.
  const jobs = await getJobs(PAT, PROJECT_ID, pipelineId)
  const job = jobs.find((j) => j.name.includes('cache-test-ci'))
  const jobId = job.id
  if (!jobs?.length || !jobId) {
    console.error('Failed to find job with name "cache-test-ci" in for pipeline, ending early')
    return
  }

  // Create the directory we'll save data to.
  console.log(`Will save data from this run to ${SAVE_DIR}\n`)
  makeDir(SAVE_DIR)

  // Download artifacts from pipeline.
  // First create an artifacts cache folder using the job id. We download artifacts to here instead
  // of to SAVE_DIR. This lets us cache downloads and avoid re-downloading files multiple times
  // (which is nice if we re-running the script on the same pipeline twice).
  const artifactsCacheDir = `${DIR}/artifacts_cache/${jobId}`
  makeDir(artifactsCacheDir)
  const buildEventTextFilePathCiCache = `${artifactsCacheDir}/${BUILD_EVENT_TEXT_FILE}_ci.txt`
  const execLogBinaryFilePathCiCache = `${artifactsCacheDir}/${EXEC_LOG_BINARY_FILE}_ci.log`
  const execLogJsonFilePathCiCache = `${artifactsCacheDir}/${EXEC_LOG_JSON_FILE}_ci.json`
  const objectFileHashesPathCiCache = `${artifactsCacheDir}/object_file_hashes_ci.txt`
  const bazelOutCiCache = `${artifactsCacheDir}/bazel_out_ci.tar.gz`
  const bazelBinCiCache = `${artifactsCacheDir}/bazel_bin_ci.tar.gz`

  // Then download the artifacts cache folder (if we need to).
  console.log(`Will download artifacts from job ${jobId}: ${job.web_url}`)
  await downloadArtifact(PAT, PROJECT_ID, jobId, `${BUILD_EVENT_TEXT_FILE}_ci.txt`, buildEventTextFilePathCiCache)
  await downloadArtifact(PAT, PROJECT_ID, jobId, `${EXEC_LOG_BINARY_FILE}_ci.log`, execLogBinaryFilePathCiCache)
  await downloadArtifact(PAT, PROJECT_ID, jobId, `${EXEC_LOG_JSON_FILE}_ci.txt`, execLogJsonFilePathCiCache)
  await downloadArtifact(PAT, PROJECT_ID, jobId, `${OBJECT_FILE_HASHES}_ci.txt`, objectFileHashesPathCiCache)
  await downloadArtifact(PAT, PROJECT_ID, jobId, `bazel_out_ci.tar.gz`, bazelOutCiCache)
  await downloadArtifact(PAT, PROJECT_ID, jobId, `bazel_bin_ci.tar.gz`, bazelBinCiCache)

  // Finally copy the artifacts from the cache folder to the folder for this run.
  await fs.copyFileSync(buildEventTextFilePathCiCache, BUILD_EVENT_TEXT_FILE_PATH_CI)
  await fs.copyFileSync(execLogBinaryFilePathCiCache, EXEC_LOG_BINARY_FILE_PATH_CI)
  await fs.copyFileSync(execLogJsonFilePathCiCache, EXEC_LOG_JSON_FILE_PATH_CI)
  await fs.copyFileSync(objectFileHashesPathCiCache, OBJECT_FILE_HASHES_CI)
  await fs.copyFileSync(bazelOutCiCache, `${SAVE_DIR}/bazel_out_ci.tar.gz`)
  await fs.copyFileSync(bazelBinCiCache, `${SAVE_DIR}/bazel_bin_ci.tar.gz`)

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  //// 4. Build locally
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  let command = `cd ${NIANTIC_REPO_DIR} && bazel clean && bazel build --build_event_text_file=${BUILD_EVENT_TEXT_FILE_PATH_LOCAL} --execution_log_json_file=${EXEC_LOG_JSON_FILE_PATH_LOCAL} --execution_log_binary_file=${EXEC_LOG_BINARY_FILE_PATH_LOCAL} ${BUILD_OPTIONS}`
  console.log('\nNow building locally, command:')
  console.log(command)
  const localBuildOut = (await execPromise(command, {maxBuffer: 1024 * 1024 * 50}))
  await fs.writeFileSync(`${SAVE_DIR}/local_build.txt`, `${localBuildOut.stdout}\n${localBuildOut.stderr}`)
  console.log(`Finished building locally - saved output to ${SAVE_DIR}/local_build.txt\n`)

  console.log(`Hashing object files in ${NIANTIC_REPO_DIR}/bazel-bin/ and saving to ${OBJECT_FILE_HASHES_LOCAL}`)
  await execPromise(`cd ${NIANTIC_REPO_DIR} && find -L bazel-bin -type f | xargs -I% openssl dgst -md5 % > ${OBJECT_FILE_HASHES_LOCAL}`)

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  //// 5. Analyze results.
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  console.log('\nAnalyzing results')
  if (!fs.existsSync(BUILD_EVENT_TEXT_FILE_PATH_CI) ||
      !fs.existsSync(EXEC_LOG_BINARY_FILE_PATH_CI) ||
      !fs.existsSync(EXEC_LOG_JSON_FILE_PATH_CI)) {
    console.error("Missing CI files")
    return
  }
  if (!fs.existsSync(BUILD_EVENT_TEXT_FILE_PATH_LOCAL) ||
      !fs.existsSync(EXEC_LOG_BINARY_FILE_PATH_LOCAL) ||
      !fs.existsSync(EXEC_LOG_JSON_FILE_PATH_LOCAL)) {
    console.error("Missing local files")
    return
  }

  if (!fs.existsSync(BAZEL_REPO_DIR)) {
    console.error(`In order to analyze the --execution_log_binary_file you need to clone the bazel repo to ${BAZEL_REPO_DIR}. Run 'cd ${REPO_DIR} && git clone git clone --depth 10 https://github.com/bazelbuild/bazel.git`)
    return
  }

  // This bazel tool formats the --execution_log_binary_file. The resulting file is easier to compare than the --execution_log_json_file.
  const formatCommand = `cd ${BAZEL_REPO_DIR} && bazel build --disk_cache=/tmp/bazel_local_cache_bazel --java_runtime_version=remotejdk_11 //src/tools/execlog:parser && bazel-bin/src/tools/execlog/parser --log_path=${EXEC_LOG_BINARY_FILE_PATH_LOCAL} --log_path=${EXEC_LOG_BINARY_FILE_PATH_CI} --output_path=${EXEC_LOG_BINARY_FILE_PATH_LOCAL}.txt --output_path=${EXEC_LOG_BINARY_FILE_PATH_CI}.txt`
  await execPromise(formatCommand)
  if (!fs.existsSync(`${EXEC_LOG_BINARY_FILE_PATH_LOCAL}.txt`) ||
      !fs.existsSync(`${EXEC_LOG_BINARY_FILE_PATH_CI}.txt`)) {
    console.error("Missing parsed binary files")
    return
  }

  // Analyze object file hashes with diffoscope.
  const objectFileHashesDiffoscopeFile = await runDiffoscopeAndOpenResult(
    OBJECT_FILE_HASHES,
    `${OBJECT_FILE_HASHES_LOCAL}`,
    `${OBJECT_FILE_HASHES_CI}`)

  // Analyze build event text files with diffoscope.
  const buildEventTextFileDiffoscopeFile = await runDiffoscopeAndOpenResult(
    BUILD_EVENT_TEXT_FILE,
    `${BUILD_EVENT_TEXT_FILE_PATH_LOCAL}`,
    `${BUILD_EVENT_TEXT_FILE_PATH_CI}`)

  // Analyze parsed execution log binary files with diffoscope.
  const execLogBinaryFileDiffoscopeFile = await runDiffoscopeAndOpenResult(
    EXEC_LOG_BINARY_FILE,
    `${EXEC_LOG_BINARY_FILE_PATH_LOCAL}.txt`,
    `${EXEC_LOG_BINARY_FILE_PATH_CI}.txt`)

  const diffInstructions = `
Pipeline: ${pipelineId}
Job: ${jobId}
COMMAND: ${COMMAND}
CI_HOST_PLATFORM: ${CI_HOST_PLATFORM}
BUILD_OPTIONS: ${BUILD_OPTIONS}
SAVE_DIR: ${SAVE_DIR}

Run one of these to see the diff (local on left, CI on right):

vimdiff ${EXEC_LOG_BINARY_FILE_PATH_LOCAL}.txt ${EXEC_LOG_BINARY_FILE_PATH_CI}.txt

diff --speed-large-files -y ${EXEC_LOG_BINARY_FILE_PATH_LOCAL}.txt ${EXEC_LOG_BINARY_FILE_PATH_CI}.txt

git difftool ${EXEC_LOG_BINARY_FILE_PATH_LOCAL}.txt ${EXEC_LOG_BINARY_FILE_PATH_CI}.txt

open ${execLogBinaryFileDiffoscopeFile}

open ${buildEventTextFileDiffoscopeFile}

open ${objectFileHashesDiffoscopeFile}
`
  console.log(diffInstructions)
  await fs.writeFileSync(`${SAVE_DIR}/diff_instructions.txt`, diffInstructions)
}

const main = async () => {
  await cacheTestCi()
  console.log('Done')
}

main()
