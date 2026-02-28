import type {DeepReadonly} from 'ts-essentials'

import useCurrentAccount from './use-current-account'
import type {VersionChannel} from '../../shared/xrweb-version-types'
import {
  hasInternalEngineVersionAccess, isPublicXrwebChannelName,
} from '../../shared/xrweb-version-access'
import {useSelector} from '../hooks'

const useAvailableXrwebVersions = (): DeepReadonly<VersionChannel[]> => {
  const account = useCurrentAccount()
  // NOTE(christoph): Even though we only return versions from the server that the
  // user has access to, we still filter them here depending on which account is selected.
  const hasInternalAccess = hasInternalEngineVersionAccess(account)
  return useSelector(s => s.common.versions)
    .filter(({name}) => hasInternalAccess || isPublicXrwebChannelName(name))
    .sort((a, b) => {
      if (a.name === 'local') {
        return 1
      } else if (b.name === 'local') {
        return -1
      } else {
        return a.build < b.build ? -1 : 1
      }
    })
}

export {
  useAvailableXrwebVersions,
}
