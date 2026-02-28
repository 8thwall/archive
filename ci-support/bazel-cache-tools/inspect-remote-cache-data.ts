/* eslint-disable no-console */
// This script downloads the data in the remote cache and opens it for inspection.
//
// Set up:
// - Set up `gsutil`: https://cloud.google.com/storage/docs/gsutil_install
// - Add `code` to your path: https://code.visualstudio.com/docs/setup/mac#_launching-from-the-command-line
//
// To run:
// - bazel run //ci-support/bazel-cache-tools:inspect-remote-cache-data
//  - Note that this takes a long time and may crash. You may want to cancel this midway through running.
//
// TODO(someone): Don't download everything, just the past N days.

import {exec} from 'child_process'
import {promisify} from 'util'
import {makeDir} from '../helpers'

const execPromise = promisify(exec)

const inspectRemoteCacheData = async () => {
  const DIR = `/tmp/inspect-remote-cache-data`
  makeDir(DIR)
  const DATE = new Date().toLocaleString().replace(/,/g, "").replace(/[\:\/ \-]/g, "_")
  const FILE = `${DIR}/runners-bazel-cache-us-west2_${DATE}`
  console.log(`Starting download to data to ${FILE} - note that this will download a lot of data, so you may want to end early with control+c.`)
  await execPromise(`gsutil ls -r -L  gs://runners-bazel-cache-us-west2 > ${FILE}`)
  await execPromise(`code ${FILE}`)
}

const main = async () => {
  await inspectRemoteCacheData()
  console.log('Done')
}

main()
