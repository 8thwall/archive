import React, {useEffect, useRef, useState} from 'react'
import {Trans, useTranslation} from 'react-i18next'
import {useHistory} from 'react-router'

import {
  FORM_STEP_TO_A8_CATEGORY, type CompleteOnboardingRequestBody,
} from '../account-onboarding-types'
import {
  useOnboardingAccount, useGetOnboardingError,
  useRegisterFormNavigation,
  useFormNavigation,
  useCurrentFormStep,
} from '../account-onboarding-context'
import {brandWhite} from '../../../static/styles/settings'
import {combine} from '../../../common/styles'
import useActions from '../../../common/use-actions'
import {useCurrentUser} from '../../../user/use-current-user'
import {hexColorWithAlpha} from '../../../../shared/colors'
import {createThemedStyles} from '../../../ui/theme'
import {
  MAX_ACCOUNT_NAME_LENGTH, MAX_SHORTNAME_LENGTH, MIN_ACCOUNT_NAME_LENGTH, MIN_SHORTNAME_LENGTH,
} from '../../../../shared/account-constants'
import {isEnterprise, isPro, shortNameify} from '../../../../shared/account-utils'
import {SpaceBetween} from '../../../ui/layout/space-between'
import {Loader} from '../../../ui/components/loader'
import {useDebounce} from '../../../common/use-debounce'
import accountActions from '../../account-actions'
import {AbandonableExecutor, useAbandonableEffect} from '../../../hooks/abandonable-effect'
import billingActions from '../../../billing/billing-actions'
import {Icon} from '../../../ui/components/icon'
import {StaticBanner} from '../../../ui/components/banner'
import {useOnboardingStyles} from '../account-onboarding-styles'
import {PrimaryButton} from '../../../ui/components/primary-button'
import brandLogo from '../../../static/infin8_Purple.svg'
import {StandardComplexTextField} from '../../../ui/components/standard-complex-text-field'
import {useSelector} from '../../../hooks'

const URL_INPUT_VALIDATION_DELAY_MILLIS = 500

const useStyles = createThemedStyles(theme => ({
  guidelinesContainer: {
    'marginTop': '0.5em',
    'borderRadius': '0.5em',
    'color': theme.fgMuted,
    'border': `1px solid ${hexColorWithAlpha(brandWhite, 0.2)}`,
    'padding': '1.25em',
    '& ul': {
      margin: 0,
      paddingLeft: '1em',
    },
  },
  guidelineWarning: {
    color: theme.fgWarning,
  },
  bannerContainer: {
    'display': 'flex',
    'gap': '0.25em',
    'margin': '0.75em 0 0.5em',
    '& svg': {
      margin: '0.25em 0',
    },
  },
  bannerText: {
    textAlign: 'left',
    padding: 0,
    margin: 0,
    maxWidth: '500px',
  },
  statusSuccess: {
    color: theme.fgSuccess,
  },
  statusDanger: {
    color: theme.fgError,
  },
  statusWarning: {
    color: theme.fgWarning,
  },
  urlWarning: {
    '& > div': {
      boxShadow: `0 0 0 1px ${theme.fgWarning} inset !important`,
    },
  },
  urlError: {
    '& > div': {
      boxShadow: `0 0 0 1px ${theme.fgError} inset !important`,
    },
  },
  formButtonRow: {
    display: 'flex',
    justifyContent: 'center',
  },
}))

enum ClaimUrlStatus {
  Loading = 1,
  Requirements,
  Available,
  Unavailable,
  Invalid,
}

const ClaimUrlStatusBanner: React.FC<{status: ClaimUrlStatus}> = ({status}) => {
  const classes = useStyles()
  const TransStatus: React.FC<{i18nKey: string, values?: any}> = ({i18nKey, values}) => (
    <p className={classes.bannerText}>
      <Trans
        ns='account-onboarding-pages'
        values={values}
        i18nKey={i18nKey}
        components={{1: <strong />}}
      />
    </p>
  )

  switch (status) {
    case ClaimUrlStatus.Loading:
      return (
        <div className={classes.bannerContainer}>
          <Loader inline size='tiny' />
          <TransStatus i18nKey='claim_url_step.status.loading' />
        </div>
      )
    case ClaimUrlStatus.Requirements:
      return (
        <div className={combine(classes.bannerContainer, classes.statusDanger)}>
          <Icon stroke='danger' color='danger' />
          <TransStatus i18nKey='account_onboarding_form.url_guideline.length' />
        </div>
      )
    case ClaimUrlStatus.Available:
      return (
        <div className={combine(classes.bannerContainer, classes.statusSuccess)}>
          <Icon stroke='success' color='success' />
          <TransStatus i18nKey='claim_url_step.status.available' />
        </div>
      )
    case ClaimUrlStatus.Unavailable:
      return (
        <div className={combine(classes.bannerContainer, classes.statusWarning)}>
          <Icon stroke='warning' color='warning' />
          <TransStatus i18nKey='claim_url_step.status.unavailable' />
        </div>
      )
    case ClaimUrlStatus.Invalid:
      return (
        <div className={combine(classes.bannerContainer, classes.statusDanger)}>
          <Icon stroke='danger' color='danger' />
          <TransStatus
            i18nKey='claim_url_step.status.invalid'
            values={{min: MIN_SHORTNAME_LENGTH, max: MAX_SHORTNAME_LENGTH}}
          />
        </div>
      )
    default:
      throw new Error(`Invalid claim URL status: ${status}`)
  }
}

