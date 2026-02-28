import {CrmState, CrmCustomer, LoadState} from './types'

export const isCrmDataLoaded = (crmState: CrmState): boolean => (
  crmState.currentUserLoading === LoadState.Loaded
)

export const getCurrentUserCrmCustomer = (crmState: CrmState): CrmCustomer => (
  crmState.currentUserLoading === LoadState.Loaded
    ? crmState.entities[crmState.currentUser]
    : undefined
)
