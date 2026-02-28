import React from 'react'
import {useTranslation} from 'react-i18next'
import {Link} from 'react-router-dom'
import {UAParser} from 'ua-parser-js'

import {
  FORM_STEP_TO_A8_CATEGORY,
} from '../account-onboarding-types'
import {
  useRegisterFormNavigation,
  useCurrentFormStep,
  useFormNavigation,
} from '../account-onboarding-context'
import {combine} from '../../../common/styles'
import {createThemedStyles} from '../../../ui/theme'
import {useOnboardingStyles} from '../account-onboarding-styles'
import brandLogo from '../../../static/infin8_Purple.svg'
import {PrimaryButton} from '../../../ui/components/primary-button'
import {SecondaryButton} from '../../../ui/components/secondary-button'
import {mobileViewOverride} from '../../../static/styles/settings'

const MAC_SILICON_URL = 'https://8th.io/mac-arm64-latest'
const MAC_INTEL_URL = 'https://8th.io/mac-intel-latest'
const WINDOWS_X64_URL = 'https://8th.io/win-x64-latest'

const useStyles = createThemedStyles(theme => ({
  headingContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1em',
    alignItems: 'center',
    paddingTop: '2em',
    [mobileViewOverride]: {
      padding: 'unset',
    },
  },
  formContent: {
    alignItems: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1em',
    paddingBottom: '2em',
    [mobileViewOverride]: {
      padding: 'unset',
    },
  },
  downloadsLink: {
    'alignSelf': 'center',
    'color': theme.linkBtnFg,
    'textDecoration': 'underline',
    '&:hover': {
      color: theme.sfcHighlight,
      textDecoration: 'underline',
    },
  },
  continueSection: {
    padding: '3em 2em',
    display: 'flex',
    gap: '1.5em',
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueBrowserButton: {
    'position': 'relative',
  },
}))

const AccountOnboardingDesktopApp = () => {
  const {t} = useTranslation(['account-onboarding-pages', 'common'])
  const onboardingClasses = useOnboardingStyles()
  const classes = useStyles()
  const currentStep = useCurrentFormStep()
  const {onNextClick} = useFormNavigation()

  const [{os, downloadUrl}] = React.useState<{
    os: string | undefined, downloadUrl?: string
  }>(() => {
    const parser = new UAParser(navigator.userAgent)
    const parserName = parser.getOS().name
    const parserArch = parser.getCPU().architecture

    // eslint-disable-next-line local-rules/hardcoded-copy
    if (parserName === 'Mac OS') {
      return parserArch === 'amd64'
        ? {os: 'intel_mac', downloadUrl: MAC_INTEL_URL}
        : {os: 'apple_silicon', downloadUrl: MAC_SILICON_URL}
    // eslint-disable-next-line local-rules/hardcoded-copy
    } else if (parserName === 'Windows') {
      return parserArch === 'amd64'
        ? {os: 'windows_x64', downloadUrl: WINDOWS_X64_URL}
        : {os: undefined}
    }
    // TODO(lynn): Re-enable Windows when the desktop app is available for it.
    return {os: undefined}
  })

  useRegisterFormNavigation({
    onNextClick: async () => {},
    onBackClick: () => {},
  })

  return (
    <div>
      <div className={onboardingClasses.formWrapper}>
        <div className={combine(onboardingClasses.formContent, classes.formContent)}>
          <div className={classes.headingContainer}>
            <img
              className={onboardingClasses.logo}
              src={brandLogo}
              // eslint-disable-next-line local-rules/hardcoded-copy
              alt='logo'
              draggable='false'
            />
            <div className={onboardingClasses.heading}>
              {t('account_onboarding_form.heading.desktop_app')}
            </div>
            <div className={onboardingClasses.subheading}>
              {t('account_onboarding_form.description.desktop_app')}
            </div>
          </div>
          <div className={classes.buttonContainer}>
            <PrimaryButton
              // TODO (lynn): Add actual download link and OS detection.
              onClick={() => {
                window.open(downloadUrl)
              }}
              a8={`click;onboarding-${FORM_STEP_TO_A8_CATEGORY[currentStep]};finish-button`}
            >
              {os
                ? t(`account_onboarding_form.button.download_app_${os}`)
                : t('account_onboarding_form.button.download_app_not_supported')}
            </PrimaryButton>
            <Link
              className={classes.downloadsLink}
              to='/download'
            >
              {t('account_onboarding_form.button.view_all_downloads')}
            </Link>
          </div>
        </div>
      </div>
      <div className={classes.continueSection}>
        <SecondaryButton
          onClick={onNextClick}
          a8={`click;onboarding-${FORM_STEP_TO_A8_CATEGORY[currentStep]};finish-button`}
        >
          {t('account_onboarding_form.button.continue_to_browser')}
        </SecondaryButton>
      </div>
    </div>

  )
}

export {
  AccountOnboardingDesktopApp,
}
