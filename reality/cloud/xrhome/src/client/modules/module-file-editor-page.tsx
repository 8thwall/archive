import React from 'react'
import SplitPane from 'react-split-pane'
import localForage from 'localforage'

import {useCurrentModule} from '../common/use-current-module'
import Title from '../widgets/title'
import ErrorMessage from '../home/error-message'
import {ModuleRepoToolbar} from './module-repo-toolbar'
import {Loader} from '../ui/components/loader'
import GitProgressIndicator from '../editor/git-progress-indicator'
import {useCurrentGit, useGitLoadProgress} from '../git/hooks/use-current-git'
import {ModuleEditorSocketBranchEnum as BranchEnum} from './module-editor-constants'
import {useTheme} from '../user/use-theme'
import {getModuleSpecifier} from './module-specifier'
import RepoInfoFooter from '../editor/repo-info-footer'
import SwitchActiveBrowserModal from '../editor/modals/switch-active-browser-modal'
import {useModuleUser} from '../common/use-module-user'
import {AccountDashboardPathEnum, getPathForAccountDashboard} from '../common/paths'
import moduleUserActions from './module-user-actions'

import useCurrentAccount from '../common/use-current-account'
import useActions from '../common/use-actions'
import moduleGitActions from '../git/module-git-actions'
import {EditorThemeProvider} from '../editor/editor-theme-provider'

const LazyModuleBrowsableMultitabEditorView = React.lazy(() => (
  import('./module-browsable-multitab-editor-view')
))

const COLLAPSED_SIZE = 30
const EXPANDED_SIZE = 250
const MIN_EXPANDED_SIZE = 100

const getMaxSize = () => window.innerHeight * 0.8
const limitSize = size => Math.min(getMaxSize(), size)

const ModuleFileEditorPage: React.FunctionComponent = () => {
  const module = useCurrentModule()
  const themeName = useTheme()

  const loadProgress = useGitLoadProgress()
  const isLoaded = loadProgress === 'DONE'

  const git = useCurrentGit()
  const {repo} = git
  const moduleUser = useModuleUser()
  const account = useCurrentAccount()
  const clientSpecifier = getModuleSpecifier(module, git, BranchEnum.currentClient)
  const {getModuleUser, updateModuleUser} = useActions(moduleUserActions)
  const {revertModuleToSave} = useActions(moduleGitActions)

  const [splitSize, setSplitSize] = React.useState(COLLAPSED_SIZE)
  const showLogs = splitSize >= MIN_EXPANDED_SIZE

  const handleResize = (size: number) => {
    setSplitSize(limitSize(size))
  }
  const [preferredExpandedSize, setPreferredExpandedSize] = React.useState(EXPANDED_SIZE)

  const handleResizeFinished = (rawSize: number) => {
    const size = limitSize(rawSize)
    const collapse = size < MIN_EXPANDED_SIZE

    setSplitSize(collapse ? COLLAPSED_SIZE : size)

    if (!collapse) {
      setPreferredExpandedSize(size)
      localForage.setItem('editor-log-container-size', size)
    }
  }

  const toggleShowLogs = () => {
    setSplitSize(
      splitSize < MIN_EXPANDED_SIZE
        ? limitSize(preferredExpandedSize)
        : COLLAPSED_SIZE
    )
  }

  return (
    <EditorThemeProvider>
      <div className={`studio-editor ${themeName}`}>
        <Title>{`${module.name} - Editor`}</Title>
        <ErrorMessage />

        {/* TODO(pawel) G8 Error message forcing re-sync */}

        <SwitchActiveBrowserModal
          entityUuid={repo?.repoId}
          activeBrowserUuid={moduleUser?.activeBrowser}
          chatSpecifier={getModuleSpecifier(module, git, BranchEnum.chatChannel)}
          backPath={getPathForAccountDashboard(account, AccountDashboardPathEnum.modules)}
          getUserSpecific={() => getModuleUser(module.uuid)}
          updateUserSpecific={activeBrowser => updateModuleUser(module.uuid, {activeBrowser})}
          revertToSave={() => revertModuleToSave(repo)}
        />
        <SplitPane
          split='horizontal'
          primary='second'
          minSize={COLLAPSED_SIZE}
          size={splitSize}
          maxSize={getMaxSize()}
          onChange={handleResize}
          onDragFinished={handleResizeFinished}
        >
          <div className='main-view vertical'>
            <ModuleRepoToolbar module={module} />
            {isLoaded
              ? (
                <React.Suspense fallback={<Loader />}>
                  <LazyModuleBrowsableMultitabEditorView />
                </React.Suspense>
              )
              : <GitProgressIndicator status={loadProgress} />
            }
          </div>
          <RepoInfoFooter
            logKey={module.repoId}
            showLogs={showLogs}
            toggleShowLogs={toggleShowLogs}
            clientSpecifier={clientSpecifier}
          />
        </SplitPane>
      </div>
    </EditorThemeProvider>
  )
}

export {
  ModuleFileEditorPage as default,
}
