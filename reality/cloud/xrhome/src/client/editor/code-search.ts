import FlexSearch from 'flexsearch'
import type {DeepReadonly} from 'ts-essentials'

import type {IGitFile} from '../git/g8-dto'
import {isAssetPath, isHiddenPath} from '../common/editor-files'
import type {ScopedFileLocation} from './editor-file-location'
import {getSearchResult, SearchResult} from './code-search-index'
import type {IMultiRepoContext} from './multi-repo-context'
import type {IDependencyContext} from './dependency-context'

type IndexedFileInfo = {
  timestamp: Date
  numLines: number
  location: ScopedFileLocation
}

interface CodeSearchIndex {
  update: (
    gitFiles: DeepReadonly<IGitFile[]>,
    multiRepoContext: IMultiRepoContext,
    dependencyContext: IDependencyContext,
  ) => any
  search: (searchValue: string, limit: number) => SearchResult[]
}

const createCodeSearchIndex = (): CodeSearchIndex => {
  // Index for searching for lines of code in files. Returns string of form `lineNum-filePath`.
  const index_: FlexSearch.Index = new FlexSearch.Index({
    // This takes more memory but performs better than other options.
    tokenize: 'full',
    cache: 100,
    resolution: 9,
    // To lowercase, then split on spaces, including the space as a word.
    //   - Example: "Hello/ <8th> {Wall}" => ["hello/", " ", "<8th>", " ", "{wall}"]
    // Gives better matches than splitting on spaces but not including the space as a word or the
    // whole line being used as a single word.
    encode(str) {
      return str.toLowerCase().split(/(\s+)/)
    },
  })
  // Maps from `lineNum-filePath` to the line of code in filePath at lineNum.
  const lineKeyToLine_: Record<string, string> = {}
  // NOTE(johnny): Maps from displayPath to IndexedFileInfo.
  // timestamp: Timestamp of the file when we last indexed it.
  // numLines: How many lines the file was.
  // location: Repo scoped location of the file.
  const displayPathToIndexedInfo_: Record<string, IndexedFileInfo> = {}

  // Creates a `lineKey` key.
  const makeLineKey = (
    lineNum: number,
    filePath: string
  ): string => `${lineNum}-${filePath}`

  // Gets line info from a `lineKey` key.
  const lineInfoFromKey = (lineKey: string): SearchResult => {
    const separator = lineKey.indexOf('-')
    const lineNum = parseInt(lineKey.substring(0, separator), 10)
    const displayPath = lineKey.substring(separator + 1, lineKey.length)
    const indexedFileInfo = displayPathToIndexedInfo_[displayPath]

    return {
      lineNum,
      ...indexedFileInfo.location,
      displayPath,
      line: lineKeyToLine_[lineKey],
    }
  }

  // Remove displayPath from index, lineKeyToLine, and displayPathToIndexedFileInfo.
  const removeFile = (displayPath: string) => {
    if (displayPath in displayPathToIndexedInfo_) {
      for (let i = 1; i < displayPathToIndexedInfo_[displayPath].numLines + 1; i++) {
        const lineKey = makeLineKey(i, displayPath)
        index_.remove(lineKey)
        delete lineKeyToLine_[lineKey]
      }
      delete displayPathToIndexedInfo_[displayPath]
    }
  }

  /**
   * Adds each line for the file to the index. Also record the key we used in the index to
   * the line of text it corresponds to in lineKeyToLine.
   * @param displayPath The file to add.
   * @param timestamp The timestamp when this file was last updated.
   * @param lines The lines of text in `filePath`.
   * @param location The repo scoped location of the file.
   */
  const addFile = (
    displayPath: string,
    location: ScopedFileLocation,
    timestamp: Date,
    rawLines: string
  ) => {
    if (displayPath in displayPathToIndexedInfo_) {
      removeFile(displayPath)
    }

    const lines = rawLines.split('\n')
    displayPathToIndexedInfo_[displayPath] = {
      timestamp,
      location,
      numLines: lines.length,
    }

    lines.forEach((rawLine, i) => {
      // Line numbers start at 1.
      const lineNum = i + 1
      const line = rawLine.slice(0, 500)
      const lineKey = makeLineKey(lineNum, displayPath)
      lineKeyToLine_[lineKey] = line
      index_.add(lineKey, line)
    })
  }

  /**
   * Updates the index with a list of `gitFiles` that may or may not have changed.
   * @param gitFiles Files that may or may not have changed.
   * @param multiRepoContext Multi repo context (for multi repo)
   * @param dependencyContext Dependency context (for multi repo)
   */
  const update = (
    gitFiles: DeepReadonly<IGitFile[]>,
    multiRepoContext: IMultiRepoContext,
    dependencyContext: IDependencyContext
  ) => {
    const files = gitFiles.filter(element => !element.isDirectory &&
      !isAssetPath(element.filePath) && !isHiddenPath(element.filePath))
    const searchResults = files.map(file => ({
      ...getSearchResult(file, multiRepoContext, dependencyContext),
      timestamp: file.timestamp,
      content: file.content,
    }))

    // First find and remove any files we're tracking that are no longer present in `gitFiles`.
    const fileNames = new Set(searchResults.map(result => result.displayPath))

    Object.keys(displayPathToIndexedInfo_).filter(
      f => !fileNames.has(f)
    ).forEach(removeFile)

    // Then check if there are new files or if files have been modified.
    searchResults.forEach((result) => {
      const {displayPath} = result
      const seenFile = displayPath in displayPathToIndexedInfo_
      const seenFileNeedsUpdate =
        seenFile && result.timestamp > displayPathToIndexedInfo_[displayPath].timestamp
      // Update the index for this file if 1) it's not in the index or 2) it's been modified.
      if (!seenFile || seenFileNeedsUpdate) {
        addFile(displayPath,
          {filePath: result.filePath, repoId: result.repoId},
          result.timestamp, result.content)
      }
    })
  }

  // Searches the index and returns a list of search results.
  const search = (searchValue: string, limit: number): SearchResult[] => index_.search(
    searchValue, {suggest: false, limit}
  ).map(
    lineKey => lineInfoFromKey(lineKey)
  )

  return {
    update, search,
  }
}

export {createCodeSearchIndex}

export type {
  CodeSearchIndex,
}
