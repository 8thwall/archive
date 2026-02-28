import React from 'react'

import type {IApp} from '../../common/types/models'
import {FinalPublishContent} from './final-publish-content'
import {PostPublishContent} from './post-publish-content'
import {PublishContent} from './publish-content'
import type {LandPublishState} from '../hooks/use-land-publish-state'

interface IOnlinePublishContent {
  landPublishState: LandPublishState | null
  publish: (prodCommitId: string, stageCommitId: string) => Promise<boolean>
  app: IApp
}

const OnlinePublishFlow: React.FC<IOnlinePublishContent> = ({
  landPublishState,
  publish,
  app,
}) => {
  // The first step of the web publish flow, where users select a commit to publish.
  const [isPublishContentShown, setIsPublishContentShown] = React.useState(true)

  // The pending commits the user selected to publish in <PublishContent>. Used in the second step.
  const [pendingProductionCommitId, setPendingProductionCommitId] = React.useState<string>(null)
  const [pendingStagingCommitId, setPendingStagingCommitId] = React.useState<string>(null)

  // The third step of the web publish flow, a success screen about publishing their build.
  const [isPostPublishContentShown, setIsPostPublishContentShown] = React.useState(false)

  const onPublishModalPublish = async (prodCommitId: string, stageCommitId: string) => {
    if (prodCommitId && !app?.productionCommitHash) {
      setPendingProductionCommitId(prodCommitId)
      setPendingStagingCommitId(stageCommitId)
      setIsPublishContentShown(false)
    } else {
      await publish(prodCommitId, stageCommitId)
    }
  }

  return (
    <>
      {isPublishContentShown && (
        <PublishContent
          publish={onPublishModalPublish}
          landPublishState={landPublishState}
        />
      )}

      {(pendingStagingCommitId || pendingProductionCommitId) &&
      !(isPostPublishContentShown || isPublishContentShown) && (
        <FinalPublishContent
          setShowPostPublish={setIsPostPublishContentShown}
          onClose={() => {
            setPendingProductionCommitId(null)
            setPendingStagingCommitId(null)
          }}
          onCancel={() => {
            setPendingProductionCommitId(null)
            setPendingStagingCommitId(null)
            setIsPublishContentShown(true)
          }}
          publish={() => publish(pendingProductionCommitId, pendingStagingCommitId)}
        />
      )}
      {isPostPublishContentShown && (
        <PostPublishContent />
      )}
    </>
  )
}

export {OnlinePublishFlow}
