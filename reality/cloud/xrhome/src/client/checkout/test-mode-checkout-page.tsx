import React from 'react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'
import {useHistory, useRouteMatch} from 'react-router-dom'
import {Button} from 'semantic-ui-react'

import checkoutActions from './checkout-actions'
import CheckoutDetailsRow from './checkout-detail-row'
import {useCheckoutStyles} from './checkout-styles'
import {postCheckoutSuccessMessage} from './checkout-message-handlers'
import ValidTimeBanner from './valid-time-banner'
import {formatToCurrency} from '../../shared/billing/currency-formatter'
import {getPathForCheckoutConfirmation} from '../common/paths'
import useActions from '../common/use-actions'
import {withCheckoutOrderLoaded} from '../common/with-state-loaded'
import {useSelector} from '../hooks'
import {brandWhite, gray2} from '../static/styles/settings'
import {StandardSelectField} from '../ui/components/standard-select-field'
import {StandardTextField} from '../ui/components/standard-text-field'
import LinkOut from '../uiWidgets/link-out'
import stripeSVG from '../static/stripe_minimal.svg'
import {FALLBACK_LOCALE} from '../../shared/i18n/i18n-locales'
import {dateToStripeTime} from '../../shared/time-utils'
import {PrimaryButton} from '../ui/components/primary-button'

const useTestStyles = createUseStyles({
  paymentPlaceholderContainer: {
    fontSize: '1.16em',
    border: `1px solid ${gray2}`,
    borderRadius: '8px',
    width: '100%',
    margin: '1em 0',
    padding: '1em',
    position: 'relative',
    boxShadow: '2px 2px 15px rgba(213, 215, 228, 0.55)',
  },
  paymentPlaceholderOverlay: {
    display: 'flex',
    flexDirection: 'column-reverse',
    position: 'absolute',
    paddingRight: '1em',
    top: '0px',
    left: '0px',
    width: '100%',
    height: '100%;',
    borderRadius: '8px',
    background: `linear-gradient(0deg, ${brandWhite} 37.33%, rgba(255, 255, 255, 0) 103.89%)`,
  },
  paymentPlaceholderContent: {
    padding: '1em',
    textAlign: 'center',
  },
  paymentPlaceholderTitle: {
    fontWeight: 'bold',
    marginBottom: '0.5em',
  },
  buttonGroup: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    marginBottom: '1em',
  },
  button: {
    flex: '1 1 0',
  },
})

const TestModeCheckoutPage: React.FC = () => {
  const classes = useCheckoutStyles()
  const testClasses = useTestStyles()
  const history = useHistory()
  const match = useRouteMatch()
  const {setOrderSuccess} = useActions(checkoutActions)
  const {i18n, t} = useTranslation(['checkout'])

  const {app, product} = useSelector(state => state.checkout.order)
  const appTitle = app.title
  const price = formatToCurrency(product.amount, {currency: product.currency})

  const handleConfirmPayment = () => {
    const completedAt = new Date()
    setOrderSuccess(
      {last4: '1234', type: 'card'},
      dateToStripeTime(completedAt)
    )
    postCheckoutSuccessMessage({
      productId: product.productId,
      timestamp: completedAt.getTime(),
    })

    const confirmationPath = getPathForCheckoutConfirmation(match)
    history.push(confirmationPath + history.location.search)
  }

  const handleFailPayment = () => {
    window.close()
  }

  return (
    <div className={classes.content}>
      <div className={classes.paymentTitle}>{t('pageTitle')}</div>
      <CheckoutDetailsRow label={t('appNameLabel')} value={appTitle} />
      <CheckoutDetailsRow label={t('productLabel')} value={product.name} />
      <ValidTimeBanner validTimeMillis={product.expirationTimeMillis} />
      <div className={testClasses.paymentPlaceholderContainer}>
        <StandardTextField
          id='card-number'
          label={t('cardNumberLabel')}
          value='1234 1234 1234 1234'
          disabled
        />
        <StandardTextField
          id='exp-date'
          label={t('expDateLabel')}
          value={t('expDatePlaceholder')}
          disabled
        />
        <StandardTextField
          id='ccv'
          label='CCV'
          value='564'
          disabled
        />
        <StandardSelectField id='country' label={t('countryLabel')} disabled>
          <option value='us'>United States</option>
        </StandardSelectField>
        <div className={testClasses.paymentPlaceholderOverlay}>
          <div className={testClasses.paymentPlaceholderContent}>
            <div className={testClasses.paymentPlaceholderTitle}>
              {t('testModeTitle')}
            </div>
            <div>
              {t('testModeDescription')}
            </div>
          </div>
        </div>
      </div>
      <div className={classes.priceContainer}>
        <div className={classes.priceLabel}>{t('priceLabel')}</div>
        <div className={classes.priceText}>{price}</div>
      </div>
      <div className={testClasses.buttonGroup}>
        <Button basic color='black' className={testClasses.button} onClick={handleFailPayment}>
          {t('testFailButton')}
        </Button>
        {/* eslint-disable-next-line local-rules/ui-component-styling */}
        <PrimaryButton className={testClasses.button} onClick={handleConfirmPayment}>
          {t('testSuccessButton')}
        </PrimaryButton>
      </div>
      <div className={classes.termsText}>
        {'By confirming you agree to the 8th Wall '}
        <LinkOut url='/terms' className={classes.tosLink}>
          Terms of Service
        </LinkOut>
        {i18n.language !== FALLBACK_LOCALE && ' (English Only)'}
      </div>
      <img
        src={stripeSVG}
        alt='Powered by Stripe'
        draggable={false}
      />
    </div>
  )
}

export default withCheckoutOrderLoaded(TestModeCheckoutPage)
