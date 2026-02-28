import * as React from 'react'
import {Button, Form, Icon, Input} from 'semantic-ui-react'
import {Trans, useTranslation} from 'react-i18next'

import appsActions from '../apps-actions'
import type {IApp} from '../../common/types/models'
import useActions from '../../common/use-actions'

interface IWebOriginsView {
  app: IApp
}

const WebOriginsView: React.FC<IWebOriginsView> = ({app}) => {
  const [newOrigin, setNewOrigin] = React.useState('')
  const {updateApp} = useActions(appsActions)
  const {t} = useTranslation(['app-pages'])

  const handleSubmit = () => {
    const origin = `https://${newOrigin}`
    const webOrigins = !app.webOrigins
      ? [origin]
      : [...app.webOrigins, origin]
    updateApp({webOrigins, uuid: app.uuid})
    setNewOrigin('')
  }

  const handleRemove = (origin) => {
    updateApp({uuid: app.uuid, webOrigins: [...app.webOrigins.filter(o => o !== origin)]})
  }

  return (
    <div className='web-app-list-modal'>
      <p>
        {t('project_dashboard_page.web_origins_view.setup_self_host.description')}
      </p>
      <p>
        <Trans
          ns='app-pages'
          i18nKey='project_dashboard_page.web_origins_view.setup_self_host.note'
        >
          <strong>Note:</strong> Self-hosted domains are subdomain specific. For example,
          if you will be hosting at &ldquo;mydomain.com&rdquo; and &ldquo;www.mydomain.com&rdquo;,
          you must specify both.
        </Trans>
      </p>
      <Form onSubmit={() => newOrigin !== '' && handleSubmit()}>
        <Form.Group inline>
          <Form.Field inline width={16}>
            <label>https://</label>
            <Input
              fluid
              name='newOrigin'
              onChange={(e, target) => {
                setNewOrigin(target.value)
              }}
            >
              <input
                pattern='[a-zA-Z0-9][a-zA-Z0-9_\.\-]+'
                title='Origin must be a valid origin (e.g. www.example.com)'
                placeholder='www.example.com'
                value={newOrigin}
              />
            </Input>
            <Button right='attached' type='submit' icon><Icon name='add' /></Button>
          </Form.Field>
        </Form.Group>
      </Form>
      {app.webOrigins && app.webOrigins.length > 0 &&
        <div className='web-origins'>
          {app.webOrigins.map(o => (
            <div className='web-origin' key={o}>
              <strong>{o}</strong>
              <Button
                floated='left'
                size='mini'
                icon='close'
                onClick={() => handleRemove(o)}
              />
            </div>
          ))
          }
        </div>
      }
    </div>
  )
}

export {
  WebOriginsView,
}
