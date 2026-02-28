import React from 'react'

import useActions from '../../common/use-actions'
import {useCurrentMemberAccount} from '../../common/use-current-member-account'
import {useSelector} from '../../hooks'
import tokenActions from '../../tokens/token-actions'
import {useMountedRef} from '../../hooks/use-mounted'
import {useUserUuid} from '../../user/use-current-user'
import {useDocumentVisibility} from '../../hooks/use-document-visibility'

type DevTokenOptions = {
  disabled?: boolean
  version?: string
}

const useDevToken = (options?: DevTokenOptions) => {
  const account = useCurrentMemberAccount()
  const [loading, setLoading] = React.useState(true)
  const mountedRef = useMountedRef()

  const documentVisibility = useDocumentVisibility()

  const enabled = !options?.disabled

  const refreshActive = documentVisibility === 'visible' && enabled

  const userUuid = useUserUuid()
  const installedVersion = useSelector(state => state.tokens.installedDevCookie.version)
  const devInviteRes = useSelector(state => state.tokens.devInviteRes)

  const version = options?.version || installedVersion || 'js_release'

  const {
    beginDevTokenInviteRefresh, endDevTokenInviteRefresh, updateDevInviteRequest,
  } = useActions(tokenActions)

  React.useEffect(() => {
    updateDevInviteRequest({
      version,
      uuid: userUuid,
      AccountUuid: account.uuid,
      shortName: account.shortName,
    })
  }, [account, version, userUuid])

  React.useEffect(() => {
    if (!refreshActive) {
      return undefined
    }

    beginDevTokenInviteRefresh().then(() => {
      if (mountedRef.current) {
        setLoading(false)
      }
    })

    return () => {
      endDevTokenInviteRefresh()
    }
  }, [refreshActive])

  if (!enabled || !devInviteRes?.url || loading) {
    return null
  }

  return devInviteRes
}

export {
  useDevToken,
}
