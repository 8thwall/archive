import React from 'react'

import {loadScript} from '@ecs/shared/load-script'
import {MODEL_URL, WORKER_URL} from '@ecs/shared/splat-constants'

import type {IModel} from '@ecs/shared/splat-model'

import {useAbandonableEffect} from '../hooks/abandonable-effect'

let loadScriptPromise: Promise<void> | null = null
let finishedLoading = false
let Model: IModel

const useSplatModelLoaded = () => {
  const [modelLoaded, setModelLoaded] = React.useState(finishedLoading)

  useAbandonableEffect(async (executor) => {
    if (finishedLoading) {
      return
    }

    if (!loadScriptPromise) {
      loadScriptPromise = loadScript(MODEL_URL)
      loadScriptPromise.then(() => {
        Model = (window as any).Model
        Model.setInternalConfig({workerUrl: WORKER_URL})
        finishedLoading = true
      })
    }

    await executor(loadScriptPromise)
    setModelLoaded(true)
  }, [])

  return modelLoaded && Model
}

export {
  useSplatModelLoaded,
}
