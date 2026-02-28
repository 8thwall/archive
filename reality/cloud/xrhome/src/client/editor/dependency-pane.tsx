import React from 'react'
import {Label} from 'semantic-ui-react'

import {useHistory} from 'react-router-dom'

import {isValidDependency} from '../../shared/module/validate-module-dependency'
import {isValidOverrideSettings} from '../../shared/module/validate-module-override'
import {CLIENT_FILE_PATH} from '../common/editor-files'
import {createThemedStyles} from '../ui/theme'
import {TargetSelector} from './dependency-settings'
import {useCurrentGit, useGitFile} from '../git/hooks/use-current-git'
import {useModuleMetadata} from './modules/use-module-metadata'
import {DependencyPaneHeader} from './modules/dependency-pane-header'
import {useChangeEffect} from '../hooks/use-change-effect'
import useActions from '../common/use-actions'
import dependencyActions from './dependency-actions'
import {useSelector} from '../hooks'
import {useModuleManifest} from './modules/use-module-manifest'
import {useAbandonableFunction} from '../hooks/use-abandonable-function'
import {useDependencyContext} from './dependency-context'
import {DependencyPaneContent} from './dependency-pane-content'
import {ModuleManifestMissingMessage} from './module-manifest-missing-message'
import type {CustomState} from './tab-state'
import {targetOverrideApplies} from '../../shared/module/module-target-override'
import {useGitRepo} from '../git/hooks/use-current-git'
import ForkModuleModal from './modals/fork-module-modal'
import useCurrentAccount from '../common/use-current-account'
import moduleActions from '../modules/actions'
import {ModuleActionsContext} from './modules/module-actions-context'
import moduleGitActions from '../git/module-git-actions'
import {getPathForDependency} from '../common/paths'
import {Loader} from '../ui/components/loader'
import useCurrentApp from '../common/use-current-app'
import fetchLog from '../common/fetch-log'
import {moduleTargetsEqual} from '../../shared/module/compare-module-target'

const useStyles = createThemedStyles(theme => ({
  dependencyPane: {
    position: 'relative',
    padding: '1rem 2rem 1rem 1rem',
    color: theme.fgMain,
    background: theme.mainEditorPane,
    flex: '2 0 0',
    overflow: 'auto',
  },
}))

const safeParseJson = (file: string): any => {
  try {
    return JSON.parse(file)
  } catch (error) {
    return null
  }
}

const useDependency = (dependencyPath: string) => {
  const context = useDependencyContext()
  if (!context) {
    return null
  }
  const {dependenciesByPath} = context
  const dependency = dependenciesByPath[dependencyPath]
  if (isValidDependency(dependency)) {
    return dependency
  }
  return null
}

interface IDependencyPane {
  dependencyPath: string
  tabState: CustomState
  onTabStateChange: (customState: CustomState) => void
}

