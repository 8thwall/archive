/* eslint-disable local-rules/hardcoded-copy */
import * as React from 'react'
import {Modal} from 'semantic-ui-react'

import {useCurrentGit} from './hooks/use-current-git'
import useActions from '../common/use-actions'
import coreGitActions from './core-git-actions'
import {actions as gitActions} from './git-actions'
import {PrimaryButton} from '../ui/components/primary-button'
import {TertiaryButton} from '../ui/components/tertiary-button'

interface G8ErrorMessageProps {
  appUuid: string
}

const reloadPage = () => {
  window.location.reload()
}

// TODO(pawel) better explanation to the user as to what exactly "force re-sync" does

const G8ErrorMessage: React.FunctionComponent<G8ErrorMessageProps> = ({appUuid}) => {
  const git = useCurrentGit()
  const {repo, msg} = git
  const {clearGitErr} = useActions(coreGitActions)
  const {revertToSave} = useActions(gitActions)

  if (!msg) {
    return null
  }
  return (
    <Modal
      open
      dimmer='blurring'
      className='error-modal'
      closeIcon='close'
      onClose={() => clearGitErr(repo.repoId)}
    >
      <h1>Oops! A source control error has occurred.</h1>
      <p>
        Try refreshing the page. In some cases, you may need to force a re-sync.
        <br /><br />

        <span className='buttons'>
          <PrimaryButton onClick={reloadPage}>Refresh the page</PrimaryButton>
          <TertiaryButton onClick={() => revertToSave(repo, appUuid)}>Force Re-Sync</TertiaryButton>
        </span>
        <br /><br />

        If the problem persists, reach out to&nbsp;
        <a href='support@8thwall.com'>support@8thwall.com</a>
      </p>

      <p>
        <strong>Additional details:</strong> <span className='msg'>{msg}</span>
      </p>
    </Modal>
  )
}

export {
  G8ErrorMessage,
}
