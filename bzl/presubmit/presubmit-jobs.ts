import * as fs from 'fs'
import * as path from 'path'

import type {PresubmitJob} from './tasks/task'
import {validateJob} from './tasks/task-validate'

const unique = (arr: string[]) => [...new Set(arr)]

const jobForPresubmitFile = (file: string): PresubmitJob => (
  validateJob(JSON.parse(fs.readFileSync(file, {encoding: 'utf8', flag: 'r'})))
)

const jobs = (
  presubmits: Record<string, PresubmitJob>, dir: string
): Record<string, PresubmitJob> => {
  // If we are at the root, or we already know the answer for this directory, return early.
  const parent = path.dirname(dir)

  if (!dir || dir in presubmits || dir === parent) {
    return presubmits
  }

  const presubmitFile = path.join(dir, 'PRESUBMIT.json')

  // If there is a valid presubmit file, use it.
  let fstat = null
  try {
    fstat = fs.lstatSync(presubmitFile)
  } catch {
    // ignore
  }
  if (!fstat || !fstat.isFile()) {
    return jobs(presubmits, parent)
  }

  // If there is no PRESUBMIT file in this directory, go up a level and try again.
  if (!fs.existsSync(presubmitFile)) {
    return jobs(presubmits, parent)
  }

  // Parse the current presubmit file and add to the list.
  console.log('Reading presubmit file', presubmitFile)  // eslint-disable-line no-console
  const fileData = jobForPresubmitFile(presubmitFile)
  presubmits[dir] = fileData

  // If the current presubmit requests to inherit, examine the parent.
  return fileData.inherit ? jobs(presubmits, parent) : presubmits
}

const findJobs = ({files}): PresubmitJob[] => {
  const dirs = unique(files.map(f => path.dirname(path.resolve(f))))
  return Object.values(dirs.reduce(jobs, {}))
}

export {
  findJobs,
}
