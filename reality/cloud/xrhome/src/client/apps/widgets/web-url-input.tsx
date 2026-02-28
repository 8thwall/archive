import React from 'react'
import {useState} from 'react'
import {Input, Form, Icon, Confirm} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import {is8thWallHosted} from '../../../shared/app-utils'
import {gray3, gray5} from '../../static/styles/settings'
import {parseConnectedDomainFull} from '../../../shared/domain-utils'
import {makeHostedProductionUrl} from '../../../shared/hosting-urls'
import type {IAccount, IApp} from '../../common/types/models'
import {PrimaryButton} from '../../ui/components/primary-button'

const useStyles = createUseStyles({
  radioList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5em',
  },
  radioItem: {
    display: 'flex',
    flexDirection: 'row',
    gap: '0.5em',
    alignItems: 'center',
  },
  radio: {
    border: `2px solid ${gray3}`,
    height: '16px',
    width: '16px',
    borderRadius: '50%',
    cursor: 'pointer',
  },
  radioFilled: {
    border: `5px solid ${gray5}`,
    height: '16px',
    width: '16px',
    borderRadius: '50%',
  },
})

// In case an user types in "http://"
const withHttps = (url: string) => url && (url.match(/^https?:\/\//)
  ? url.toString().replace(/^https?:\/\//, 'https://')
  : `https://${url}`)
const withoutHttps = (url: string) => (url &&
  url.toString().replace(/https?:\/\//, ''))

const getDomainFromUrl = (url) => {
  try {
    return new URL(withHttps(url)).hostname
  } catch (err) {
    return null
  }
}

interface IWebUrlInput {
  app: IApp
  webUrl: string
  canEdit: boolean
  account: IAccount
  updateApp: (update: {uuid: string, webUrl?: string, webOrigins?: string[]}) => Promise<void>
}

const WebUrlInput: React.FC<IWebUrlInput> = ({updateApp, app, webUrl, canEdit, account}) => {
  const {t} = useTranslation(['app-pages', 'common'])
  const [value, setValue] = useState(webUrl)
  const [editing, setEditing] = useState(false)
  const [addingOrigin, setAddingOrigin] = useState(false)
  const inputValue = value !== null ? value : withoutHttps(webUrl)
  const defaultWebUrl = makeHostedProductionUrl(account.shortName, app.appName)
  const connectedDomain = parseConnectedDomainFull(app?.connectedDomain)?.domainName || null
  const destinationList = [
    ...is8thWallHosted(app) ? [withoutHttps(defaultWebUrl)] : [],
    ...connectedDomain ? [connectedDomain] : []]
  const classes = useStyles()

  const httpsValue = withHttps(value)
  const canSave = httpsValue && httpsValue !== webUrl

  const submitVerb = canSave
    ? (t('button.save', {ns: 'common'}))
    : (t('button.cancel', {ns: 'common'}))

  const close = () => {
    setEditing(false)
    setAddingOrigin(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Clean up "https://" prefix if any so it won't show in the input next time
    setValue(withoutHttps(value))

    if (canSave) {
      updateApp({uuid: app.uuid, webUrl: httpsValue})
        .then(() => {
          const newDomain = getDomainFromUrl(value)
          const hasAllowedOrigins = account.webOrigin
          const alreadyContainsOrigin = app.webOrigins.includes(withHttps(newDomain))

          if (newDomain && hasAllowedOrigins && !alreadyContainsOrigin) {
            setEditing(true)
            setAddingOrigin(true)
          } else {
            close()
          }
        })
    } else {
      close()
    }
  }

  const updateDestination = (updatedLink: string) => {
    const newWebUrl = withHttps(updatedLink)

    if (newWebUrl !== webUrl) {
      updateApp({uuid: app.uuid, webUrl: newWebUrl})
    }
  }

  const handleAddOrigin = () => {
    const newWebOrigins = app.webOrigins.slice(0)
    newWebOrigins.push(withHttps(getDomainFromUrl(value)))
    updateApp({uuid: app.uuid, webOrigins: newWebOrigins})
    close()
  }

  return (
    <>
      {!editing && webUrl && destinationList.length < 2 &&
        <p className='web-url-input'>
          <a href={webUrl}>{withoutHttps(webUrl)}</a>
          {canEdit &&
            <Icon
              name='pencil'
              className='edit-icon'
              onClick={() => setEditing(true)}
            />
          }
        </p>
      }
      {!editing && webUrl && destinationList.length > 1 &&
        <div className={classes.radioList}>
          {destinationList.map(link => (
            <div
              role='button'
              className={classes.radioItem}
              key={link}
              onClick={() => updateDestination(link)}
              onKeyDown={() => updateDestination(link)}
              tabIndex={0}
            >
              <div
                className={withoutHttps(webUrl) === link ? classes.radioFilled : classes.radio}
              />
              <a href={`https://${link}`}>{link}</a>
            </div>
          ))}
        </div>
      }
      {(!webUrl || editing) &&
        <>
          <Form className='web-url-input' onSubmit={e => handleSubmit(e)}>
            <Form.Field>
              <Input
                className='web-url-input'
                label={{basic: true, content: 'https://'}}
                action={(<PrimaryButton>{submitVerb}</PrimaryButton>)}
                value={inputValue || ''}
                placeholder='example.com'
                onChange={e => setValue(e.target.value)}
              />
            </Form.Field>
          </Form>
          <Confirm
            open={addingOrigin}
            content={t('project_dashboard_page.qr_code_8.web_url_input.add_origin_prompt')}
            cancelButton={t('button.cancel', {ns: 'common'})}
            confirmButton={t('button.confirm', {ns: 'common'})}
            header={
              t('project_dashboard_page.qr_code_8.web_url_input.confirmation.heading',
                {domain: getDomainFromUrl(value)})
            }
            onCancel={close}
            onConfirm={handleAddOrigin}
          />
        </>
    }
    </>
  )
}

export default WebUrlInput
