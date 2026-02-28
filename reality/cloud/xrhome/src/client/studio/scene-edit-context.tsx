import React, {useMemo} from 'react'
import type {DeepReadonly} from 'ts-essentials'
import {useTranslation} from 'react-i18next'
import type {SceneGraph} from '@ecs/shared/scene-graph'

import {MutateCallback, SceneContextProvider} from './scene-context'
import {useUndoStack} from './hooks/undo-stack'
import {SceneJsonEditor} from './studio-scenegraph-view'
import {updateObject} from './update-object'
import {DerivedSceneProvider} from './derived-scene-context'

interface ISceneEditContext {
  sceneProvider: () => DeepReadonly<SceneGraph> | null
  onSceneChange: (scene: DeepReadonly<SceneGraph>) => void
  children: React.ReactNode
}

const SceneEditContext: React.FC<ISceneEditContext> = ({
  sceneProvider, onSceneChange, children,
}) => {
  const {t} = useTranslation('cloud-studio-pages')
  const [scene, setScene] = React.useState(sceneProvider)
  const isDraggingGizmoRef = React.useRef(false)
  const [isDraggingGizmo, setIsDraggingGizmoState] = React.useState(false)
  const undoStack = useUndoStack<DeepReadonly<SceneGraph>>()
  const [isRenamingById, setIsRenamingById] = React.useState<Record<string, boolean>>({})

  const setIsRenaming = (id: string, isRenaming: boolean) => {
    setIsRenamingById(old => ({...old, [id]: isRenaming}))
  }

  React.useEffect(() => {
    setScene(sceneProvider())
  }, [sceneProvider])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onSceneChange(scene)
    }, 500)
    return () => clearTimeout(timeout)
  }, [scene])

  const sceneContextValue = useMemo(() => {
    if (!scene || typeof scene.objects !== 'object') {
      return null
    }
    const updateScene = (cb: MutateCallback<SceneGraph>) => {
      setScene((oldScene) => {
        undoStack.addToUndo(oldScene)
        return cb(oldScene)
      })
    }

    const setIsDraggingGizmo = (isDragging: boolean) => {
      isDraggingGizmoRef.current = isDragging
      setIsDraggingGizmoState(isDragging)
    }

    return {
      scene,
      updateScene,
      updateObject: updateObject.bind(null, updateScene),
      isDraggingGizmoRef,
      isDraggingGizmo,
      setIsDraggingGizmo,
      isRenamingById,
      setIsRenaming,
      canUndo: undoStack.canUndo,
      undo: () => {
        const oldScene = undoStack.undo(scene)
        if (oldScene) {
          setScene(oldScene)
        }
      },
      canRedo: undoStack.canRedo,
      redo: () => {
        const nextScene = undoStack.redo(scene)
        if (nextScene) {
          setScene(nextScene)
        }
      },
      playsUsingRuntime: true,
    } as const
  }, [
    scene, isDraggingGizmo,
    undoStack.canRedo, undoStack.canUndo, isRenamingById,
  ])

  if (!sceneContextValue) {
    return (
      <>
        <h2>{t('scene_edit_context.invalid_scene')}</h2>
        <SceneJsonEditor currentScene={scene} onSceneChange={setScene} />
      </>
    )
  }

  return (
    <SceneContextProvider value={sceneContextValue}>
      <DerivedSceneProvider>
        {children}
      </DerivedSceneProvider>
    </SceneContextProvider>
  )
}

export {
  SceneEditContext,
}

export type {
  ISceneEditContext,
}
