import React from 'react'

import type {User} from './user-config'

interface IUserContext {
  currentUser?: User
  userAttributes?: {[key: string]: string}
  updateUserAttributes: (attributes: {[key: string]: string}) => void
  isUserEligibleForFreeTrial: boolean
  signOut: () => void

}

const UserContext = React.createContext<IUserContext>(null)

const useUserContext = () => React.useContext(UserContext)

const UserContextProvider = UserContext.Provider

export {
  UserContext,
  useUserContext,
  UserContextProvider,
}

export type {
  IUserContext,
}
