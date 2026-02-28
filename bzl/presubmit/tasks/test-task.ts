import type {TestTask} from './task'
import {runCommand} from './shell'
import {misconfigured, type TaskReport} from './report'

const runTestTask = async ({task}: {task: TestTask}): Promise<TaskReport> => {
  if (!task.targets?.length) {
    return misconfigured('No targets provided for test task')
  }
  const fullCmd =
    `bazel test ${task.args?.join(' ') || ''} -- ${task.targets?.join(' ') || ''}`
  return runCommand(fullCmd)
}

export {runTestTask}
