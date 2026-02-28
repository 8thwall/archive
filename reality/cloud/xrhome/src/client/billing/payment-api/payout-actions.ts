import {batch} from 'react-redux'

import {dispatchify} from '../../common'
import type {DispatchifiedActions} from '../../common/types/actions'
import {PayoutActionType} from './payout-types'
import authenticatedFetch from '../../common/authenticated-fetch'

const fetchDetails = (accountUuid: string) => async (dispatch) => {
  batch(() => {
    dispatch({type: PayoutActionType.PENDING, pending: true})
    dispatch({type: PayoutActionType.ERROR, error: {}})
  })

  try {
    const detailsUrl = `/v1/payments/details/${accountUuid}`
    const details = await dispatch(authenticatedFetch(detailsUrl))
    dispatch({type: PayoutActionType.DETAILS, payoutDetails: details})
  } catch (e) {
    dispatch({type: PayoutActionType.ERROR, error: {status: e.status, message: e.message}})
  } finally {
    dispatch({type: PayoutActionType.PENDING, pending: false})
  }
}

const clearDetails = () => (dispatch) => {
  dispatch({type: PayoutActionType.CLEAR})
}

const rawActions = {
  fetchDetails,
  clearDetails,
}

export type DiscoveryActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)
