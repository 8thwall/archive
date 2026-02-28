import React from 'react'
import {createUseStyles} from 'react-jss'
import {Modal} from 'semantic-ui-react'
import type {DeepReadonly} from 'ts-essentials'

import {Icon} from '../../ui/components/icon'
import {combine} from '../../common/styles'
import {isMac} from '../device-models'
import {
  brandBlack, brandWhite, eggshell, gray1, gray2, gray3, gray4, mint, moonlight,
} from '../../static/styles/settings'
import {Tag} from '../../ui/components/tag'
import {
  escapeRegExp, SearchResult, truncateLine, TruncateResult,
} from '../code-search-index'
import {Badge} from '../../ui/components/badge'
import {getAllMatches} from '../get-all-matches'
import {isAssetPath} from '../../common/editor-files'
import {UiThemeProvider} from '../../ui/theme'
import {extractScopedLocation, deriveLocationKey, ScopedFileLocation} from '../editor-file-location'
import {useDismissibleModal} from '../dismissible-modal-context'
import {useCodeSearchContext} from './code-search-context'

const MOVEMENT_BY_KEY = {
  PageUp: -10,
  ArrowUp: -1,
  ArrowDown: 1,
  PageDown: 10,
} as const

const useStyles = createUseStyles({
  menu: {
    userSelect: 'none',
    maxHeight: '70vh',
    overflow: 'auto',
    backgroundColor: brandWhite,
    zIndex: '10',
    borderRadius: '0px 0px 8px 8px',
    display: 'block',
  },
  menuOption: {
    'cursor': 'pointer',
    'position': 'relative',
    'overflow': 'hidden',
    'padding': '0.5rem 1rem',
    '&:hover': {
      background: gray2,
    },
    '&:not(:last-child)': {
      borderBottom: `1px solid ${eggshell}`,
    },
  },
  noResultsMenu: {
    userSelect: 'none',
    color: gray3,
    padding: '1rem',
    height: '6rem',
    overflow: 'none',
    backgroundColor: moonlight,
    zIndex: '10',
    borderRadius: '0px 0px 8px 8px',
    display: 'block',
  },
  focusedOption: {
    background: gray1,
  },
  searchCombobox: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '52px',
    position: 'relative',
    color: brandBlack,
    boxSizing: 'border-box',
    background: brandWhite,
    borderRadius: '8px',
  },
  input: {
    'flex': '1 0 0',
    'minWidth': '0',
    'border': '0',
    'outline': 'none',
    'height': '24px',
    '&::placeholder': {
      color: gray3,
    },
  },
  cancel: {
    display: 'flex',
    outline: 'none',
    border: '0',
    background: 'transparent',
    margin: '0',
    color: gray3,
    cursor: 'pointer',
  },
  searchBar: {
    flex: '1 0 0',
    display: 'flex',
    padding: '12px',
    minHeight: '52px',
    gap: '0.5rem',
    minWidth: '3rem',
    borderBottom: `1px solid ${gray1}`,
    alignItems: 'center',
    color: gray3,
  },
  picker: {
    color: gray3,
    display: 'flex',
    minHeight: '52px',
    padding: '1rem',
    boxSizing: 'border-box',
    borderBottom: `1px solid ${gray1}`,
    alignItems: 'center',
    flexWrap: 'wrap',
    cursor: 'default',
    overflow: 'hidden',
    gap: '0.5rem',
  },
  divider: {
    backgroundColor: eggshell,
    color: gray4,
    padding: '0.1rem 1rem',
    fontStyle: 'italic',
  },
  codeText: {
    whiteSpace: 'pre-wrap',
  },
  codeHighlighted: {
    display: 'inline-block',
    backgroundColor: mint,
  },
  searchOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  lineNum: {
    color: gray4,
    marginLeft: 'auto',
  },
  highlineLine: {
    display: 'block',
    overflowWrap: 'anywhere',
  },
})

const CODES_PLACEHOLDER_MSG = 'Search for code...'
const FILES_PLACEHOLDER_MSG = 'Search for files...'
const DEFAULT_PLACEHOLDER_MSG = 'Search for files or code...'

type SearchModes = 'file' | 'code' | 'both'

type SearchValue = ScopedFileLocation & {
  lineNum?: number
  column?: number
}

