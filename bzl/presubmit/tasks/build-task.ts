import type {BuildTask} from './task'
import {misconfigured, type TaskReport} from './report'
import {runCommand} from './shell'

const runBuildTask = async ({task}: {task: BuildTask}): Promise<TaskReport> => {
  if (!task.targets?.length) {
    return misconfigured('No targets provided for build task')
  }
  const fullCmd =
    `bazel build ${task.args?.join(' ') || ''} -- ${task.targets?.join(' ') || ''}`
  return runCommand(fullCmd)
}

export {runBuildTask}