const AccountOnboardingCreateWorkspace = () => {
  const {t} = useTranslation(['account-onboarding-pages', 'common'])
  const account = useOnboardingAccount()
  const user = useCurrentUser()
  const [urlStatus, setUrlStatus] = useState<ClaimUrlStatus>(ClaimUrlStatus.Loading)
  const [claimedUrl] = useState<string>(
    !account.shortNameChangeRequired ? account.shortName : null
  )
  const [urlInput, setUrlInput] = useState<string>(claimedUrl || shortNameify(account.name))
  const [accountName, setAccountName] = React.useState(account.name)
  const urlAvailabilityAbortController = useRef<AbortController>()
  const {addBilling} = useActions(billingActions)
  const {completeOnboarding, isAccountShortnameAvailable} = useActions(accountActions)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const classes = useStyles()
  const onboardingClasses = useOnboardingStyles()
  const onboardingErrorMessage = useGetOnboardingError()
  const isFormDisabled = !claimedUrl && urlStatus !== ClaimUrlStatus.Available
  const {onNextClick} = useFormNavigation()
  const currentStep = useCurrentFormStep()
  const [isUrlManuallyEdited, setUrlManuallyEdited] = React.useState<boolean>(false)
  const [urlSuggestionMade, setUrlSuggestionMade] = React.useState<boolean>(false)
  const history = useHistory()
  const desktopLoginReturnUrl = useSelector(state => state.common.desktopLoginReturnUrl)

  const onUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlManuallyEdited(true)
    setUrlInput(e.target.value)
  }
  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountName(e.target.value)
  }

  const validateUrl = async (executor: AbandonableExecutor, abortSignal: AbortSignal) => {
    if (claimedUrl) {
      setUrlStatus(ClaimUrlStatus.Available)
      return
    }

    if (!urlInput.match(/^[0-9a-z]+$/)) {
      setUrlStatus(ClaimUrlStatus.Invalid)
      return
    }

    setUrlStatus(ClaimUrlStatus.Loading)

    const {available: urlAvailable, suggestion: urlSuggestion} = (await executor(
      isAccountShortnameAvailable(account.uuid, urlInput, abortSignal, !isUrlManuallyEdited)
    ))

    if (urlSuggestion) {
      setUrlSuggestionMade(true)
      setUrlInput(urlSuggestion)
      return
    }

    setUrlStatus(urlAvailable ? ClaimUrlStatus.Available : ClaimUrlStatus.Unavailable)
  }

  const validateUrlFuncRef = useRef(null)
  validateUrlFuncRef.current = validateUrl

  const validateUrlFunc = useDebounce(validateUrlFuncRef, URL_INPUT_VALIDATION_DELAY_MILLIS)

  useEffect(() => () => {
    validateUrlFuncRef.current = null
  }, [])

  useAbandonableEffect(async (executor) => {
    if (urlAvailabilityAbortController.current) {
      urlAvailabilityAbortController.current.abort()
    }

    if (claimedUrl) {
      setUrlStatus(ClaimUrlStatus.Available)
      return
    }

    if (urlInput.length < MIN_SHORTNAME_LENGTH || urlInput.length > MAX_SHORTNAME_LENGTH) {
      setUrlStatus(ClaimUrlStatus.Requirements)
      return
    }

    if (!urlInput || claimedUrl) {
      // Do not validate url if it is empty or if there aren't enough characters yet.
      return
    }

    if (!isUrlManuallyEdited && urlSuggestionMade) {
      setUrlStatus(ClaimUrlStatus.Available)
      return
    }

    urlAvailabilityAbortController.current = new AbortController()
    validateUrlFunc(executor, urlAvailabilityAbortController.current.signal)
  }, [urlInput, claimedUrl])

  useEffect(() => {
    if (!isUrlManuallyEdited) {
      setUrlSuggestionMade(false)
      setUrlInput(shortNameify(accountName))
    }
  }, [accountName])

  const onSubmitForm = async () => {
    const updateAccountBody: CompleteOnboardingRequestBody = {
      uuid: account.uuid,
      status: 'ENABLED',
      ...((!isPro(account) && !isEnterprise(account)) ? {publicFeatured: true} : {}),
      ...(!claimedUrl ? {shortName: urlInput} : {}),
    }

    try {
      setIsSubmitting(true)
      if (!account.stripeId) {
        await addBilling(account.uuid, {
          email: user.email,
          name: `${user.given_name} ${user.family_name}`,
          description: `${user.email} ${account.name}`,
          locale: user.locale,
        })
      }
      await completeOnboarding(updateAccountBody)

      // Redirect back to the desktop login page and launch the desktop app
      if (desktopLoginReturnUrl) {
        history.push('/desktop-login')
      }
    } catch (err) {
      throw new Error(t('error.failed_to_update_account'))
    } finally {
      setIsSubmitting(false)
    }
  }

  useRegisterFormNavigation({
    onNextClick: onSubmitForm,
    onBackClick: () => {},
  }, [claimedUrl, urlStatus, urlInput])

  const hasNextStep = !desktopLoginReturnUrl

  return (
    <div className={onboardingClasses.formWrapper}>
      {isSubmitting &&
        <div className={onboardingClasses.dimmer}>
          <Loader />
        </div>
      }
      <div className={onboardingClasses.formContent}>
        <img
          className={onboardingClasses.logo}
          src={brandLogo}
          // eslint-disable-next-line local-rules/hardcoded-copy
          alt='logo'
          draggable='false'
        />
        <SpaceBetween direction='vertical' justifyCenter centered narrow>
          <div className={onboardingClasses.heading}>
            {t('account_onboarding_form.heading.welcome')}
          </div>
          <div className={onboardingClasses.subheading}>
            {t('account_onboarding_form.description.welcome')}
          </div>
        </SpaceBetween>
        {onboardingErrorMessage &&
          <StaticBanner type='warning'>{onboardingErrorMessage}</StaticBanner>
        }
        <div className={onboardingClasses.fieldRow}>
          <div className={onboardingClasses.inputContainer}>
            <StandardComplexTextField
              id='account-name-input'
              label={t('account_onboarding_form.label.workspace_name')}
              placeholder={t('welcome_step.edit_account_name.placeholder')}
              value={accountName}
              onChange={onNameChange}
              minLength={MIN_ACCOUNT_NAME_LENGTH}
              maxLength={MAX_ACCOUNT_NAME_LENGTH}
              iconStroke='smiley'
            />
          </div>
        </div>
        <div className={onboardingClasses.fieldRow}>
          <div className={combine(onboardingClasses.inputContainer,
            urlStatus === ClaimUrlStatus.Unavailable && classes.urlWarning,
            (urlStatus === ClaimUrlStatus.Invalid || urlStatus === ClaimUrlStatus.Requirements) &&
              classes.urlError)}
          >
            <StandardComplexTextField
              id='account-url-input'
              label={t('account_onboarding_form.label.workspace_url')}
              placeholder={t('claim_url_step.heading.edit_url.placeholder')}
              onChange={onUrlInputChange}
              pattern='^[0-9a-z]+$'
              minLength={MIN_SHORTNAME_LENGTH}
              maxLength={MAX_SHORTNAME_LENGTH}
              value={urlInput}
              autoComplete='off'
              disabled={isSubmitting || !!claimedUrl}
              iconStroke='link'
              inputPrefix='8thwall.com/'
            />
          </div>
          {urlStatus && <ClaimUrlStatusBanner status={urlStatus} />}
          <div className={classes.guidelinesContainer}>
            <ul>
              <li>{t('account_onboarding_form.url_guideline.length')}</li>
              <li>{t('account_onboarding_form.url_guideline.lowercase_numbers_only')}</li>
              <li>{t('account_onboarding_form.url_guideline.relevant_names')}</li>
              <li className={classes.guidelineWarning}>
                {t('account_onboarding_form.url_guideline.cannot_be_changed')}
              </li>
            </ul>
          </div>
        </div>
        <div className={classes.formButtonRow}>
          <PrimaryButton
            spacing='normal'
            a8={`click;onboarding-${FORM_STEP_TO_A8_CATEGORY[currentStep]};` +
            `${hasNextStep ? 'next' : 'finish'}-button`}
            onClick={onNextClick}
            disabled={isSubmitting || isFormDisabled}
          >
            {t('account_onboarding_form.button.complete_form')}
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

export {
  AccountOnboardingCreateWorkspace,
}
