import {push} from 'redux-first-history'
import {batch} from 'react-redux'

import {dispatchify, onError} from '../common'
import authenticatedFetch from '../common/authenticated-fetch'
import unauthenticatedFetch from '../common/unauthenticated-fetch'
import {getPathForMyProjectsPage} from '../common/paths'
import accountActions from '../accounts/account-actions'
import crossAccountActions from '../cross-account-permissions/actions'
import type {AsyncThunk, DispatchifiedActions} from '../common/types/actions'
import type {Invitation, TeamRole} from './types'

const lightshipGetRoles = (): AsyncThunk => async (dispatch, getState) => {
  if (!getState().accounts.selectedAccount) {
    return
  }

  try {
    const {roles} = await dispatch(authenticatedFetch<{roles: TeamRole[]}>(
      `/v1/lightship/roles/${getState().accounts.selectedAccount}`
    ))
    dispatch({type: 'ROLES_SET', roles})
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
  }
}

const getRoles = () => (dispatch, getState) => (!getState().accounts.selectedAccount
  ? Promise.resolve()
  : dispatch(authenticatedFetch(`/v1/roles/${getState().accounts.selectedAccount}`))
    .then(({roles}) => dispatch({type: 'ROLES_SET', roles}))
    .catch(err => dispatch({type: 'ERROR', msg: err.message})))

const lightshipUpdateRole = (ua: TeamRole): AsyncThunk => async (dispatch, getState) => {
  try {
    const {roles} = await dispatch(authenticatedFetch<{roles: TeamRole[]}>(
      `/v1/lightship/roles/${getState().accounts.selectedAccount}`,
      {method: 'PUT', body: JSON.stringify(ua)}
    ))
    dispatch({type: 'ROLES_SET', roles})
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
  }
}

const updateRole = ua => (dispatch, getState) => dispatch(authenticatedFetch(`/v1/roles/${getState().accounts.selectedAccount}`, {method: 'PUT', body: JSON.stringify(ua)}))
  .then(({roles}) => dispatch({type: 'ROLES_SET', roles}))
  .catch(err => dispatch({type: 'ERROR', msg: err.message}))

const lightshipDeleteRole = (ua: TeamRole): AsyncThunk => async (dispatch, getState) => {
  try {
    await dispatch(authenticatedFetch(
      `/v1/lightship/roles/${getState().accounts.selectedAccount}`,
      {method: 'DELETE', body: JSON.stringify(ua)}
    ))

    dispatch(lightshipGetRoles())
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
  }
}

const deleteRole = ua => (dispatch, getState) => dispatch(authenticatedFetch(`/v1/roles/${getState().accounts.selectedAccount}`, {method: 'DELETE', body: JSON.stringify(ua)}))
  .then(() => dispatch(getRoles()))
  .catch(err => dispatch({type: 'ERROR', msg: err.message}))

const lightshipUninvite = ({email}: {email: string}): AsyncThunk => async (dispatch, getState) => {
  try {
    await dispatch(authenticatedFetch(
      '/v1/lightship/roles/invite', {
        method: 'DELETE',
        body: JSON.stringify({
          email, AccountUuid: getState().accounts.selectedAccount,
        }),
      }
    ))

    dispatch(lightshipGetRoles())
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
  }
}

const uninvite = ({email}) => (dispatch, getState) => dispatch(authenticatedFetch('/v1/roles/invite', {
  method: 'DELETE',
  body: JSON.stringify({
    email, AccountUuid: getState().accounts.selectedAccount,
  }),
}))
  .then(() => dispatch(getRoles()))
  .catch(err => dispatch({type: 'ERROR', msg: err.message}))

const lightshipInvite = (
  {emails}: {emails: string[]}
): AsyncThunk => async (dispatch, getState) => {
  try {
    await dispatch(authenticatedFetch('/v1/lightship/roles/invite', {
      method: 'POST',
      body: JSON.stringify({
        emails,
        AccountUuid: getState().accounts.selectedAccount,
      }),
    }))
    dispatch(lightshipGetRoles())
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
  }
}

const invite = ({emails}) => (dispatch, getState) => (
  dispatch(authenticatedFetch('/v1/roles/invite', {
    method: 'POST',
    body: JSON.stringify({
      emails,
      AccountUuid: getState().accounts.selectedAccount,
    }),
  }))
)
  .then(() => dispatch(getRoles()))
  .catch(err => dispatch({type: 'ERROR', msg: err.message}))

