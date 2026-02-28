import * as React from 'react'
import {useTranslation} from 'react-i18next'

import {useCurrentGit} from '../../git/hooks/use-current-git'
import {IPublishingPrimaryButton, PublishingPrimaryButton} from './publish-primary-button'

interface IUnpublishButton extends IPublishingPrimaryButton {
  deploymentTarget: 'staging' | 'production'
  loading?: boolean
}

const UnpublishButton: React.FunctionComponent<IUnpublishButton> = ({
  loading = false, deploymentTarget, onClick, disabled, ...rest
}) => {
  const {deployment} = useCurrentGit()
  const {t} = useTranslation(['cloud-editor-pages'])
  const hasDeploymentTarget = !!(deployment && deployment[deploymentTarget])

  if (!hasDeploymentTarget) {
    return null
  }

  return (
    <PublishingPrimaryButton
      {...rest}
      spacing='full'
      height='tiny'
      disabled={!hasDeploymentTarget || loading || disabled}
      loading={loading}
      onClick={onClick}
    >
      {t(`editor_page.publish_modal.buttons.unpublish.${deploymentTarget}`)}
    </PublishingPrimaryButton>
  )
}

export {UnpublishButton}