const DependencyPane: React.FC<IDependencyPane> = ({
  dependencyPath, tabState, onTabStateChange,
}) => {
  const repo = useGitRepo()
  const classes = useStyles()
  const currentAccount = useCurrentAccount()
  const currentApp = useCurrentApp()
  const handle = useCurrentGit(git => git.repo?.handle)
  const history = useHistory()

  const dependency = useDependency(dependencyPath)

  const [forkModuleCommitId, setForkModuleCommitId] = React.useState<string>(null)
  const [forking, setForking] = React.useState(false)

  const {
    fetchModuleTargets, updateDependencyTarget, updateDependencyBackends,
  } = useActions(dependencyActions)
  const {duplicateModule} = useActions(moduleActions)
  const fetchModuleTargetsAbandonable = useAbandonableFunction(fetchModuleTargets)
  const {addDependency, onDeleteDependency} = React.useContext(ModuleActionsContext)
  const {bootstrapModuleRepo} = useActions(moduleGitActions)

  const [failedDependencyId, setFailedDependencyId] = React.useState<string>(null)

  const pendingBackendUpdateRef = React.useRef(false)

  const clientFile = useGitFile(CLIENT_FILE_PATH)
  const clientJson = safeParseJson(clientFile?.content)
  const isValidClientSettings = isValidOverrideSettings(clientJson)

  useChangeEffect(([prevDependency]) => {
    if (dependency && prevDependency?.dependencyId !== dependency.dependencyId) {
      setFailedDependencyId(null)
      fetchModuleTargetsAbandonable(dependency).catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Failed to load targets', err)
        setFailedDependencyId(dependency.dependencyId)
      })
    }
  }, [dependency, fetchModuleTargetsAbandonable] as const)

  const baseTargetOverride = (
    isValidClientSettings && clientJson.moduleTargetOverrides?.[dependency?.dependencyId]
  ) || null

  const targetOverride = dependency &&
                         targetOverrideApplies(dependency.target, baseTargetOverride) &&
                         baseTargetOverride

  const dependencyMetadata = useModuleMetadata(dependency)

  const hasTargets = useSelector(s => !!s.modules.targets[dependency?.moduleId])

  const manifestState = useModuleManifest(dependency && {
    ...dependency,
    target: targetOverride || dependency.target,
  }, !!targetOverride)

  const manifestLoading = manifestState.status === 'loading'
  const manifestLoaded = manifestState.status === 'loaded'
  const manifestMissing = manifestState.status === 'missing'

  useChangeEffect(([prevManifestState]) => {
    if (!pendingBackendUpdateRef.current) {
      return
    }

    if (manifestState.status !== 'loaded') {
      return
    }
    const loadComplete = prevManifestState.status === 'loading' ||
        !moduleTargetsEqual(manifestState.target, prevManifestState.target)

    if (loadComplete) {
      updateDependencyBackends(repo, dependencyPath, manifestState.manifest.backendTemplates)
      pendingBackendUpdateRef.current = false
    }
  }, [manifestState] as const)

  if (!dependency) {
    // TODO(christoph): Maybe add actionable options like to revert/re-import the dependency
    return <div><Label size='large'>Invalid dependency</Label></div>
  }

  if (dependency?.dependencyId === failedDependencyId) {
    return (
      <div className={classes.dependencyPane}>
        Failed to load targets
      </div>
    )
  }

  if (manifestState.status === 'error') {
    return (
      <div className={classes.dependencyPane}>
        {manifestState.message || 'Manifest failed to load'}
      </div>
    )
  }

  const isLoading = dependencyMetadata.status === 'loading' || !hasTargets
  if (isLoading) {
    return (
      <div className={classes.dependencyPane} />
    )
  }

  const isDevelopmentMode = targetOverride?.type === 'development'

  const {module} = dependencyMetadata.metadata || {}
  const forkable = module?.repoVisibility === 'PUBLIC' &&
    module?.AccountUuid !== currentAccount.uuid

  const doFork = async (name: string) => {
    setForking(true)
    try {
      const newModule = await duplicateModule(module, {
        name,
        AccountUuid: currentAccount.uuid,
        commitId: forkModuleCommitId,
        isFork: true,
      })
      fetchLog('s', {
        action: 'FORK_MODULE',
        appUuid: currentApp.uuid,
        forkedModule: module.uuid,
      })
      await bootstrapModuleRepo(newModule.repoId)
      await addDependency(
        newModule.uuid,
        {type: 'branch', branch: 'master'},
        newModule.name,
        {type: 'development', handle}
      )
      history.push(getPathForDependency(currentAccount, currentApp, name))
      onDeleteDependency(dependencyPath)
    } finally {
      setForkModuleCommitId(null)
      setForking(false)
    }
  }

  return (
    <div className={classes.dependencyPane}>
      {forkModuleCommitId &&
        <ForkModuleModal
          onClose={() => setForkModuleCommitId(null)}
          forkModule={doFork}
          sourceAlias={dependency.alias}
          loading={forking}
        />
      }
      {dependencyMetadata.status === 'loaded' &&
        <DependencyPaneHeader
          module={dependencyMetadata.metadata.module}
          account={dependencyMetadata.metadata.account}
          dependencyId={dependency.dependencyId}
        />
      }
      {!targetOverride &&
        <TargetSelector
          dependency={dependency}
          dependencyPath={dependencyPath}
          onChange={(newTarget) => {
            updateDependencyTarget(repo, dependencyPath, newTarget)
            pendingBackendUpdateRef.current = true
          }}
          moduleIsForkable={forkable}
          onDoFork={id => setForkModuleCommitId(id)}
        />}
      {manifestLoading && <Loader />}
      {manifestMissing &&
        <ModuleManifestMissingMessage
          moduleUuid={dependency.moduleId}
          isDevelopmentMode={isDevelopmentMode}
        />
      }
      {manifestLoaded &&
        <DependencyPaneContent
          dependencyPath={dependencyPath}
          readme={manifestState.readme}
          manifest={manifestState.manifest}
          moduleId={dependency.moduleId}
          tabState={tabState}
          onTabStateChange={onTabStateChange}
          isDevelopmentMode={isDevelopmentMode}
        />
      }
    </div>
  )
}

export {
  DependencyPane,
}