type SearchComboboxOption = {
  value: SearchValue
  content: React.ReactNode
}

interface IHighlineLine {
  truncateResult: TruncateResult
  searchValue: string
}

const HighlightLine: React.FC<IHighlineLine> = ({truncateResult, searchValue}) => {
  const classes = useStyles()

  const res = truncateResult.pre
    ? [<span className={classes.codeText} key={-1}>{truncateResult.pre}</span>]
    : []

  // Trim all spaces up until the start of our match.
  const line = truncateResult.line.slice(0, truncateResult.start).trimLeft() +
    truncateResult.line.slice(truncateResult.start, truncateResult.line.length)

  // Regex matches either a) searchValue exactly or b) individual non-space words in searchValue
  // after it has been split on spaces. If safeSearchValue is empty then we have all spaces, so
  // just search for case a).
  const safeSearchValue = escapeRegExp(searchValue)
  const safeSearchValueWords = safeSearchValue.split(/\s/).filter(Boolean)
  const regex = safeSearchValueWords.length === 0
    ? safeSearchValue
    : `${safeSearchValue}|${safeSearchValueWords.join('|')}`

  // Find last index of the last occurence of the search term.
  // Marks the end index of line that has been added to `res` thus far.
  let end = 0
  const matches = getAllMatches(line, new RegExp(regex, 'gi'))
  matches.forEach((match) => {
    res.push(
      <span className={classes.codeText} key={end}>
        {line.substring(end, match.index)}
        <mark className={combine(classes.codeHighlighted, classes.codeText)}>
          {line.substring(match.index, match.index + match[0].length)}
        </mark>
      </span>
    )
    end = match.index + match[0].length
  })

  if (end !== line.length) {
    // Add the rest of the line - needed unless searchValue runs until to the end of the line.
    res.push(
      <span className={classes.codeText} key={end}>
        {line.substring(end, line.length)}
      </span>
    )
  }
  if (truncateResult.post) {
    res.push(<span className={classes.codeText} key={end + 1}>{truncateResult.post}</span>)
  }
  return <div className={classes.highlineLine}>{res}</div>
}

interface ICodeSearchOption {
  lineInfo: SearchResult
  searchValue: string
  truncateResult: TruncateResult
}

const CodeSearchOption: React.FC<ICodeSearchOption> = ({
  lineInfo, truncateResult, searchValue,
}) => {
  const classes = useStyles()
  return (
    <div className={classes.searchOption}>
      <Badge
        color={lineInfo.repoId ? 'blue' : 'gray'}
        height='small'
      >
        {lineInfo.repoId ? lineInfo.displayPath : lineInfo.filePath}
      </Badge>
      <HighlightLine truncateResult={truncateResult} searchValue={searchValue} />
      <span className={classes.lineNum}>{lineInfo.lineNum}</span>
    </div>
  )
}

const makeFileOptionId = (
  baseId: string, option: SearchComboboxOption
) => `${baseId}-file-${deriveLocationKey(extractScopedLocation(option.value))}`
const makeCodeOptionId = (
  baseId: string, option: SearchComboboxOption
) => `${baseId}-code-${deriveLocationKey(
  extractScopedLocation(option.value)
)}-${option.value.lineNum}`

const placeholderMsg = ((searchMode: SearchModes) => {
  if (searchMode === 'both') {
    return DEFAULT_PLACEHOLDER_MSG
  } else {
    return searchMode === 'code' ? CODES_PLACEHOLDER_MSG : FILES_PLACEHOLDER_MSG
  }
})

interface ISearchModal {
  onFileSelect: (selected: SearchValue) => void
  onModeChange: (mode?: SearchModes) => void
  onClose: () => void
  searchMode?: SearchModes
  openFiles: DeepReadonly<ScopedFileLocation[]>
  initialSearchValue?: string
  filterOutAssets?: boolean
}

