import {useRouteMatch} from 'react-router-dom'

import {useSelector} from '../hooks'
import {getRouteMemberAccount} from './paths'
import type {IApp, IExternalAccount} from './types/models'

interface AppSharingInfo {
  isExternalApp: boolean
  externalOwnerAccount: IExternalAccount | null
  memberInviteeAccount: IExternalAccount | null
  sharingAccounts: IExternalAccount[]
}

const useAppSharingInfo = (app: IApp): AppSharingInfo => {
  const rootState = useSelector(state => state)
  const match = useRouteMatch()
  const account = getRouteMemberAccount(rootState, match)
  const allAccounts = useSelector(state => state.accounts.allAccounts)
  const permissionsState = useSelector(state => state.crossAccountPermissions)

  if (!app) {
    return {
      isExternalApp: false,
      externalOwnerAccount: null,
      memberInviteeAccount: null,
      sharingAccounts: [],
    }
  }

  let ownsApp = account?.uuid === app.AccountUuid
  if (!account) {
    // We're not on an account page. Let's check if any member account own this app.
    ownsApp = allAccounts.some(a => a.uuid === app.AccountUuid)
  }

  if (!ownsApp) {
    // The user does not own this app, therefore, they are not sharing this app
    // with anyone.
    const permissionUuid = permissionsState.byAppUuid[app.uuid][0]
    const permission = permissionsState.entities[permissionUuid]
    return {
      isExternalApp: true,
      externalOwnerAccount: permission.FromAccount,
      memberInviteeAccount: (account || permission.ToAccount) as IExternalAccount,
      sharingAccounts: [],
    }
  }

  const uuids = permissionsState.byAppUuid[app.uuid] || []
  const sharingAccounts = uuids.map(uuid => permissionsState.entities[uuid].ToAccount)
  return {
    isExternalApp: false,
    externalOwnerAccount: null,
    memberInviteeAccount: null,
    sharingAccounts,
  }
}

export default useAppSharingInfo
