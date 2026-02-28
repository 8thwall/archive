type TaskReport =
  | {status: 'ok'}
  | {status: 'misconfigured', message: string}
  | {status: 'fixable', command: string}
  | {status: 'fail', message: string}

type TaskReports = TaskReport | Array<TaskReport>

const OK = {status: 'ok'} as const

const fail = (message: string): TaskReport => ({
  status: 'fail',
  message,
})

const fixable = (command: string): TaskReport => ({
  status: 'fixable',
  command,
})

const misconfigured = (message: string): TaskReport => ({
  status: 'misconfigured',
  message,
})

export {
  OK,
  misconfigured,
  fail,
  fixable,
}

export type {
  TaskReport,
  TaskReports,
}
