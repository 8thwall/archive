import React from 'react'
import {createUseStyles} from 'react-jss'

import {useSelector} from '../hooks'
import {tinyViewOverride} from '../static/styles/settings'

import KeywordLink from './keyword-link'
import type {Keyword} from '../../shared/discovery-types'

const useStyles = createUseStyles({
  row: {
    'padding': '24px 88px 32px 88px',
    'margin': '0 auto',
    'display': 'flex',
    'gap': '8px',
    'flexWrap': 'wrap',
  },
  scroll: {
    'paddingTop': '24px',
    'paddingBottom': '24px',
    'paddingLeft': '40px',
    'display': 'flex',
    'gap': '8px',
    'overflowX': 'scroll',
    'scrollbarWidth': 'none',
    'msOverflowStyle': 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    [tinyViewOverride]: {
      paddingLeft: '24px',
    },
    '&:after': {
      content: '""',
      paddingRight: '40px',
      [tinyViewOverride]: {
        paddingRight: '24px',
      },
    },
  },
})

interface IKeywords {
  allPathPrefix: string
  allKeyword: Keyword
  pathPrefix: string
}

const KeywordsRow = ({allPathPrefix, allKeyword, pathPrefix}: IKeywords) => {
  const classes = useStyles()
  const isSmallScreen = useSelector(state => state.common.isSmallScreen)
  const keywords = useSelector(state => state.discovery.keywords)

  return (
    <section className={isSmallScreen ? classes.scroll : classes.row}>
      <KeywordLink pathPrefix={allPathPrefix} keyword={allKeyword} />
      {keywords.map(keyword => (
        <KeywordLink
          pathPrefix={pathPrefix}
          keyword={keyword}
          key={keyword.name}
        />
      ))}
    </section>
  )
}

export default KeywordsRow
