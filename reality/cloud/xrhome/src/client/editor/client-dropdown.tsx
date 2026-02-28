import * as React from 'react'
import {Dropdown} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import coreGitActions, {DEFAULT_CLIENT} from '../git/core-git-actions'
import {newUserBranchUrl} from '../common/hosting-urls'
import {MAX_CLIENT_NAME_LENGTH} from '../../shared/app-constants'
import type {IApp} from '../common/types/models'
import useActions from '../common/use-actions'
import {useCurrentGit, useGitActiveClient, useGitClients} from '../git/hooks/use-current-git'
import {StandardModal} from './standard-modal'
import {StandardModalHeader} from './standard-modal-header'
import {BasicModalContent} from './basic-modal-content'
import {StandardModalActions} from './standard-modal-actions'
import {TertiaryButton} from '../ui/components/tertiary-button'
import {LinkButton} from '../ui/components/link-button'
import {StandardTextField} from '../ui/components/standard-text-field'
import {useSaveSemaphoreContext} from './hooks/save-challenge-semaphore'
import {useAbandonableFunction} from '../hooks/use-abandonable-function'
import {useDismissibleModal} from './dismissible-modal-context'

interface IClientDropdown {
  app?: IApp
}

const ClientDropdown: React.FunctionComponent<IClientDropdown> = ({app}) => {
  const [isCreating, setIsCreating] = React.useState(false)
  useDismissibleModal(() => setIsCreating(false))
  const [newClientName, setNewClientName] = React.useState('')
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [isFlushing, setIsFlushing] = React.useState(false)
  const repo = useCurrentGit(g => g.repo)
  const activeClientName = useGitActiveClient()?.name

  const clients = useGitClients()
  const {t} = useTranslation(['cloud-editor-pages', 'common'])

  const {changeClient, deleteClient, newClient} = useActions(coreGitActions)

  const saveSemaphore = useSaveSemaphoreContext()
  const postSaveChallengeAbandonable = useAbandonableFunction(saveSemaphore.postChallenge)

  // TODO(johnny): Make text editor read-only while flush is happening
  const flush = async () => {
    setIsFlushing(true)
    try {
      await postSaveChallengeAbandonable()
    } finally {
      setIsFlushing(false)
    }
  }

  const handleChange = async (name: string) => {
    await flush()
    changeClient(repo, name)
  }

  const handleDelete = async () => {
    setIsDeleting(false)
    await flush()
    deleteClient(repo, activeClientName)
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    setIsCreating(false)
    await flush()
    newClient(repo, newClientName)
  }

  const isLoading = useCurrentGit(git => git.progress.client === 'START') || !clients || isFlushing

  // NOTE(pawel) Modules don't get a url.
  const userBranchUrl = app && repo && newClientName && /^[a-z0-9]+$/.test(newClientName) && (
    newUserBranchUrl({
      appName: app.appName,
      workspace: repo.workspace,
      handle: repo.handle,
      client: newClientName,
    })
  )

  const urlPreviewText = userBranchUrl ||
                         t('editor_page.client_dropdown.error.please_enter_valid_name')

  return (
    <>
      <Dropdown
        text={isLoading ? t('loader.loading', {ns: 'common'}) : activeClientName}
        button
        floating
        loading={isLoading}
        disabled={isLoading}
      >
        <Dropdown.Menu>
          {clients && clients.map(({name}) => (
            <Dropdown.Item
              key={name}
              icon={name === activeClientName ? 'check circle' : 'circle outline'}
              onClick={() => handleChange(name)}
              text={name}
              disabled={isLoading}
            />
          ))}
          <Dropdown.Divider />
          <Dropdown.Item
            icon='plus'
            text={t('editor_page.client_dropdown.item.new_client')}
            onClick={() => {
              setIsCreating(true)
              setNewClientName('')
            }}
          />
          {activeClientName !== DEFAULT_CLIENT &&
            <Dropdown.Item
              icon='minus'
              text={t('editor_page.client_dropdown.item.delete_client', {activeClientName})}
              onClick={() => setIsDeleting(true)}
            />
            }
        </Dropdown.Menu>
      </Dropdown>

      {isCreating &&
        <StandardModal size='tiny' onClose={() => setIsCreating(false)}>
          <StandardModalHeader>
            <h2>{t('editor_page.new_client_modal.header')}</h2>
          </StandardModalHeader>
          <form onSubmit={handleCreateSubmit}>
            <BasicModalContent>
              <p>{t('editor_page.new_client_modal.blurb')}</p>
              <StandardTextField
                id='client-name-input'
                label={t('editor_page.new_client_modal.label.client_name')}
                maxLength={MAX_CLIENT_NAME_LENGTH}
                value={newClientName}
                onChange={e => setNewClientName(e.target.value)}
                autoFocus
              />
              {app &&
                <>
                  <p>{t('editor_page.new_client_modal.label.preview_url')}</p>
                  <p>{urlPreviewText}</p>
                </>
            }
            </BasicModalContent>
            <StandardModalActions>
              <LinkButton onClick={() => setIsCreating(false)}>
                {t('button.cancel', {ns: 'common'})}
              </LinkButton>
              <TertiaryButton
                type='submit'
                height='small'
                disabled={!/^[a-z0-9]+$/.test(newClientName)}
              >{t('button.create', {ns: 'common'})}
              </TertiaryButton>
            </StandardModalActions>
          </form>
        </StandardModal>
        }

      {isDeleting &&
        <StandardModal size='tiny' onClose={() => setIsDeleting(false)}>
          <StandardModalHeader>
            <h2>
              {t('editor_page.delete_client_modal.header', {activeClientName})}
            </h2>
          </StandardModalHeader>
          <BasicModalContent>
            <p>{t('editor_page.delete_client_modal.delete_client')}</p>
          </BasicModalContent>
          <StandardModalActions>
            <LinkButton onClick={() => setIsDeleting(false)}>
              {t('button.cancel', {ns: 'common'})}
            </LinkButton>
            <TertiaryButton height='small' onClick={handleDelete} autoFocus>
              {t('button.delete', {ns: 'common'})}
            </TertiaryButton>
          </StandardModalActions>
        </StandardModal>
        }
    </>
  )
}

export {
  ClientDropdown,
}
