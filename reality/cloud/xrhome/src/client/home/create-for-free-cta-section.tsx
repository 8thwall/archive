import React from 'react'
import {useTranslation} from 'react-i18next'

import {
  mobileWidthBreakpoint, tinyViewOverride,
} from '../static/styles/settings'
import {createThemedStyles} from '../ui/theme'
import {CreateForFreeCtaButton} from './create-for-free-cta-button'

const useStyles = createThemedStyles(theme => ({
  section: {
    padding: '4em 2em',
    fontSize: '16px',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'center',
    gap: '2em',
    position: 'relative',
    overflow: 'hidden',
  },
  headingContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5em',
    maxWidth: mobileWidthBreakpoint,
    alignItems: 'center',
    zIndex: 2,
  },
  heading: {
    color: theme.fgMuted,
    fontFamily: theme.headingFontFamily,
    fontSize: '3.5em',
    fontWeight: 700,
    textAlign: 'center',
    lineHeight: '1em',
    [tinyViewOverride]: {
      fontSize: '1.5em',
    },
  },
  description: {
    fontFamily: theme.subHeadingFontFamily,
    color: theme.fgMuted,
    [tinyViewOverride]: {
      fontSize: '0.825em',
    },
  },
  graphic: {
    position: 'absolute',
    top: '4em',
  },
}))

const CreateForFreeCtaSection: React.FC = () => {
  const classes = useStyles()
  const {t} = useTranslation(['public-featured-pages'])

  return (
    <div className={classes.section}>
      <div className={classes.headingContainer}>
        <div className={classes.heading}>
          {t('home_page.create_for_free_cta.heading')}
        </div>
        <div className={classes.description}>
          {t('home_page.create_for_free_cta.subheading')}
        </div>
        <CreateForFreeCtaButton />
      </div>
      {/* eslint-disable max-len */}
      <svg className={classes.graphic} xmlns='http://www.w3.org/2000/svg' width='1440' height='422' viewBox='0 0 1440 422' fill='none'>
        <g filter='url(#filter0_f_932_2935)'>
          <path d='M720 100C1118.75 100 1442 322 1442 322L720 322L-2 322C-2 322 321.25 100 720 100Z' fill='url(#paint0_radial_932_2935)' fillOpacity='0.35' />
        </g>
        <defs>
          <filter id='filter0_f_932_2935' x='-102' y='0' width='1644' height='422' filterUnits='userSpaceOnUse' colorInterpolationFilters='sRGB'>
            <feFlood floodOpacity='0' result='BackgroundImageFix' />
            <feBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
            <feGaussianBlur stdDeviation='50' result='effect1_foregroundBlur_932_2935' />
          </filter>
          <radialGradient id='paint0_radial_932_2935' cx='0' cy='0' r='1' gradientTransform='matrix(8.12719e-05 336.149 -1093.38 14.6132 720 100)' gradientUnits='userSpaceOnUse'>
            <stop offset='0.137016' stopColor='#FFF806' />
            <stop offset='0.560507' stopColor='#AD50FF' />
            <stop offset='1' stopColor='#57BFFF' />
          </radialGradient>
        </defs>
      </svg>
      {/* eslint-ensable max-len */}
    </div>
  )
}

export {CreateForFreeCtaSection}
