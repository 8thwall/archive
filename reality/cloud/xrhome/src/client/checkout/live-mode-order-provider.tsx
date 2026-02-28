import React from 'react'

import checkoutActions from './checkout-actions'
import useActions from '../common/use-actions'
import NotFoundPage from '../home/not-found-page'
import {useAbandonableEffect} from '../hooks/abandonable-effect'
import {useSelector} from '../hooks'
import useQuery from '../common/use-query'

/**
 * Loads the order for the checkout session, and stores the order details in
 * Redux. If no order is specified in the URL query param, a "Not Found" page will
 * be shown.
 */
const LiveModeOrderProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const order = useSelector(state => state.checkout.order)
  const query = useQuery()
  const orderId = query.get('order')
  const {fetchOrder} = useActions(checkoutActions)

  useAbandonableEffect(async (executor) => {
    if (orderId && order?.orderId !== orderId) {
      await executor(fetchOrder(orderId))
    }
  }, [orderId])

  if (!orderId) {
    return <NotFoundPage />
  }

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>{children}</>
  )
}

export default LiveModeOrderProvider
