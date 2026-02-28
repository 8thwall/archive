import {useRouteMatch} from 'react-router-dom'

import {useSelector} from '../hooks'
import {getRouteMemberAccount} from './paths'
import type {IAccount} from './types/models'
import {useEnclosedAccount} from '../accounts/enclosed-account-context'

const useCurrentMemberAccount = (): IAccount => {
  const match = useRouteMatch()
  const enclosedAccount = useEnclosedAccount()
  const routeAccount = useSelector(state => getRouteMemberAccount(state, match))

  return routeAccount || enclosedAccount
}

export {useCurrentMemberAccount}
