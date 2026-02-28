import React from 'react'

import type {IApp} from '../../common/types/models'
import {actions as gitActions} from '../../git/git-actions'
import useActions from '../../common/use-actions'
import {useCurrentGit} from '../../git/hooks/use-current-git'

type LandType = 'land' | 'land-and-publish'

type LandPublishState = {
  pendingLandAndPublishStagingCommitId: string | null
  pendingLandAndPublishProductionCommitId: string | null
}

const useLandPublishState = (app: IApp) => {
  const [landPublishState, setLandPublishState] = React.useState<LandPublishState | null>(null)

  const deployment = useCurrentGit(git => git?.deployment)
  const stagingCommitHash = deployment?.staging
  const productionCommitHash = deployment?.production

  const {trySetDeploymentBranch} = useActions(gitActions)

  const publish = async (newProductionId: string | null, newStagingId: string | null) => {
    const setStaging = await newStagingId
      ? trySetDeploymentBranch(app.uuid, 'staging', newStagingId)
      : Promise.resolve(true)

    const setProd = await newProductionId
      ? trySetDeploymentBranch(app.uuid, 'production', newProductionId)
      : Promise.resolve(true)

    // If we just published the commits that were pending for land+publish, clear state.
    if ((!stagingCommitHash && newStagingId) || (!productionCommitHash && newProductionId)) {
      setLandPublishState(null)
    }

    return setStaging && setProd
  }

  // When a user clicks `Land Files + Publish`, we will automatically publish unless a commit has
  // not yet been published for either Staging or Production, in which case we'll show the publish
  // modal with the new commit pre-filled for that environment. But we will try to publish if we
  // can.
  const onRemoteLand = async (landType: LandType, commitId: string) => {
    if (landType === 'land-and-publish') {
      if (!stagingCommitHash && !productionCommitHash) {
        // Neither environment has been published yet, so we can't publish.
        setLandPublishState({
          pendingLandAndPublishStagingCommitId: commitId,
          pendingLandAndPublishProductionCommitId: commitId,
        })
      } else if (!stagingCommitHash) {
        // Staging has never been published, so we can't publish. But we can publish Production.
        setLandPublishState({
          pendingLandAndPublishStagingCommitId: commitId,
          pendingLandAndPublishProductionCommitId: null,
        })
        await publish(commitId, null)
      } else if (!productionCommitHash) {
        // Production has never been published, so we can't publish. But we can publish Staging.
        setLandPublishState({
          pendingLandAndPublishStagingCommitId: null,
          pendingLandAndPublishProductionCommitId: commitId,
        })
        await publish(null, commitId)
      } else {
        // Both environments have been published before, so we can publish Staging and Production.
        setLandPublishState({
          pendingLandAndPublishStagingCommitId: null,
          pendingLandAndPublishProductionCommitId: null,
        })
        await publish(commitId, commitId)
      }
    }
  }

  return {
    landPublishState,
    publish,
    onRemoteLand,
  }
}

export {
  LandType,
  LandPublishState,
  useLandPublishState,
}
