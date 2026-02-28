import type {DeepReadonly} from 'ts-essentials'

import type {SimulatorConfig} from './app-preview-utils'
import type {IApp} from '../../common/types/models'
import {useDevToken} from '../token/use-dev-token'
import {useSelector} from '../../hooks'
import {useProjectPreviewUrl} from './use-project-preview-url'

type LiveSyncMode = 'inline' | undefined

type EncodedUrlInfo = {
  // The base URL that the user would end up on (excluding simulatorConfig)
  rawDevUrl: string
  // The full URL with the simulatorConfig and token redirects inserted
  currentConfigUrl: string
}

const useSimulatorConfigUrl = (
  app: IApp,
  simulatorConfig: DeepReadonly<SimulatorConfig>,
  alreadyAppliedToken: boolean,
  sessionId?: string,
  liveSyncMode?: LiveSyncMode
): EncodedUrlInfo => {
  const devInviteRes = useDevToken({disabled: alreadyAppliedToken})

  const previewLinkDebugMode = useSelector(state => !!state.editor.previewLinkDebugMode)

  const projectUrl = useProjectPreviewUrl(app)

  if ((!devInviteRes && !alreadyAppliedToken) || !projectUrl) {
    return {rawDevUrl: null, currentConfigUrl: null}
  }

  const currentConfigUrl = new URL(projectUrl)

  currentConfigUrl.searchParams.set('d', String(previewLinkDebugMode))

  // NOTE(christoph): By including the 'd' parameter in rawDevUrl, we cause a reload if it changes.
  const rawDevUrl = currentConfigUrl.toString()

  currentConfigUrl.searchParams.set('simulatorConfig', JSON.stringify(simulatorConfig))

  if (sessionId) {
    currentConfigUrl.searchParams.set('sessionId', sessionId)
  }

  if (liveSyncMode) {
    currentConfigUrl.searchParams.set('liveSyncMode', liveSyncMode)
  }

  // The triple redirect below will Set-Cookie for the app domain and the com domain.
  // If we have already applied this token, skip the triple redirect.
  // If we are in web QA mode, we are unlikely to be running local app server, skip.
  // If we are in desktop mode, we do want the triple redirect so the cookie can be intercepted.
  if (alreadyAppliedToken || (BuildIf.ALL_QA && Build8.PLATFORM_TARGET !== 'desktop')) {
    return {rawDevUrl, currentConfigUrl: currentConfigUrl.toString()}
  }

  // Set the url to the dev token invite URL which does the triple redirect.
  const tokenUrl = new URL(devInviteRes.url)
  tokenUrl.searchParams.set('to', currentConfigUrl.toString())

  return {
    rawDevUrl,
    currentConfigUrl: tokenUrl.toString(),
  }
}

export {
  useSimulatorConfigUrl,
}

export type {
  LiveSyncMode,
}
