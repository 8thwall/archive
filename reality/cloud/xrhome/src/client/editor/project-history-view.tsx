import React from 'react'
import {useTranslation} from 'react-i18next'

import {
  makeHostedClientUrl, makeHostedDevelopmentUrl, makeHostedProductionUrl, makeHostedStagingUrl,
} from '../../shared/hosting-urls'
import {actions as gitActions} from '../git/git-actions'
import useActions from '../common/use-actions'
import {useCurrentGit, useGitActiveClient} from '../git/hooks/use-current-git'
import {CommitHistoryView} from './commit-history-view'
import useCurrentApp from '../common/use-current-app'

interface IProjectHistoryView {
  renderCommitSummaryMenu?: (commitId: string) => React.ReactNode
}

const ProjectHistoryView: React.FunctionComponent<IProjectHistoryView> = ({
  renderCommitSummaryMenu,
}) => {
  const {syncRepoStateFromServer} = useActions(gitActions)
  const app = useCurrentApp()
  const git = useCurrentGit()
  const {t} = useTranslation(['cloud-editor-pages'])

  const reloadDeployments = () => {
    if (git.progress.load !== 'DONE') {
      return null
    }
    return syncRepoStateFromServer(git.repo, app.uuid)
  }

  React.useEffect(() => {
    reloadDeployments()
  }, [git?.repo?.repositoryName])

  const {repo, deployment} = git

  const devCommitHash = deployment.master || ''
  const stagingCommitHash = deployment.staging || ''
  const productionCommitHash = deployment.production || ''

  const activeClient = useGitActiveClient()

  // When a hash isn't present for a target, we don't shift the target position in the grid,
  // so we leave the falsy elements in the array.
  const targets = [
    devCommitHash && {
      key: 'latest',
      commitId: devCommitHash,
      text: t('editor_page.deployment_type.latest'),
      href: makeHostedDevelopmentUrl(repo.workspace, app.appName),
    },
    stagingCommitHash && {
      key: 'staging',
      commitId: stagingCommitHash,
      text: t('editor_page.deployment_type.staging'),
      className: 'staging-link',
      href: makeHostedStagingUrl(repo.workspace, app.appName),
    },
    productionCommitHash && {
      key: 'public',
      commitId: productionCommitHash,
      text: t('editor_page.deployment_type.public'),
      className: 'prod-link',
      href: makeHostedProductionUrl(repo.workspace, app.appName),
    },
  ]

  return (
    <CommitHistoryView
      annotatedTargets={targets}
      clientHref={makeHostedClientUrl(repo.workspace, app.appName, repo.handle, activeClient?.name)}
      renderCommitSummaryMenu={renderCommitSummaryMenu}
    />
  )
}

export {
  ProjectHistoryView,
}
