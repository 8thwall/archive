import {useRouteMatch} from 'react-router-dom'

import {useSelector} from '../hooks'
import {getRouteAccount} from './paths'
import type {IAccount} from './types/models'
import {useEnclosedAccount} from '../accounts/enclosed-account-context'

const useCurrentRouteAccount = (): IAccount => {
  const match = useRouteMatch()
  return useSelector(state => getRouteAccount(state, match))
}

const useEnclosedAccountWithFallback = (): IAccount => {
  const enclosedAccount = useEnclosedAccount()
  const routeAccount = useCurrentRouteAccount()
  if (enclosedAccount) {
    return enclosedAccount
  }

  return routeAccount
}

const useCurrentAccount: () => IAccount = useEnclosedAccountWithFallback

export default useCurrentAccount

export {
  useCurrentRouteAccount,
}
