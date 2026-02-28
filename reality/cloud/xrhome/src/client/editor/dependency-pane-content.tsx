import React from 'react'
import type {DeepReadonly} from 'ts-essentials'

import type {ModuleDependency} from '../../shared/module/module-dependency'
import type {IGitFile} from '../git/g8-dto'
import useActions from '../common/use-actions'
import coreGitActions from '../git/core-git-actions'
import {useGitFileContent, useGitRepo} from '../git/hooks/use-current-git'
import {useAbandonableFunction} from '../hooks/use-abandonable-function'
import {
  configReducer, fileChangeAction, initConfigState, saveStartAction,
} from './module-config/module-config-editor-reducer'
import type {ModuleManifest} from '../../shared/module/module-manifest'
import {createThemedStyles} from '../ui/theme'
import {RawMarkdownPreview} from './raw-markdown-preview'
import {ModuleConfigEditor} from './module-config/module-config-editor'
import {ModuleConfigBuilder} from './module-config/module-config-builder'
import {useSelector} from '../hooks'
import {ModuleReleaseNotes} from '../modules/module-release-notes'
import {StandardInlineToggleField} from '../ui/components/standard-inline-toggle-field'
import {IMultiRepoContext, useMultiRepoContext} from './multi-repo-context'
import {IDependencyContext, useDependencyContext} from './dependency-context'
import type {CustomState} from './tab-state'
import {RepoIdProvider} from '../git/repo-id-context'
import {useId} from '../hooks/use-id'
import {BackendApiCardList} from './dependency-backend-api-card'
import {Keys} from '../studio/common/keys'

const useStyles = createThemedStyles(theme => ({
  readmeContainer: {
    border: `1px solid ${theme.subtleBorder}`,
    borderRadius: '0.5rem',
    margin: '1rem 0 0',
    overflow: 'hidden',
  },
  tab: {
    'color': theme.fgMuted,
    'fontSize': '1.125rem',
    'background': 'none',
    'border': 'none',
    '&[aria-selected="true"]': {
      color: theme.fgMain,
    },
  },
  tabs: {
    paddingInlineStart: '0',
    display: 'flex',
    gap: '1rem',
    marginTop: '2.5rem',
  },
  editToggle: {
    marginLeft: 'auto',
  },
}))

const useRepoIdForDependency = (
  dependencyPath: string,
  multiRepoContext: DeepReadonly<IMultiRepoContext>,
  dependencyContext: DeepReadonly<IDependencyContext>
): string => {
  if (!multiRepoContext || !dependencyContext) {
    return null
  }
  const depId = dependencyContext.dependenciesByPath[dependencyPath]?.dependencyId
  return multiRepoContext.openDependencies[depId]
}

interface IDependencyPaneContent {
  moduleId: string
  dependencyPath: string
  manifest: ModuleManifest
  readme: string
  tabState: CustomState
  onTabStateChange: (customState: CustomState) => void
  isDevelopmentMode: boolean
}

