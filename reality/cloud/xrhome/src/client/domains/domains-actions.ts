import {dispatchify} from '../common'
import authenticatedFetch from '../common/authenticated-fetch'
import type {DispatchifiedActions} from '../common/types/actions'

const getCustomDomain = (entityType, uuid) => dispatch => (
  dispatch(authenticatedFetch(`/v1/domains/${entityType}/${uuid}`))
)

const createCustomDomain = (entityType, uuid, publicDomain, redirectDomains) => dispatch => (
  dispatch(authenticatedFetch(`/v1/domains/${entityType}/${uuid}`, {
    method: 'POST',
    body: JSON.stringify({
      publicDomain,
      redirectDomains,
      // TODO add stagingDomain
    }),
  }))
    .then((res) => {
      if (res.status === 'success') {
        dispatch({
          type: (entityType === 'app' ? 'APPS_UPDATE' : 'UPDATE_ACCOUNT'),
          [entityType]: {uuid, connectedDomain: res.connectedDomain},
        })
      }

      return res
    })
)

const deleteCustomDomain = (entityType, uuid) => dispatch => (
  dispatch(authenticatedFetch(`/v1/domains/${entityType}/${uuid}`, {method: 'DELETE'}))
    .then(() => {
      const action = {
        type: (entityType === 'app' ? 'APPS_UPDATE' : 'UPDATE_ACCOUNT'),
        [entityType]: {uuid, connectedDomain: null},
      }
      dispatch(action)
    })
)

// When the retry was successful this endpoint returns also the association like getCustomDomain().
const retryCustomDomainStep = (entityType, uuid, step) => dispatch => (
  dispatch(authenticatedFetch(`/v1/domains/${entityType}/${uuid}/retry/${step}`, {
    method: 'POST',
  }))
)

const rawActions = {
  createCustomDomain,
  getCustomDomain,
  deleteCustomDomain,
  retryCustomDomainStep,
}

export type DomainActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)
