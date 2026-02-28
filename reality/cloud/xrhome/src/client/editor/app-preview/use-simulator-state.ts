import {useSelector} from '../../hooks'
import type {SimulatorState} from '../editor-reducer'
import useActions from '../../common/use-actions'
import editorActions from '../editor-actions'
import useCurrentApp from '../../common/use-current-app'
import type {IApp} from '../../common/types/models'
import {isCloudStudioApp} from '../../../shared/app-utils'

const useSimulatorState = (appKey: string): SimulatorState => (
  useSelector(state => state.editor.byKey[appKey]?.simulatorState) || {}
)

type SimulatorHook = {
  // NOTE(christoph): inlinePreviewVisible is not the source of truth for whether the
  // simulator is visible. Use useSimulatorVisible.
  simulatorState: Omit<SimulatorState, 'inlinePreviewVisible'>
  updateSimulatorState: (status: Partial<SimulatorState>) => void
}

const useSimulator = (): SimulatorHook => {
  const app = useCurrentApp()
  const {updateSimulatorState} = useActions(editorActions)
  return {
    simulatorState: useSimulatorState(app.appKey),
    updateSimulatorState: (status: Partial<SimulatorState>) => {
      updateSimulatorState(app.appKey, status)
    },
  }
}

const useSimulatorVisible = (app: IApp) => useSelector((s) => {
  const appState = s.editor.byKey[app.appKey]
  if (!appState?.simulatorState) {
    return false
  }

  return appState.simulatorState.inlinePreviewVisible ??
  (!isCloudStudioApp(app) && !!app.defaultSimulatorSequence)
})

export {
  useSimulatorState,
  useSimulatorVisible,
  useSimulator,
}
