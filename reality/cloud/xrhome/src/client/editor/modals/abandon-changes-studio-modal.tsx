import * as React from 'react'

import {useTranslation} from 'react-i18next'

import {createUseStyles} from 'react-jss'

import {StandardModal} from '../standard-modal'
import {StandardModalActions} from '../standard-modal-actions'
import {StandardModalHeader} from '../standard-modal-header'
import {BasicModalContent} from '../basic-modal-content'
import {useOpenGits} from '../../git/hooks/use-open-gits'
import {LinkButton} from '../../ui/components/link-button'
import {PrimaryButton} from '../../ui/components/primary-button'
import {useDismissibleModal} from '../dismissible-modal-context'
import {Icon} from '../../ui/components/icon'
import {StandardRadioButton} from '../../ui/components/standard-radio-group'
import {useChangesetStatus} from '../../git/hooks/use-changeset-status'
import {EXPANSE_FILE_PATH} from '../../studio/common/studio-files'
import {combine} from '../../common/styles'

const useStyles = createUseStyles({
  confirmationText: {
    textAlign: 'center',
    minHeight: '3rem',
  },
})

interface IAbandonChangesStudioModal {
  onAbandon: () => void
  onAbandonScene: () => void
  onAbandonAll: () => void
  onClose: () => void
  loadingAbandon?: boolean
  disabled?: boolean
}

const AbandonChangesStudioModal: React.FC<IAbandonChangesStudioModal> = ({
  onAbandon, onAbandonScene, onAbandonAll, onClose,
  loadingAbandon, disabled,
}) => {
  const {t} = useTranslation(['cloud-studio-pages', 'common'])
  useDismissibleModal(onClose)
  const openRepoIds = useOpenGits(g => g.repo.repoId)
  const allowAbandonScene = useChangesetStatus(EXPANSE_FILE_PATH).status > 0
  const superAbandon = openRepoIds.length > 1
  const classes = useStyles()

  const [abandonChoice, setAbandonChoice] = React.useState<'scene' | 'project' | 'all' | '' >('')

  const getConfirmationText = () => {
    switch (abandonChoice) {
      case 'scene':
        return t('abandon_modal.confirmation.abandon_scene')
      case 'project':
        return t('abandon_modal.confirmation.abandon_project')
      case 'all':
        return t('abandon_modal.confirmation.abandon_all')
      default:
        return ''
    }
  }

  const confirmationText = getConfirmationText()

  const handleConfirmAbandon = () => {
    if (abandonChoice === 'scene') {
      onAbandonScene()
    } else if (abandonChoice === 'project') {
      onAbandon()
    } else if (abandonChoice === 'all') {
      onAbandonAll()
    }
  }

  return (
    <StandardModal
      onClose={!loadingAbandon && onClose}
    >
      <StandardModalHeader>
        <Icon stroke='warning' size={2} />
        <h2>{t('abandon_modal.header')}</h2>
      </StandardModalHeader>
      <BasicModalContent>
        <p>
          {t('abandon_modal.description')}
        </p>
        <StandardRadioButton
          id='abandon-scene-radio'
          label={t('abandon_modal.radio.scene_changes')}
          checked={abandonChoice === 'scene'}
          onChange={() => setAbandonChoice('scene')}
          disabled={!allowAbandonScene}
        />
        <StandardRadioButton
          id='abandon-project-radio'
          label={t('abandon_modal.radio.project_changes')}
          checked={abandonChoice === 'project'}
          onChange={() => setAbandonChoice('project')}
        />
        <StandardRadioButton
          id='abandon-all-radio'
          label={t('abandon_modal.radio.all_changes')}
          checked={abandonChoice === 'all'}
          onChange={() => setAbandonChoice('all')}
          disabled={!superAbandon}
        />
        <p className={
          combine(classes.confirmationText, !confirmationText && classes.confirmationText)}
        >
          {confirmationText}
        </p>
      </BasicModalContent>
      <StandardModalActions>
        <LinkButton
          onClick={onClose}
          disabled={loadingAbandon}
        >
          {t('button.cancel', {ns: 'common'})}
        </LinkButton>
        <PrimaryButton
          autoFocus
          onClick={handleConfirmAbandon}
          disabled={disabled || !abandonChoice}
          loading={loadingAbandon}
        >
          {t('abandon_modal.button.abandon')}
        </PrimaryButton>
      </StandardModalActions>
    </StandardModal>
  )
}
export {
  AbandonChangesStudioModal,
}
