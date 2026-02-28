import type {DeepReadonly} from 'ts-essentials'

import {isHiddenPath} from '../common/editor-files'
import type {IGitFile} from '../git/g8-dto'
import type {CodeSearchIndex} from './code-search'
import type {IDependencyContext} from './dependency-context'
import {deriveLocationKey, ScopedFileLocation} from './editor-file-location'
import type {IMultiRepoContext} from './multi-repo-context'

const CODE_SEARCH_LIMIT_MAXIMUM = 100
const MIN_CHARS = 50
const MAX_CHARS = 115

type TruncateResult = {
  line: string
  pre: string
  post: string
  start: number
}

type SearchResult = ScopedFileLocation & {
  displayPath: string
  lineNum?: number
  line?: string
}

const getSearchResult = (
  file: ScopedFileLocation,
  multiRepoContext?: IMultiRepoContext,
  dependencyContext?: IDependencyContext
): SearchResult => {
  const {repoId, filePath} = file
  const appTitle = multiRepoContext?.repoIdToTitle[multiRepoContext?.primaryRepoId]

  if (!multiRepoContext || !dependencyContext || !appTitle) {
    return {
      displayPath: filePath,
      filePath,
    }
  } else if (!repoId || multiRepoContext.primaryRepoId === repoId) {
    return {
      displayPath: `${appTitle}/${filePath}`,
      filePath,
    }
  } else {
    const depId = multiRepoContext.repoIdToDependencyId[repoId]
    const dependencyPath = dependencyContext.dependencyIdToPath[depId]
    const {alias} = dependencyContext.dependenciesByPath[dependencyPath]
    return {
      displayPath: `${alias}/${filePath}`,
      filePath,
      repoId,
    }
  }
}

const compareDate = (a: IGitFile, b: IGitFile) => (
  a.timestamp.valueOf() < b.timestamp.valueOf() ? 1 : -1
)

const findFiles = (
  searchText: string,
  gitFiles: DeepReadonly<IGitFile[]>,
  openFiles: DeepReadonly<ScopedFileLocation[]>,
  multiRepoContext: IMultiRepoContext,
  dependencyContext: IDependencyContext
): SearchResult[] => {
  const searchOptions: ScopedFileLocation[] = searchText
    ? gitFiles.filter(element => !element.isDirectory &&
      element.filePath.toLowerCase().includes(searchText.toLowerCase()))
      .sort(compareDate)
      .map(file => ({filePath: file.filePath, repoId: file.repoId}))
    : Object.values(Array.from(openFiles)
      .reduce((uniqueFileList, file) => {
        const key = deriveLocationKey(file)
        const repoId = file.repoId || multiRepoContext.primaryRepoId
        const isValidFile = !isHiddenPath(file.filePath) && !uniqueFileList[key] &&
        gitFiles.some(
          gitFile => gitFile.repoId === repoId && gitFile.filePath === file.filePath
        )
        if (isValidFile) {
          uniqueFileList[key] = file
        }
        return uniqueFileList
      }, {}))

  return searchOptions.map(option => getSearchResult(
    {filePath: option.filePath, repoId: option?.repoId}, multiRepoContext, dependencyContext
  ))
}

// Escapes all special characters in a string so you can use the string as a regex expression.
const escapeRegExp = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
   * Truncates a string to a max character limit, centering the truncation on an input search term.
   * @param filePath The file path.
   * @param line The input line.
   * @param searchValue The search ter  m in the line to truncate the line around.
   * @returns `line` The truncated line.
   * @returns `pre` A string to prefix the truncated line with.
   * @returns `post` A string to postfix the truncated line with.
   * @returns `start` The start index of the search term in the line.
   */
const truncateLine = (filePath: string, line: string, searchValue: string): TruncateResult => {
  // TODO(paris): Could calculate the size of the div and compute maxChars from that.
  const maxChars = Math.max(MIN_CHARS, MAX_CHARS - filePath.length)
  // Find the first occurence of our search term.
  const patt = new RegExp(escapeRegExp(searchValue), 'gi')
  let match = patt.exec(line)
  if (!match) {
    return {line: line.substr(0, maxChars), pre: '', post: '', start: 0}
  }
  // Starting index of the first occurence of the search term.
  const start = match.index

  // Line is short enough, don't need to truncate.
  if (line.length <= maxChars) {
    return {line, pre: '', post: '', start}
  }

  // Find last index of the last occurence of the search term.
  let end = start
  // eslint-disable-next-line no-cond-assign
  while (match = patt.exec(line)) {
    end = patt.lastIndex
  }

  let truncatedStart = 0
  if (end - start <= maxChars) {
    // If can fit all text containing all occurrences of search term, expand out equally on
    // both sides.
    const remaining = maxChars - (end - start)
    truncatedStart = Math.max(0, start - (remaining / 2))
  } else {
    // We can't fit all text containing all search terms, just take as much text as we can,
    // starting from the first search term.
    truncatedStart = start
  }

  return {
    start,
    line: line.substr(truncatedStart, maxChars),
    pre: truncatedStart === 0 ? '' : '...',
    post: truncatedStart + maxChars >= line.length ? '' : '...',
  }
}

const findCodes = (searchValue: string, index: CodeSearchIndex): SearchResult[] => {
  if (searchValue === '' || !index) {
    return []
  } else {
    return index.search(searchValue, CODE_SEARCH_LIMIT_MAXIMUM)
  }
}

export {
  getSearchResult,
  escapeRegExp,
  findFiles,
  findCodes,
  truncateLine,
}

export type {
  SearchResult,
  TruncateResult,
}
