import React from 'react'

import type {DeepReadonly} from 'ts-essentials'

import type {IDeployableModule} from '../../common/types/models'
import {TertiaryButton} from '../../ui/components/tertiary-button'
import {getVersionSpecifier} from '../../../shared/module/module-version-patches'
import {useAbandonableFunction} from '../../hooks/use-abandonable-function'
import {StandardCheckboxField} from '../../ui/components/standard-checkbox-field'
import {StandardModalContent} from '../../editor/standard-modal-content'
import {StandardModalActions} from '../../editor/standard-modal-actions'
import {StandardModalHeader} from '../../editor/standard-modal-header'
import {StandardModal} from '../../editor/standard-modal'
import type {VersionInfo} from '../../../shared/module/module-target-api'
import {LinkButton} from '../../ui/components/link-button'
import {useModuleVersionModalStyles} from './module-version-modal-styles'
import type {ModuleVersionTarget} from '../../../shared/module/module-target'
import {ModuleCommitDropdown} from './module-commit-dropdown'
import {VersionDescriptionField} from './version-description-field'
import {SpaceBetween} from '../../ui/layout/space-between'
import {DangerButton} from '../../ui/components/danger-button'
import useActions from '../../common/use-actions'
import moduleVersionActions from '../module-version-actions'
import {BasicModalContent} from '../../editor/basic-modal-content'
import {Icon} from '../../ui/components/icon'

interface IModuleVersionModal {
  module: IDeployableModule
  onClose: () => void
  activePreRelease: VersionInfo
  onDeploy: (version: ModuleVersionTarget, description: string, commit: string) => Promise<void>
}

const EditPreReleaseModal: React.FC<DeepReadonly<IModuleVersionModal>> = ({
  onClose, module, activePreRelease, onDeploy,
}) => {
  const classes = useModuleVersionModalStyles()

  const [willPromote, setWillPromote] = React.useState(false)
  const [commit, setCommit] = React.useState(activePreRelease.commitId)
  const [publishing, setPublishing] = React.useState(false)
  const [versionDescription, setVersionDescription] = React.useState(
    activePreRelease.versionDescription
  )
  const [isConfirmingAbandon, setIsConfirmingAbandon] = React.useState(false)

  const hasChange = (
    willPromote ||
    commit !== activePreRelease.commitId ||
    versionDescription !== activePreRelease.versionDescription
  )

  const canPublish = hasChange && !!commit && !!versionDescription

  const onDeployAbandonable = useAbandonableFunction(onDeploy)

  const {patchModuleVersion} = useActions(moduleVersionActions)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newVersion = {...activePreRelease.patchTarget}

    if (willPromote) {
      delete newVersion.pre
    }

    setPublishing(true)

    try {
      await onDeployAbandonable(newVersion, versionDescription, commit)
    } finally {
      setPublishing(false)
      onClose()
    }
  }

  const handleAbandon = async () => {
    patchModuleVersion(
      module.uuid, activePreRelease.patchTarget, {deprecated: true}
    )
  }

  if (isConfirmingAbandon) {
    return (
      <StandardModal size='tiny' onClose={onClose}>
        <StandardModalHeader>
          <Icon stroke='warning' size={2} />
          <h2>Abandon Pre-Release?</h2>
        </StandardModalHeader>
        <BasicModalContent>
          <p>
            Abandoning a pre-release will remove it from the available module versions list and
            prohibit future users from using it. Users who are currently using this pre-release
            version will be unable to use it in future projects and will be prompted to move off
            this version.
          </p>
        </BasicModalContent>
        <StandardModalActions>
          <LinkButton onClick={() => setIsConfirmingAbandon(false)}>Cancel</LinkButton>
          <DangerButton onClick={handleAbandon}>Abandon</DangerButton>
        </StandardModalActions>
      </StandardModal>
    )
  }

  return (
    <StandardModal onClose={onClose}>
      <StandardModalHeader>
        <h2>Edit Pre-Release {getVersionSpecifier(activePreRelease.patchTarget)}</h2>
      </StandardModalHeader>
      <form onSubmit={handleSubmit}>
        <StandardModalContent>
          <ModuleCommitDropdown
            module={module}
            value={commit}
            onChange={setCommit}
          />
          <div className={classes.columnFlex}>
            <VersionDescriptionField
              value={versionDescription}
              onChange={setVersionDescription}
            />
            <span className={classes.note}>
              These notes cannot be edited after promotion.
            </span>
          </div>
          <div className={classes.columnFlex}>
            <StandardCheckboxField
              id='set-as-release-input'
              label='Promote to Release'
              checked={willPromote}
              onChange={e => setWillPromote(e.target.checked)}
            />
            <span className={classes.note}>
              Promoting this version will make it an official release.
              All subscribed projects will automatically be updated.
            </span>
          </div>
        </StandardModalContent>
        <StandardModalActions align='split'>
          <DangerButton onClick={() => setIsConfirmingAbandon(true)}>
            Abandon Pre-Release
          </DangerButton>
          <SpaceBetween>
            <LinkButton onClick={onClose}>Cancel</LinkButton>
            <TertiaryButton type='submit' disabled={!canPublish || publishing}>
              {willPromote ? 'Promote' : 'Deploy'}
            </TertiaryButton>
          </SpaceBetween>
        </StandardModalActions>
      </form>
    </StandardModal>
  )
}

export {
  EditPreReleaseModal,
}
