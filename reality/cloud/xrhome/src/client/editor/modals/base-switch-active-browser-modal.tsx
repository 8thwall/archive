import React from 'react'
import {useTranslation} from 'react-i18next'

import {StandardModal} from '../standard-modal'
import {StandardModalHeader} from '../standard-modal-header'
import {StandardModalActions} from '../standard-modal-actions'
import {BasicModalContent} from '../basic-modal-content'

import {LinkButton} from '../../ui/components/link-button'
import {TertiaryButton} from '../../ui/components/tertiary-button'
import {Icon} from '../../ui/components/icon'

interface IBaseSwitchActiveBrowserModal {
  activating: boolean
  onAccept: () => void
  onReject: () => void
}

const BaseSwitchActiveBrowserModal: React.FC<IBaseSwitchActiveBrowserModal> = ({
  onAccept, onReject, activating,
}) => {
  const {t} = useTranslation(['cloud-editor-pages', 'common'])

  return (
    <StandardModal onClose={onReject}>
      <StandardModalHeader>
        <Icon stroke='warning' size={2} />
        <h2>{t('switch_active_browser_modal.heading')}</h2>
      </StandardModalHeader>
      <BasicModalContent>
        <p>{t('switch_active_browser_modal.content')}</p>
      </BasicModalContent>
      <StandardModalActions>
        <LinkButton onClick={onReject}>{t('button.cancel', {ns: 'common'})}</LinkButton>
        <TertiaryButton loading={activating} autoFocus onClick={onAccept}>
          {t('switch_active_browser_modal.cta')}
        </TertiaryButton>
      </StandardModalActions>
    </StandardModal>

  )
}

export {
  BaseSwitchActiveBrowserModal,
}
