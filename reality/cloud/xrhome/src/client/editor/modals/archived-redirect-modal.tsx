import React, {FunctionComponent, useState} from 'react'

import {Link} from 'react-router-dom'

import {Button, Form, Modal} from 'semantic-ui-react'

import {createUseStyles} from 'react-jss'

import createModal8Styles from '../../uiWidgets/styles/modal'
import useActions from '../../common/use-actions'
import appActions from '../../apps/apps-actions'

import {combine} from '../../common/styles'
import {DeemphasizedButton} from '../../widgets/deemphasized-button'

import {editorBlue, green} from '../../static/styles/settings'
import {useTheme} from '../../user/use-theme'

const useStyles = createUseStyles({
  pub: {
    color: green,
  },
  featured: {
    color: editorBlue,
  },
  spaceBelow: {
    marginBottom: '1em',
  },
  optionsList: {
    display: 'flex',
    flexDirection: 'column',
  },
  inline: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  urlInput: {
    'width': '80%',
    '& input': {
      height: '2em !important',
    },
  },
  radio: {
    marginTop: '0 !important',
    marginBottom: '0 !important',
    marginLeft: '0 !important',
    marginRight: '0.5em !important',
  },
})

interface ISetRedirectModal {
  appUuid: string
  featuredUrl: string
  featuredSettingsUrl: string
  isFeatured: boolean
  initialRedirectUrl: string  // The redirectUrl that was set when the modal was opened.
  onClose: Function
}

export const SetRedirectModal: FunctionComponent<ISetRedirectModal> = ({
  featuredUrl, initialRedirectUrl, onClose, isFeatured, appUuid, featuredSettingsUrl,
}) => {
  const {pub, featured, optionsList, inline, spaceBelow, urlInput, radio} = useStyles()
  const modal8 = createModal8Styles()
  const themeName = useTheme()

  const {updateApp, error} = useActions(appActions)

  const [isLoading, setIsLoading] = useState(false)
  const [redirectUrl, setRedirectUrl] = useState(initialRedirectUrl || '')
  const [useManualUrl, setUseManualUrl] = useState(redirectUrl.length > 0)

  const onConfirm = async () => {
    setIsLoading(true)
    // Setting a blank redirect clears it.
    const rawRedirect = redirectUrl.length > 0 ? redirectUrl : null
    const redirect = rawRedirect &&
      (rawRedirect.startsWith('https://') ? rawRedirect : `https://${rawRedirect}`)

    try {
      await updateApp({
        uuid: appUuid,
        campaignRedirectUrl: useManualUrl ? redirect : null,
      })
    } catch (err) {
      error(err)
    }
    setIsLoading(false)
    onClose()
  }

  return (
    <Modal open size='mini' className={combine(modal8.modal, 'form-modal', themeName)}>
      <Form onSubmit={onConfirm}>
        <h2>Set Redirect URL</h2>
        <p>
          <span className={pub}>Public</span> will redirect to this URL:
        </p>
        <div className={combine(optionsList, spaceBelow)}>
          <div className={combine(inline, spaceBelow)}>
            <Form.Radio
              className={radio}
              checked={useManualUrl}
              onChange={(_, {checked}) => setUseManualUrl(checked)}
            />
            <Form.Input
              className={urlInput}
              value={redirectUrl}
              placeholder='https://'
              onChange={(_, {value}) => {
                setRedirectUrl(value)
                if (!useManualUrl) {
                  setUseManualUrl(true)
                }
                if (value === '') {
                  setUseManualUrl(false)
                }
              }}
            />
          </div>
          <div className={inline}>
            <Form.Radio
              className={radio}
              checked={!useManualUrl && isFeatured}
              disabled={!isFeatured}
              onChange={(_, {checked}) => setUseManualUrl(!checked)}
            />
            <span className={featured}>Featured</span>
            &nbsp;
            {isFeatured
              ? (
                <Link to={featuredUrl} className='inline-link'>
                  8thwall.com{featuredUrl}
                </Link>
              )
              : (
                <>
                  project page&nbsp;
                  <Link className='inline-link' to={featuredSettingsUrl}>
                    not published
                  </Link>
                </>
              )}
          </div>
        </div>
        <Form.Field className='button-row right'>
          <DeemphasizedButton
            type='button'
            onClick={onClose}
            content='Cancel'
            disabled={isLoading}
          />
          <Button
            type='submit'
            size='small'
            primary
            content='Confirm'
            disabled={isLoading}
            loading={isLoading}
          />
        </Form.Field>
      </Form>
    </Modal>
  )
}
