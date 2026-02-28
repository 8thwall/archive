import React from 'react'
import {Modal, Dimmer} from 'semantic-ui-react'

import {createThemedStyles} from '../../ui/theme'
import {SupportFormView} from './support-form-view'
import {CompleteSupportView} from './complete-support-view'
import {useTheme} from '../../user/use-theme'
import useActions from '../../common/use-actions'
import actions from './help-center-actions'
import type {IAccount} from '../../common/types/models'
import type {SupportTicketType} from '../../../shared/help-center/help-center-types'
import {MAX_SUPPORT_FORM_ATTACHMENTS_ALLOWED} from './help-center-constants'
import {Loader} from '../../ui/components/loader'

const useStyles = createThemedStyles(theme => ({
  modal: {
    overflow: 'hidden',
    color: theme.modalFg,
    background: `${theme.modalContentBg} !important`,
    borderRadius: '6px !important',
  },
}))

interface IRequestSupportModal {
  account: IAccount
  modalOpen: boolean
  closeModal: () => void
  isBug: boolean
}

const RequestSupportOrBugModal: React.FC<IRequestSupportModal> = ({
  account, modalOpen, closeModal, isBug,
}) => {
  const [isLoading, setLoading] = React.useState<boolean>(false)
  const [email, setEmail] = React.useState<string>(null)
  const [attachments, setAttachments] = React.useState<File[]>([])
  const classes = useStyles()
  const themeName = useTheme() || 'light'

  const {
    sendSupportTicket, clearSupportTicket, uploadAttachments, clearErrors,
  } = useActions(actions)

  const handleSubmitForm = async (subject: string, body: string, ticketType: SupportTicketType) => {
    setLoading(true)
    try {
      const attachmentIds = await uploadAttachments(attachments)

      const response = await sendSupportTicket(
        account.uuid, subject, body, ticketType, [...attachmentIds]
      )

      if (response) {
        setEmail(response.result.email)
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleModalClose = () => {
    setAttachments([])
    clearSupportTicket()
    clearErrors()
    closeModal()
    setEmail(null)
  }

  const onMediaAddDrop = (file: File) => {
    clearErrors()
    if (attachments.length >= MAX_SUPPORT_FORM_ATTACHMENTS_ALLOWED) {
      return
    }
    setAttachments([...attachments, file])
  }

  const onRemoveAttachmentClick = (fileName: string) => {
    clearErrors()
    setAttachments(attachments.filter((attachment: File) => !(fileName === attachment.name)))
  }

  return (
    <Modal
      open={modalOpen}
      onClose={handleModalClose}
      closeOnDimmerClick={!isLoading}
      size='tiny'
      className={classes.modal}
    >
      {!email &&
        <SupportFormView
          handleModalClose={handleModalClose}
          onSubmit={handleSubmitForm}
          isBug={isBug}
          onAttachmentFileDrop={onMediaAddDrop}
          attachments={attachments}
          onRemoveAttachmentClick={onRemoveAttachmentClick}
        />
      }
      {email &&
        <CompleteSupportView
          handleModalClose={handleModalClose}
          email={email}
        />
      }
      <Dimmer active={isLoading} inverted={themeName === 'light'}>
        <Loader />
      </Dimmer>
    </Modal>
  )
}

export {RequestSupportOrBugModal}
