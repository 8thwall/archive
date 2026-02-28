import {
  isEnterprise,
  isSpecialFeatureEnabled,
  isWebAccount,
  type PickAccount,
} from '../account-utils'

const hasUnlimitedWhiteLabelAccess = (
  account: PickAccount<'accountType' | 'specialFeatures'>
): boolean => isEnterprise(account) && isSpecialFeatureEnabled(account, 'unlimitedWhiteLabel')

const canPurchaseWhiteLabelLicense = (
  account: PickAccount<'accountType' | 'specialFeatures'>
): boolean => {
  if (isEnterprise(account)) {
    return hasUnlimitedWhiteLabelAccess(account)
  }

  return isWebAccount(account)
}

export {
  canPurchaseWhiteLabelLicense,
  hasUnlimitedWhiteLabelAccess,
}
