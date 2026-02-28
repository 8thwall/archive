import React from 'react'
import * as localForage from 'localforage'
import {useTranslation} from 'react-i18next'

import {FileActionsContext} from '../editor/files/file-actions-context'
import {stopPropagation} from '../editor/files/stop-propagation'
import {useChangesetStatus} from '../git/hooks/use-changeset-status'
import {StatusIcon} from '../editor/files/status-icon'
import InlineTextInput from '../common/inline-text-input'
import {ModuleActionsContext} from '../editor/modules/module-actions-context'
import {useGitFileContent, useScopedGit} from '../git/hooks/use-current-git'
import type {ModuleDependency} from '../../shared/module/module-dependency'
import {isValidDependency} from '../../shared/module/validate-module-dependency'
import {useSelector} from '../hooks'
import {getPathForModule, ModulePathEnum} from '../common/paths'
import {isValidAlias} from '../../shared/module/is-valid-alias'
import {MAX_MODULE_ALIAS_LENGTH} from '../../shared/module/module-constants'
import {useMultiRepoContext} from '../editor/multi-repo-context'
import {RepoIdProvider} from '../git/repo-id-context'
import {ModuleFileList} from './module-file-list'
import {editorFileLocationEqual, ScopedFileLocation} from '../editor/editor-file-location'
import {combine} from '../common/styles'
import AbandonChangesModal from '../editor/modals/abandon-changes-modal'
import RevertCloudSaveModal from '../editor/modals/revert-cloud-save-modal'
import useActions from '../common/use-actions'
import moduleActions from '../git/module-git-actions'
import coreGitActions from '../git/core-git-actions'
import {useAbandonableEffect} from '../hooks/abandonable-effect'
import {useTreeElementStyles} from './ui/tree-element-styles'
import {ContextMenu, useContextMenuState} from './ui/context-menu'
import {Icon} from '../ui/components/icon'
import {createThemedStyles} from '../ui/theme'

const deriveDependency = (dependencyContent: string): ModuleDependency => {
  try {
    const dependency = JSON.parse(dependencyContent)
    if (!isValidDependency(dependency)) {
      return null
    }
    return dependency
  } catch (err) {
    return null
  }
}

interface IModuleListItem {
  filePath: string
  activeFileLocation: ScopedFileLocation
}

const useStyles = createThemedStyles(theme => ({
  moduleContainer: {
    'borderBottom': theme.studioSectionBorder,
    'userSelect': 'none',
    '&:first-child': {
      borderTop: theme.studioSectionBorder,
    },
  },
  moduleTitle: {
    paddingRight: '0.75em',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'relative',
  },
  fileBar: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    gap: '0.5em',
    padding: '0.25em 0 0.25em 0.5em',
  },
  renaming: {
    flex: 1,
    whiteSpace: 'nowrap',
  },
  collapseButton: {
    position: 'static',
  },
  hideChevron: {
    opacity: 0,
  },
}))

