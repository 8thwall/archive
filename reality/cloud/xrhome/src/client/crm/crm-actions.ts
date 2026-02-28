import {dispatchify} from '../common'
import authenticatedFetch from '../common/authenticated-fetch'
import type {DispatchifiedActions} from '../common/types/actions'
import {currentUserLoaded, currentUserLoading} from './crm-reducer'
import {LoadState} from './types'

const getCurrentUserCrm = () => (dispatch, getState) => {
  if (getState().crm.currentUserLoading === LoadState.Loading) {
    return null
  }

  dispatch(currentUserLoading(LoadState.Loading))
  return dispatch(authenticatedFetch('/v1/crm')).then((crmData) => {
    dispatch(currentUserLoaded(crmData.vid ? crmData : undefined))
  }).catch((e) => {
    dispatch({type: 'ERROR', msg: e})
    dispatch(currentUserLoading(LoadState.Stale))
  })
}

const updateCurrentUserCrm = (
  company: string,
  jobFunction: string,
  industry: string,
  onboardingStage: string = null,
  onboardingAccountUuid: string = null
) => dispatch => dispatch(authenticatedFetch('/v1/crm', {
  method: 'PATCH',
  body: JSON.stringify({
    company,
    job_function: jobFunction,
    industry,
    workspace_onboarding_stage: onboardingStage,
    workspace_onboarding_account: onboardingAccountUuid,
  }),
})).then((crmData) => {
  dispatch(currentUserLoaded(crmData.vid ? crmData : undefined))
}).catch((e) => {
  dispatch({type: 'ERROR', msg: e})
  dispatch(currentUserLoading(LoadState.Stale))
})

const rawActions = {
  getCurrentUserCrm,
  updateCurrentUserCrm,
}

export type CrmActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)
