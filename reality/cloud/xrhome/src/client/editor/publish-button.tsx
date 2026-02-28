import React from 'react'

import {useGitProgress} from '../git/hooks/use-current-git'
import {UniversalPublishModal} from './modals/universal-publish-modal'
import {usePublishingStateContext} from './publishing/publish-context'
import type {LandPublishState} from './hooks/use-land-publish-state'

type IPublishButton = {
  renderButton: (props: {disabled: boolean}) => React.ReactElement
  publish: (prodCommitId: string, stageCommitId: string) => Promise<boolean>
  landPublishState: LandPublishState | null
}

const PublishButton: React.FC<IPublishButton> = ({
  renderButton,
  publish,
  landPublishState,
}) => {
  const gitProgress = useGitProgress()
  const {setActivePublishModalOption} = usePublishingStateContext()

  const disabled = gitProgress.load !== 'DONE' ||
  (gitProgress.land !== 'UNSPECIFIED' && gitProgress.land !== 'DONE')

  // If we just did a `Land Files + Publish` but have commits we were not able to publish and
  // require the user to land manually, show the publish modal which they can use to publish.
  React.useEffect(() => {
    if (
      landPublishState?.pendingLandAndPublishStagingCommitId ||
      landPublishState?.pendingLandAndPublishProductionCommitId
    ) {
      setActivePublishModalOption('web')
    }
  }, [landPublishState])

  return (
    <UniversalPublishModal
      trigger={renderButton({disabled})}
      landPublishState={landPublishState}
      publish={publish}
    />
  )
}

export {
  PublishButton,
}
