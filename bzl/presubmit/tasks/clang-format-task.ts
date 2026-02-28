import type {Task} from './task'
import {exec} from './shell'
import {fixable, OK, type TaskReport} from './report'
import {isFile} from './file'

const isClangFile = (file: string): boolean => {
  const extensions = ['.c', '.cpp', '.cc', '.cxx', '.h', '.hpp', '.hxx', '.m', '.mm']
  return extensions.some(ext => file.endsWith(ext))
}

const runClangFormat = async (fix: boolean, file: string): Promise<TaskReport> => {
  if (!isClangFile(file)) {
    return OK
  }

  if (!isFile(file)) {
    return OK
  }

  try {
    if (fix) {
      await exec(`clang-format -i --Werror -style=file ${file}`)
    } else {
      await exec(`clang-format --dry-run --Werror -style=file ${file}`)
    }
    return OK
  } catch (e) {
    return fixable(`clang-format -i -style=file ${file}`)
  }
}

const runClangFormatTask = ({files, fix}: Task): Promise<TaskReport[]> => (
  Promise.all(files.map(runClangFormat.bind(null, fix)))
)

export {
  runClangFormatTask,
}
