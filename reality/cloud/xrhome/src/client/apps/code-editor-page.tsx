import React from 'react'
import {useTranslation} from 'react-i18next'

import '../static/styles/code-editor.scss'
import ErrorMessage from '../home/error-message'
import {G8ErrorMessage} from '../git/g8-error-message'
import Title from '../widgets/title'
import {getDisplayNameForApp} from '../../shared/app-utils'
import useActions from '../common/use-actions'
import useCurrentApp from '../common/use-current-app'
import {useCurrentGit} from '../git/hooks/use-current-git'
import GitProgressIndicator from '../editor/git-progress-indicator'
import {EditorThemeProvider} from '../editor/editor-theme-provider'
import {useUserEditorSettings} from '../user/use-user-editor-settings'
import {combine} from '../common/styles'
// eslint-disable-next-line import/no-cycle
import {FileActionsContext} from '../editor/files/file-actions-context'
import {CodeEditor} from '../editor/code-editor/code-editor'
import {ModuleActionsContext} from '../editor/modules/module-actions-context'
import {actions as gitActions} from '../git/git-actions'
import NewProjectModal from '../editor/modals/new-project-modal'
import {useStudioFileActionState} from '../studio/hooks/use-studio-file-action-state'
import {AppPathEnum} from '../common/paths'

const InnerCodeEditorPage: React.FC = () => {
  const app = useCurrentApp()
  const {t} = useTranslation(['app-pages'])

  const settings = useUserEditorSettings()

  const {
    focusedEditor,
    actionsContext,
    editorSession,
    fileActionModals,
    moduleActionsContext,
  } = useStudioFileActionState(AppPathEnum.codeEditor)

  return (
    <div className={combine('studio-editor', settings.darkMode ? 'dark' : 'light')}>
      <EditorThemeProvider>
        <Title>{`${getDisplayNameForApp(app)} - ${t('code_editor_page.page_title')}`}</Title>
        <ErrorMessage />
        <G8ErrorMessage appUuid={app.uuid} />
        <FileActionsContext.Provider value={actionsContext}>
          <ModuleActionsContext.Provider value={moduleActionsContext}>
            <CodeEditor
              editorSession={editorSession}
              focusedEditor={focusedEditor}
              isStandAlone
            />
            {fileActionModals}
          </ModuleActionsContext.Provider>
        </FileActionsContext.Provider>
      </EditorThemeProvider>
    </div>
  )
}

const CodeEditorPage = () => {
  const app = useCurrentApp()
  const gitProgress = useCurrentGit(g => g.progress.load)

  const {bootstrapAppRepo} = useActions(gitActions)

  React.useEffect(() => {
    if (gitProgress === 'HAS_REPO_NEEDS_CLONE') {
      bootstrapAppRepo(app.uuid, {ensureLocalClone: true})
    }
  }, [gitProgress, app.uuid, bootstrapAppRepo])

  if (gitProgress === 'DONE') {
    return <InnerCodeEditorPage />
  }

  if (gitProgress === 'NEEDS_INIT' || !app.repoId) {
    return (
      <EditorThemeProvider>
        <NewProjectModal app={app} />
      </EditorThemeProvider>
    )
  }

  return (
    <>
      <ErrorMessage />
      <G8ErrorMessage appUuid={app.uuid} />
      <GitProgressIndicator status={gitProgress || 'UNSPECIFIED'} />
    </>
  )
}

export default CodeEditorPage
