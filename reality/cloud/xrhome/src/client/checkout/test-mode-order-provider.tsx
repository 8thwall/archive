import React, {useEffect, useMemo} from 'react'
import {useLocation} from 'react-router-dom'

import checkoutActions from './checkout-actions'
import useActions from '../common/use-actions'
import NotFoundPage from '../home/not-found-page'
import {useSelector} from '../hooks'
import type {CheckoutOrder} from './checkout-types'

const useOrderQueryParam = () => {
  const {search} = useLocation()
  return useMemo(() => {
    const query = new URLSearchParams(search)
    const orderParam = query.get('order')

    if (!orderParam) {
      return null
    }

    try {
      // TODO(alvin): Validate the fields in the object.
      const order = JSON.parse(decodeURI(orderParam)) as CheckoutOrder
      return order
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      return null
    }
  }, [search])
}

/**
 * Loads the order for the checkout session, and stores the order details in
 * Redux. If no order is specified in the URL query param, a "Not Found" page will
 * be shown.
 */
const TestModeOrderProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const order = useSelector(state => state.checkout.order)
  const orderParam = useOrderQueryParam()
  const {setTestOrder} = useActions(checkoutActions)

  useEffect(() => {
    if (orderParam && !order) {
      setTestOrder({...orderParam, status: 'requires_payment_method', orderId: 'pi_test_1234'})
    }
  }, [orderParam])

  if (!order) {
    return <NotFoundPage />
  }

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>{children}</>
  )
}

export default TestModeOrderProvider