const checkInvitation = () => (dispatch) => {
  if (location.search) {
    const pair = location.search.slice(1).split('&')
      .map(kv => kv.split('='))
      .find(a => a[0] === 'invite')
    if (pair) {
      dispatch(unauthenticatedFetch(`/invited/${pair[1]}`))
        .then(invitation => dispatch({type: 'ROLES_INVITED', invitation}))
        .catch(err => dispatch({type: 'ROLES_INVITED_ERR', err}))
    }
  }
}

const lightshipWasInvited = (invitation: Invitation): AsyncThunk => async (dispatch) => {
  // Only send one request for invitation
  dispatch({type: 'ROLES_INVITED', invitation: null})

  try {
    const {message} = await dispatch(authenticatedFetch<{message: string}>(
      '/v1/lightship/roles/invited', {
        method: 'POST',
        body: JSON.stringify(invitation),
      }
    ))
    // NOTE(dat): We need to get the full user attributes but until then we know
    // for sure that these attributes are updated. This avoids UI flashes.
    dispatch({type: 'USER_ATTRIBUTES', attributes: {confirmed: true, email_verified: 'true'}})
    batch(() => {
      dispatch({type: 'MESSAGE', msg: message})
      accountActions(dispatch).getAccounts()
        .then((accounts) => {
          const newAccount = accounts.find(({uuid}) => uuid === invitation.accountUuid)
          if (newAccount) {
            accountActions(dispatch).loadAppsForAccount(newAccount.uuid)
            dispatch(lightshipGetRoles())
          }
        })
    })
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
  }
}

const wasInvited = (invitation: Invitation) => async (dispatch) => {
  dispatch({type: 'ROLES_INVITED', invitation: null})
  try {
    const {message} = await dispatch(authenticatedFetch('/v1/roles/invited', {
      method: 'POST',
      body: JSON.stringify(invitation),
    }))
    dispatch({type: 'MESSAGE', msg: message})
    dispatch({type: 'USER_ATTRIBUTES', attributes: {confirmed: true, email_verified: 'true'}})

    await crossAccountActions(dispatch).getListOfPermissionsByUser()
    await accountActions(dispatch).getAccounts()
    await accountActions(dispatch).setActivatingAccount(invitation.accountUuid)
    dispatch(push(getPathForMyProjectsPage()))
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
  }
}

const leaveTeam = (teamMember: TeamRole, accountUuid: string) => async (dispatch) => {
  try {
    dispatch({type: 'ROLES_PENDING', pending: {leaveTeam: true}})

    await dispatch(
      authenticatedFetch(`/v1/roles/${accountUuid}`,
        {method: 'DELETE', body: JSON.stringify(teamMember)})
    )
    // TODO(Brandon): Intended behavior here is to reset the redux state to a place it would be at
    // without the account we're leaving from.
    // Remove this account context from these state branches:
    // apps, accounts, crossaccountpermissions, selectedAccount, billing, payments, modules,
    // (more tbd)

    // TODO(Brandon): Use dispatch(push(getPathForMyProjectsPage())) when redux changes done.
    window.location.replace(getPathForMyProjectsPage())
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
  } finally {
    dispatch({type: 'ROLES_PENDING', pending: {leaveTeam: false}})
  }
}

const lightshipLeaveTeam = (ua: TeamRole): AsyncThunk => async (dispatch, getState) => {
  try {
    dispatch({type: 'ROLES_PENDING', pending: {leaveTeam: true}})

    await dispatch(authenticatedFetch(
      `/v1/lightship/roles/${getState().accounts.selectedAccount}`,
      {method: 'DELETE', body: JSON.stringify(ua)}
    ))

    window.location.replace('/account')
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
  } finally {
    dispatch({type: 'ROLES_PENDING', pending: {leaveTeam: false}})
  }
}

const initialize = checkInvitation

// //////////////////////////////////////////////////////////

export const rawActions = {
  lightshipGetRoles,
  getRoles,
  lightshipUpdateRole,
  updateRole,
  lightshipDeleteRole,
  deleteRole,
  lightshipInvite,
  invite,
  lightshipUninvite,
  uninvite,
  checkInvitation,
  lightshipWasInvited,
  wasInvited,
  initialize,
  error: onError,
  leaveTeam,
  lightshipLeaveTeam,
}

export type TeamActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)
