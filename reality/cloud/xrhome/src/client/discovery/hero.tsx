import React from 'react'
import {useTranslation} from 'react-i18next'

import {combine} from '../common/styles'
import {useLoadedImage} from '../hooks/use-loaded-image'
import {
  brandWhite,
  tinyViewOverride,
  brandBlack,
  smallMonitorViewOverride,
  gray5,
  gray6,
} from '../static/styles/settings'
import {ALL_KEYWORD, VIEW_ALL_KEYWORD} from '../../shared/discovery-constants'
import {getDiscoveryHeroUrl} from '../../shared/discovery-utils'
import type {Keyword} from '../../shared/discovery-types'
import {createCustomUseStyles} from '../common/create-custom-use-styles'
import type {UiTheme} from '../ui/theme'

const useStyles = createCustomUseStyles<{imgUrl: string}>()((theme: UiTheme) => ({
  'heroSection': {
    'backgroundColor': brandBlack,
    'color': brandWhite,
    'width': '100%',
    'height': '340px',
    'display': 'flex',
    'flexDirection': 'column',
    'justifyContent': 'center',
    'backgroundSize': 'cover',
    'backgroundRepeat': 'no-repeat',
    'backgroundPosition': 'center center',
    '@media (max-width: 450px)': {
      height: '220px',
    },
  },
  'heroImg': {
    'backgroundImage': ({imgUrl}) => `url(${imgUrl})`,
  },
  'heroContent': {
    'maxWidth': '700px',
    'margin': '0 10%',
    'display': 'flex',
    'flexDirection': 'column',
    'alignItems': 'flex-start',
    '& h1': {
      fontFamily: theme.headingFontFamily,
      fontWeight: 900,
      fontSize: '40px',
      lineHeight: 1.446,
    },
    '& p': {
      fontFamily: theme.bodyFontFamily,
      fontWeight: 500,
      fontSize: '20px',
      lineHeight: 1.5,
    },
    [smallMonitorViewOverride]: {
      'margin': '0 7%',
      '& h1': {
        fontSize: '36px',
      },
      '& p': {
        fontSize: '18px',
      },
    },
    [tinyViewOverride]: {
      'margin': '0 7%',
      '& h1': {
        fontSize: '32px',
      },
      '& p': {
        fontSize: '16px',
      },
    },
    '@media (max-width: 450px)': {
      '& p': {
        fontSize: '16px',
      },
    },
  },
  'animate': {
    animation: '$loadBreathe 1s ease-in-out infinite alternate both',
    backgroundColor: gray6,
  },
  '@keyframes loadBreathe': {
    from: {
      background: gray6,
    },
    to: {
      background: gray5,
    },
  },
}))

interface IHero {
  activeKeyword: Keyword
}

const Hero = ({activeKeyword = ALL_KEYWORD}: IHero) => {
  const {name, descriptionTranslationKey, heroId, nameTranslationKey} = activeKeyword
  const imgUrl = getDiscoveryHeroUrl(heroId, {size: 'large'})
  const loadedImg = useLoadedImage(imgUrl)
  const classes = useStyles({imgUrl})
  const {t} = useTranslation(['public-featured-pages'])
  const bgClass = typeof window !== 'undefined' && loadedImg ? classes.heroImg : classes.animate

  return (
    <section
      className={combine(classes.heroSection, bgClass)}
    >
      <div className={classes.heroContent}>
        <h1>
          {(name === ALL_KEYWORD.name || name === VIEW_ALL_KEYWORD.name)
            ? t('discovery_page.header')
            : t(nameTranslationKey)
          }
        </h1>
        <p>{t(descriptionTranslationKey)}</p>
      </div>
    </section>
  )
}

export default Hero
