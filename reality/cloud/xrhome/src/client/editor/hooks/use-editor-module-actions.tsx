import React from 'react'

import {useHistory, useLocation} from 'react-router-dom'

import dependencyActions from '../dependency-actions'
import useActions from '../../common/use-actions'
import {useCurrentGit} from '../../git/hooks/use-current-git'
import {EditorRouteParams, editorRouteMatchEqual} from '../editor-route'
import type {PersistentEditorSession} from './use-persistent-editor-session'
import {useTabActions} from './use-tab-actions'
import type {ModuleTarget} from '../../../shared/module/module-target'
import type {IApp} from '../../common/types/models'
import {useDependencyContext} from '../dependency-context'
import {BACKEND_FOLDER, generateDependencyFilePath, isBackendPath} from '../../common/editor-files'
import coreGitActions from '../../git/core-git-actions'
import moduleActions from '../../modules/actions'
import {updateVersionTarget} from '../../../shared/module/update-version-target'
import ChangeModuleAliasModal from '../modals/change-module-alias-modal'
import type {IModuleActionsContext} from '../modules/module-actions-context'
import {useMultiRepoContext} from '../multi-repo-context'
import {useChangeEffect} from '../../hooks/use-change-effect'
import type {GitReduxState} from '../../git/git-reducer'
import {useSelector} from '../../hooks'
import type {GatewayDefinition} from '../../../shared/gateway/gateway-types'
import {extractBackendFilename} from '../backend-config/backend-config-files'
import {useAppPathsContext} from '../../common/app-container-context'

const getBackendFiles = (gitState: GitReduxState, depRepoId: string) => {
  const paths = gitState.byRepoId[depRepoId]?.childrenByPath[BACKEND_FOLDER]
  const backendPaths = paths ? paths.filter(path => isBackendPath(path)) : []
  return backendPaths.map(path => gitState.byRepoId[depRepoId].filesByPath[path])
}

interface IEditorModule {
  app: IApp
  editorSession: PersistentEditorSession
  curRouteParams: EditorRouteParams
}

