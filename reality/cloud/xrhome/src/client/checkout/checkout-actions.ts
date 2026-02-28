import {batch} from 'react-redux'

import {dispatchify} from '../common'
import type {DispatchifiedActions} from '../common/types/actions'
import {CheckoutActionType, CheckoutOrder, CheckoutPaymentMethod} from './checkout-types'
import {publicApiFetch} from '../common/public-api-fetch'

const fetchOrder = (orderId: string) => async (dispatch) => {
  batch(() => {
    dispatch({type: CheckoutActionType.PENDING, pending: {fetchOrder: true}})
    dispatch({type: CheckoutActionType.ERROR, error: {fetchOrder: false}})
  })

  try {
    const orderUrl = `/checkout/order/${orderId}`
    const order = await dispatch(publicApiFetch(orderUrl))
    dispatch({type: CheckoutActionType.ORDER, order})
  } catch (e) {
    dispatch({type: CheckoutActionType.ERROR, error: {fetchOrder: true}})
  } finally {
    dispatch({type: CheckoutActionType.PENDING, pending: {fetchOrder: false}})
  }
}

const setTestOrder = (
  order: CheckoutOrder
) => (dispatch) => {
  dispatch({type: CheckoutActionType.ORDER, order})
}

const setOrderSuccess = (
  paymentMethod: CheckoutPaymentMethod,
  completedAt: number
) => (dispatch) => {
  dispatch({type: CheckoutActionType.SUCCESS, completedAt, paymentMethod})
}

const rawActions = {
  fetchOrder,
  setTestOrder,
  setOrderSuccess,
}

export type CheckoutActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)
