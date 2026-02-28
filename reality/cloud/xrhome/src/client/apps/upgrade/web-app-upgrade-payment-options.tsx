import React from 'react'
import {Form, Popup} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import {useSelector} from '../../hooks'
import useStyles from './web-app-upgrade-jss'
import PaymentSource from '../../uiWidgets/payment-source'
import {
  isInvoiceSource,
  getPaymentMethods,
  getLatestPaymentMethod,
} from '../../billing/billing-utils'
import type {IContract} from '../../common/types/models'
import {useDidUpdateOnce} from '../../common/did-update-once-hook'
import {getSelectedAccount} from '../../accounts/account-select'
import {areInvoicePaymentsAllowed} from '../../../shared/contract-utils'
import {IUpgradePaymentSource, UpgradePaymentType} from './web-app-upgrade-payment'
import {Icon} from '../../ui/components/icon'

const InvoiceLabel: React.FC<{email: string}> = ({email}) => {
  const {t} = useTranslation(['app-pages'])
  return (
    <>
      {t('purchase_license_page.web_app_upgrade_payment_options.invoice_due')}{' '}
      <Popup
        content={t('purchase_license_page.web_app_upgrade_payment_options.popup_email', {email})}
        trigger={<Icon stroke='questionMark' inline />
}
      />
    </>
  )
}

interface IPaymentOptions {
  appContract: IContract
  selectedSource: IUpgradePaymentSource
  onPaymentSourceSelect: (paymentSource: IUpgradePaymentSource) => void
}

const WebAppUpgradePaymentOptions: React.FunctionComponent<IPaymentOptions> = React.memo(({
  appContract,
  selectedSource,
  onPaymentSourceSelect,
}) => {
  const account = useSelector(state => getSelectedAccount(state))
  const email = useSelector(state => state.billing?.email)
  const paymentMethods = useSelector(state => getPaymentMethods(state))
  const latestPaymentMethod = useSelector(state => getLatestPaymentMethod(state))
  const isLatestPaymentMethodUpdated = useDidUpdateOnce(latestPaymentMethod)
  // Invoice payments handled through separate option.
  const allowedPaymentSources = paymentMethods?.filter(s => !isInvoiceSource(s))
  const displayInvoicePaymentOption = areInvoicePaymentsAllowed(account, appContract)
  const handleSourceSelect = (source: IUpgradePaymentSource) => {
    onPaymentSourceSelect(source)
  }

  React.useEffect(() => {
    // Initial mount should not select any cards even if latestPaymentMethod exists in redux.
    if (isLatestPaymentMethodUpdated && latestPaymentMethod) {
      handleSourceSelect({type: UpgradePaymentType.IMMEDIATE, sourceId: latestPaymentMethod})
    }
  }, [latestPaymentMethod])

  const classes = useStyles()
  const {type, sourceId} = selectedSource || {}
  return (
    <div className={classes.paymentMethod}>
      {allowedPaymentSources?.map(({id}) => (
        <Form.Radio
          key={id}
          name='cardSource'
          checked={type === UpgradePaymentType.IMMEDIATE && sourceId === id}
          value={id}
          onChange={
            () => handleSourceSelect({type: UpgradePaymentType.IMMEDIATE, sourceId: id})
          }
          label={{children: <PaymentSource sourceId={id} />}}
        />
      ))}

      {/* TODO(alvin): The text here isn't final. Make sure this gets updated. */}
      {displayInvoicePaymentOption &&
        <Form.Radio
          name='invoiceSource'
          checked={selectedSource?.type === UpgradePaymentType.INVOICE}
          onChange={() => handleSourceSelect({type: UpgradePaymentType.INVOICE, sourceId: null})}
          label={{children: <InvoiceLabel email={email} />}}
        />
      }
    </div>
  )
})

export default WebAppUpgradePaymentOptions
