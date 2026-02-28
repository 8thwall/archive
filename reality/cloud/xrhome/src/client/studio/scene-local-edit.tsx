import React from 'react'
import type {DeepReadonly} from 'ts-essentials'
import type {SceneGraph} from '@ecs/shared/scene-graph'

import {defaultScene} from './example/scenes/default-scene'
import {SceneEdit} from './scene-edit'
import {SceneEditContext} from './scene-edit-context'
import {ExampleComponentsContextProvider} from './example-studio-components-context'
import {SceneStateContext} from './scene-state-context'
import {StudioAgentStateContextProvider} from './studio-agent/studio-agent-context'
import {StudioPlayButtonTray} from './studio-play-button-tray'
import {ScenePlay} from './scene-play'
import {PublishingStateContextProvider} from '../editor/publishing/publish-context'
import {YogaParentContextProvider} from './yoga-parent-context'

const initialScene = (): DeepReadonly<SceneGraph> => {
  try {
    const sceneJson = localStorage.getItem('scene')
    if (sceneJson) {
      return JSON.parse(sceneJson)
    }
  } catch (err) {
    // Ignore
  }
  return defaultScene
}

const saveScene = (scene: DeepReadonly<SceneGraph>) => {
  try {
    localStorage.setItem('scene', JSON.stringify(scene))
  } catch (err) {
    // Ignore
  }
}

const SceneLocalEdit: React.FC = () => (
  <ExampleComponentsContextProvider>
    <SceneStateContext>
      <SceneEditContext
        sceneProvider={initialScene}
        onSceneChange={saveScene}
      >
        <StudioAgentStateContextProvider>
          <PublishingStateContextProvider>
            <YogaParentContextProvider>
              <SceneEdit
                playbackControls={<StudioPlayButtonTray />}
                renderScenePlayback={defaultCamera => (
                  <ScenePlay
                    defaultCamera={defaultCamera}
                  />
                )}
              />
            </YogaParentContextProvider>
          </PublishingStateContextProvider>
        </StudioAgentStateContextProvider>
      </SceneEditContext>
    </SceneStateContext>
  </ExampleComponentsContextProvider>
)

export {
  SceneLocalEdit,
}