const ModuleListItem: React.FC<IModuleListItem> = (
  {filePath, activeFileLocation}
) => {
  const {t} = useTranslation(['cloud-editor-pages', 'cloud-studio-pages', 'common'])
  const classes = useStyles()
  const elementClasses = useTreeElementStyles()
  const active = editorFileLocationEqual(filePath, activeFileLocation)
  const [renaming, setRenaming] = React.useState(false)
  const [newName, setNewName] = React.useState('')
  const [showFiles, setShowFiles] = React.useState(false)
  const {status, dirty} = useChangesetStatus(filePath)
  const dependencyContent = useGitFileContent(filePath)
  const dependency = React.useMemo(() => deriveDependency(dependencyContent), [dependencyContent])

  const [isAbandonChangesModalShown, setIsAbandonChangesModalShown] = React.useState(false)
  const [isRevertCloudSaveModalShown, setIsRevertCloudSaveModalShown] = React.useState(false)
  const [isLoadingRevert, setIsLoadingRevert] = React.useState(false)
  const [isLoadingAbandon, setIsLoadingAbandon] = React.useState(false)

  const menuState = useContextMenuState()

  const multiRepoContext = useMultiRepoContext()
  const appRepoId = multiRepoContext?.primaryRepoId
  const appRepo = useScopedGit(appRepoId).repo

  const {revertClient, revertFile} = useActions(coreGitActions)
  const {revertModuleToSave} = useActions(moduleActions)

  const alias = dependency?.alias
  const moduleId = dependency?.moduleId

  const module = useSelector(s => moduleId && s.modules.entities[moduleId])
  const account = useSelector(
    s => module && s.accounts.allAccounts.find(a => a.uuid === module.AccountUuid)
  )
  const moduleEditorLink = module && account && (
    getPathForModule(account, module, ModulePathEnum.files)
  )

  const moduleExpandedKey = `editor-module-expanded-${appRepoId}-${dependency?.dependencyId}`

  // TODO (tri) switch these on ModuleActionsContext
  const {onSelect} = React.useContext(FileActionsContext)
  const {onAliasChange, onDeleteDependency} = React.useContext(ModuleActionsContext)

  useAbandonableEffect(async (maybeAbandon) => {
    const expanded = await maybeAbandon(
      localForage.getItem<boolean>(moduleExpandedKey)
    )
    if (expanded) {
      setShowFiles(expanded)
    }
  }, [])

  const startRename = () => {
    setNewName(alias)
    setRenaming(true)
  }

  const cancelRename = () => {
    setRenaming(false)
  }

  const handleFileDisplay = () => {
    setShowFiles(!showFiles)
    localForage.setItem(moduleExpandedKey, !showFiles)
  }

  const handleRenameSubmit = () => {
    if (isValidAlias(newName)) {
      setRenaming(false)
      onAliasChange(newName, filePath)
    }
  }

  // TODO(christoph): Finalize invalid/missing alias behavior
  const name = alias || '<invalid>'

  const openRepoId = multiRepoContext?.openDependencies[dependency?.dependencyId]
  const openRepo = useScopedGit(openRepoId)?.repo

  const options = [
    moduleEditorLink && {
      content: t('module_list_item.option.go_to_editor'),
      onClick: () => { window.open(moduleEditorLink, '_blank') },
    },
    (alias && BuildIf.EXPERIMENTAL) && {
      content: t('button.rename', {ns: 'common'}),
      onClick: startRename,
    },
    {content: t('button.remove', {ns: 'common'}), onClick: (() => onDeleteDependency(filePath))},
    openRepoId &&
    {
      content: t('module_list_item.option.revert_changes'),
      onClick: (() => setIsRevertCloudSaveModalShown(true)),
    },
    openRepoId && {
      content: t('file_list.option.abandon_changes'),
      onClick: (() => setIsAbandonChangesModalShown(true)),
    },
  ]

  return (
    <div className={classes.moduleContainer}>
      <div className={combine(classes.fileBar, active && elementClasses.selectedButton)}>
        <button
          type='button'
          onClick={(e) => {
            e.stopPropagation()
            menuState.setContextMenuOpen(false)
            handleFileDisplay()
          }}
          className={combine('style-reset', elementClasses.chevron, classes.collapseButton,
            !openRepoId && classes.hideChevron, !showFiles && elementClasses.collapsedChevron)}
          disabled={!openRepoId}
        >
          <Icon stroke='chevronDown' />
        </button>
        <button
          draggable={false}
          type='button'
          className={combine(
            classes.moduleTitle, 'style-reset'
          )}
          onClick={renaming ? undefined : stopPropagation(() => onSelect(filePath))}
          onDragStart={e => e.dataTransfer.setData('filePath', filePath)}
          onContextMenu={menuState.handleContextMenu}
          {...menuState.getReferenceProps()}
        >
          {renaming
            ? (
              <InlineTextInput
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onCancel={cancelRename}
                onSubmit={handleRenameSubmit}
                maxLength={MAX_MODULE_ALIAS_LENGTH}
                pattern='^[a-zA-Z0-9_-]+$'
                inputClassName='style-reset'
                formClassName={combine(classes.renaming, elementClasses.renaming)}
                title={t('module_list_item.input.set_module_alias', {ns: 'cloud-studio-pages'})}
                invalid={!isValidAlias(newName)}
              />
            )
            : (
              <span
                className={elementClasses.name}
                title={name}
              >
                {name}
              </span>
            )
          }
          {!renaming &&
            <span className={elementClasses.treeElementIconRow}>
              <StatusIcon status={status} dirty={dirty} />
            </span>
          }
          {isAbandonChangesModalShown &&
            <AbandonChangesModal
              confirmSwitch={async () => {
                setIsLoadingAbandon(true)
                if (openRepoId) {
                  await revertClient(openRepo)
                }
                await revertFile(appRepo, filePath)
                setIsLoadingAbandon(false)
                setIsAbandonChangesModalShown(false)
              }}
              rejectSwitch={() => setIsAbandonChangesModalShown(false)}
              loadingAbandon={isLoadingAbandon}
            />
          }
          {isRevertCloudSaveModalShown &&
            <RevertCloudSaveModal
              confirmSwitch={async () => {
                setIsLoadingRevert(true)
                if (openRepoId) {
                  await revertModuleToSave(openRepoId)
                }
                await revertFile(appRepo, filePath)
                setIsLoadingRevert(false)
                setIsRevertCloudSaveModalShown(false)
              }}
              rejectSwitch={() => setIsRevertCloudSaveModalShown(false)}
              loadingRevert={isLoadingRevert}
            />
          }
        </button>
      </div>

      {openRepoId && showFiles &&
        <RepoIdProvider value={openRepoId}>
          <div>
            <ModuleFileList activeFileLocation={activeFileLocation} />
          </div>
        </RepoIdProvider>
      }
      <ContextMenu
        menuState={menuState}
        options={options}
      />
    </div>
  )
}

export {ModuleListItem}

export type {IModuleListItem}
