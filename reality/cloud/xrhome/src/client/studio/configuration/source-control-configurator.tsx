import React from 'react'
import {useTranslation} from 'react-i18next'

import {useCurrentGit, useGitActiveClient, useGitClients} from '../../git/hooks/use-current-git'
import {FloatingMenuButton} from '../../ui/components/floating-menu-button'
import coreGitActions from '../../git/core-git-actions'
import {SelectMenu} from '../ui/select-menu'
import useActions from '../../common/use-actions'

import {StandardFieldLabel} from '../../ui/components/standard-field-label'
import {Icon} from '../../ui/components/icon'
import {createThemedStyles} from '../../ui/theme'
import {combine} from '../../common/styles'
import {useSaveSemaphoreContext} from '../../editor/hooks/save-challenge-semaphore'
import {useAbandonableFunction} from '../../hooks/use-abandonable-function'
import {useStudioMenuStyles} from '../ui/studio-menu-styles'
import {CLIENT_FILE_PATH} from '../../common/editor-files'
import useCurrentApp from '../../common/use-current-app'
import {actions} from '../../git/git-actions'
import RevertCloudSaveModal from '../../editor/modals/revert-cloud-save-modal'
import {useOpenGits} from '../../git/hooks/use-open-gits'
import moduleActions from '../../git/module-git-actions'
import {ProjectHistoryModal} from '../ui/project-history-modal'
import {StandardFieldContainer} from '../../ui/components/standard-field-container'
import {RowBooleanField, useStyles as useRowFieldStyles} from './row-fields'
import {LinkButton} from '../../ui/components/link-button'
import {IconButton} from '../../ui/components/icon-button'
import {DangerButton} from '../../ui/components/danger-button'
import {FloatingTraySection} from '../../ui/components/floating-tray-section'
import {EXPANSE_FILE_PATH} from '../common/studio-files'
import {AbandonChangesStudioModal} from '../../editor/modals/abandon-changes-studio-modal'
import {NewClientConfigurator} from './new-client-configurator'
import {FloatingPanelButton} from '../../ui/components/floating-panel-button'
import {VALID_CLIENT_NAME_REGEX} from '../../git/g8-common'
import {useUserEditorSettings} from '../../user/use-user-editor-settings'
import {extractUserEditorSettings} from '../../user/editor-settings'
import userActions from '../../user/user-actions'
import {DuplicateClientConfigurator} from './duplicate-client-configurator'
import {Badge} from '../../ui/components/badge'
import {StudioBuildButton} from '../studio-build-button'
import {timeBetweenI18n} from '../../common/time-between'

type MenuState = 'selecting' | 'creating' | 'deleting' | 'saving'
  | 'abandoning' | 'reverting' | 'duplicating'

const useStyles = createThemedStyles(theme => ({
  userSelectNone: {
    userSelect: 'none',
  },
  selectedItem: {
    borderRadius: '0.25em',
    backgroundColor: theme.listItemHoverBg,
  },
  menuButton: {
    'display': 'flex',
    'justifyContent': 'space-between',
    'alignItems': 'center',
    'width': '100%',
    'wordBreak': 'break-word',
    '& svg': {
      'minWidth': '16px',
      'color': theme.fgMuted,
      '&:hover': {
        color: theme.fgMain,
      },
    },
  },
  clientItemButton: {
    maxWidth: '150px',
    gap: '0.5em',
  },
  buttonRow: {
    display: 'flex',
    gap: '0.5em',
  },
  cancelButton: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  clientButton: {
    'position': 'relative',
    'display': 'flex',
    '& $deleteButton': {
      '&:hover': {
        color: theme.fgMain,
      },
    },
    '&:hover': {
      'backgroundColor': theme.studioBtnHoverBg,
      'borderRadius': '0.25em',
    },
  },
  deleteButton: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: theme.fgMuted,
  },
  activeCheckmark: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.25em',
  },
  cloudBuildButton: {
    background: theme.studioPanelBtnBg,
    height: '1.8rem',
    display: 'flex',
    width: '22rem',
    borderRadius: '0.4em',
  },
}))

