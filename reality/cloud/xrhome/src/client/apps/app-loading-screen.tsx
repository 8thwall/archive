import React from 'react'
import {useTranslation} from 'react-i18next'

import {
  useAppLoadingProgress,
  useAppLoadingCoverImage,
} from './widgets/loading-screen/app-loading-screen-context'
import {createThemedStyles, UiThemeProvider} from '../ui/theme'
import {headerSanSerif, tinyViewOverride, mobileViewOverride} from '../static/styles/settings'
import {useOnboardingStyles} from '../accounts/onboarding/account-onboarding-styles'
import {
  useOnboardingStyles as useOnboardingStylesOld,
} from '../accounts/onboarding/account-onboarding-styles-old'
import {combine} from '../common/styles'
import {hexColorWithAlpha} from '../../shared/colors'
import {brandWhite} from '../static/styles/settings'
import {AppLoadingBar} from './widgets/loading-screen/app-loading-bar'

const useStyles = createThemedStyles(theme => ({
  'appLoadingScreenContainer': {
    width: '100%',
    color: theme.fgMain,
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    zIndex: 2,
    gap: '2.5em',
  },
  'appCoverImage': {
    width: '45em',
    padding: 0,
    aspectRatio: '16/9',
    [tinyViewOverride]: {
      width: '100%',
    },
  },
  'formWrapper': {
    overflow: 'hidden',
    maxWidth: 'unset',
  },
  'textContainer': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1em',
  },
  'loadingSubheading': {
    fontFamily: 'Mozilla Headline, sans-serif',
    fontWeight: 600,
    fontSize: '2.9em',
    margin: '0',
    lineHeight: '2em',
    [mobileViewOverride]: {
      lineHeight: '1em',
    },
  },
  'loadingSubheadingOld': {
    fontFamily: `${headerSanSerif} !important`,
    fontWeight: 600,
    fontSize: '2.9em',
    margin: '0',
    lineHeight: '2em',
    [mobileViewOverride]: {
      lineHeight: '1em',
    },
  },
  'loadingTextBlurb': {
    fontFamily: 'Geist Mono, monospace',
    fontWeight: 400,
    fontSize: '1.2em',
  },
  'loadingTextBlurbOld': {
    fontWeight: 400,
    fontSize: '1.2em',
  },
  'shimmer': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    background: (
      // eslint-disable-next-line max-len
      `linear-gradient(120deg, transparent 30%, ${hexColorWithAlpha(brandWhite, 0.5)} 50%, transparent 70%)`
    ),
    backgroundSize: '200% 100%',
    animation: '$shimmer 2.5s infinite',
  },
  '@keyframes shimmer': {
    from: {backgroundPosition: '100% 0'},
    to: {backgroundPosition: '-100% 0'},
  },
}))

interface IAppLoadingScreen {
  darkMode?: boolean
  isNewBranding?: boolean
}

const LoadingScreen: React.FC<{isNewBranding?: boolean}> = ({isNewBranding}) => {
  const {t} = useTranslation(['app-pages'])
  const classes = useStyles()
  const isBrand8 = isNewBranding
  const oldOnboardingClasses = useOnboardingStylesOld()
  const newOnboardingClasses = useOnboardingStyles()
  const onboardingClasses = isBrand8 ? newOnboardingClasses : oldOnboardingClasses
  const appLoadingProgress = useAppLoadingProgress()
  const loadingCoverImage = useAppLoadingCoverImage()
  return (
    <div className={classes.appLoadingScreenContainer}>
      <div className={combine(onboardingClasses.formWrapper, classes.formWrapper)}>
        <img
          className={
              combine(onboardingClasses.formContent, classes.appCoverImage)
            }
          src={loadingCoverImage}
          alt={t('loading_screen.app_icon.alt')}
        />
        <div className={classes.shimmer} />
      </div>
      <div className={classes.textContainer}>
        <div className={isBrand8 ? classes.loadingSubheading : classes.loadingSubheadingOld}>
          {t('loading_screen.subheading')}
        </div>
        <p className={isBrand8 ? classes.loadingTextBlurb : classes.loadingTextBlurbOld}>
          {t('loading_screen.blurb')}
        </p>
      </div>
      <AppLoadingBar progress={appLoadingProgress} />
    </div>
  )
}

const AppLoadingScreen: React.FC<IAppLoadingScreen> = ({
  darkMode = true, isNewBranding = false,
}) => (
  <UiThemeProvider mode={darkMode ? 'dark' : 'light'}>
    <LoadingScreen isNewBranding={isNewBranding} />
  </UiThemeProvider>
)

export {
  AppLoadingScreen,
}
