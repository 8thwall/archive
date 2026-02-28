import React, {useMemo} from 'react'
import {useTranslation} from 'react-i18next'
import {Link} from 'react-router-dom'

import {createThemedStyles} from '../ui/theme'
import CodeHighlight, {filenameToLanguage} from '../browse/code-highlight'
import {Icon} from '../ui/components/icon'
import {useBrand8QaContext} from '../brand8/brand8-qa-context'

const useStyles = createThemedStyles(theme => ({
  fileBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5em',
    border: theme.listBoxBorder,
    borderRadius: '0.5em',
    overflow: 'hidden',
  },
  blockHeaderBar: {
    backgroundColor: theme.bgMuted,
    borderBottom: theme.listBoxBorder,
    padding: '0.5em 1em 0.25em 1em',
    fontSize: '14px',
    justifyContent: 'space-between',
    display: 'flex',
  },
  blockFooterBar: {
    'backgroundColor': theme.bgMuted,
    'color': theme.fgMain,
    'borderTop': theme.listBoxBorder,
    'borderBottom': 'none',
    'borderLeft': 'none',
    'borderRight': 'none',
    'padding': '0.5em 1em 0.5em 1em',
    'fontSize': '12px',
    'alignItems': 'center',
    'display': 'flex',
    'gap': '0.5em',
    'cursor': 'pointer',
    '&:hover': {
      backgroundColor: theme.secondaryBtnHoverBg,
    },
  },
  blockHeaderBarLink: {
    'color': theme.fgMain,
    '&:hover': {
      color: theme.fgPrimary,
      textDecoration: 'underline',
    },
  },
  codeHighlight: {
    'border': theme.listBoxBorder,
    'borderRadius': theme.codeSearchResultBorderRadius,
    'margin': '0.25em',
    'backgroundColor': theme.bgMain,
    '& span': {
      'fontSize': '0.875em',
      'lineHeight': '1em',
    },
    '& a': {
      'fontSize': '0.875em',
    },
    '& pre': {
      'margin': '0',
      'padding': '0.5em',
      'overflowX': 'scroll',
      'scrollbar-width': 'auto',
      'lineHeight': '1.25em',
      'borderRadius': theme.codeSearchResultBorderRadius,

      '&::-webkit-scrollbar': {
        background: theme.bgMuted,
        borderRadius: theme.codeSearchResultBorderRadius,
      },
      '&::-webkit-scrollbar-thumb': {
        background: theme.fgMuted,
        borderRadius: theme.codeSearchResultBorderRadius,
      },
    },
  },
}))

const getStartingLineNumber = (match: string, fileContent: string, maxLines: number) => {
  const matchIndex = fileContent.indexOf(match)
  if (matchIndex === -1) {
    return null
  }
  const beforeMatch = fileContent.substring(0, matchIndex)
  const initialLineNumber = beforeMatch.split('\n').length
  const middleOfMatch = initialLineNumber + Math.floor(match.split('\n').length / 2)

  // Center the match in the middle of the highlighted lines
  return Math.max(0, middleOfMatch - Math.floor(maxLines / 2))
}

const getHighlightedLines = (fileContent: string, lineNumber: number, maxLines: number) => {
  const lines = fileContent.split('\n')
  const startLine = Math.max(0, lineNumber)
  const endLine = Math.min(lines.length, startLine + maxLines)

  return lines.slice(startLine, endLine).join('\n')
}

interface ICodeResultsBlock {
  fileName: string
  fileContent: string
  matches: readonly string[]
  maxLines?: number
  publicPathToFile?: string
}

const CodeResultsBlock: React.FC<ICodeResultsBlock> = ({
  fileName, matches, fileContent, maxLines = 5, publicPathToFile = undefined,
}) => {
  const classes = useStyles()
  const {t} = useTranslation(['public-featured-pages'])
  const [isExpanded, setIsExpanded] = React.useState(false)
  const {modeOverride} = useBrand8QaContext()
  const themeMode = modeOverride === 'brand8dark' ? 'dark' : 'light'

  const displayedMatches = useMemo(() => (
    isExpanded ? matches : matches.slice(0, 1)
  ), [matches, isExpanded])

  return (
    <div className={classes.fileBlock}>
      <div className={classes.blockHeaderBar}>
        {publicPathToFile
          ? (
            <Link
              className={classes.blockHeaderBarLink}
              to={publicPathToFile}
            >
              {fileName}
            </Link>
          )
          : (
            <span>{fileName}</span>
          )}
      </div>
      {displayedMatches.map((match) => {
        const lineNumber = getStartingLineNumber(match, fileContent, maxLines) || 0
        return (
          <div className={classes.codeHighlight} key={`${fileName}-${lineNumber}`}>
            <CodeHighlight
              content={getHighlightedLines(fileContent, lineNumber, maxLines)}
              language={filenameToLanguage(fileName)}
              lineOffset={lineNumber}
              pathToFile={publicPathToFile}
              themeMode={themeMode}
            />
          </div>
        )
      })}
      {matches.length > 1 &&
        <button
          type='button'
          className={classes.blockFooterBar}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {!BuildIf.PROJECT_LIBRARY_REVAMP_20250929 && (
            <Icon stroke={isExpanded ? 'collapseView' : 'expandView'} />
          )}
          <span>
            {isExpanded
              ? t('project_library_page.show_less')
              : t('project_library_page.show_more_results', {count: matches.length - 1})
            }
          </span>
        </button>
      }
    </div>
  )
}

export {
  CodeResultsBlock,
}
