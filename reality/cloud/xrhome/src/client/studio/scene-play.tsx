import React from 'react'
import {useFrame, useThree} from '@react-three/fiber'
import {createWorld, ready as ecsReady, isReady} from '@ecs/runtime'
import {CameraEvents} from '@ecs/runtime/camera-events'
import type {CameraObject} from '@ecs/runtime/camera-manager-types'

import {useSceneContext} from './scene-context'
import './example'
import {useDebounced} from './use-debounced'
import {useStudioStateContext} from './studio-state-context'

const {ACTIVE_CAMERA_CHANGE} = CameraEvents

interface IScenePlay {
  defaultCamera: CameraObject
}

const useRuntimeReady = () => {
  const [, setRerender] = React.useState(false)

  const ready = isReady()

  React.useEffect(() => {
    if (ready) {
      return undefined
    }
    let cancelled = false
    ecsReady().then(() => {
      if (!cancelled) {
        setRerender(s => !s)
      }
    })
    return () => {
      cancelled = true
    }
  })

  return ready
}

const ScenePlay: React.FC<IScenePlay> = ({defaultCamera}) => {
  const latestScene = useSceneContext()
  const scene = useDebounced(latestScene, 750)
  const [errored, setErrored] = React.useState(false)
  const {state: {isPreviewPaused: paused, pointing, restartKey}} = useStudioStateContext()
  const three = useThree()
  const runtimeReady = useRuntimeReady()

  const world = React.useMemo(() => (
    runtimeReady ? createWorld(three.scene, three.gl, defaultCamera) : undefined
  ), [three.scene, three.gl, defaultCamera, runtimeReady, restartKey])

  React.useLayoutEffect(() => {
    if (!world) {
      return undefined
    }
    try {
      const spawned = world.loadScene(scene.scene)
      return () => {
      // TODO(christoph): Refresh existing entities rather than replacing entirely
        spawned.remove()
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      setErrored(true)
      world.destroy()
      throw err
    }
  }, [world, scene.scene])

  React.useLayoutEffect(() => {
    if (!world || paused || errored) {
      return undefined
    }
    world.start()
    return () => world.stop()
  }, [paused, errored, world])

  React.useLayoutEffect(() => {
    if (world && pointing) {
      const handleCameraChange = (e: any) => {
        three.set({camera: e.data.camera})
      }
      world.events.addListener(world.events.globalId, ACTIVE_CAMERA_CHANGE, handleCameraChange)

      world.camera.attach()
      world.pointer.attach()
      world.input.attach()
      return () => {
        world.events.removeListener(world.events.globalId, ACTIVE_CAMERA_CHANGE, handleCameraChange)
        three.set({camera: defaultCamera})
        world.camera.detach()
        world.pointer.detach()
        world.input.detach()
      }
    }
    return undefined
  }, [world, pointing, defaultCamera])

  React.useLayoutEffect(() => () => world?.destroy(), [world])

  useFrame(() => {
    three.invalidate()
  })

  return (
    null
  )
}

export {
  ScenePlay,
}

export type {
  IScenePlay,
}
