import React from 'react'
import {Button, Form, Header, Input, Modal} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

const splitUrl = (str: string) => {
  if (!str) {
    return {}
  }

  let n = str.indexOf('://')
  let end = 3
  if (n < 0) {
    n = 0
    end = 0
  }
  return {proto: str.slice(0, n + end), rest: str.substring(n + end)}
}

interface ICampaignRedirectModal {
  app: any
  createTrigger: (handleOpen: () => void) => React.ReactNode
  updateApp: (data: {campaignRedirectUrl: string, uuid: string}) => void
}

const CampaignRedirectModal: React.FC<ICampaignRedirectModal> = ({
  app, createTrigger, updateApp,
}) => {
  const {t} = useTranslation(['app-pages'])
  const [newRedirectUrl, setNewRedirectUrl] = React.useState('')
  const [modalOpen, setModalOpen] = React.useState(false)

  const handleSubmit = () => {
    const {proto, rest} = splitUrl(newRedirectUrl)
    let newUrl = null
    if (rest) {
      newUrl = `${proto || 'https://'}${rest}`
    }
    updateApp({campaignRedirectUrl: newUrl, uuid: app.uuid})
    setModalOpen(false)
  }

  const handleOpen = () => {
    setModalOpen(true)
    setNewRedirectUrl(splitUrl(app.campaignRedirectUrl).rest)
  }

  const handleClose = () => {
    setModalOpen(false)
    setNewRedirectUrl(splitUrl(app.campaignRedirectUrl).rest)
  }

  return (
    <Modal
      open={modalOpen}
      onClose={handleClose}
      closeOnDimmerClick
      trigger={createTrigger(handleOpen)}
      closeIcon
      size='tiny'
    >
      <div className='web-app-list-modal'>
        <Header as='h2'>
          {t('project_dashboard_page.redirect_url.modal.header')}
        </Header>
        <Form onSubmit={handleSubmit}>
          <Form.Group inline>
            <Form.Field inline width={16}>
              <label htmlFor='newRedirectUrl'>
                {splitUrl(app.campaignRedirectUrl).proto || 'https://'}
              </label>
              <Input
                fluid
                name='newRedirectUrl'
                onChange={(_, target) => setNewRedirectUrl(target.value)}
                className='add-right-padding'
              >
                <input
                  pattern={'[a-zA-Z0-9][a-zA-Z0-9_\\.\\/\\?\\&\\=\\-\\:]+'}
                  title={t('project_dashboard_page.redurect_url.input.title')}
                  placeholder='8thwall.com'
                  value={newRedirectUrl || ''}
                />
              </Input>
              <Button right='attached' type='submit' icon='check' />
            </Form.Field>
          </Form.Group>
        </Form>
        <p>
          {t('project_dashboard_page.redirect_url.modal.description')}
        </p>
      </div>
    </Modal>
  )
}

export {
  CampaignRedirectModal,
}
