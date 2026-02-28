import React, {useEffect, useState} from 'react'
import {useHistory, useRouteMatch} from 'react-router-dom'
import type {
  Appearance,
  PaymentIntentResult,
  PaymentMethod,
  StripeElementsOptions,
  StripeError,
} from '@stripe/stripe-js'
import {Elements, PaymentElement, useElements, useStripe} from '@stripe/react-stripe-js'
import {Button} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import checkoutActions from './checkout-actions'
import CheckoutDetailsRow from './checkout-detail-row'
import type {CheckoutOrder} from './checkout-types'
import {useCheckoutStyles} from './checkout-styles'
import {postCheckoutSuccessMessage} from './checkout-message-handlers'
import ValidTimeBanner from './valid-time-banner'
import {formatToCurrency} from '../../shared/billing/currency-formatter'
import stripePromise from '../billing/stripe'
import {getPathForCheckoutConfirmation} from '../common/paths'
import useActions from '../common/use-actions'
import {withCheckoutOrderLoaded} from '../common/with-state-loaded'
import {useSelector} from '../hooks'
import ColoredMessage from '../messages/colored-message'
import LinkOut from '../uiWidgets/link-out'
import stripeSVG from '../static/stripe_minimal.svg'
import {FALLBACK_LOCALE, SupportedLocale8w} from '../../shared/i18n/i18n-locales'
import {dateToStripeTime} from '../../shared/time-utils'
import {toStripeLocale} from '../../shared/i18n/i18n-utils'

interface Props {
  order: CheckoutOrder
}

const LiveModeCheckoutPage: React.FC<Props> = ({order}) => {
  const elements = useElements()
  const stripe = useStripe()
  const classes = useCheckoutStyles()
  const history = useHistory()
  const match = useRouteMatch()
  const {setOrderSuccess} = useActions(checkoutActions)
  const {i18n, t} = useTranslation(['checkout'])

  const [isSendingPayment, setIsSendingPayment] = useState(false)
  const [submitError, setSubmitError] = useState<StripeError | null>(null)
  const [submitDisabled, setSubmitDisabled] = useState(true)
  const [paymentElementReady, setPaymentElementReady] = useState(false)

  const {app, product} = order
  const appTitle = app.title
  const price = formatToCurrency(product.amount, {currency: product.currency})

  useEffect(() => {
    if (paymentElementReady) {
      setSubmitDisabled(submitError?.type === 'card_error' || isSendingPayment)
    }
  }, [submitError, isSendingPayment])

  const handleSubmit = async () => {
    setIsSendingPayment(true)
    setSubmitError(null)
    try {
      const {paymentIntent, error}: PaymentIntentResult = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: {
          expand: ['payment_method'],
          // TODO(alvin): Set redirect URL?
        },
      })

      if (error) {
        throw error
      }

      const paymentMethod = paymentIntent.payment_method as PaymentMethod
      const completedAt = new Date()
      setOrderSuccess(
        {last4: paymentMethod.card.last4, type: 'card'},
        dateToStripeTime(completedAt)
      )
      postCheckoutSuccessMessage({
        productId: product.productId,
        timestamp: completedAt.getTime(),
      })

      const confirmationPath = getPathForCheckoutConfirmation(match, order.orderId)
      history.push(confirmationPath + history.location.search)
    } catch (e) {
      setIsSendingPayment(false)
      setSubmitError(e)
    }
  }

  const handleOnPaymentChange = (e) => {
    if (submitDisabled && e.complete) {
      setSubmitDisabled(false)
    } else if (!submitDisabled && !e.complete) {
      setSubmitDisabled(true)
    }

    if (submitError) {
      setSubmitError(null)
    }
  }

  return (
    <div className={classes.content}>
      <div className={classes.paymentTitle}>{t('pageTitle')}</div>
      <CheckoutDetailsRow label={t('appNameLabel')} value={appTitle} />
      <CheckoutDetailsRow label={t('productLabel')} value={product.name} />
      <ValidTimeBanner validTimeMillis={product.expirationTimeMillis} />
      <PaymentElement
        className={classes.paymentElement}
        onChange={handleOnPaymentChange}
        onReady={() => setPaymentElementReady(true)}
      />
      <div className={classes.priceContainer}>
        <div className={classes.priceLabel}>{t('priceLabel')}</div>
        <div className={classes.priceText}>{price}</div>
      </div>
      {submitError &&
        <ColoredMessage color='red' iconName='exclamation circle' className={classes.errorMessage}>
          {submitError.message}
        </ColoredMessage>
      }
      <Button
        primary
        className={classes.submitButton}
        onClick={handleSubmit}
        loading={isSendingPayment}
        disabled={submitDisabled}
      >
        {t('confirmButton')}
      </Button>
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

const StripeElementsWrapper = () => {
  const {i18n} = useTranslation(['checkout'])
  const order = useSelector(state => state.checkout.order)
  const appearance: Appearance = {
    rules: {
      '.Label': {
        fontWeight: '700',
      },
    },
  }

  const locale = toStripeLocale(i18n.language as SupportedLocale8w)
  const elementOptions: StripeElementsOptions = {
    clientSecret: order.clientSecret,
    appearance,
    locale,
  }
  return (
    <Elements stripe={stripePromise} options={elementOptions}>
      <LiveModeCheckoutPage order={order} />
    </Elements>
  )
}

export default withCheckoutOrderLoaded(StripeElementsWrapper)
