import * as path from 'path'

import type {Task} from './task'
import {fixable, OK, type TaskReport} from './report'
import {exec} from './shell'
import {isFile} from './file'

const isBazelFile = (file: string): boolean => {
  const base = path.basename(file)
  if (base === 'BUILD') {
    return true
  }
  if (base.substr(-'.BUILD'.length) === '.BUILD') {
    return true
  }
  if (base.substr(-'.bzl'.length) === '.bzl') {
    return true
  }
  if (base === 'WORKSPACE') {
    return true
  }
  return false
}

const runBuildifier = async (file: string): Promise<TaskReport> => {
  if (!isBazelFile(file)) {
    return OK
  }

  if (!isFile(file)) {
    return OK
  }

  try {
    await exec(`buildifier -mode=check -lint=warn "${file}"`)
    return OK
  } catch (e) {
    return fixable(`buildifier -lint=fix ${file}`)
  }
}

const runBuildifierTask = ({files}: Task) => (
  Promise.all(files.map(runBuildifier))
)

export {
  runBuildifierTask,
}
