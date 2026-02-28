import React, {useEffect, useMemo} from 'react'
import {Route, useLocation, useRouteMatch} from 'react-router-dom'

import ContainerSidebar from '../widgets/container-sidebar'
import ContainerSwitch from '../widgets/container-switch'
import NotFoundPage from '../home/not-found-page'
import getPagesForModule from './module-pages'
import {useCurrentModule} from '../common/use-current-module'
import moduleGitActions from '../git/module-git-actions'
import useActions from '../common/use-actions'
import moduleDeploymentActions from './module-deployment-actions'
import {useModuleWebsockets} from './use-module-websockets'
import {createSaveSemaphore, SaveSemaphoreContext} from '../editor/hooks/save-challenge-semaphore'
import {useScopedGit} from '../git/hooks/use-current-git'
import {RepoIdProvider} from '../git/repo-id-context'
import {TextEditorContextProvider} from '../editor/texteditor/texteditor-context'
import {
  DismissibleModalContextProvider, useDismissibleModalContext,
} from '../editor/dismissible-modal-context'

const InnerModuleContainer: React.FC = () => {
  const match = useRouteMatch()
  const pages = getPagesForModule()
  const {dismissModals} = useDismissibleModalContext()

  React.useEffect(() => {
    dismissModals()
  }, [useLocation()])

  return (
    <>
      <ContainerSidebar
        pages={pages}
        size='thin'
        iconSize='large'
        showText={false}
      />
      <ContainerSwitch pages={pages}>
        <Route path={match.path}>
          <NotFoundPage />
        </Route>
      </ContainerSwitch>
    </>
  )
}

const ModuleContainer: React.FC = () => {
  const module = useCurrentModule()

  const saveSemaphore = useMemo(createSaveSemaphore, [])

  const {bootstrapModuleRepo, initializeModuleRepo} = useActions(moduleGitActions)
  const {fetchModuleChannels} = useActions(moduleDeploymentActions)

  const repo = useScopedGit(module?.repoId, git => git.repo)
  const hasExpectedRepo = repo?.repositoryName === module?.repoId
  const repoNeedsInit = useScopedGit(module?.repoId, git => git.progress.load === 'NEEDS_INIT')

  useEffect(() => {
    if (module && !hasExpectedRepo) {
      bootstrapModuleRepo(module.repoId)
    }
  }, [hasExpectedRepo, module, bootstrapModuleRepo])

  useEffect(() => {
    if (hasExpectedRepo && repoNeedsInit) {
      initializeModuleRepo(module.repoId)
    }
  }, [repoNeedsInit])

  // WEBSOCKET HANDLING
  useModuleWebsockets(module)

  useEffect(() => {
    if (module) {
      fetchModuleChannels(module.uuid)
    }
  }, [module?.uuid])

  if (!module) {
    // TODO(pawel) Right now WorkspaceContainer lists modules for account so if this is null,
    // we assume the module list is still loading. In the future we want to resolve the module
    // based on account and module name but this endpoint is still not in modules-controller.
    // When it appears, adjust this logic to load the module and if that returns 404 then
    // we display a 404 page.
    return null
  }

  return (
    <RepoIdProvider value={module.repoId}>
      <div className='with-sidebar'>
        <SaveSemaphoreContext.Provider value={saveSemaphore}>
          <TextEditorContextProvider>
            <DismissibleModalContextProvider>
              <InnerModuleContainer />
            </DismissibleModalContextProvider>
          </TextEditorContextProvider>
        </SaveSemaphoreContext.Provider>
      </div>
    </RepoIdProvider>
  )
}

export {
  ModuleContainer as default,
}
