import React from 'react'
import {createUseStyles} from 'react-jss'
import * as localForage from 'localforage'

import {FileActionsContext} from '../files/file-actions-context'
import {stopPropagation} from '../files/stop-propagation'
import {useChangesetStatus} from '../../git/hooks/use-changeset-status'
import {StatusIcon} from '../files/status-icon'
import {OptionsDropdown} from '../files/options-dropdown'
import InlineTextInput from '../../common/inline-text-input'
import {ModuleActionsContext} from './module-actions-context'
import {useGitFileContent} from '../../git/hooks/use-current-git'
import type {ModuleDependency} from '../../../shared/module/module-dependency'
import {isValidDependency} from '../../../shared/module/validate-module-dependency'
import {useSelector} from '../../hooks'
import {getPathForModule, ModulePathEnum} from '../../common/paths'
import {isValidAlias} from '../../../shared/module/is-valid-alias'
import {MAX_MODULE_ALIAS_LENGTH} from '../../../shared/module/module-constants'
import {useMultiRepoContext} from '../multi-repo-context'
import {RepoIdProvider} from '../../git/repo-id-context'
import {ModuleFileList} from './module-file-list'
import {editorFileLocationEqual, ScopedFileLocation} from '../editor-file-location'
import {ContextDropdown} from '../files/context-dropdown'
import {combine} from '../../common/styles'
import {CollapseButton} from '../files/collapse-button'
import AbandonChangesModal from '../modals/abandon-changes-modal'
import RevertCloudSaveModal from '../modals/revert-cloud-save-modal'
import useActions from '../../common/use-actions'
import moduleActions from '../../git/module-git-actions'
import coreGitActions from '../../git/core-git-actions'
import {useAbandonableEffect} from '../../hooks/abandonable-effect'
import {useStudioMenuStyles} from '../../studio/ui/studio-menu-styles'

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
  isStudio?: boolean
}

const useStyles = createUseStyles({
  moduleContainer: {
    borderBottom: '1px solid #8083A280',
    padding: '0.5em 0 0.5em 0',
  },
  moduleTitle: {
    paddingRight: '0.75em',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  fileBar: {
    display: 'flex',
    alignItems: 'center',
  },
  fileList: {
    paddingBottom: '1em',
  },
})

const ModuleListItem: React.FC<IModuleListItem> = (
  {filePath, activeFileLocation, isStudio}
) => {
  const [clickPoint, setClickPoint] = React.useState<[number, number]>(null)
  const classes = useStyles()
  const studioStyles = useStudioMenuStyles()
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

  const multiRepoContext = useMultiRepoContext()
  const appRepoId = multiRepoContext?.primaryRepoId

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

  const handleContextMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setClickPoint([event.clientX, event.clientY])
  }

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

  const options = [
    {content: 'Go to Editor', externalLink: moduleEditorLink},
    (alias && BuildIf.EXPERIMENTAL) && {content: 'Rename', onClick: startRename},
    {content: 'Remove', onClick: (() => onDeleteDependency(filePath))},
    openRepoId &&
    {content: 'Revert Changes', onClick: (() => setIsRevertCloudSaveModalShown(true))},
    openRepoId &&
    {content: 'Abandon Changes', onClick: (() => setIsAbandonChangesModalShown(true))},
  ]
  return (
    <li className={combine(
      classes.moduleContainer, `file-list-item file ${active ? 'active' : ''}`,
      isStudio && studioStyles.studioFont
    )}
    >
      <div className={combine(classes.fileBar, 'file-bar no-padding')}>
        <CollapseButton
          onClick={handleFileDisplay}
          showFiles={showFiles}
          hidden={!openRepoId}
        />
        <button
          draggable={false}
          type='button'
          className={combine(
            classes.moduleTitle, 'style-reset', isStudio && studioStyles.studioFont
          )}
          onClick={renaming ? undefined : stopPropagation(() => onSelect(filePath))}
          onDragStart={e => e.dataTransfer.setData('filePath', filePath)}
          onContextMenu={handleContextMenu}
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
                inputClassName='style-reset file-input'
                // eslint-disable-next-line local-rules/hardcoded-copy
                formClassName={combine('file-name edit', isStudio && studioStyles.studioFont)}
                title='Alias must only contain alphanumeric, underscore (_), or dash (-)'
                invalid={!isValidAlias(newName)}
              />
            )
            : (
              <span
                className={combine('file-name', isStudio && studioStyles.studioFont)}
                title={name}
              >
                {name}
              </span>
            )
          }

          <span className='file-right-section'>
            <StatusIcon status={status} dirty={dirty} />
          </span>
          <OptionsDropdown options={options} />
          {clickPoint !== null &&
            <ContextDropdown
              options={options}
              onClose={() => setClickPoint(null)}
              clickPoint={clickPoint}
            />
              }
          {isAbandonChangesModalShown &&
            <AbandonChangesModal
              confirmSwitch={async () => {
                setIsLoadingAbandon(true)
                if (openRepoId) {
                  await revertClient(openRepoId)
                }
                await revertFile(appRepoId, filePath)
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
                await revertFile(appRepoId, filePath)
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
          <div className={classes.fileList}>
            <ModuleFileList activeFileLocation={activeFileLocation} isStudio />
          </div>
        </RepoIdProvider>
      }
    </li>
  )
}

export {ModuleListItem}

export type {IModuleListItem}
