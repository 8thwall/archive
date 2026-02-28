import React, {useState, useRef} from 'react'
import {Dimmer} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import {Trans, useTranslation} from 'react-i18next'

import stripeSVG from '../../static/stripe_minimal.svg'
import {Loader} from '../../ui/components/loader'
import {tinyViewOverride} from '../../static/styles/settings'
import {PrimaryButton} from '../../ui/components/primary-button'
import LinkOut from '../../uiWidgets/link-out'
import {getActiveCreditGrant} from '../../../shared/feature-utils'
import useCurrentAccount from '../../common/use-current-account'
import {CreditDisplayBudget} from './credit-display-budget'
import {
  ACCOUNT_FEATURES, CREDIT_GRANT_FEATURE, FREE_TOP_UP_OPTION, getTopUpOption,
} from '../../../shared/feature-config'
import {StandardTextField} from '../../ui/components/standard-text-field'
import {StandardRadioButton, StandardRadioGroup} from '../../ui/components/standard-radio-group'
import {AccountPathEnum, getPathForAccount} from '../../common/paths'
import {createSuccessUrl} from '../use-feature-search-params'
import featureActions from '../feature-actions'
import useActions from '../../common/use-actions'
import {formatToCurrency} from '../../../shared/billing/currency-formatter'
import {Badge} from '../../ui/components/badge'
import {Icon} from '../../ui/components/icon'
import {calculateExpiresAtDate} from '../../../shared/credits/grant-validity-periods'
import {StaticBanner} from '../../ui/components/banner'
import {useSelector} from '../../hooks'
import homeActions from '../../home/home-actions'
import {StandardModal} from '../../editor/standard-modal'
import {StandardContainer} from '../../ui/components/standard-container'
import {SpaceBetween} from '../../ui/layout/space-between'
import {SecondaryButton} from '../../ui/components/secondary-button'

const useStyles = createUseStyles({
  modalContainer: {
    padding: '3em',
    flexDirection: 'column',
    display: 'flex',
    gap: '2em',
    [tinyViewOverride]: {
      padding: '1.5em',
    },
  },
  loaderContainer: {
    height: '5em',
  },
  headingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1em',
    fontSize: '1.125em',
    textAlign: 'center',
  },
  heading: {
    fontWeight: 700,
    fontSize: '1.5em',
    margin: '0',
  },
  discountContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  radioButtonContainer: {
    display: 'flex',
    gap: '2em',
    justifyContent: 'center',
  },
  creditAmountContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'start',
    gap: '1.5em',
  },
  customCreditContainer: {
    'display': 'flex',
    'gap': '0.5em',
    '& span': {
      fontSize: '1.25em',
      fontWeight: 700,
    },
    '& input': {
      minWidth: '10em',
    },
  },
  expirationDate: {
    textAlign: 'center',
    fontSize: '1.125em',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: '1.5em',
    [tinyViewOverride]: {
      flexDirection: 'column-reverse',
    },
  },
  buttonLink: {
    padding: '0 1em',
  },
  dollarSign: {
    marginTop: '0.6em',
  },
})

interface ICreditTopUpModal {
  onClose: () => void
}

