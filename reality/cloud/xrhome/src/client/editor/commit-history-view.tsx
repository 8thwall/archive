import React from 'react'
import {Button} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import coreGitActions from '../git/core-git-actions'
import useActions from '../common/use-actions'
import {CommitChart, ClientBranch} from './commit-chart'
import {useCurrentGit, useGitActiveClient} from '../git/hooks/use-current-git'
import {getCommitTimeString, getTruncatedHash} from '../git/g8-commit'
import {DiffViewModal, IDiffViewModal} from './diff/diff-view-modal'
import {useAbandonableFunction} from '../hooks/use-abandonable-function'

interface ICommitSummary {
  commitId: string
  summary: string
  signature: string
  when: string
  onOpenDiffView: Function
  loading: boolean
  renderCommitSummaryMenu?: (commitId: string) => React.ReactNode
}

const CommitSummary: React.FunctionComponent<ICommitSummary> = ({
  commitId, summary, signature, when, onOpenDiffView, loading, renderCommitSummaryMenu,
}) => {
  const {t} = useTranslation(['common'])

  return (
    <div className='commit with-content'>
      <div className='commit-box'>
        <div className='header'>
          <div className='summary'>
            <span className='commit-hash'>{getTruncatedHash(commitId)}</span>
            <span title={summary} className='commit-summary'>{summary}</span>
          </div>
          <div className='description'>
            <span>{when} by {signature}</span>&ensp;
            <span>
              <Button
                className='view-button'
                loading={loading}
                onClick={() => onOpenDiffView()}
                content={t('button.view')}
              />
            </span>
            {renderCommitSummaryMenu &&
              <span>
                {renderCommitSummaryMenu(commitId)}
              </span>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

interface ITargetPointerItem {
  index: number
  skipIdx: number
  text: string
  href?: string
  className?: string
}

const TargetPointerItem: React.FC<ITargetPointerItem> = ({
  index, skipIdx, href, className, text,
}) => (
  <div className={`target row${(skipIdx === 0 ? 2 : 1) + index}`}>
    {href
      ? <a target='_blank' href={href} rel='noreferrer' className={className}>{text}</a>
      : <span className={className}>{text}</span>
    }
  </div>
)

type TargetAnnotation = Pick<ITargetPointerItem, 'href' | 'className' | 'text'> & {
  key: string
  commitId: string
}

interface ICommitHistoryView {
  annotatedTargets: TargetAnnotation[]
  clientHref?: string
  clientContent?: React.ReactNode
  renderCommitSummaryMenu?: (commitId: string) => React.ReactNode
}

const CommitHistoryView: React.FC<ICommitHistoryView> = ({
  annotatedTargets, clientContent, clientHref, renderCommitSummaryMenu,
}) => {
  const {performDiff, getDependencyDiff} = useActions(coreGitActions)
  const abandonGetDependencyDiff = useAbandonableFunction(getDependencyDiff)
  const git = useCurrentGit()
  const {t} = useTranslation(['cloud-editor-pages'])

  const [currentOpenDiff, setCurrentOpenDiff] = React.useState<IDiffViewModal>(null)

  const {logs} = git

  const rowHeight: number = 37
  // the empty line is for a potential landing visualization
  const numLinesWithSkip = 1 + logs.length

  const activeClient = useGitActiveClient()
  const activeClientName = activeClient && activeClient.name

  let skipIdx = null
  if (activeClient) {
    // find skipIdx
    const clientParent = logs.findIndex(l => l.id === activeClient.forkId)
    if (clientParent >= 0) {
      skipIdx = clientParent
    }
  }

  const targetPointers = annotatedTargets.map(target => (
    target ? logs.findIndex(l => l.id === target.commitId) : -1
  ))

  // RepoProductionPointersAndCommitLog
  // Explicit grid is required for -1 row span to work
  return (
    <>
      <div
        className='deployment-repo'
        style={{
          gridAutoRows: `${rowHeight}px`,
          gridTemplateRows: `repeat(${numLinesWithSkip}, ${rowHeight}px)`,
        }}
      >
        {annotatedTargets.map((target, index) => (
          target && <TargetPointerItem {...target} index={index} skipIdx={skipIdx} />
        ))}
        <CommitChart
          className='chart'
          solidPointers={targetPointers}
          rowHeight={rowHeight}
          numLines={logs?.length || 0}
          skipIdx={skipIdx !== null ? [skipIdx] : null}
        />
        <div className='commit' />
        {logs.map((l, index) => {
          // When rendering the line item for the fork point for the current client, show the
          // client pointer above it.
          const clientBranchPointer = skipIdx === index &&
            <ClientBranch
              name={activeClientName}
              className='client-branch'
              content={clientContent}
              link={clientHref}
              rowHeight={rowHeight}
            />

          const logCommitId = l.id || '0000000'
          const summary = l.summary || t('project_history_page.default_summary')
          const signature = (l.signature && l.signature.name) ||
            t('project_history_page.default_signature')
          const when = getCommitTimeString(l)

          return (
            <React.Fragment key={logCommitId}>
              {clientBranchPointer}
              <CommitSummary
                commitId={logCommitId}
                summary={summary}
                signature={signature}
                when={when}
                loading={
                  git.progress.diff === 'REQUEST_SENT'
                }
                onOpenDiffView={async () => {
                  const prevCommitLog = logs[index + 1]
                  const parentCommitId = (prevCommitLog && prevCommitLog.id) || 'EMPTY'
                  performDiff({
                    repositoryName: git.repo.repositoryName,
                    repoId: git.repo.repoId,
                    basePoint: parentCommitId,
                    changePoint: logCommitId,
                    findRenames: true,
                  })
                  const dependencyDiff = await abandonGetDependencyDiff({
                    repositoryName: git.repo.repositoryName,
                    repoId: git.repo.repoId,
                    basePoint: parentCommitId,
                    changePoint: logCommitId,
                  })
                  setCurrentOpenDiff({
                    commitId: logCommitId,
                    description: summary,
                    whenByWhom: `${when} by ${signature}`,
                    onClose: () => setCurrentOpenDiff(null),
                    dependencyDiff,
                  })
                }}
                renderCommitSummaryMenu={renderCommitSummaryMenu}
              />
            </React.Fragment>
          )
        })}
      </div>
      {currentOpenDiff && git.progress.diff === 'READY' && <DiffViewModal {...currentOpenDiff} />}
    </>
  )
}

export {
  CommitHistoryView,
}
