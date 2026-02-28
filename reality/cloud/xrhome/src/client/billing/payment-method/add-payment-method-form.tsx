import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import type {
  StripeElementsOptions,
  StripeError,
} from '@stripe/stripe-js'
import {Elements, PaymentElement, useElements, useStripe} from '@stripe/react-stripe-js'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import {Loader} from '../../ui/components/loader'
import {FadeIn} from '../../widgets/fade-in'
import stripePromise from '../stripe'
import {rawActions as actions} from '../billing-actions'
import StripeLock from '../../uiWidgets/stripe-lock'
import {PrimaryButton} from '../../ui/components/primary-button'
import ButtonLink from '../../uiWidgets/button-link'
import {gray4} from '../../static/styles/settings'
import useCurrentAccount from '../../common/use-current-account'
import {toStripeLocale} from '../../../shared/i18n/i18n-utils'
import type {SupportedLocale8w} from '../../../shared/i18n/i18n-locales'

const useStyles = createUseStyles({
  paymentTypeOption: {
    'display': 'block',
    'padding': '0.25em 0',
    '& .checkbox': {
      verticalAlign: 'middle',
      marginRight: '0.5em',
      position: 'relative',
      top: '-0.15em',
    },
  },
  action: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flex: '0 0 auto',
  },
  right: {
    flex: '0 0 auto',
    textAlign: 'right',
  },
  stripeBox: {
    boxShadow: 'none',
    marginTop: 0,
    padding: 0,
  },
  loading: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    marginRight: '1em',
    width: '7em',
  },
  cancelButton: {
    'color': gray4,
    '&:hover': {
      color: gray4,
    },
  },
})

interface IProps {
  onCancel: () => void
  onSubmitComplete: (result: any) => void
  onError: (e: Error) => void
}

const AddPaymentMethodFormInner: React.FunctionComponent<IProps> = ({
  onCancel,
  onSubmitComplete,
  onError,
}) => {
  const {t} = useTranslation(['common'])
  const elements = useElements()
  const stripe = useStripe()
  const classes = useStyles()
  const account = useCurrentAccount()
  const dispatch = useDispatch()

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<StripeError | null>(null)
  const [submitDisabled, setSubmitDisabled] = useState(true)
  const [paymentElementReady, setPaymentElementReady] = useState(false)

  useEffect(() => {
    if (paymentElementReady) {
      setSubmitDisabled(submitError?.type === 'card_error' || submitting)
    }
  }, [submitError, submitting])

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const result = await dispatch(
        actions.addPaymentMethod(stripe, elements, account.uuid)
      )
      setSubmitting(false)
      onSubmitComplete(result)
    } catch (e) {
      setSubmitting(false)
      onError(e)
    }
  }
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.stopPropagation()
    e.preventDefault()
    handleSubmit()
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
    <form onSubmit={onSubmit}>
      <PaymentElement
        className={classes.stripeBox}
        onChange={handleOnPaymentChange}
        onReady={() => setPaymentElementReady(true)}
      />
      <FadeIn delay={500} transitionDuration={300} translateAmount='0'>
        <div className={classes.action}>
          <div className={classes.left}>
            <PrimaryButton
              className={classes.confirmButton}
              type='submit'
              disabled={submitDisabled}
            >
              {submitting
                ? <Loader centered inline size='small' />
                : t('button.confirm', {ns: 'common'})
              }
            </PrimaryButton>
            <ButtonLink className={classes.cancelButton} onClick={onCancel}>
              {t('button.cancel', {ns: 'common'})}
            </ButtonLink>
          </div>
          <div className={classes.right}>
            <StripeLock />
          </div>
        </div>
      </FadeIn>
    </form>
  )
}

const AddPaymentMethodForm: React.FunctionComponent<IProps> = (props) => {
  const {i18n} = useTranslation(['billing'])
  const [clientSecret, setClientSecret] = useState(null)
  const dispatch = useDispatch()
  const account = useCurrentAccount()
  const classes = useStyles()

  const fetchClientSecret = async () => {
    const paymentSetupIntent = await dispatch(actions.getPaymentSetupIntent(account.uuid))
    setClientSecret(paymentSetupIntent)
  }

  useEffect(() => {
    fetchClientSecret()
  }, [])

  const elementsOptions: StripeElementsOptions = {
    clientSecret,
    fonts: [
      {cssSrc: 'https://fonts.googleapis.com/css?family=Nunito:400&subset=latin'},
    ],
    appearance: {
      theme: 'stripe',
      variables: {
        fontFamily: 'Nunito, system-ui, sans-serif',
      },
    },
    locale: toStripeLocale(i18n.language as SupportedLocale8w),
  }

  if (!clientSecret) {
    return (
      <div className={classes.loading}>
        <Loader centered inline />
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise} options={elementsOptions}>
      <AddPaymentMethodFormInner {...props} />
    </Elements>
  )
}

export default AddPaymentMethodForm