const SourceControlConfigurator: React.FC = () => {
  const {t} = useTranslation(['cloud-studio-pages', 'common', 'cloud-editor-pages'])
  const classes = useStyles()
  const rowFieldClasses = useRowFieldStyles()
  const studioClasses = useStudioMenuStyles()
  const repo = useCurrentGit(g => g.repo)
  const clients = useGitClients()
  const activeClient = useGitActiveClient()
  const activeClientName = activeClient?.name
  const lastSaveTime = activeClient?.lastSaveTime
  const {
    changeClient, deleteClient, newClient, revertClient, revertFile,
  } = useActions(coreGitActions)
  const {revertToSave} = useActions(actions)
  const {revertModuleToSave} = useActions(moduleActions)
  const saveSemaphore = useSaveSemaphoreContext()
  const postSaveChallengeAbandonable = useAbandonableFunction(saveSemaphore.postChallenge)
  const openGits = useOpenGits()
  const app = useCurrentApp()
  const editorSettings = useUserEditorSettings()
  const {updateAttribute} = useActions(userActions)

  const [menuState, setMenuState] = React.useState<MenuState>('selecting')
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const [deleteClientName, setDeleteClientName] = React.useState('')

  const [isLoadingAbandon, setIsLoadingAbandon] = React.useState(false)
  const [isLoadingRevert, setIsLoadingRevert] = React.useState(false)
  const [viewExpanseDiff, setViewExpanseDiff] = React.useState(editorSettings.viewExpanseDiff)

  const lockClient = async (moveToSavingState: boolean = true) => {
    try {
      if (moveToSavingState) {
        setMenuState('saving')
      }

      await postSaveChallengeAbandonable()
    } catch (error) {
      throw new Error(`Failed to lock client: ${activeClientName}`)
    }
  }

  const handleChange = async (name: string) => {
    try {
      if (menuState !== 'saving') {
        setIsDropdownOpen(false)
        await lockClient()
        changeClient(repo, name)
        setMenuState('selecting')
      }
    } catch (error) {
      setMenuState('selecting')
      throw new Error(`Failed to change client: ${name}`)
    }
  }

  const handleDeleteClient = async () => {
    try {
      if (menuState !== 'saving') {
        setIsDropdownOpen(false)
        await lockClient()
        deleteClient(repo, deleteClientName)
        setMenuState('selecting')
      }
    } catch (error) {
      setMenuState('selecting')
      throw new Error(`Failed to delete client: ${deleteClientName}`)
    } finally {
      setDeleteClientName('')
    }
  }

  const handleCreateClient = async (name: string) => {
    try {
      if (menuState !== 'saving' && name && name.match(VALID_CLIENT_NAME_REGEX)) {
        setIsDropdownOpen(false)
        await lockClient()
        newClient(repo, name)
        setMenuState('selecting')
      }
    } catch (error) {
      setMenuState('selecting')
      throw new Error(`Failed to create client: ${name}`)
    }
  }

  const handleAbandonChanges = async (abandonAll?: boolean) => {
    try {
      if (menuState !== 'saving') {
        setIsLoadingAbandon(true)
        setIsDropdownOpen(false)
        await lockClient()
        if (abandonAll) {
          await Promise.all(openGits.map((git) => {
            const isPrimary = git.repo.repoId === app.repoId
            return revertClient(git.repo, {pathsToPreserve: isPrimary && [CLIENT_FILE_PATH]})
          }))
        } else {
          revertClient(repo, {pathsToPreserve: [CLIENT_FILE_PATH]})
        }
        setIsLoadingAbandon(false)
        setMenuState('selecting')
      }
    } catch (error) {
      setIsLoadingAbandon(false)
      setMenuState('selecting')
      throw new Error(`Failed to abandon changes in client: ${activeClientName}`)
    }
  }

  const handleRevertToLastSave = async (revertAll?: boolean) => {
    try {
      if (menuState !== 'saving') {
        setIsLoadingRevert(true)
        setIsDropdownOpen(false)
        await lockClient()
        if (revertAll) {
          await Promise.all(openGits.map(git => revertModuleToSave(git.repo.repoId)))
        } else {
          revertToSave(repo, app.uuid)
        }
        setMenuState('selecting')
      }
    } catch (error) {
      setIsLoadingRevert(false)
      setMenuState('selecting')
      throw new Error(`Failed to revert to last save in client: ${activeClientName}`)
    }
  }

  const handleAbandonSceneChanges = async () => {
    try {
      if (menuState !== 'saving') {
        setIsDropdownOpen(false)
        await lockClient()
        revertFile(repo, EXPANSE_FILE_PATH)
        setMenuState('selecting')
      }
    } catch (error) {
      setMenuState('selecting')
      throw new Error(`Failed to abandon scene changes in client: ${activeClientName}`)
    }
  }

  const handleViewExpanseDiffChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setViewExpanseDiff(e.target.checked)
    const finalAttributes = extractUserEditorSettings({
      ...editorSettings,
      viewExpanseDiff: e.target.checked,
    })
    await updateAttribute({
      'custom:themeSettings': JSON.stringify(finalAttributes),
    })
  }

  const trigger = (
    <button
      type='button'
      className={combine('style-reset', rowFieldClasses.select, rowFieldClasses.preventOverflow)}
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
    >
      <div className={combine(rowFieldClasses.selectText, classes.userSelectNone)}>
        {activeClientName || t('source_control_configurator.button.client.placeholder')}
        <div className={rowFieldClasses.chevron} />
      </div>
    </button>
  )

  return (
    <>
      <FloatingTraySection
        title={t('source_control_configurator.title')}
      >
        <div className={rowFieldClasses.row}>
          <div className={combine(rowFieldClasses.flexItem, classes.userSelectNone)}>
            <StandardFieldLabel
              label={t('source_control_configurator.client.label')}
              mutedColor
            />
          </div>
          <div className={rowFieldClasses.flexItem}>
            <StandardFieldContainer>
              <SelectMenu
                id='source-control-select-menu'
                onOpenChange={(isOpen) => {
                  if (!isOpen) {
                    setDeleteClientName('')
                    setMenuState('selecting')
                    setIsDropdownOpen(false)
                  }
                }}
                menuWrapperClassName={combine(studioClasses.studioMenu,
                  rowFieldClasses.selectMenuContainer)}
                trigger={trigger}
                matchTriggerWidth={false}
              >
                {collapse => (
                  <>
                    {menuState === 'duplicating'
                      ? (
                        <DuplicateClientConfigurator
                          lockClient={lockClient}
                          returnToMainMenu={() => setMenuState('selecting')}
                        />
                      )
                      : clients.map(client => (
                        <div
                          className={combine(classes.clientButton,
                            client.name === deleteClientName && classes.selectedItem)}
                          key={client.name}
                        >
                          <FloatingMenuButton
                            onClick={() => {
                              handleChange(client.name)
                              setMenuState('selecting')
                              collapse()
                            }}
                          >
                            <div
                              className={combine(classes.menuButton, classes.clientItemButton)}
                              key={client.name}
                            >
                              {client.name}
                            </div>
                          </FloatingMenuButton>
                          {client.name === activeClientName &&
                            <div className={classes.activeCheckmark}>
                              <Icon
                                block
                                color='highlight'
                                stroke='checkmark'
                              />
                            </div>
                        }
                          {client.name !== 'default' && client.name !== activeClientName &&
                            <div className={classes.deleteButton}>
                              <IconButton
                                text={t('source_control_configurator.button.delete_client')}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setDeleteClientName(client.name)
                                  setMenuState('deleting')
                                }}
                                stroke='delete12'
                              />
                            </div>
                        }
                        </div>
                      ))}
                    {menuState === 'selecting' &&
                      <>
                        <div className={studioClasses.divider} />
                        <FloatingMenuButton
                          onClick={() => {
                            setMenuState('creating')
                          }}
                        >
                          <div className={classes.menuButton}>
                            {t('source_control_configurator.button.new_client')}
                            <Icon stroke='plus' size={0.75} />
                          </div>
                        </FloatingMenuButton>
                        <FloatingMenuButton
                          onClick={() => {
                            setMenuState('duplicating')
                          }}
                        >
                          <div className={classes.menuButton}>
                            {t('source_control_configurator.button.duplicate_client')}
                            <Icon stroke='chevronRight' size={0.7} />
                          </div>
                        </FloatingMenuButton>
                      </>
                }
                    {menuState === 'creating' &&
                      <NewClientConfigurator
                        label={t('source_control_configurator.create_new_client.label')}
                        onSave={(name) => {
                          handleCreateClient(name)
                          collapse()
                        }}
                        onCancel={() => {
                          setMenuState('selecting')
                          collapse()
                        }}
                        clients={new Set(clients.map(client => client.name))}
                      />
                }

                    {menuState === 'deleting' &&
                      <>
                        <div className={studioClasses.divider} />
                        <div className={classes.buttonRow}>
                          <div className={classes.cancelButton}>
                            <LinkButton
                              onClick={() => {
                                setDeleteClientName('')
                                setMenuState('selecting')
                                setIsDropdownOpen(false)
                                collapse()
                              }}
                            >
                              {t('button.cancel', {ns: 'common'})}
                            </LinkButton>
                          </div>
                          <DangerButton
                            onClick={() => {
                              handleDeleteClient()
                              setIsDropdownOpen(false)
                              collapse()
                            }}
                            height='tiny'
                            spacing='normal'
                          >
                            {t('button.delete', {ns: 'common'})}
                          </DangerButton>
                        </div>
                      </>
                }
                  </>
                )}
              </SelectMenu>
            </StandardFieldContainer>
          </div>
        </div>
        <RowBooleanField
          id='view-expanse-diff'
          label={t('source_control_configurator.view_scene_diff.label')}
          checked={viewExpanseDiff}
          onChange={handleViewExpanseDiffChange}
        />
        {Build8.PLATFORM_TARGET === 'desktop' &&
          <div className={combine(rowFieldClasses.row, classes.buttonRow)}>
            <Badge height='small' color='gray' variant='outlined' spacing='full'>
              {t('source_control_configurator.badge.last_sync')}
              {': '}
              {timeBetweenI18n(lastSaveTime, new Date(), t)}
            </Badge>
            <div className={classes.cloudBuildButton}>
              <StudioBuildButton />
            </div>
          </div>
        }
        <div className={combine(rowFieldClasses.row, classes.buttonRow)}>
          <FloatingPanelButton
            onClick={() => {
              if (menuState !== 'saving') {
                setMenuState('reverting')
              }
            }}
            spacing='full'
            loading={isLoadingRevert}
          >
            {t('source_control_configurator.button.revert_to_last_build')}
          </FloatingPanelButton>
          <FloatingPanelButton
            onClick={() => {
              if (menuState !== 'saving') {
                setMenuState('abandoning')
              }
            }}
            spacing='full'
            loading={isLoadingAbandon}
          >
            {t('source_control_configurator.button.abandon_changes')}
          </FloatingPanelButton>
        </div>
        <ProjectHistoryModal />
      </FloatingTraySection>
      {menuState === 'reverting' &&
        <RevertCloudSaveModal
          confirmSwitch={() => handleRevertToLastSave()}
          confirmSwitchAll={() => handleRevertToLastSave(true)}
          rejectSwitch={() => setMenuState('selecting')}
          loadingRevert={isLoadingRevert}
        />
    }
      {menuState === 'abandoning' &&
        <AbandonChangesStudioModal
          onAbandon={() => handleAbandonChanges()}
          onAbandonAll={() => handleAbandonChanges(true)}
          onAbandonScene={() => handleAbandonSceneChanges()}
          onClose={() => setMenuState('selecting')}
          loadingAbandon={isLoadingAbandon}
        />
    }
    </>
  )
}

export {
  SourceControlConfigurator,
}
