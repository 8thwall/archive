import React from 'react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'
import {format} from 'date-fns'

import {formatToCurrency} from '../../shared/billing/currency-formatter'
import {withCheckoutOrderLoaded} from '../common/with-state-loaded'
import {useSelector} from '../hooks'
import {gray4, moonlight} from '../static/styles/settings'
import {BoldButton} from '../ui/components/bold-button'
import {stripeTimeToDate} from '../../shared/time-utils'
import {PrimaryButton} from '../ui/components/primary-button'
import {Icon} from '../ui/components/icon'

const useStyles = createUseStyles({
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 'auto',
    padding: '0 1.5em',
    maxWidth: '400px',
    width: '100%',
  },
  confirmationIcon: {
    marginBottom: '0.4em !important',
  },
  confirmationTitle: {
    fontSize: '2em',
    fontWeight: 'bold',
    marginBottom: '0.5em',
  },
  confirmationSubtitle: {
    fontSize: '1.16em',
    marginBottom: '1em',
  },
  orderNumberBanner: {
    display: 'flex',
    width: '100%',
    textAlign: 'center',
    background: moonlight,
    fontWeight: 'bold',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '5.75em',
    marginBottom: '2em',
  },
  detailsRow: {
    display: 'flex',
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: '1em',
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: gray4,
  },
  closeButton: {
    width: '100%',
  },
  contactSupport: {
    color: gray4,
    fontWeight: '600',
    margin: '2em 0',
  },
})

interface IDetailsRowProps {
  label: string
  value: string
}
const DetailsRow: React.FC<IDetailsRowProps> = ({label, value}) => {
  const classes = useStyles()
  return (
    <div className={classes.detailsRow}>
      <div>{label}</div>
      <div>{value}</div>
    </div>
  )
}

const CheckoutConfirmationPage: React.FC = () => {
  const classes = useStyles()
  const {t} = useTranslation(['checkout'])
  const order = useSelector(state => state.checkout.order)
  const {amount, currency} = order.product
  const price = formatToCurrency(amount, {currency})
  return (
    <div className={classes.content}>
      <span className={classes.confirmationIcon}>
        <Icon inline stroke='success' color='success' size={2.5} />
      </span>
      <div className={classes.confirmationTitle}>{t('confirmationTitle')}</div>
      <div className={classes.confirmationSubtitle}>{t('confirmationSubtitle')}</div>
      <div className={classes.orderNumberBanner}>
        <div>{t('orderNumberLabel')}</div>
        <div>{order.orderId}</div>
      </div>
      <DetailsRow
        label={t('appNameLabel')}
        value={order.app.title}
      />
      <DetailsRow label={t('productLabel')} value={order.product.name} />
      <DetailsRow
        label={t('amountPaidLabel')}
        value={price}
      />
      <DetailsRow
        label={t('paymentMethodLabel')}
        value={`**** **** **** ${order.paymentMethod.last4}`}
      />
      <DetailsRow
        label={t('dateLabel')}
        value={format(stripeTimeToDate(order.completedAt), 'MMM dd, yyyy')}
      />
      <div className={classes.closeButton}>
        <PrimaryButton onClick={() => { window.close() }}>
          {t('closeButton')}
        </PrimaryButton>
      </div>
      <div className={classes.contactSupport}>
        {t('supportText')}
      </div>
      <BoldButton color='blue' onClick={() => { window.print() }}>
        {t('printButton')}
      </BoldButton>
    </div>
  )
}

export default withCheckoutOrderLoaded(CheckoutConfirmationPage)
