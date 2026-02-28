import type {UserAccountRole} from '../common/types/db'
import type {IAccount} from '../common/types/models'
import {useUserUuid} from '../user/use-current-user'

const useUserAccountRole = (account: IAccount | undefined): UserAccountRole | undefined => {
  const userUuid = useUserUuid()
  return account?.Users.find(u => u.UserUuid === userUuid)?.role
}

export {
  useUserAccountRole,
}
