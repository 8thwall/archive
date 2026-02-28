import React from 'react'

import './set-three'
import {useCurrentGit} from '../git/hooks/use-current-git'
import useActions from '../common/use-actions'
import {ISceneEdit, SceneEdit} from './scene-edit'
import {StudioDebugControlsTray} from './studio-debug-controls-tray'

import {actions as gitActions} from '../git/git-actions'
import {useSimulator, useSimulatorVisible} from '../editor/app-preview/use-simulator-state'
import useCurrentApp from '../common/use-current-app'
import {useStudioDebug} from '../editor/app-preview/use-studio-debug-state'
import {DebugSimulatorPanel} from './debug-simulator-panel'
import {useStudioStateContext} from './studio-state-context'
import {UserGeolocationContextProvider} from '../apps/vps/user-geolocation-context'
import {StudioMapContainer} from './gsb/studio-map-container'
import {YogaParentContextProvider} from './yoga-parent-context'

interface ISceneFileEdit extends ISceneEdit {
  simulatorId: string
}

const SceneFileEdit: React.FC<ISceneFileEdit> = ({simulatorId, ...rest}) => {
  const repo = useCurrentGit(git => git.repo)
  const {ensureSimulatorReady} = useActions(gitActions)
  const {updateSimulatorState} = useSimulator()
  const app = useCurrentApp()

  const simulatorVisible = useSimulatorVisible(app)
  const {selectSimulatorDebugSession} = useStudioDebug()
  const stateCtx = useStudioStateContext()
  const {simulatorCollapsed, simulatorMode} = stateCtx.state

  const maybeOpenSimulator = () => {
    if (simulatorVisible) {
      selectSimulatorDebugSession(simulatorId)
      return
    }

    ensureSimulatorReady(repo)
    updateSimulatorState({inlinePreviewVisible: true, inlinePreviewDebugActive: true})
    stateCtx.update({
      simulatorCollapsed: false,
    })
  }

  const inFullscreenSimulator = simulatorMode === 'full' && simulatorVisible && !simulatorCollapsed

  return (
    <YogaParentContextProvider>
      <SceneEdit
        hideViewport={inFullscreenSimulator}
        playbackControls={(
          <StudioDebugControlsTray
            onPlay={maybeOpenSimulator}
            simulatorId={simulatorId}
          />
        )}
        simulatorPanel={<DebugSimulatorPanel simulatorId={simulatorId} />}
        mapPanel={
        !inFullscreenSimulator &&
          <UserGeolocationContextProvider>
            <StudioMapContainer />
          </UserGeolocationContextProvider>
      }
        {...rest}
      />
    </YogaParentContextProvider>
  )
}

export default SceneFileEdit
