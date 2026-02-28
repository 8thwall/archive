import React from 'react'
import {Trans} from 'react-i18next'

import {usePaymentMethod} from '../hooks/use-payment-method'
import {titleCase} from '../common/strings'

type Source = {
  sourceId: string
}

const CardSource: React.FC<Source> = ({sourceId}) => {
  const source = usePaymentMethod(sourceId)
  const card = source?.card
  if (!card) {
    return null
  }

  return (
    <span>
      <Trans
        ns='billing'
        i18nKey='billing.payment_source.raw_card_source'
      >
        {{cardBrand: titleCase(card.brand)}} XXXX-XXXX-XXXX-
        {{last4: card.last4}} exp {{month: card.exp_month}}/{{year: card.exp_year}}
      </Trans>
    </span>
  )
}

const OtherSource: React.FC<Source> = ({sourceId}) => {
  const source = usePaymentMethod(sourceId)

  if (!sourceId || !source) {
    return null
  }

  return <span>${source.type}</span>
}

const PaymentSource: React.FC<Source> = ({sourceId}) => {
  const source = usePaymentMethod(sourceId)
  if (!sourceId || !source) {
    return null
  }

  const {id, type} = source
  if (!id) {
    return null
  }

  if (type === 'card') {
    return <CardSource sourceId={id} />
  }
  // component have to always return
  return <OtherSource sourceId={id} />
}

export {
  PaymentSource as default,
  CardSource,
  OtherSource,
}
