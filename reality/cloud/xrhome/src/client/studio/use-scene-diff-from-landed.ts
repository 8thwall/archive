import React from 'react'
import type {Expanse} from '@ecs/shared/scene-graph'

import coreGitActions from '../git/core-git-actions'
import useActions from '../common/use-actions'
import {useGitActiveClient, useGitRepo} from '../git/hooks/use-current-git'
import {EXPANSE_FILE_REGEX} from './common/studio-files'
import {useSceneContext} from './scene-context'
import {useAbandonableEffect} from '../hooks/abandonable-effect'
import {getChangeLog} from './get-change-log'
import type {SceneDiffContext} from './scene-diff-context'

const useSceneDiffFromLanded = (): SceneDiffContext | null => {
  const {inspectFiles} = useActions(coreGitActions)
  const repo = useGitRepo()
  const ctx = useSceneContext()
  const curExpanse = ctx.scene as Readonly<Expanse>
  const [prevExpanse, setPrevExpanse] = React.useState<Readonly<Expanse> | null>(null)
  const {forkId} = useGitActiveClient()

  useAbandonableEffect(async (abandon) => {
    const expanseInspect = await abandon(inspectFiles(repo.repoId, {
      // will this always exist? I think yes due to initial commit
      inspectPoint: forkId,
      inspectRegex: EXPANSE_FILE_REGEX,
      // always exactly only expanse.json file that fits the regex
    }))
    setPrevExpanse(JSON.parse(expanseInspect[0].contents))
  }, [forkId, repo.repoId])

  if (!prevExpanse) {
    return null
  }

  return {
    beforeScene: prevExpanse,
    afterScene: curExpanse,
    changeLog: getChangeLog(
      prevExpanse,
      curExpanse
    ),
  }
}

export {useSceneDiffFromLanded}
