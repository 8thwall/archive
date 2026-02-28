import React from 'react'
import {Trans, useTranslation} from 'react-i18next'

import {PrimaryButton} from '../../ui/components/primary-button'
import {createThemedStyles} from '../../ui/theme'
import {DeemphasizedButton} from '../../widgets/deemphasized-button'
import {StandardDropdownField} from '../../ui/components/standard-dropdown-field'
import {StandardTextAreaField} from '../../ui/components/standard-text-area-field'
import {StandardTextField} from '../../ui/components/standard-text-field'
import {SupportTicketType} from '../../../shared/help-center/help-center-types'
import {StandardLink} from '../../ui/components/standard-link'
import {useSelector} from '../../hooks'
import type {RootState} from '../../reducer'
import {TextNotification} from '../../ui/components/text-notification'
import {gray4} from '../../static/styles/settings'
import {UploadDrop} from '../../uiWidgets/upload-drop'
import {SUPPORT_FORM_ACCEPTED_FILE_TYPES} from './help-center-constants'
import useActions from '../../common/use-actions'
import helpCenterActions from './help-center-actions'
import {AttachmentCard} from './attachment-card'
import {Icon} from '../../ui/components/icon'

const MIN_TEXT_INPUT_LENGTH = 3

const useStyles = createThemedStyles(theme => ({
  modalHeader: {
    'padding': '2.5em 2em 1.5em',
    'backgroundColor': theme.modalBg,
    'textAlign': 'center',
    'position': 'relative',
  },
  modalBody: {
    padding: '1em 2em 0em 2em',
    backgroundColor: theme.modalBg,
    display: 'flex',
    flexDirection: 'column',
    gap: '1em',
  },
  modalFooter: {
    padding: '1em 2em 2em 1em',
    backgroundColor: theme.modalBg,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '2em',
  },
  instructions: {
    'lineHeight': '1.25em',
    '& a:hover': {
      textDecoration: 'underline',
    },
  },
  cancelButton: {
    color: `${theme.secondaryBtnColor} !important`,
  },
  dropdownOption: {
    padding: '0.5em 0',
  },
  slack: {
    'color': `${theme.fgPrimary}`,
    '&:hover': {
      color: `${theme.fgPrimary}`,
      textDecoration: 'underline',
    },
  },
  attachmentDropArea: {
    background: theme.sfcBackgroundDefault,
    color: gray4,
    borderRadius: '0.25em !important',
    padding: '1em',
    boxShadow: `0 0 0 1px ${theme.sfcBorderDefault} inset`,
  },
  uploadDrop: {
    'border': 'none !important',
    'padding': '0 !important',
    '&.hovering': {
      background: 'transparent !important',
    },
  },
  dropAreaContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '1em',
  },
  dropAreaInstructions: {
    lineHeight: '1.5em',
  },
  dropAreaIcon: {
    color: theme.modalIcon,
  },
  dropAreaCta: {
    color: theme.fgMain,
  },
  attachmentsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '1em',
    gap: '0.5em',
    justifyContent: 'center',
  },
  inputLabel: {
    'marginBottom': '0.5em',
    'color': theme.fgMain,
  },
}))

interface IRequestSupportView {
  handleModalClose: () => void
  onSubmit: (subject: string, body: string, ticketType: SupportTicketType) => void
  onAttachmentFileDrop: (file: File) => void
  onRemoveAttachmentClick?: (fileName: string) => void
  isBug?: boolean
  attachments?: File[]
}

interface IReportOption {
  value: SupportTicketType
  name: string
}

const reportOptions: IReportOption[] = [
  {
    value: SupportTicketType.ACCOUNT_BILLING_LICENSING_SUPPORT,
    name: 'in_app_help_center.support_form_view.option.account_billing_licensing_support',
  },
  {
    value: SupportTicketType.TECHNICAL_SUPPORT,
    name: 'in_app_help_center.support_form_view.option.tech_support',
  },
  {
    value: SupportTicketType.OTHER_SUPPORT,
    name: 'in_app_help_center.support_form_view.option.other',
  },
]

