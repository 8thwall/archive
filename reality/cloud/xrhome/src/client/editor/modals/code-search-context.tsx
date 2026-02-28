import React from 'react'
import type {DeepReadonly} from 'ts-essentials'

import {createCodeSearchIndex} from '../code-search'
import {useOpenGits} from '../../git/hooks/use-open-gits'
import {isHiddenPath} from '../../common/editor-files'
import {useDependencyContext} from '../dependency-context'
import {useMultiRepoContext} from '../multi-repo-context'
import {findCodes, findFiles, SearchResult} from '../code-search-index'
import type {ScopedFileLocation} from '../editor-file-location'

interface ICodeSearchContext {
  getFileList: (
    searchValue: string, openFiles: DeepReadonly<ScopedFileLocation[]>
  ) => SearchResult[]
  getCodeList: (searchValue: string) => SearchResult[]
  updateCodeSearch: () => void
}

const CodeSearchContext = React.createContext<ICodeSearchContext | null>(null)

const CodeSearchContextProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const gitFiles = useOpenGits(git => git.files)
    .map(files => files.filter(file => !isHiddenPath(file.filePath)))
    .flat()
  const dependencyContext = useDependencyContext()
  const multiRepoContext = useMultiRepoContext()

  const [codeSearchIndex] = React.useState(createCodeSearchIndex)

  const updateCodeSearch = () => {
    codeSearchIndex.update(gitFiles, multiRepoContext, dependencyContext)
  }

  React.useEffect(() => {
    updateCodeSearch()
  }, [])

  const value: ICodeSearchContext = {
    getFileList: (searchValue, openFiles) => findFiles(
      searchValue, gitFiles, openFiles, multiRepoContext, dependencyContext
    ),
    getCodeList: searchValue => findCodes(searchValue, codeSearchIndex),
    updateCodeSearch,
  }

  return <CodeSearchContext.Provider value={value}>{children}</CodeSearchContext.Provider>
}

const useCodeSearchContext = () => React.useContext(CodeSearchContext)

export {
  CodeSearchContextProvider,
  useCodeSearchContext,
}
