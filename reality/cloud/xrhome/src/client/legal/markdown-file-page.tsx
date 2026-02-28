import React from 'react'
import ReactMarkdown from 'react-markdown'

import Page from '../widgets/page'
import {createThemedStyles} from '../ui/theme'
import AutoHeading from '../widgets/auto-heading'
import SpaceBelow from '../ui/layout/space-below'

const useStyles = createThemedStyles(theme => ({
  header: {
    fontFamily: theme.headingFontFamily,
    fontSize: '3em',
    fontWeight: 500,
    width: '100%',
  },
  mainText: {
    'fontFamily': theme.bodyFontFamily,
    '& h2': {
      fontFamily: theme.bodyFontFamily,
      fontSize: '1.5em',
      textAlign: 'center',
      lineHeight: '1.5em',
    },
    '& h3': {
      fontFamily: theme.bodyFontFamily,
      fontSize: '1.25em',
    },
    '& ul, ol': {
      'paddingInlineStart': '1.85rem',
      '& li': {
        marginTop: '0.5rem',
      },
    },
    '& ul': {
      '& li': {
        listStyle: 'none',
        marginTop: '0.5rem',
      },
    },
    '& table': {
      'borderCollapse': 'collapse',
      'margin': '1em 0',
      'width': '100%',
      '& th': {
        color: theme.tableHeadFg,
      },
      '& th, & td': {
        border: theme.tableBorder,
        padding: '0.5em',
      },
      '& thead, & th': {
        background: theme.tableHeadBg,
      },
    },
  },
}))

interface IMarkdownFilePage {
  markdownSource: string
  header: string
  title?: string
}

const MarkdownFilePage: React.FC<IMarkdownFilePage> = ({
  markdownSource, header, title,
}) => {
  const classes = useStyles()

  return (
    <Page title={title}>
      <SpaceBelow>
        <AutoHeading className={classes.header}>{header}</AutoHeading>
      </SpaceBelow>
      <div className={classes.mainText}>
        <ReactMarkdown
          source={markdownSource}
          escapeHtml={false}
        />
      </div>
    </Page>

  )
}

export {
  MarkdownFilePage,
}
