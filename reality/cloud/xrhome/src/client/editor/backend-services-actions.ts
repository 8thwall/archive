import {dispatchify} from '../common'
import type {DispatchifiedActions} from '../common/types/actions'
import authenticatedFetch from '../common/authenticated-fetch'

type BackendAccount = {}

const requestAccount = (appUuid: string) => {
  const apiPath = `/v1/backend-services/account/${appUuid}`
  return authenticatedFetch<BackendAccount>(apiPath, {method: 'POST'})
}

const rawActions = {
  requestAccount,
}

type BackendServicesActions = DispatchifiedActions<typeof rawActions>

const backendServicesActions = dispatchify(rawActions)

export {
  backendServicesActions as default,
  rawActions,
}

export type {
  BackendServicesActions,
}
