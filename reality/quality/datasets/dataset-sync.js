/* eslint-disable no-console */
// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)
//
// Script that syncs the folder local dataset directories with the remote dataset of the specified
// name. Downloads pull from HuggingFace (public), uploads are not currently supported.
//
// Setup:
// - brew install huggingface-cli
// - hf auth login
//   - Use a token with write permissions to the 8th Wall HuggingFace organization:
//     https://huggingface.co/8thWall
//
// Usage:
// $ bazel run //reality/quality/datasets:dataset-sync -- \
//   --dry-run --direction=down --dataset=cylindrical-image-targets --local=${HOME}/datasets

import {checkArgs} from 'c8/cli/args'
import {streamExec} from 'c8/cli/proc'

const HELP = `dataset-sync.js usage:
  dataset-sync.js [--help] [--dry-run] [--deleteFromDestination] --dataset=[name|all]
  --direction=[up|down] --local=[path]
`

const HF_REPO = '8thWall/datasets'

const datasets = [
  'benchmark',
  'compression',
  'cylindrical-image-targets',
  'depth-mapping',
  'flat-image-targets',
  'loop-close',
  'low-motion',
  'newfeatures',
  'offset',
  'portals',
  'problematic',
  'relocalization',
  'face',
  'scan-targets',
  'selfies',
  'stability',
  'true-scale',
  'vps',
  'xzsliding',
  'yawpitchroll',
  'hand-tracking',
]

const rawArgs = checkArgs({
  optionalFlags: ['direction', 'dataset', 'local', 'dry-run', 'deleteFromDestination'],
  requiredFlags: ['direction', 'dataset', 'local'],
  optionsForFlag: {
    direction: ['up', 'down'],
    dataset: datasets.concat(['all']),
  },
  maxOrdered: 0,
  help: HELP,
})

const syncHuggingFaceToLocal = async ({dataset, local, dryrun}) => {
  console.log(`Downloading ${HF_REPO} ${dataset} to ${local}`)

  const command = dataset === 'all'
    ? `hf download ${HF_REPO} --repo-type=dataset --local-dir=${local}`
    : `hf download ${HF_REPO} --repo-type=dataset --local-dir=${local} --include ${dataset}/**`
  console.log('[dataset-sync] Running: ', command)

  if (dryrun) {
    console.log('[dataset-sync] Exiting early due to dryrun.')
    return
  }

  await streamExec(command)
  console.log('Successfully downloaded the dataset.')
}

const main = async () => {
  if (rawArgs.direction === 'up') {
    console.error('Uploads are not currently supported.')
  } else if (rawArgs.direction === 'down') {
    await syncHuggingFaceToLocal({
      dataset: rawArgs.dataset,
      local: rawArgs.local,
      dryrun: rawArgs['dry-run'],
    })
  }
}

main()
