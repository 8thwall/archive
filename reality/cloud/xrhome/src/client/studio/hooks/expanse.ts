/* eslint react-hooks/exhaustive-deps: error */
import React from 'react'
import {SceneDoc, createEmptySceneDoc, loadSceneDoc} from '@ecs/shared/crdt'
import {bytesToString, stringToBytes} from '@ecs/shared/data'
import type {DeepReadonly} from 'ts-essentials'
import type {Expanse, SceneGraph} from '@ecs/shared/scene-graph'

import {useSaveSemaphore} from '../../editor/hooks/save-challenge-semaphore'
import {useCurrentGit, useGitActiveClient, useGitFileContent} from '../../git/hooks/use-current-git'
import useActions from '../../common/use-actions'
import coreGitActions from '../../git/core-git-actions'
import type {MutateCallback} from '../scene-context'
import {EXPANSE_FILE_PATH, EXPANSE_FILE_REGEX} from '../common/studio-files'
import {defaultScene} from '../example/scenes/default-scene'
import {useEvent} from '../../hooks/use-event'

const DEBOUNCE_TIME = Build8.PLATFORM_TARGET === 'desktop' ? 500 : 1500

type ExpanseHandle = {
  ready: boolean
  scene: DeepReadonly<SceneGraph>
  update: (fn: (expanse: DeepReadonly<SceneGraph>) => DeepReadonly<SceneGraph>) => void
}

type InternalExpanseState = {
  loadedFor: string
  dirty: boolean
}

type CachedForkPoint = {
  forkPoint: string
  forkPointDoc: SceneDoc
  forkPointHistory: string
  forkPointHistoryVersion: string
}

const useExpanse = (): ExpanseHandle => {
  const expanseFile = useGitFileContent(EXPANSE_FILE_PATH)
  const {saveFiles, inspectFiles} = useActions(coreGitActions)
  const [scene, setScene] = React.useState<DeepReadonly<SceneGraph>>(null)
  const stateRef = React.useRef<InternalExpanseState | null>(null)
  const repo = useCurrentGit(git => git.repo)
  const activeClient = useGitActiveClient()
  const activeClientName = activeClient?.name
  const forkPoint = activeClient?.forkId
  const saveTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>()

  const cachedForkPointRef = React.useRef<CachedForkPoint | null>(null)

  const ready = !!scene

  const maybeSaveState = useEvent(async () => {
    clearTimeout(saveTimeoutRef.current)
    const internalState = stateRef.current
    if (!internalState?.dirty) {
      return
    }

    let forkPointDoc: SceneDoc
    let forkPointHistory: string
    let forkPointHistoryVersion: string
    if (cachedForkPointRef.current?.forkPoint === forkPoint) {
      forkPointDoc = cachedForkPointRef.current.forkPointDoc
      forkPointHistory = cachedForkPointRef.current.forkPointHistory
      forkPointHistoryVersion = cachedForkPointRef.current.forkPointHistoryVersion
    } else {
      const forkPointFiles = await inspectFiles(repo, {
        inspectPoint: forkPoint,
        inspectRegex: EXPANSE_FILE_REGEX,
      })

      const forkPointContents: string = forkPointFiles[0]?.contents
      if (forkPointContents) {
        const forkPointExpanse: Expanse = JSON.parse(forkPointContents)
        forkPointHistory = forkPointExpanse.history
        forkPointHistoryVersion = forkPointExpanse.historyVersion
      }

      forkPointDoc = forkPointHistory
        ? loadSceneDoc(stringToBytes(forkPointHistory), '')
        : createEmptySceneDoc('')
      cachedForkPointRef.current = {
        forkPoint, forkPointDoc, forkPointHistory, forkPointHistoryVersion,
      }
    }

    const newExpanse: Expanse = {...scene as SceneGraph}

    if (forkPointHistory) {
      const myEditDoc = forkPointDoc.clone('')
      myEditDoc.update(() => scene)
      const compactedHistory = bytesToString(myEditDoc.save())
      newExpanse.history = compactedHistory
    }

    if (forkPointHistoryVersion) {
      newExpanse.historyVersion = forkPointHistoryVersion
    }

    const expanseData = JSON.stringify(newExpanse, null, 2)
    internalState.dirty = false
    internalState.loadedFor = expanseData
    await saveFiles(repo, [
      {filePath: EXPANSE_FILE_PATH, content: expanseData},
    ])
  })

  useSaveSemaphore(maybeSaveState)

  React.useEffect(() => () => {
    stateRef.current = null
    clearTimeout(saveTimeoutRef.current)
  }, [activeClientName])

  React.useEffect(() => {
    const isExpectedChange = stateRef.current && (
      stateRef.current.loadedFor === expanseFile
    )

    if (isExpectedChange) {
      return
    }

    let sceneFromFile: DeepReadonly<SceneGraph>
    if (expanseFile) {
      try {
        const expanseData: Expanse = JSON.parse(expanseFile)
        delete expanseData.history
        delete expanseData.historyVersion
        sceneFromFile = expanseData
      } catch {
        // Invalid expanse json file, fallback to default
        sceneFromFile = defaultScene
      }
    } else {
      sceneFromFile = defaultScene
    }
    stateRef.current = {loadedFor: expanseFile, dirty: false}
    setScene(sceneFromFile)
  }, [expanseFile, activeClientName])

  const update = (fn: MutateCallback<SceneGraph>) => {
    if (!stateRef.current) {
      throw new Error('Not ready to edit expanse')
    }
    setScene(fn)
    stateRef.current.dirty = true
    clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(maybeSaveState, DEBOUNCE_TIME)
  }

  return {
    ready,
    scene,
    update,
  }
}

export {
  useExpanse,
}
