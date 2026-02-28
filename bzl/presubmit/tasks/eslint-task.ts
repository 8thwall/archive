import type {Task} from './task'
import {exec, runCommand} from './shell'
import {fixable, OK, TaskReport} from './report'
import {isFile} from './file'

const isEslintFile = (file: string): boolean => {
  const extensions = ['.js', '.ts', '.tsx']
  return extensions.some(ext => file.endsWith(ext))
}

const runEslintTask = async ({files, fix}: Task): Promise<TaskReport> => {
  const lintableFiles = files.filter(isEslintFile).filter(isFile)
  if (lintableFiles.length === 0) {
    return OK
  }
  const paths = lintableFiles.map(e => `'${e}'`).join(' ')

  if (fix) {
    return runCommand(`./eslint.sh --fix ${paths}`)
  }

  try {
    await exec(`./eslint.sh ${paths}`)
    return OK
  } catch (e) {
    return fixable(`(maybe) ./eslint.sh --fix ${paths}`)
  }
}

export {
  runEslintTask,
}
