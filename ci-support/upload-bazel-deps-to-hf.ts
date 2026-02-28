// Uploads the bazel dependencies to HuggingFace to HuggingFace:
// - https://huggingface.co/datasets/8thWall/bazel-dependencies.
//
// Setup:
// - Login to AWS
// - Login to HuggingFace
//   - brew install huggingface-cli
//   - hf auth login
//     - Use a token with write permissions to the 8th Wall HuggingFace organization
//       (https://huggingface.co/8thWall)
// Usage:
// - bazel run //ci-support:upload-bazel-deps-to-hf

import os from 'os'
import fs from 'fs'

import {syncS3DirectoryToLocal} from 'c8/cli/s3'
import {uploadToHuggingFace} from 'c8/cli/hugging-face'

/* eslint-disable no-console, no-await-in-loop */

// Uploads the bazel dependencies to HuggingFace:
// https://huggingface.co/datasets/8thWall/bazel-dependencies
const HUGGINGFACE_REPO = '8thWall/bazel-dependencies'
const TEMP_DIR = `${os.homedir()}/archive8/upload-bazel-deps-to-hf`

// Buckets where files are already organized in subdirectories
const BUCKETS = [
  '8w-bazel',
  '8w-crosstool',
  '8w-cargo-crate',
  '8w-mdm-dist',
]

// Buckets where files are at the root and need to be wrapped in a folder
// Maps bucket name -> folder name on HuggingFace
const BUCKETS_NEEDING_WRAPPER: Record<string, string> = {
  '8w-miniaudio-addon': 'miniaudio-addon',
  '8w-roboelectric': 'roboelectric',
}

const run = async () => {
  // Handle standard buckets (files already in subdirectories)
  for (const bucket of BUCKETS) {
    const localDir = `${TEMP_DIR}/${bucket}`
    fs.mkdirSync(localDir, {recursive: true})

    console.log(`Syncing s3://${bucket} to ${localDir}`)
    await syncS3DirectoryToLocal({
      dryrun: false,
      deleteFromDestination: false,
      remote: `s3://${bucket}`,
      local: localDir,
    })

    console.log(`Uploading ${localDir} to ${HUGGINGFACE_REPO}`)
    await uploadToHuggingFace({
      repo: HUGGINGFACE_REPO,
      localPath: localDir,
    })
  }

  // Handle buckets that need their contents wrapped in a folder
  for (const [bucket, folderName] of Object.entries(BUCKETS_NEEDING_WRAPPER)) {
    const localDir = `${TEMP_DIR}/${bucket}/${folderName}`
    fs.mkdirSync(localDir, {recursive: true})

    console.log(`Syncing s3://${bucket} to ${localDir}`)
    await syncS3DirectoryToLocal({
      dryrun: false,
      deleteFromDestination: false,
      remote: `s3://${bucket}`,
      local: localDir,
    })

    // Upload the parent directory so the folder structure is preserved
    const parentDir = `${TEMP_DIR}/${bucket}`
    console.log(`Uploading ${parentDir} to ${HUGGINGFACE_REPO}`)
    await uploadToHuggingFace({
      repo: HUGGINGFACE_REPO,
      localPath: parentDir,
    })
  }
}

run()
