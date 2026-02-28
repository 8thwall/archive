import React from 'react'
import {useHistory} from 'react-router-dom'
import {Modal} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import RepoControllerView from '../editor/repo-controller-view'
import '../static/styles/studio-repo-view.scss'
import '../static/styles/code-editor.scss'
import projectHistorySvg from '../static/icons/project_history.svg'
import GitProgressIndicator from '../editor/git-progress-indicator'
import {useTheme} from '../user/use-theme'

import WorkspaceCrumbHeading from '../widgets/workspace-crumb-heading'
import ErrorMessage from '../home/error-message'
import {ProjectHistoryView} from '../editor/project-history-view'
import useCurrentApp from '../common/use-current-app'
import useCurrentAccount from '../common/use-current-account'
import {useCurrentGit} from '../git/hooks/use-current-git'
import {useAppPathsContext} from '../common/app-container-context'
import {EditorThemeProvider} from '../editor/editor-theme-provider'
import {DependencyActiveBrowserModal} from '../editor/modals/dependency-active-browser-modal'
import {isCloudStudioApp} from '../../shared/app-utils'
import {PublishingStateContextProvider} from '../editor/publishing/publish-context'

const StudioRepoView: React.FC<{}> = () => {
  const app = useCurrentApp()
  const account = useCurrentAccount()
  const git = useCurrentGit()
  const history = useHistory()
  const themeName = useTheme()
  const {getPathForApp} = useAppPathsContext()
  const {t} = useTranslation(['cloud-editor-pages'])

  let content = null
  const repoLoadStatus = git.progress.load
  if (repoLoadStatus === 'DONE') {
    content = <ProjectHistoryView />
  } else {
    content = <GitProgressIndicator status={repoLoadStatus || 'UNSPECIFIED'} />
  }

  const mainAppPagePath = getPathForApp()

  return (
    <EditorThemeProvider>
      <PublishingStateContextProvider>
        <DependencyActiveBrowserModal />
        <div className='studio-repo-view'>
          {!isCloudStudioApp(app) &&
            <div className={`studio-editor ${themeName}`}>
              <RepoControllerView app={app} disableTemplatePicker />
            </div>
        }
          <div className='studio-repo-view-main'>
            <WorkspaceCrumbHeading
              text={t('project_history_page.heading')}
              account={account}
              app={app}
              dark
            />
            <ErrorMessage />
            {content}
          </div>
          {(!app.repoId || repoLoadStatus === 'NEEDS_INIT') &&
            <Modal
              className='no-repo-modal'
              open
              onClose={() => history.push(mainAppPagePath)}
              size='tiny'
            >
              <img className='icon' src={projectHistorySvg} alt='Project History' />
              <h2>{t('project_history_page.no_repo_modal.header')}</h2>
              <p>{t('project_history_page.no_repo_modal.blurb')}</p>
            </Modal>
        }
        </div>
      </PublishingStateContextProvider>
    </EditorThemeProvider>
  )
}

export default StudioRepoView
