import React, {useContext} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import {combine, bool} from '../common/styles'
import type {Keyword} from '../../shared/discovery-types'
import {DiscoveryContext} from './discovery-context'
import {KEYWORD_SEARCH_PARAM, TECHNOLOGIES} from '../../shared/discovery-constants'
import {encodeQueryParam} from '../../shared/discovery-utils'
import {useDiscoveryKey} from '../hooks/use-discovery-key'
import DiscoveryHomeIcon from './discovery-home-icon'
import {createThemedStyles} from '../ui/theme'

const ENCODED_TECHNOLOGIES = new Set(TECHNOLOGIES.map(t => encodeQueryParam(t.name)))

const useStyles = createThemedStyles(theme => ({
  keywordLink: {
    'border': '1px solid',
    'fontWeight': '400',
    'borderRadius': '6px',
    'padding': '7px 16px',
    '--keyword-link-color': theme.fgMuted,
    'borderColor': 'var(--keyword-link-color)',
    'color': 'var(--keyword-link-color)',
    'white-space': 'nowrap',
    'display': 'flex',
    'justifyContent': 'center',
    'alignItems': 'center',
    '&:hover': {
      'color': 'var(--keyword-link-color)',
      'borderColor': 'var(--keyword-link-color)',
    },
    '&:hover:not($selected)': {
      '--keyword-link-color': theme.fgMain,
    },
  },
  selected: {
    '--keyword-link-color': theme.fgPrimary,
  },
}))

interface IKeywordLink {
  pathPrefix: string
  keyword: Keyword
}

const KeywordLink = ({pathPrefix, keyword}: IKeywordLink) => {
  const classes = useStyles()
  const location = useLocation()
  const {pageName} = useContext(DiscoveryContext)
  const currentKey = useDiscoveryKey()
  const {t} = useTranslation(['public-featured-pages'])
  const keywordPath = keyword.slug?.toLocaleLowerCase() || keyword.name.toLocaleLowerCase()
  const isSelected = keyword.name === currentKey.name

  const getLinkTo = () => {
    const searchParams = new URLSearchParams(location.search)
    const keywordValues = searchParams.getAll(KEYWORD_SEARCH_PARAM)
    if (keywordValues.length !== 1 || !ENCODED_TECHNOLOGIES.has(keywordValues[0])) {
      searchParams.delete(KEYWORD_SEARCH_PARAM)
    }
    const searchParamString = searchParams.toString() ? `?${searchParams.toString()}` : ''

    if (keywordPath === 'all') {
      return `/${pathPrefix}${searchParamString}`
    }
    return `/${pathPrefix}/${keywordPath}${searchParamString}`
  }

  return (
    <Link
      className={combine(classes.keywordLink, bool(isSelected, classes.selected))}
      to={decodeURIComponent(getLinkTo())}
      a8={`click;${pageName};click-keyword-${keywordPath}`}
    >
      {keyword.name === 'home' ? <DiscoveryHomeIcon /> : t(keyword.nameTranslationKey)}
    </Link>
  )
}

export default KeywordLink
