import React from 'react'

import '../static/styles/studio-repo-view.scss'
import '../static/styles/code-editor.scss'
import GitProgressIndicator from '../editor/git-progress-indicator'
import {useTheme} from '../user/use-theme'
import ErrorMessage from '../home/error-message'
import {ModuleHistoryView} from './module-history-view'
import useCurrentAccount from '../common/use-current-account'
import {useCurrentGit} from '../git/hooks/use-current-git'
import HeadingBreadcrumbs from '../widgets/heading-breadcrumbs'
import {getPathForModule, getPathForModules, ModulePathEnum} from '../common/paths'
import {useCurrentModule} from '../common/use-current-module'
import {ModuleRepoToolbar} from './module-repo-toolbar'
import {useUserEditorSettings} from '../user/use-user-editor-settings'
import {UiThemeProvider} from '../ui/theme'

const ModuleHistoryPage: React.FC<{}> = () => {
  const account = useCurrentAccount()
  const module = useCurrentModule()
  const git = useCurrentGit()
  const themeName = useTheme()
  const settings = useUserEditorSettings()

  let content = null
  const repoLoadStatus = git.progress.load
  if (repoLoadStatus === 'DONE') {
    content = (
      <ModuleHistoryView
        module={module}
      />
    )
  } else {
    content = (<GitProgressIndicator status={repoLoadStatus || 'UNSPECIFIED'} />)
  }

  return (
    <UiThemeProvider mode={settings.darkMode ? 'dark' : 'light'}>
      <div className='studio-repo-view'>
        <div className={`studio-editor ${themeName}`}>
          <ModuleRepoToolbar module={module} />
        </div>
        <div className='studio-repo-view-main'>
          <HeadingBreadcrumbs
            title='Module History'
            links={[
              {
                text: account.shortName,
                path: getPathForModules(account),
                key: 'account-name-link',
              },
              {
                text: module.name,
                // TODO(christoph): This link on the project history page links to the dashboard,
                // what should it be for modules?
                path: getPathForModule(account, module, ModulePathEnum.history),
                key: 'module-name-link',
              }]}
            dark
          />
          <ErrorMessage />
          {content}
        </div>
      </div>
    </UiThemeProvider>
  )
}

export default ModuleHistoryPage
