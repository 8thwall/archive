import {useSelector} from '../hooks'
import type {IAccount} from '../common/types/models'

const useAccountModules = (account: IAccount) => useSelector(s => (
  s.modules.byAccountUuid[account.uuid]?.map(i => s.modules.entities[i])
))

export {useAccountModules}
