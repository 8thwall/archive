import type {PresubmitJob} from './task'

// Should mirror Task types in task.d.ts. This is used to validate that JSON matches the typescript
// schema.
const types = {
  BUILD: {args: 'string[]', targets: 'string[]'},
  BUILDIFIER: {},
  CARGO_CLIPPY: {},
  CLANG_FORMAT: {},
  ESLINT: {},
  TEST: {args: 'string[]', targets: 'string[]'},
}

// Checks that the provided valid is an array of strings. Returns true if valid and false otherwise.
const validateStringArray = (v): boolean => {
  if (!Array.isArray(v)) {
    return false
  }
  return !v.some((e => typeof (e) !== 'string'))
}

// Checks that a PresubmitTask from JSON is valid for the typescript definition. If not, throws an
// error.
const validateTask = (task: any) => {
  // If there is no task, it's invalid.
  const t = task.task
  if (!t) {
    throw new Error(`Missing task: ${JSON.stringify(task)}`)
  }

  // If we don't have the task type registered with `types` above, it's invalid.
  const type = types[t]
  if (!type) {
    throw new Error(`Unsupported task type '${t}'`)
  }

  // Validate other fields.
  Object.entries(task).forEach(([k, v]) => {
    if (k === 'task') {
      return  // Already checked.
    }

    // Get the type spec for this key within the task.
    const keyType = type[k]

    // If a task field is not in the schema, throw an error.
    if (keyType === undefined) {
      throw new Error(`Unsupported field '${k}' in task ${t}`)
    }

    // Check that the valid of a field in the task has the correct type.
    if (keyType === 'string[]') {
      if (!validateStringArray(v)) {
        throw new Error(`Expected string[] for '${k}' in task ${t}`)
      }
    } else {
      // This is an error with this validation script. A type of a field was used in 'types' but
      // we don't have an `if keyType === '[type]'` to handle it above.
      throw new Error(`Validator error validating type ${keyType}`)
    }
  })
}

const validateJob = (job: any): PresubmitJob => {
  if (typeof (job.inherit) !== 'boolean') {
    throw new Error(`PRESUBMIT.json has missing or invalid 'inherit' field: ${JSON.stringify(job)}`)
  }
  if (!Array.isArray(job.tasks)) {
    throw new Error(`PRESUBMIT.json does not have 'tasks' array: ${JSON.stringify(job)}`)
  }
  job.tasks.forEach(validateTask)
  return job as PresubmitJob
}

export {
  validateJob,
}
