type FileInfo = {
  children?: string[]
}

// FolderStructure<T> is a map from paths to representations of each node in the tree
// Each element can be an object with just a "children" array, containing a list of full paths
// that are children of the folder, in the case of a folder with no data provided, or T type plus
// an added "children" field to allow for folders with information stored.

type FolderStructure<T> = Record<string, FileInfo | FileInfo & T>

function attachToParents<T>(filePath: string, structure: FolderStructure<T>) {
  const filePathSplit = filePath.split('/')

  while (filePathSplit.length >= 2) {
    const childPath = filePathSplit.join('/')
    filePathSplit.pop()
    const parentPath = filePathSplit.join('/')

    const parentAlreadyExists = structure[parentPath]

    if (!parentAlreadyExists) {
      structure[parentPath] = {children: [childPath]}
    } else if (!structure[parentPath].children) {
      structure[parentPath].children = [childPath]
    } else {
      structure[parentPath].children.push(childPath)
    }

    if (parentAlreadyExists) {
      return
    }
  }
}

function getStructure<T extends {filePath: string}>(files: T[]): FolderStructure<T> {
  const structure = {}

  files.forEach(({filePath, ...rest}) => {
    if (structure[filePath]) {
      Object.assign(structure[filePath], rest)
    } else {
      structure[filePath] = {
        filePath,
        ...rest,
      }
    }

    attachToParents<T>(filePath, structure)
  })

  return structure
}

function reverseStructure<T extends { filePath: string }>(
  structure: FolderStructure<T>
): T[] {
  const files: T[] = []

  Object.values(structure).forEach((fileInfo) => {
    // Makes sure it's a file and not a folder.
    if ('filePath' in fileInfo) {
      files.push(fileInfo as T)
    }
  })

  return files
}

function combineStructures<T>(a: FolderStructure<T>, b: FolderStructure<T>) {
  const res: FolderStructure<T> = {...a}

  Object.entries(b).forEach(([filePath, data]) => {
    if (!res[filePath] || !res[filePath].children) {
      res[filePath] = data
    } else if (!res[filePath].children.includes(filePath)) {
      res[filePath].children.push(filePath)
    }
  })

  return res
}

function enumerateFiles<T>(structure: FolderStructure<T>): string[] {
  return Object.keys(structure).filter(filePath => !structure[filePath].children)
}

function enumerateRootItems<T>(structure: FolderStructure<T>): string[] {
  return Object.keys(structure).filter(filePath => !filePath.includes('/'))
}

export {
  getStructure,
  reverseStructure,
  combineStructures,
  enumerateFiles,
  enumerateRootItems,
  FolderStructure,
}