const SupportFormView: React.FC<IRequestSupportView> = ({
  handleModalClose, onSubmit, isBug, onAttachmentFileDrop, attachments = [],
  onRemoveAttachmentClick,
}) => {
  const classes = useStyles()
  const {t} = useTranslation(['app-pages', 'common'])
  const options = reportOptions.map(option => ({
    value: option.value,
    content: <div className={classes.dropdownOption}>{t(option.name)}</div>,
  }))
  const [formOption, setFormOption] = React.useState<SupportTicketType>(
    isBug ? SupportTicketType.REPORT_BUG : null
  )
  const [subject, setSubject] = React.useState<string>('')
  const [description, setDescription] = React.useState<string>('')
  const {clearErrors} = useActions(helpCenterActions)
  const submitError = useSelector((state: RootState) => state.helpCenter.error.sendSupportTicket)
  const attachmentError = useSelector((state: RootState) => state.helpCenter.error.uploadAttachment)
  const disabledSubmit = description?.length < MIN_TEXT_INPUT_LENGTH ||
    subject?.length < MIN_TEXT_INPUT_LENGTH || !formOption

  React.useEffect(() => {
    if (attachmentError || submitError) {
      clearErrors()
    }
  }, [subject, description, formOption])

  const handleFormOptionSelect = (value) => {
    setFormOption(value)
  }
  const handleSubmit = () => {
    onSubmit(subject, description, formOption)
  }

  const maxAttachmentsMsg = (
    t('in_app_help_center.support_form_view.attachments.description.attachment_limit')
  )

  const maxAttachFileSize = (
    t('in_app_help_center.support_form_view.attachments.description.attachment_size_limit')
  )

  return (
    <div>
      <div className={classes.modalHeader}>
        <h1>
          {isBug
            ? t('in_app_help_center.label.report_bug')
            : t('in_app_help_center.label.request_support')
          }
        </h1>
        <div className={classes.instructions}>
          {!isBug &&
            <Trans
              ns='app-pages'
              i18nKey='in_app_help_center.support_form_view.description.support'
              components={{
                1: <StandardLink href='https://www.8thwall.com/forum' newTab color='primary' />,
              }}
            />}
          {isBug && t('in_app_help_center.support_form_view.description.bug')}
        </div>
      </div>
      <div className={classes.modalBody}>
        {!isBug &&
          <StandardDropdownField
            id='select-form-option'
            label={null}
            value={formOption}
            options={options}
            onChange={handleFormOptionSelect}
            placeholder={t('in_app_help_center.support_form_view.placeholder.select_reason')}
          />
        }
        <div>
          <div className={classes.inputLabel}>
            {t('in_app_help_center.support_form_view.label.subject')}
          </div>
          <StandardTextField
            id='report-subject-input'
            label={null}
            value={subject}
            placeholder={t('in_app_help_center.support_form_view.placeholder.subject')}
            onChange={e => setSubject(e.target.value)}
          />
        </div>
        <div>
          <div className={classes.inputLabel}>
            {t('in_app_help_center.support_form_view.label.description')}
          </div>
          <StandardTextAreaField
            id='report-description-input'
            label={null}
            value={description}
            placeholder={isBug
              ? t('in_app_help_center.support_form_view.placeholder.bug_description')
              : t('in_app_help_center.support_form_view.placeholder.support_description')}
            onChange={e => setDescription(e.target.value)}
            rows={7}
          />
        </div>
        <div className={classes.attachmentDropArea}>
          <UploadDrop
            onDrop={onAttachmentFileDrop}
            elementClickInsteadOfButton
            className={classes.uploadDrop}
            noButton
            dropMessage={t('in_app_help_center.support_form_view.attachments.cta')}
            fileAccept={SUPPORT_FORM_ACCEPTED_FILE_TYPES.join(',')}
          >
            <div className={classes.dropAreaContainer}>
              <Icon
                stroke='image'
                size={2}
              />
              <div className={classes.dropAreaInstructions}>
                <div>{maxAttachmentsMsg}</div>
                <div>{maxAttachFileSize}</div>
              </div>
              <div className={classes.dropAreaCta}>
                {t('in_app_help_center.support_form_view.button.upload')}
              </div>
            </div>
          </UploadDrop>
          <div className={classes.attachmentsContainer}>
            {attachments.map(attachment => (
              <AttachmentCard
                key={attachment.name}
                attachment={attachment}
                onRemoveAttachmentClick={onRemoveAttachmentClick}
              />
            ))}
          </div>
          <div>
            {attachmentError &&
              <TextNotification type='danger'>
                {t('in_app_help_center.support_form_view.error.upload')}
              </TextNotification>}
          </div>
        </div>
        <div>
          {submitError &&
            <TextNotification type='danger'>
              {t('in_app_help_center.support_form_view.error.submit')}
            </TextNotification>
          }
        </div>
      </div>
      <div className={classes.modalFooter}>
        <DeemphasizedButton
          onClick={handleModalClose}
          className={classes.cancelButton}
        >
          {t('button.cancel', {ns: 'common'})}
        </DeemphasizedButton>
        <PrimaryButton
          onClick={handleSubmit}
          disabled={disabledSubmit}
        >
          {t('in_app_help_center.support_form_view.button.submit')}
        </PrimaryButton>
      </div>
    </div>
  )
}

export {SupportFormView}