const SearchModal: React.FC<ISearchModal> = ({
  onClose, onModeChange, onFileSelect, searchMode = 'both', openFiles, initialSearchValue = '',
  filterOutAssets = false,
}) => {
  useDismissibleModal(onClose)
  const classes = useStyles()
  const [focusedIndex, setFocusedIndex] = React.useState(-1)
  const [searchValue, setSearchValue] = React.useState(initialSearchValue)

  const {updateCodeSearch, getFileList, getCodeList} = useCodeSearchContext()

  React.useLayoutEffect(() => updateCodeSearch(), [])

  const fileList = getFileList(searchValue, openFiles)
  const codeList = getCodeList(searchValue)

  const id = 'search-modal'
  const inputId = `${id}-input`
  const buttonId = `${id}-button`
  const placeholderId = `${id}-placeholder`
  const fileListboxId = `${id}-file-listbox`
  const codeListboxId = `${id}-code-listbox`

  const filteredFileList = filterOutAssets
    ? fileList?.filter(
      option => (!isAssetPath(option.filePath))
    )
    : fileList

  const fileOptions: SearchComboboxOption[] = filteredFileList?.map(
    option => ({
      content: option.displayPath,
      value: {filePath: option.filePath, repoId: option.repoId},
    })
  )

  const codeOptions: SearchComboboxOption[] = codeList?.map(
    (option) => {
      const truncateResult = truncateLine(option.filePath, option.line, searchValue)
      return {
        content: <CodeSearchOption
          truncateResult={truncateResult}
          lineInfo={option}
          searchValue={searchValue}
        />,
        value: {
          filePath: option.filePath,
          repoId: option.repoId,
          lineNum: option.lineNum,
          column: truncateResult.start + 1,
        },
      }
    }
  )

  const allOptions = (() => {
    if (searchMode === 'both') {
      return fileOptions.concat(codeOptions)
    }
    return searchMode === 'code' ? codeOptions : fileOptions
  })()

  const hasOptions = allOptions?.length !== 0

  if (hasOptions && focusedIndex === -1) {
    setFocusedIndex(0)
  }

  const focusedId = (() => {
    if (focusedIndex === -1 || !hasOptions || focusedIndex >= allOptions.length) {
      return placeholderId
    } else if (focusedIndex < fileOptions.length && searchMode !== 'code') {
      return makeFileOptionId(id, allOptions[focusedIndex])
    } else {
      return makeCodeOptionId(id, allOptions[focusedIndex])
    }
  })()

  const menuRef = React.useRef<HTMLDivElement>()

  React.useLayoutEffect(() => {
    if (menuRef.current) {
      menuRef.current.querySelector(`.${classes.focusedOption}`)?.scrollIntoView({block: 'nearest'})
    }
  }, [focusedIndex])

  const handleOptionClick = (o: SearchComboboxOption) => {
    setFocusedIndex(-1)
    onFileSelect(o.value)
  }

  const getCodeIndex = (index: number) => (
    searchMode === 'both' ? fileOptions.length + index : index)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const {key, ctrlKey, metaKey, shiftKey} = e

    if (key === 'p' && (metaKey || ctrlKey)) {
      e.preventDefault()
      setFocusedIndex(fileOptions ? 0 : -1)
    } else if (key === 'f' && shiftKey && (metaKey || ctrlKey)) {
      e.preventDefault()
      setFocusedIndex(codeOptions ? 0 : -1)
    } else if (MOVEMENT_BY_KEY[key]) {
      e.preventDefault()
      const currentIndex = focusedIndex === -1 ? 0 : focusedIndex
      const goalIndex = currentIndex + MOVEMENT_BY_KEY[key]
      let newIndex = 0
      if (currentIndex === 0 && goalIndex < 0) {
        newIndex = allOptions.length - 1
      } else if (currentIndex === allOptions.length - 1 && goalIndex > allOptions.length - 1) {
        newIndex = 0
      } else {
        newIndex = Math.min(allOptions.length - 1, Math.max(0, goalIndex))
      }
      setFocusedIndex(newIndex)
    } else if (!searchValue && key === 'Backspace') {
      onModeChange('both')
    } else if (focusedIndex !== -1 && (key === 'Enter')) {
      e.preventDefault()
      handleOptionClick(allOptions[focusedIndex])
    }
  }

  const searchShortcut =
    isMac(navigator.userAgent, navigator.platform) ? '⌘+Shift+F' : 'Ctrl+Shift+F'
  const fileShortcut =
    isMac(navigator.userAgent, navigator.platform) ? '⌘P' : 'Ctrl+P'

  const searchTypePicker = (
    <div className={classes.picker}>
      <span>I&apos;m looking for </span>
      <Tag
        height='tiny'
        onClick={() => {
          onModeChange('code')
          setFocusedIndex(codeOptions ? 0 : -1)
        }}
      >Code ({searchShortcut})
      </Tag>
      <Tag
        height='tiny'
        onClick={() => {
          onModeChange('file')
          setFocusedIndex(fileOptions ? 0 : -1)
        }}
      >File ({fileShortcut})
      </Tag>
    </div>
  )

  const noResults = (
    <div className={classes.noResultsMenu}>
      No results found.
    </div>
  )

  return (
    <UiThemeProvider mode='light'>
      <Modal
        open
        onClose={onClose}
        closeOnDimmerClick
        centered={false}
        size='large'
        basic
      >
        <Modal.Content>
          <div className={classes.searchCombobox}>
            <div className={classes.searchBar}>
              <Icon stroke='search' />
              {(searchMode === 'code') &&
                <Tag height='tiny' onClick={() => onModeChange('both')} dismissible>Code</Tag>}
              {(searchMode === 'file') &&
                <Tag height='tiny' onClick={() => onModeChange('both')} dismissible>File</Tag>}
              <input
                id={inputId}
                className={classes.input}
                type='text'
                role='combobox'
                placeholder={placeholderMsg(searchMode)}
                value={searchValue}
                aria-autocomplete='list'
                aria-expanded='false'
                aria-controls={`${fileListboxId} ${codeListboxId}`}
                aria-activedescendant={focusedId}
                autoComplete='off'
                onChange={(e) => {
                  setFocusedIndex(-1)
                  setSearchValue(e.target.value)
                }}
                onKeyDown={handleKeyDown}
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
              />
              <button
                id={buttonId}
                className={classes.cancel}
                type='button'
                tabIndex={-1}
                aria-label={id}
                aria-expanded='true'
                aria-controls={`${fileListboxId} ${codeListboxId}`}
                onClick={onClose}
              >
                <Icon stroke='times' />
              </button>
            </div>
            {(searchMode === 'both' && !searchValue) && searchTypePicker}
            {hasOptions
              ? (
                <div ref={menuRef}>
                  {(searchMode !== 'code' && fileOptions.length !== 0) &&
                    <div>
                      {searchMode === 'both' &&
                        <div className={classes.divider}>
                          files
                        </div>}
                      <div
                        role='listbox'
                        className={classes.menu}
                        id={fileListboxId}
                        tabIndex={-1}
                      >
                        {/* NOTE(johnny): Disabling these rules because keyboard inputs/focus
                         is controlled by the combobox instead of each option. */}
                        {/* eslint-disable jsx-a11y/click-events-have-key-events  */}
                        {/* eslint-disable jsx-a11y/interactive-supports-focus */}
                        {fileOptions.map((o, i) => (
                          <div
                            key={makeFileOptionId(id, o)}
                            role='option'
                            id={makeFileOptionId(id, o)}
                            className={combine(
                              classes.menuOption,
                              focusedIndex === i && classes.focusedOption
                            )}
                            aria-selected={focusedIndex === i}
                            onClick={() => handleOptionClick(o)}
                          >
                            {o.content}
                          </div>
                        ))}
                      </div>
                    </div>
                  }
                  {(searchMode !== 'file' && codeOptions.length !== 0) &&
                    <div>
                      {searchMode === 'both' &&
                        <div className={classes.divider}>
                          code
                        </div>}
                      <div
                        role='listbox'
                        className={classes.menu}
                        id={codeListboxId}
                        tabIndex={-1}
                      >
                        {codeOptions.map((o, i) => (
                          <div
                            key={makeCodeOptionId(id, o)}
                            role='option'
                            id={makeCodeOptionId(id, o)}
                            className={combine(
                              classes.menuOption,
                              focusedIndex === getCodeIndex(i) && classes.focusedOption
                            )}
                            aria-selected={focusedIndex === getCodeIndex(i)}
                            onClick={() => handleOptionClick(o)}
                          >
                            {o.content}
                          </div>
                        ))}
                      </div>
                    </div>
                  }
                </div>
              )
              : noResults}
          </div>
        </Modal.Content>
      </Modal>
    </UiThemeProvider>
  )
}

export {
  SearchModal,
}

export type {
  SearchValue,
  SearchModes,
}
