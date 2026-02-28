interface BuildTask {
  task: 'BUILD'
  args?: string[]
  targets?: string[]
}

interface TestTask {
  task: 'TEST'
  args?: string[]
  targets?: string[]
}

interface BuildifierTask {
  task: 'BUILDIFIER'
}

interface CargoClippyTask {
  task: 'CARGO_CLIPPY'
}

interface ClangFormatTask {
  task: 'CLANG_FORMAT'
}

interface EslintTask {
  task: 'ESLINT'
}

type PresubmitTask = BuildTask
  | BuildifierTask
  | CargoClippyTask
  | ClangFormatTask
  | TestTask
  | EslintTask

interface PresubmitJob {
  inherit: boolean
  tasks: PresubmitTask[]
  // TODO(nbutko): Consider making this a more general CI hook with lifecycles:
  // e.g. preupdate, preland, update, land, hourly, nightly
}

interface Task {
  task: PresubmitTask
  files: string[]
  fix: boolean
}

export {
  BuildTask,
  TestTask,
  BuildifierTask,
  PresubmitJob,
  PresubmitTask,
  Task,
}
