import {dispatchify} from '../common/index'
import {publicApiFetch} from '../common/public-api-fetch'
import type {DispatchifiedActions} from '../common/types/actions'
import {GET_PARTNERS} from './partners-types'

const getPartners = () => async (dispatch) => {
  try {
    const {
      premierPartners,
      partners,
    } = await dispatch(publicApiFetch('/partners/partners'))
    dispatch({type: GET_PARTNERS, premierPartners, partners})
  } catch (error) {
    dispatch({type: 'ERROR', msg: error.message})
  }
}

export const rawActions = {
  getPartners,
}

export type PartnersActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)
