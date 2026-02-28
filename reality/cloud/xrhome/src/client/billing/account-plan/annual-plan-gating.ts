import {
  isStarter, isPro, isPlus, isBasic, isWebAccount,
} from '../../../shared/account-utils'
import type {IAccount} from '../../common/types/models'

const isAnnualBillingAllowed = (account: IAccount) => {
  if (!isWebAccount(account)) {
    return false
  }

  return isBasic(account) ||
    isStarter(account) ||
    isPro(account) ||
    isPlus(account)
}

export {
  isAnnualBillingAllowed,
}
