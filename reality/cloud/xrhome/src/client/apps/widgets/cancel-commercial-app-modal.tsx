import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {Form, Header, Input, Modal} from 'semantic-ui-react'

import type {IApp} from '../../common/types/models'
import AppCommercialStatusLabel from './app-commercial-status-label'
import {PrimaryButton} from '../../ui/components/primary-button'
import {TertiaryButton} from '../../ui/components/tertiary-button'

interface ICancelCommercialAppModal {
  app: IApp
  cancelAppLicense: Function
  createTrigger: Function
}

const CancelCommercialAppModal: React.FC<ICancelCommercialAppModal> = ({
  app, cancelAppLicense, createTrigger,
}) => {
  const {t} = useTranslation(['account-pages', 'common'])
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteField, setDeleteField] = useState('')
  const confirmationText = t('plan_billing_page.cancel_commercial_app_modal.confirmation_text')

  const confirmed = () => deleteField === confirmationText

  const handleOk = (e) => {
    if (e) {
      e.preventDefault()
    }
    if (confirmed()) {
      setModalOpen(false)
      cancelAppLicense(app.appName, app.uuid)
    }
  }

  const handleClose = () => {
    setDeleteField('')
    setModalOpen(false)
  }

  const handleOpen = () => {
    setModalOpen(true)
  }

  const handleChange = (e) => {
    setDeleteField(e.target.value)
  }

  return (
    <Modal
      open={modalOpen}
      onClose={handleClose}
      className='cancel-commercial-app-modal'
      trigger={createTrigger(handleOpen)}
    >
      <Header as='h2' textAlign='center'>
        {t('plan_billing_page.cancel_commercial_app_modal.header')}
      </Header>
      <Header as='h3' textAlign='center'>
        {app.appName}
        <AppCommercialStatusLabel app={app} />
      </Header>
      <p>
        {t('plan_billing_page.cancel_commercial_app_modal.summary')}
      </p>
      <p>
        {t('plan_billing_page.cancel_commercial_app_modal.confirmation_prompt', {confirmationText})}
      </p>
      <Form onSubmit={handleOk} autoComplete='off'>
        <Form.Field>
          <Input name='deleteField' onChange={handleChange} />
        </Form.Field>
        <div className='cancel-commercial-app-buttons'>
          <TertiaryButton onClick={handleClose} type='button'>
            {t('button.cancel', {ns: 'common'})}
          </TertiaryButton>
          <PrimaryButton onClick={handleOk} disabled={!confirmed()} type='submit'>
            {t('button.confirm', {ns: 'common'})}
          </PrimaryButton>
        </div>
      </Form>
    </Modal>
  )
}

export {
  CancelCommercialAppModal,
}
