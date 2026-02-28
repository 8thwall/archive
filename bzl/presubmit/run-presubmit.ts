// @package(npm-bzl-presubmit)

import {findJobs} from './presubmit-jobs'
import {runBuildTask} from './tasks/build-task'
import {runBuildifierTask} from './tasks/buildifier-task'
import {runCargoClippyTask} from './tasks/cargo-clippy-task'
import {runClangFormatTask} from './tasks/clang-format-task'
import {runEslintTask} from './tasks/eslint-task'
import type {TaskReports} from './tasks/report'
import type {Task} from './tasks/task'
import {runTestTask} from './tasks/test-task'

/* eslint-disable no-console */

interface RunPresubmitArgs {
  files: string[]
  fix: boolean
}

// Inspect a presubmit task and dispatch to the correct handler.
const runTask = (taskWithFiles: Task): Promise<TaskReports> => {
  const {task} = taskWithFiles
  switch (task.task) {
    case 'BUILD': {
      return runBuildTask({task})
    }
    case 'TEST': {
      return runTestTask(({task}))
    }
    case 'BUILDIFIER': {
      return runBuildifierTask(taskWithFiles)
    }
    case 'CARGO_CLIPPY': {
      return runCargoClippyTask(taskWithFiles)
    }
    case 'CLANG_FORMAT': {
      return runClangFormatTask(taskWithFiles)
    }
    case 'ESLINT': {
      return runEslintTask(taskWithFiles)
    }
    default: {
      const err = `'Unsupported presubmit task: '${(task as any).task}'`
      console.error(err)  // eslint-disable-line no-console
      throw new Error(err)
    }
  }
}

// Find PRESUBMIT.json files in the tree of the modified files, and run their tasks.
const runPresubmit = async ({files, fix}: RunPresubmitArgs) => {
  // Get all the jobs we need to run.
  const jobs = findJobs({files})
  // Extract all the tasks from the jobs.
  const tasks = jobs.map(j => j.tasks || []).flat()
  // Run each task.
  const results = await Promise.all(tasks.map(task => runTask({task, files, fix})))

  const errors = results.flat().filter(report => report.status !== 'ok')
  if (errors.length === 0) {
    return
  }

  errors.forEach((report) => {
    switch (report.status) {
      case 'fail':
        console.error(`FAIL:          ${report.message}`)
        break
      case 'fixable':
        console.error(`FIXABLE with:  ${report.command}`)
        break
      case 'misconfigured':
        console.error(`MISCONFIGURED: ${report.message}`)
        break
      default:
        console.error('Unknown report status')
    }
  })

  process.exit(1)
}

export {
  runPresubmit,
}