const CreditTopUpModal: React.FC<ICreditTopUpModal> = (
  {onClose}
) => {
  const {t} = useTranslation(['account-pages', 'common'])
  const classes = useStyles()
  const account = useCurrentAccount()
  const {createFeatureCheckout} = useActions(featureActions)
  const {Features} = useCurrentAccount()
  const activeCreditGrant = getActiveCreditGrant(Features)
  const topUpOption = getTopUpOption(activeCreditGrant?.optionName) || FREE_TOP_UP_OPTION
  const {
    presetCreditAmounts: topUpCreditAmounts,
    minimumCreditAmount,
    maximumCreditAmount,
  } = topUpOption
  const topUpCreditAmountOptions = topUpCreditAmounts.map(creditAmount => ({
    name: `${topUpOption.name}-${creditAmount}`,
    creditAmount,
    FormattedPrice: formatToCurrency(
      topUpOption.price * creditAmount * 100, {currency: 'usd', decimalPlaces: 0}
    ),
  }))
  const topUpCustomOptionName = `${topUpOption.name}-custom`
  const [currentOptionName, setCurrentOptionName] = useState(topUpCreditAmountOptions[0].name)
  const [isLoading, setIsLoading] = useState(false)
  const creditExpirationDate = calculateExpiresAtDate('ONE_MONTH', new Date())
  const minimumPrice = topUpOption.price * minimumCreditAmount
  const maximumPrice = topUpOption.price * maximumCreditAmount
  const [currentCreditAmount, setCurrentCreditAmount] =
    useState<number>(topUpCreditAmountOptions[0].creditAmount)
  const [isCustomVisible, setIsCustomVisible] = useState<boolean>(false)
  const [customPriceInput, setCustomPriceInput] = useState<string>('')
  const [inputError, setInputError] = useState<string | null>(null)
  const [showInputError, setShowInputError] = useState<boolean>(false)
  const stoppedTypingDebounceRef = useRef<ReturnType<typeof setTimeout>>(null)
  const stateError = useSelector(state => state.common.error)
  const {acknowledgeError} = useActions(homeActions)

  const isValidPrice =
    currentOptionName !== topUpCustomOptionName ||
    (customPriceInput && !inputError)

  const getLimitedValueFromInput = (input: string) => {
    const truncated = Math.trunc(Number(input))
    return Math.min(truncated, maximumPrice)
  }

  const handleCustomPriceChange = (input: string) => {
    if (input === '') {
      setInputError(null)
      setShowInputError(false)
      setCustomPriceInput('')
      setCurrentCreditAmount(minimumCreditAmount)
      clearTimeout(stoppedTypingDebounceRef?.current)
      return
    }
    const limitedValue = getLimitedValueFromInput(input)
    setCurrentCreditAmount(limitedValue / topUpOption.price)
    setCustomPriceInput(limitedValue.toString())

    if (limitedValue < minimumPrice) {
      setInputError(t('plan_billing_page.credit_top_up_modal.error.below_minimum', {minimumPrice}))
    } else {
      setInputError(null)
    }

    // Don't show error while typing
    setShowInputError(false)
    clearTimeout(stoppedTypingDebounceRef?.current)

    // Show error after timeout
    stoppedTypingDebounceRef.current = setTimeout(() => {
      setShowInputError(true)
    }, 500)
  }

  const completeTopUpPurchase = async () => {
    setIsLoading(true)
    const rootUrl =
      `${window.location.origin}${getPathForAccount(account, AccountPathEnum.account)}`
    const successUrl = createSuccessUrl(rootUrl, {
      category: ACCOUNT_FEATURES.name,
      featureName: CREDIT_GRANT_FEATURE.name,
      optionName: topUpOption.name,
      quantity: currentCreditAmount,
      entityName: account.shortName,
    })

    await createFeatureCheckout({
      account,
      category: ACCOUNT_FEATURES.name,
      featureName: CREDIT_GRANT_FEATURE.name,
      optionName: topUpOption.name,
      entityName: account.shortName,
      successUrl,
      cancelUrl: rootUrl,
      quantity: currentCreditAmount,
    })
    setIsLoading(false)
  }

  return (
    <StandardModal
      onClose={onClose}
      closeOnDimmerClick={!isLoading}
    >
      <div className={classes.modalContainer}>
        <div className={classes.headingContainer}>
          <SpaceBetween extraNarrow>
            <Icon stroke='plus' size={2.25} />
            <Icon stroke='creditsBold' size={2.25} />
          </SpaceBetween>
          <h2 className={classes.heading}>
            {t('plan_billing_page.credit_top_up_modal.heading')}
          </h2>
          <div>{t('plan_billing_page.credit_top_up_modal.description')}</div>
        </div>
        {activeCreditGrant &&
          <div className={classes.discountContainer}>
            <Badge color='mint' variant='pastel'>
              <Trans
                ns='account-pages'
                i18nKey={'plan_billing_page.credit_top_up_modal.discount_applied.' +
                  `${activeCreditGrant.optionName.toLowerCase()}`}
                values={{
                  planName:
                    (CREDIT_GRANT_FEATURE[activeCreditGrant.optionName].planName).toUpperCase(),
                }}
                components={{1: <b />}}
              />
              <Icon stroke='checkmark' color='successDark' />
            </Badge>
          </div>
        }
        <StandardRadioGroup label=''>
          <div className={classes.radioButtonContainer}>
            {topUpCreditAmountOptions.map(option => (
              <StandardRadioButton
                key={option.name}
                id={option.name}
                label={option.FormattedPrice}
                onChange={() => {
                  setIsCustomVisible(false)
                  setCurrentOptionName(option.name)
                  setCurrentCreditAmount(option.creditAmount)
                }}
                checked={currentOptionName === option.name}
                value={option.name}
                disabled={isLoading}
              />
            ))}
            <StandardRadioButton
              key={topUpCustomOptionName}
              id={topUpCustomOptionName}
              label={t('plan_billing_page.credit_top_up_modal.credit_amount_custom')}
              onChange={() => {
                setIsCustomVisible(true)
                setCurrentOptionName(topUpCustomOptionName)
                if (customPriceInput === '') {
                  setCurrentCreditAmount(minimumCreditAmount)
                  return
                }
                const limitedValue = getLimitedValueFromInput(customPriceInput)
                setCurrentCreditAmount(limitedValue / topUpOption.price)
              }}
              checked={currentOptionName === topUpCustomOptionName}
              value={topUpCustomOptionName}
              disabled={isLoading}
            />
          </div>
        </StandardRadioGroup>
        <div className={classes.creditAmountContainer}>
          {isCustomVisible &&
            <div className={classes.customCreditContainer}>
              <span className={classes.dollarSign}>$</span>
              <StandardTextField
                id='custom-credits-amount'
                type='number'
                label=''
                placeholder={
                  t('plan_billing_page.credit_top_up_modal.minimum_custom_credits',
                    {minAmount: formatToCurrency(1000, {currency: 'usd', decimalPlaces: 0})})
                }
                value={customPriceInput}
                min={minimumPrice}
                max={maximumPrice}
                onChange={e => handleCustomPriceChange(e.target.value)}
                errorMessage={showInputError ? inputError : null}
              />
            </div>
          }
          <CreditDisplayBudget
            optionName={topUpOption.name}
            creditAmount={currentCreditAmount}
          />
        </div>
        <StandardContainer>
          <Trans
            ns='account-pages'
            i18nKey='plan_billing_page.credit_top_up_modal.terms_and_condition'
            components={{
              1: <LinkOut url='https://www.8thwall.com/terms' />,
              2: <LinkOut url='https://www.8thwall.com/privacy' />,
            }}
          />
        </StandardContainer>
        <div className={classes.expirationDate}>
          <Trans
            ns='account-pages'
            i18nKey='plan_billing_page.credit_top_up_modal.credits_expiration'
            values={{expirationDate: creditExpirationDate.toLocaleDateString()}}
            components={{1: <b />}}
          />
        </div>
        <div className={classes.buttonGroup}>
          <div>
            <img
              src={stripeSVG}
              // eslint-disable-next-line local-rules/hardcoded-copy
              alt='Powered By Stripe'
              draggable={false}
            />
          </div>
          <div className={classes.buttonGroup}>
            <SecondaryButton height='small' onClick={onClose}>
              {t('button.cancel', {ns: 'common'})}
            </SecondaryButton>
            <PrimaryButton disabled={!isValidPrice} height='small' onClick={completeTopUpPurchase}>
              {t('plan_billing_page.credit_top_up_modal.button.complete_purchase')}
            </PrimaryButton>
          </div>
        </div>
        {stateError &&
          <StaticBanner
            type='danger'
            message={stateError}
            onClose={() => acknowledgeError()}
          />
        }
      </div>
      <Dimmer active={isLoading}>
        <Loader />
      </Dimmer>
    </StandardModal>
  )
}

export default CreditTopUpModal
