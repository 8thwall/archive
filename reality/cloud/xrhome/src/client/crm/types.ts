import type {DeepReadonly} from 'ts-essentials'
/* eslint-disable camelcase */
type CrmId = string

// These keys match the data given by our CRM
// to avoid building our own adapter
interface CrmCustomer {
  vid: CrmId
  firstname: string
  lastname: string
  phone: string
  company: string
  company_size: string
  job_function: string
  industry: string
  lifecyclestage: string

  email_verified: boolean
  free_trial_stage: string
  free_trial_cancellation_reason: string
  free_trial_workspace_shortname: string
}

enum LoadState {
  Initial,
  Loading,
  Loaded,
  Stale,
}

// We are following the style for Normalized State Structure
// https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape
interface CrmState extends DeepReadonly<{
  entities: Record<CrmId, CrmCustomer>
  currentUser: CrmId
  currentUserLoading: LoadState
}> {}

export {
  LoadState,
}

export type {
  CrmState,
  CrmCustomer,
  CrmId,
}
