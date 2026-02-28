import React, {useState} from 'react'
import {createUseStyles} from 'react-jss'
import {CountryDropdown, CountryRegionData} from 'react-country-region-selector'
import {useTranslation} from 'react-i18next'

import {
  gray3, gray2, blueberry,
  bodySanSerif, tinyViewOverride,
} from '../../static/styles/settings'
import usePayoutStyles from './payout-styles'
import stripeSVG from '../../static/stripe_minimal.svg'
import {combine} from '../../common/styles'
import icons from '../../apps/icons'
import {COUNTRIES_ALLOW_LIST} from '../../../shared/payout-constants'
import useCurrentAccount from '../../common/use-current-account'
import {generateOnboardingLink} from './payout-utils'
import ColoredMessage from '../../messages/colored-message'

const useStyles = createUseStyles({
  countrySelect: {
    'display': 'flex',
    'background': 'white',
    '& select': {
      'background': 'transparent',
      'zIndex': 1,
      'appearance': 'none',
      'padding': '0.7em 1em',
      'fontFamily': bodySanSerif,
      'borderRadius': '4px',
      'border': `1px solid ${gray2}`,
      '&:focus-visible': {
        outline: 'none',
      },
      '&:focus-within': {
        border: `1px solid ${blueberry}`,
      },
      '&:-ms-expand': {
        display: 'none',
      },
      'minWidth': '20em',
      [tinyViewOverride]: {
        minWidth: '100%',
      },
    },
  },
  countrySelectPlaceholder: {
    '& select': {
      color: gray3,
    },
  },
  countrySelectIcon: {
    marginLeft: '-2em',
  },
  startButton: {
    [tinyViewOverride]: {
      width: '100%',
    },
  },
  disabledLink: {
    pointerEvents: 'none',
    opacity: 0.2,
  },
  bottomMargin: {
    marginBottom: '1em',
  },
})

const PayoutNewAccount = () => {
  const {t} = useTranslation(['account-pages'])
  const [countrySelect, setCountrySelect] = useState('')
  const fullCountryData = CountryRegionData.find(country => country[1] === countrySelect)
  const isCountryUnavailable = countrySelect.length > 1 &&
  !COUNTRIES_ALLOW_LIST.includes(countrySelect)
  const classes = useStyles()
  const payoutStyles = usePayoutStyles()
  const countrySelectStyles = combine(classes.countrySelect,
    countrySelect.length < 1 && classes.countrySelectPlaceholder,
    isCountryUnavailable && classes.bottomMargin)
  const startButtonStyles = combine('ui primary button', classes.startButton,
    (countrySelect.length < 1 || isCountryUnavailable) && classes.disabledLink)
  const account = useCurrentAccount()

  return (
    <>
      <div className={countrySelectStyles}>
        <CountryDropdown
          defaultOptionLabel={t('plan_billing_page.payout_new_account.input.placeholder')}
          value={countrySelect}
          onChange={(v) => { setCountrySelect(v) }}
          valueType='short'
        />
        <img className={classes.countrySelectIcon} src={icons.chevron} alt='dropdown-arrow' />
      </div>
      {isCountryUnavailable &&
        <ColoredMessage color='red' iconName='exclamation circle'>
          {t('plan_billing_page.payout_new_account.not_supported', {country: fullCountryData[0]})}
        </ColoredMessage>
      }
      <div className={payoutStyles.bottom}>
        <a
          className={startButtonStyles}
          href={generateOnboardingLink(account.uuid, countrySelect)}
        >{t('plan_billing_page.payout_new_account.button.start_here')}
        </a>
        <img
          className={payoutStyles.stripe}
          src={stripeSVG}
          alt='Powered by Stripe'
          draggable={false}
        />
      </div>
    </>
  )
}

export default PayoutNewAccount
