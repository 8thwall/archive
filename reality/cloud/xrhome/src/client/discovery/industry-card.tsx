import React from 'react'
import {Link} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import type {Keyword} from '../../shared/discovery-types'
import {getIndustryCardUrl} from '../../shared/discovery-utils'
import {createThemedStyles} from '../ui/theme'
import {StandardContainer} from '../ui/components/standard-container'

const useStyles = createThemedStyles(theme => ({
  industryCard: {
    'display': 'flex',
    'width': '20rem',
    'flex': '0 0 auto',
    'borderRadius': '0.5em',
    'transition': [['all', '0.08s', 'linear']],
    '&:hover': {
      transform: 'scale(1.02)',
    },
  },
  cover: {
    'display': 'block',
    'width': '100%',
    'aspectRatio': '16/9',
    'objectFit': 'cover',
  },
  title: {
    'padding': '1.4rem',
    'textAlign': 'center',
    'fontFamily': theme.headingFontFamily,
    'fontWeight': '900',
    'fontSize': '16px',
    'lineHeight': '26px',
    'color': theme.fgMain,
    'whiteSpace': 'nowrap',
  },
}))

interface IIndustry {
  pathPrefix: string
  keyword: Keyword
}

const IndustryCard = ({pathPrefix, keyword}: IIndustry) => {
  const {industryId, nameTranslationKey} = keyword
  const styles = useStyles()
  const {t} = useTranslation(['public-featured-pages'])

  const keywordPath = keyword.slug?.toLocaleLowerCase() || keyword.name.toLocaleLowerCase()
  const linkTo = `/${pathPrefix}/${keywordPath}`
  const imgUrl = getIndustryCardUrl(industryId, {size: 'medium'})

  return (
    <Link
      to={linkTo}
      className={styles.industryCard}
      a8={`click;discover;click-industry-carousel-${keywordPath}`}
    >
      <StandardContainer padding='none'>
        <img
          alt={t(nameTranslationKey)}
          draggable={false}
          src={imgUrl}
          className={styles.cover}
        />
        <div className={styles.title}>{t(nameTranslationKey)}</div>
      </StandardContainer>
    </Link>
  )
}

export default IndustryCard
