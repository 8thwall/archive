import React from 'react'

import {StandardModal} from '../standard-modal'
import {StandardModalHeader} from '../standard-modal-header'
import {BasicModalContent} from '../basic-modal-content'
import {StandardModalActions} from '../standard-modal-actions'
import {LinkButton} from '../../ui/components/link-button'
import DeveloperPreferenceSettingsView from
  '../../apps/settings/developer-preferences-settings-view'
import {useDismissibleModal} from '../dismissible-modal-context'

interface IDeveloperPreferenceSettingsModal {
  onClose: () => void
}

const DeveloperPreferenceSettingsModal: React.FC<IDeveloperPreferenceSettingsModal> = ({
  onClose,
}) => {
  useDismissibleModal(onClose)
  return (
    <StandardModal
      onClose={onClose}
    >
      <StandardModalHeader><h2>Editor Settings</h2></StandardModalHeader>
      <BasicModalContent>
        <DeveloperPreferenceSettingsView />
      </BasicModalContent>
      <StandardModalActions>
        <LinkButton
          onClick={onClose}
        >
          Close
        </LinkButton>
      </StandardModalActions>
    </StandardModal>
  )
}

export default DeveloperPreferenceSettingsModal
