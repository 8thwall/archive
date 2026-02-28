import {DeviceRemoteType, useLocalBuildUrl} from '../../studio/local-sync-context'
import type {IApp} from '../../common/types/models'
import {useCurrentGit} from '../../git/hooks/use-current-git'
import {userBranchUrl} from '../../common/hosting-urls'

// @param isRemoteViewer if true, the url is accessible from another computer. i.e. not localhost.
//                       this is only used in desktop mode to switch between localhost and LAN IP.
const useProjectPreviewUrl = (app: IApp,
  deviceType: DeviceRemoteType = 'same-device') => {
  const git = useCurrentGit()
  const studioLocalBuildUrl = useLocalBuildUrl(deviceType)

  if (!git || !app) {
    return null
  }

  return Build8.PLATFORM_TARGET === 'desktop'
    ? studioLocalBuildUrl
    : userBranchUrl({git, app})
}

export {useProjectPreviewUrl}
