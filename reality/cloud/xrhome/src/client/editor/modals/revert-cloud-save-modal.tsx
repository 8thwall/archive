import * as React from 'react'

import {useTranslation} from 'react-i18next'

import {useCurrentGit} from '../../git/hooks/use-current-git'
import {StandardModal} from '../standard-modal'
import {StandardModalActions} from '../standard-modal-actions'
import {StandardModalHeader} from '../standard-modal-header'
import {BasicModalContent} from '../basic-modal-content'
import {useOpenGits} from '../../git/hooks/use-open-gits'
import {LinkButton} from '../../ui/components/link-button'
import {TertiaryButton} from '../../ui/components/tertiary-button'
import {PrimaryButton} from '../../ui/components/primary-button'
import {useDismissibleModal} from '../dismissible-modal-context'
import {Icon} from '../../ui/components/icon'

interface IRevertCloudSaveModal {
  confirmSwitch: () => void
  confirmSwitchAll?: () => void
  rejectSwitch: () => void
  loadingRevert?: boolean
  disabled?: boolean
}

const RevertCloudSaveModal: React.FC<IRevertCloudSaveModal> = ({
  confirmSwitch, confirmSwitchAll = null, rejectSwitch,
  disabled = null, loadingRevert = false,
}) => {
  const {t} = useTranslation(['cloud-editor-pages', 'common'])
  useDismissibleModal(rejectSwitch)
  const lastSaveTime =
    useCurrentGit(git => git.clients.find(c => c.active)?.lastSaveTime?.toString()) || ''

  const openRepoIds = useOpenGits(g => g.repo.repoId)
  const superRevert = openRepoIds.length > 1

  const shouldShowRevertAll = confirmSwitchAll && (loadingRevert || superRevert)

  return (
    <StandardModal
      onClose={!loadingRevert && rejectSwitch}
    >
      <StandardModalHeader>
        <Icon stroke='warning' size={2} />
        <h2>{t('editor_page.revert_modal.header')}</h2>
      </StandardModalHeader>
      <BasicModalContent>
        <p>
          {t('editor_page.revert_modal.description')}
        </p>
        <p><i>{lastSaveTime}</i></p>
      </BasicModalContent>
      <StandardModalActions>
        <LinkButton
          onClick={rejectSwitch}
          disabled={loadingRevert}
        >
          {t('button.cancel', {ns: 'common'})}
        </LinkButton>
        {shouldShowRevertAll &&
          <>
            <TertiaryButton
              onClick={confirmSwitch}
              disabled={disabled}
            >
              {t('editor_page.revert_modal.button.revert_project')}
            </TertiaryButton>
            <PrimaryButton
              autoFocus
              onClick={confirmSwitchAll}
              disabled={disabled}
              loading={loadingRevert}
            >
              {t('editor_page.revert_modal.button.revert_all')}
            </PrimaryButton>
          </>
        }
        {!shouldShowRevertAll &&
          <PrimaryButton
            autoFocus
            onClick={confirmSwitch}
            disabled={disabled}
            loading={loadingRevert}
          >
            {t('editor_page.revert_modal.button.revert')}
          </PrimaryButton>
        }
      </StandardModalActions>
    </StandardModal>
  )
}

export default RevertCloudSaveModal
