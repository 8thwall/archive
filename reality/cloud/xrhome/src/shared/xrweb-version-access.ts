import type {DeepReadonly} from 'ts-essentials'

import {is8thWallAccountUuid, isSpecialFeatureEnabled} from './account-utils'
import type {Account} from './integration/db/models'
import {NIA} from './special-features'
import type {VersionChannel} from './xrweb-version-types'

type AccountInfo = DeepReadonly<Pick<Account, 'uuid' | 'specialFeatures'>>

const hasInternalEngineVersionAccess = (account: AccountInfo) => (
  isSpecialFeatureEnabled(account, NIA) ||
  is8thWallAccountUuid(account.uuid)
)

const hasLocalEngineVersionAccess = (accountUuid: string) => is8thWallAccountUuid(accountUuid)

const isPublicXrwebChannelName = (name: string) => name.startsWith('js_')

const isVersionAvailableToAccount = (account: AccountInfo, {name}: VersionChannel) => {
  // All public javascript releases will begin with js_
  if (hasInternalEngineVersionAccess(account)) {
    return !['release', 'beta'].includes(name)
  }
  return isPublicXrwebChannelName(name)
}

const isFrozenVersion = (version: string | null) => (
  typeof version === 'string' && version.includes('.')
)

export {
  hasInternalEngineVersionAccess,
  hasLocalEngineVersionAccess,
  isPublicXrwebChannelName,
  isVersionAvailableToAccount,
  isFrozenVersion,
}
