import type {DeepReadonly} from 'ts-essentials'

import type {
  RawActions, CallableAction, DispatchifiedActions, Dispatch, Actions,
} from './types/actions'

import StateChangeComponent from './state-change-component'
import type {TeamRole} from '../team/types'
import type {IAccount, IApp} from './types/models'
import type {RootState} from '../reducer'

const onSuccess = (msg: string) => (dispatch: Dispatch) => dispatch({type: 'SUCCESS', msg})
const onError = (msg: string) => (dispatch: Dispatch) => dispatch({type: 'ERROR', msg})

/* eslint-disable-next-line arrow-parens */
const dispatchify = <T extends RawActions>(actions: T) => (dispatch: Dispatch) => (
  Object.keys(actions).reduce((o, key: keyof T) => {
    o[key] = ((...args: any) => dispatch(actions[key](...args))) as CallableAction<T[typeof key]>
    return o
  }, {} as DispatchifiedActions<T>)
)

const mergeActions = (...dispatchifiedActions: Actions<{}>[]) => (dispatch: Dispatch) => (
  Object.assign({}, ...dispatchifiedActions.map(a => a(dispatch)))
)

const roles = ['OWNER', 'ADMIN', 'BILLMANAGER', 'DEV', 'INVITED']

type SortableRole = DeepReadonly<Pick<TeamRole, 'role' | 'given_name' | 'family_name'>>

const sortByUser = (a: SortableRole, b: SortableRole) => {
  const ai = roles.indexOf(a.role)
  const bi = roles.indexOf(b.role)
  if (ai >= 0 && ai < bi) return -1
  if (bi >= 0 && bi < ai) return 1
  if (a.given_name < b.given_name) return -1
  if (a.given_name > b.given_name) return 1
  if (a.family_name < b.family_name) return -1
  if (a.family_name > b.family_name) return 1
  return 0
}

const accountTypes = ['WebEnterprise', 'WebCamera', 'WebDeveloper', 'UnityDeveloper']

type SortableAccount = Pick<IAccount, 'accountType' | 'name'>

const sortByAccount = (a: SortableAccount, b: SortableAccount) => {
  const ai = accountTypes.indexOf(a.accountType.replace('Pro', ''))
  const bi = accountTypes.indexOf(b.accountType.replace('Pro', ''))
  if (ai >= 0 && ai < bi) return -1
  if (bi >= 0 && ai > bi) return 1
  if (a.name < b.name) return -1
  if (a.name > b.name) return 1
  return 0
}

type SortableApp = Pick<IApp, 'appName' | 'appKey'>

const sortByApp = (a: SortableApp, b: SortableApp) => {
  if (a.appName < b.appName) return -1
  if (a.appName > b.appName) return 1
  return 0
}

const sortByUsage = (state: Pick<RootState, 'usage'>, field: 'TOTAL' | 'VIEWS') => {
  const usageByKey = (field === 'TOTAL' ? state.usage.summaries : state.usage.views)
    .reduce((o, v) => Object.assign(o, {[v.appKey]: Number(v[field]) + (o[v.appKey] || 0)}), {})
  return (a: SortableApp, b: SortableApp) => {
    const au = (usageByKey[a.appKey] || 0)
    const bu = (usageByKey[b.appKey] || 0)
    if (au > bu) {
      return -1
    }
    if (au < bu) {
      return 1
    }
    return sortByApp(a, b)
  }
}

const goDocs = (fragment: string) => `https://www.8thwall.com/docs/${fragment}`

// DEPLOYMENT_STAGE is dynamically deduced because the same build artifact is hosted on both
// staging and prod
const envDeploymentStage = () => ({
  'www.8thwall.com': 'prod',
  'console-staging.8thwall.com': 'staging',
  'staging.8thwall.com': 'staging',
  'www-rc.8thwall.com': 'staging',
  'www-cd.8thwall.com': 'staging',
  'console-dev.8thwall.com': 'dev',
  'www-cd.qa.8thwall.com': 'dev',
  'www-rc.qa.8thwall.com': 'dev',
  'lightship.dev': 'prod',
  'rc.lightship.dev': 'staging',
  'cd.qa.lightship.dev': 'dev',
}[window.location.host] || 'local')

export {
  dispatchify,
  envDeploymentStage,
  goDocs,
  mergeActions,
  onError,
  onSuccess,
  sortByAccount,
  sortByUsage,
  sortByUser,
  StateChangeComponent,
}
