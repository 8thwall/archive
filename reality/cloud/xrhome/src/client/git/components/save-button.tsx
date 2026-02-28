import React, {useContext, useState} from 'react'
import type {DeepReadonly as RO} from 'ts-essentials'
import {Button} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import {useCurrentGit} from '../hooks/use-current-git'

import coreGitActions from '../core-git-actions'
import useActions from '../../common/use-actions'
import {SaveSemaphoreContext} from '../../editor/hooks/save-challenge-semaphore'
import {useAbandonableFunction} from '../../hooks/use-abandonable-function'
import type {IG8Changeset} from '../g8-dto'
import type {RepoState} from '../git-redux-types'

const g8SaveNeeded = (changesets: RO<Record<string, IG8Changeset>>) => (
  changesets && Object.values(changesets).some(cs => cs.files && cs.files.some(f => f.dirty))
)

const SaveButton: React.FunctionComponent = () => {
  const git: RepoState = useCurrentGit()
  const {saveClient} = useActions(coreGitActions)
  const needsG8Save = g8SaveNeeded(git.changesets)
  const {t} = useTranslation(['cloud-editor-pages'])

  const [awaitingSemaphore, setAwaitingSemaphore] = useState(false)
  const saveSemaphore = useContext(SaveSemaphoreContext)
  const postSemaphoreChallenge = useAbandonableFunction(saveSemaphore.postChallenge)

  const onSave = async () => {
    setAwaitingSemaphore(true)
    await postSemaphoreChallenge()
    setAwaitingSemaphore(false)
    await saveClient(git.repo)
  }

  if (!git.clients || git.progress.client === 'START') {
    return null
  }

  return (
    <Button
      primary={needsG8Save}
      loading={git.progress.save === 'START'}
      onClick={onSave}
      disabled={git.progress.sync === 'START' || git.progress.load !== 'DONE' || awaitingSemaphore}
      content={t('editor_page.button.save_and_build')}
    />
  )
}

export {
  SaveButton,
}