const useEditorModuleActions = ({app, editorSession, curRouteParams}: IEditorModule) => {
  const git = useCurrentGit()
  const {repo} = git
  const {saveFiles} = useActions(coreGitActions)
  const globalGit = useSelector(s => s.git)

  const [showChangeModuleAliasModal, setShowChangeModuleAliasModal] = React.useState(false)
  const [changeModuleAliasModalProps, setChangeModuleAliasModalProps] = React.useState({
    onAliasResolution: null,
    existingAlias: null,
  })
  const [addingDependency, setAddingDependency] = React.useState(false)
  const [showModulesContent, setShowModulesContent] = React.useState(false)

  const history = useHistory()
  const location = useLocation()

  const {getFileRoute, getPathForDependency} = useAppPathsContext()

  const multiRepoContext = useMultiRepoContext()
  const dependencyContext = useDependencyContext()

  const {
    changeDependencyAlias, updateAliasImports, deleteDependency, fetchModuleImportDependency,
    updateTargetOverride, fetchModuleManifest, updateDependencyBackends,
  } = useActions(dependencyActions)

  const {closeTab} = useTabActions(editorSession)

  const {fetchPublicModuleDetail} = useActions(moduleActions)

  useChangeEffect(([prevGit]) => {
    if (!prevGit) {
      return
    }

    Object.entries(multiRepoContext.openDependencies).forEach(([dependencyId, depRepoId]) => {
      const backendFiles = getBackendFiles(globalGit, depRepoId)
      const prevBackendFiles = getBackendFiles(prevGit, depRepoId)
      const needsUpdate = backendFiles.length !== prevBackendFiles.length ||
        Object.values(backendFiles).some(
          file => file?.content !== prevGit.byRepoId[depRepoId].filesByPath[file.filePath]?.content
        )
      if (needsUpdate) {
        const backendTemplates: GatewayDefinition[] = backendFiles.map((backendFile) => {
          const fileOutput = JSON.parse(backendFile.content)
          fileOutput.name = extractBackendFilename(backendFile.filePath)
          return fileOutput
        })
        updateDependencyBackends(
          repo, dependencyContext.dependencyIdToPath[dependencyId], backendTemplates
        )
      }
    })
  }, [globalGit, multiRepoContext] as const)

  const moduleActionsContext: IModuleActionsContext = {
    onAliasChange: async (newAlias: string, dependencyPath: string) => {
      const {oldAlias} = await changeDependencyAlias(repo, dependencyPath, newAlias)
      await updateAliasImports(repo, oldAlias, newAlias)
      if (editorRouteMatchEqual(curRouteParams, {
        isDependencyFile: true,
        moduleAlias: oldAlias,
      })) {
        history.replace(getFileRoute({
          isDependencyFile: true,
          moduleAlias: newAlias,
        }))
      }
    },
    onDeleteDependency: (dependencyPath: string) => {
      closeTab(dependencyPath)
      deleteDependency(repo, dependencyPath)
    },
    addDependency: async (
      moduleUuid: string, target: ModuleTarget, alias: string, targetOverride?: ModuleTarget
    ) => {
      const dependency = await fetchModuleImportDependency(moduleUuid, app.uuid)
      if (dependencyContext.dependencyIdToPath[dependency.dependencyId]) {
        return
      }
      dependency.alias = alias
      dependency.target = target
      const {dependencyId, moduleId} = dependency
      try {
        const {manifest} = await fetchModuleManifest({
          dependencyId, target, moduleId,
        })
        dependency.backendTemplates = manifest.backendTemplates
      } catch (err) {
        if (err.status !== 404) {
          // NOTE(christoph): If the manifest is not found it could be because the module was
          // just created, so we don't need to sync backendTemplates.
          throw err
        }
      }
      const filePath = generateDependencyFilePath()
      const content = JSON.stringify(dependency, null, 2)
      if (targetOverride) {
        await updateTargetOverride(repo, dependency.dependencyId, targetOverride)
      }
      await saveFiles(repo, [{filePath, content}])
    },
  }

  const moduleImportFromPage = async (moduleUuid: string, moduleName: string) => {
    const moduleExists = !!dependencyContext.moduleIdToAlias[moduleUuid]
    if (moduleExists) {
      history.push(
        getPathForDependency(dependencyContext.moduleIdToAlias[moduleUuid])
      )
      return
    }
    const aliasExists = !!dependencyContext.aliasToPath[moduleName]
    // TODO(Dale): If you own the module, lets import to master.
    const recentPatch = (await fetchPublicModuleDetail(moduleUuid)).recentVersion.patchTarget
    const moduleVersionTarget = updateVersionTarget(recentPatch, 'major')

    if (aliasExists) {
      setShowChangeModuleAliasModal(true)
      setChangeModuleAliasModalProps({
        onAliasResolution: async (newAlias: string) => {
          setAddingDependency(true)
          await moduleActionsContext.addDependency(moduleUuid, moduleVersionTarget, newAlias)
          setShowChangeModuleAliasModal(false)
          history.push(getPathForDependency(newAlias))
          setAddingDependency(false)
          setShowModulesContent(true)
        },
        existingAlias: moduleName,
      })
    } else {
      await moduleActionsContext.addDependency(
        moduleUuid,
        moduleVersionTarget,
        moduleName
      )
      history.push(getPathForDependency(moduleName))
      setShowModulesContent(true)
    }
  }

  React.useEffect(() => {
    const {state} = location as any
    if (state) {
      const {importModule, moduleUuid, moduleName} = state
      if (importModule && moduleUuid && moduleName) {
        moduleImportFromPage(moduleUuid, moduleName)
      }
    }
  }, [location.state])

  const moduleActionModals = showChangeModuleAliasModal
    ? (
      <ChangeModuleAliasModal
        loading={addingDependency}
        {...changeModuleAliasModalProps}
      />
    )
    : null

  return {
    moduleActionsContext,
    moduleImportFromPage,
    moduleActionModals,
    showModulesContent,
  }
}

export {useEditorModuleActions}
