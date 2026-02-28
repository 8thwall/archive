import {isWebAccount} from '../../../shared/account-utils'
import type {IAccount} from '../../common/types/models'

const areCreditPlansEnabled = (account: IAccount): boolean => (
  isWebAccount(account)
)

export {
  areCreditPlansEnabled,
}
