import {createSelector} from 'reselect'

import type {UserState} from './user-reducer'
import type {RootState} from '../reducer'
import {useSelector} from '../hooks'
import type {
  UserNianticReduxState, ErrorState, PendingState,
} from '../user-niantic/user-niantic-types'

// NOTE(johnny): UserNianticReduxState should not be Partial. This is a workaround for the
// fact that we have two state types depending on the buildif.
type CombinedUserState = UserState & Partial<UserNianticReduxState>

type UserSelector<T> = (user: CombinedUserState) => T

function useCurrentUser(): CombinedUserState
// eslint-disable-next-line no-redeclare
function useCurrentUser<T>(selector: UserSelector<T>): T
// eslint-disable-next-line no-redeclare
function useCurrentUser<T>(selector?: UserSelector<T>) {
  const userSelector = createSelector(
    (state: RootState) => state.user,
    (state: RootState) => state.userNiantic,
    (user, userNiantic) => {
      const combinedUser = {...user, ...userNiantic} as const
      if (selector) {
        return selector(combinedUser)
      } else {
        return combinedUser
      }
    }
  )
  return useSelector(userSelector)
}

const useUserUuid = () => useCurrentUser(user => user.uuid)
const useUserEmail = () => useCurrentUser(
  user => user.loggedInUser?.primaryContactEmail || user.email
)
const useUserConfirmed = () => useCurrentUser(user => user.confirmed)
const useUserGivenName = () => useCurrentUser(user => user.given_name)
const useUserLocale = () => useCurrentUser(user => user?.locale)

const useUserHasSession = () => useCurrentUser(user => (!!user.loggedInUser))

const useGarUser = () => useSelector(state => state.userNiantic.loggedInUser)

const useUserPending = (action: keyof PendingState) => (
  useSelector(state => state.userNiantic.pending?.[action])
)

const useUserError = (action: keyof ErrorState) => (
  useSelector(state => state.userNiantic.error?.[action])
)

export type {
  CombinedUserState,
}

export {
  useCurrentUser,
  useUserUuid,
  useUserEmail,
  useUserConfirmed,
  useUserGivenName,
  useUserLocale,
  useUserHasSession,
  useGarUser,
  useUserPending,
  useUserError,
}
