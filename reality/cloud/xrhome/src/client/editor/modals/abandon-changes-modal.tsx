import * as React from 'react'

import {useTranslation} from 'react-i18next'

import {StandardModal} from '../standard-modal'
import {StandardModalActions} from '../standard-modal-actions'
import {StandardModalHeader} from '../standard-modal-header'
import {BasicModalContent} from '../basic-modal-content'
import {useOpenGits} from '../../git/hooks/use-open-gits'
import {LinkButton} from '../../ui/components/link-button'
import {PrimaryButton} from '../../ui/components/primary-button'
import {TertiaryButton} from '../../ui/components/tertiary-button'
import {useDismissibleModal} from '../dismissible-modal-context'
import {Icon} from '../../ui/components/icon'

interface IAbandonChangesModal {
  confirmSwitch: () => void
  confirmSwitchAll?: () => void
  rejectSwitch: () => void
  file?: string
  loadingAbandon?: boolean
  disabled?: boolean
  description?: string
}

const AbandonChangesModal: React.FC<IAbandonChangesModal> = ({
  confirmSwitch, confirmSwitchAll = null, rejectSwitch,
  file = undefined, loadingAbandon = false, disabled = null,
  description = undefined,
}) => {
  const {t} = useTranslation(['cloud-editor-pages', 'common'])
  useDismissibleModal(rejectSwitch)
  const openRepoIds = useOpenGits(g => g.repo.repoId)
  const superAbandon = openRepoIds.length > 1
  const shouldShowAbandonAll = confirmSwitchAll && (loadingAbandon || superAbandon)

  return (
    <StandardModal
      onClose={!loadingAbandon && rejectSwitch}
    >
      <StandardModalHeader>
        <Icon stroke='warning' size={2} />
        <h2>{t('editor_page.abandon_modal.header')}</h2>
      </StandardModalHeader>
      <BasicModalContent>
        {file
          ? (
            <p>
              {description || t('editor_page.abandon_modal.abandon_file_description', {file})}
            </p>
          )
          : (
            <p>
              {description || t('editor_page.abandon_modal.abandon_all_files_description')}
            </p>
          )}
      </BasicModalContent>
      <StandardModalActions>
        <LinkButton
          onClick={rejectSwitch}
          disabled={loadingAbandon}
        >
          {t('button.cancel', {ns: 'common'})}
        </LinkButton>
        {shouldShowAbandonAll &&
          <>
            <TertiaryButton
              onClick={confirmSwitch}
              disabled={disabled}
            >
              {t('editor_page.abandon_modal.button.abandon_project')}
            </TertiaryButton>
            <PrimaryButton
              autoFocus
              onClick={confirmSwitchAll}
              disabled={disabled}
              loading={loadingAbandon}
            >
              {t('editor_page.abandon_modal.button.abandon_all')}
            </PrimaryButton>
          </>
          }
        {!shouldShowAbandonAll &&
          <PrimaryButton
            autoFocus
            onClick={confirmSwitch}
            disabled={disabled}
            loading={loadingAbandon}
          >
            {t('editor_page.abandon_modal.button.abandon')}
          </PrimaryButton>
          }
      </StandardModalActions>
    </StandardModal>
  )
}
export default AbandonChangesModal