const DependencyPaneContent: React.FC<IDependencyPaneContent> = ({
  moduleId, dependencyPath, manifest, readme, tabState, onTabStateChange, isDevelopmentMode,
}) => {
  const repo = useGitRepo()
  const classes = useStyles()
  const hasReadme = !!readme

  const multiRepoContext = useMultiRepoContext()
  const dependencyContext = useDependencyContext()
  const repoId = useRepoIdForDependency(dependencyPath, multiRepoContext, dependencyContext)

  const {transformFile} = useActions(coreGitActions)

  const transformFileAbandonable = useAbandonableFunction(transformFile)

  const fileContent = useGitFileContent(dependencyPath)

  const [configState, dispatch] = React.useReducer(configReducer, fileContent, initConfigState)

  const versions = useSelector(s => s.modules.targets[moduleId]?.versions)
  const preVersions = useSelector(s => s.modules.targets[moduleId]?.preVersions)

  const hasChanges = configState.needsSave

  const setActiveTab = (index: number) => onTabStateChange({activeTab: index})

  const editToggleId = useId()

  React.useEffect(() => {
    dispatch(fileChangeAction(fileContent))
  }, [fileContent])

  React.useEffect(() => {
    if (!hasChanges) {
      return undefined
    }

    const timeout = setTimeout(async () => {
      await transformFileAbandonable(repo, dependencyPath, (file: IGitFile) => {
        const dep = JSON.parse(file.content) as ModuleDependency
        dep.config = configState.config
        const newContent = JSON.stringify(dep, null, 2)
        dispatch(saveStartAction(newContent))
        return newContent
      })
    }, 1000)

    return () => {
      clearTimeout(timeout)
    }
  }, [dependencyPath, transformFile, hasChanges, configState])

  const backendTemplates = dependencyContext.dependenciesByPath[dependencyPath]?.backendTemplates

  const showOptions = (manifest.config?.fields && Object.keys(manifest.config.fields).length) ||
    !!backendTemplates?.length || repoId
  const editMode = tabState.editMode !== false || !!tabState.editMode

  const tabs = []
  const uniqueTabId = useId()
  // NOTE(johnny): If we are in development mode it is fine to show a blank module editor.

  if (showOptions) {
    tabs.push({
      name: 'options',
      text: 'Options',
      tabPanel: (editMode && repoId)
        ? (
          <RepoIdProvider value={repoId}>
            <ModuleConfigBuilder />
          </RepoIdProvider>)
        : (
          <>
            {backendTemplates &&
              <BackendApiCardList
                backendTemplates={backendTemplates}
                isDevelopmentMode={isDevelopmentMode}
                dependencyPath={dependencyPath}
                repoId={repoId}
              />
            }
            <ModuleConfigEditor
              dependencyPath={dependencyPath}
              manifest={manifest}
              moduleId={moduleId}
            />
          </>)
      ,
    })
  }

  if (hasReadme) {
    tabs.push({
      name: 'readme',
      text: 'README',
      tabPanel: (
        <div className={classes.readmeContainer}>
          <RawMarkdownPreview content={readme} />
        </div>
      ),
    })
  }

  if (versions?.length) {
    tabs.push({
      name: 'releasenotes',
      text: 'Release Notes',
      tabPanel: <ModuleReleaseNotes
        dependencyPath={dependencyPath}
        versions={versions}
        preVersions={preVersions}
      />,
    })
  }

  const activeTab = Math.min(Math.max(tabs.length - 1, 0), tabState.activeTab || 0)

  const handleKeyDown = (e) => {
    if (e.key === Keys.LEFT) {
      setActiveTab((tabs.length + (activeTab - 1)) % tabs.length)
    }
    if (e.key === Keys.RIGHT) {
      setActiveTab((activeTab + 1) % tabs.length)
    }
  }

  if (tabs.length === 0) {
    return null
  }

  const showEditToggle = repoId && manifest && tabs[activeTab]?.name === 'options'

  return (
    <>
      <ul
        role='tablist'
        aria-label='Module Config Tabs'
        className={classes.tabs}
        onKeyDown={handleKeyDown}
      >
        {tabs.map((t, i) => {
          const isActive = activeTab === i
          return (
            <button
              key={t.name}
              aria-controls={`tabpanel-${t.name}`}
              aria-selected={isActive}
              className={classes.tab}
              id={`tab-${t.name}-${uniqueTabId}`}
              onClick={() => setActiveTab(i)}
              role='tab'
              tabIndex={isActive ? 0 : -1}
              type='button'
            >
              {t.text}
            </button>
          )
        })}
        {showEditToggle &&
          <div className={classes.editToggle}>
            <StandardInlineToggleField
              id={`test-${editToggleId}`}
              label='Edit mode'
              checked={editMode}
              onChange={() => onTabStateChange({editMode: !editMode})}
              reverse
            />
          </div>
        }
      </ul>
      {tabs.map((t, i) => (activeTab === i && (
        <div
          key={t.name}
          aria-labelledby={`tab-${t.name}-${uniqueTabId}`}
          id={`tab-panel-${t.name}-${uniqueTabId}`}
          role='tabpanel'
          tabIndex={0}
        >
          {t.tabPanel}
        </div>
      )))}
    </>
  )
}

export {
  DependencyPaneContent,
}
