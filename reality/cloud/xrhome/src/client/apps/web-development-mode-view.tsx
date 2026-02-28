import * as React from 'react'
import {Dropdown, Grid, Header, Button, Label, Input} from 'semantic-ui-react'
import UAParser from 'ua-parser-js'
import {useTranslation} from 'react-i18next'

import {useSelector} from '../hooks'
import {getSelectedAccountField} from '../accounts'
import useActions from '../common/use-actions'
import tokenActions from '../tokens/token-actions'
import {BasicQrCode} from '../widgets/basic-qr-code'
import '../static/styles/web-dev-mode-view.scss'
import type {DevTokenInviteResponse, InstalledDevCookie, InviteStatus} from '../tokens/token-types'
import {useUserUuid} from '../user/use-current-user'
import {useAvailableXrwebVersions} from '../common/use-available-xrweb-versions'
import {Loader} from '../ui/components/loader'
import {Icon} from '../ui/components/icon'

const WebDevelopmentModeView: React.FC<{}> = () => {
  const {t} = useTranslation(['app-pages'])
  const [version, setVersion] = React.useState('js_release')
  const [engineUrl, setEngineUrl] = React.useState('')
  const [deviceWasAuthorized, setDeviceWasAuthorized] = React.useState(false)

  const {
    beginDevTokenInviteRefresh, endDevTokenInviteRefresh, updateDevInviteRequest,
  } = useActions(tokenActions)

  const devInviteRes = useSelector(s => s.tokens.devInviteRes) as DevTokenInviteResponse
  const installedDevCookie = useSelector(s => s.tokens.installedDevCookie) as InstalledDevCookie
  const devInviteStatus = useSelector(s => s.tokens.devInviteStatus) as InviteStatus
  const accountUuid = useSelector(s => getSelectedAccountField(s, 'uuid'))
  const shortName = useSelector(s => getSelectedAccountField(s, 'shortName'))
  const userUuid = useUserUuid()

  const versionOptions = useAvailableXrwebVersions().map(({name, build}) => ({
    key: name,
    value: name,
    // eslint-disable-next-line local-rules/hardcoded-copy
    text: `${name.replace('js_', '')} Version ${build}`,
  }))

  const {browserName, osName} = React.useMemo(() => {
    const parser = new UAParser()
    parser.setUA(window.navigator && window.navigator.userAgent)

    return {
      browserName: (parser.getBrowser().name || '').replace(/Mobile/, '').trim(),
      osName: (parser.getOS().name || '').replace(/ OS$/, ''),
    }
  }, [])

  React.useEffect(() => {
    updateDevInviteRequest({
      AccountUuid: accountUuid,
      uuid: userUuid,
      version: version || 'js_release',
      engineUrl,
      shortName,
    })
  }, [version, engineUrl])

  React.useEffect(() => {
    beginDevTokenInviteRefresh()

    return () => {
      endDevTokenInviteRefresh()
    }
  }, [])

  React.useEffect(() => {
    if (!devInviteRes.used) {
      setDeviceWasAuthorized(false)
      return undefined
    }

    setDeviceWasAuthorized(true)

    const timeout = setTimeout(() => setDeviceWasAuthorized(false), 2500)
    return () => {
      clearTimeout(timeout)
    }
  }, [devInviteRes.used])

  // Used with BuildIf.DEV_TOKEN_SIMULATOR_20240618
  const tokenIframeRef = React.useRef<HTMLIFrameElement>(null)
  const [customToken, setCustomToken] = React.useState<string | null>(null)
  const replaceUrlWithCustomToken = (url: string, token?: string) => {
    if (!token) {
      return url
    }
    return url.slice(0, url.length - token.length) + token
  }
  const openTokenIframe = (url) => {
    if (!tokenIframeRef.current) {
      return
    }
    tokenIframeRef.current.src = url
    tokenIframeRef.current.style.display = 'block'
  }

  const onVersionChange = (event, data) => {
    setVersion(data.value)
  }

  const onEngineLocationChange = (event, data) => {
    setEngineUrl(data.value)
  }

  const openTokenWindow = (url) => {
    const tokenWindow = window.open(url, 'tokenWindow', 'location=0,width=640,height=800')
    tokenWindow.focus()
  }

  const removeAuthorization = () => {
    openTokenWindow(devInviteRes.url.replace(/\/token\/.*/, '/token/remove'))
  }

  const currentTokenDiffers = (version === 'local' && engineUrl !== installedDevCookie.engineUrl) ||
                              (installedDevCookie.version && installedDevCookie.version !== version)

  return (
    <div className='web-dev-mode-view'>
      <div className='header-row'>
        <Header as='h2'>
          {t('project_dashboard_page.top_project_section.button.authorization')}
          <Header.Subheader>
            {t('project_dashboard_page.web_dev_mode_view.subheader.authorize_in_workspace')}
          </Header.Subheader>
          <Header.Subheader>
            {t('project_dashboard_page.web_dev_mode_view.subheader.monthly_usage')}
          </Header.Subheader>
        </Header>
        <div>
          {versionOptions &&
            <Dropdown
              selection
              options={versionOptions}
              defaultValue={installedDevCookie.version || versionOptions[0].value}
              onChange={onVersionChange}
            />
          }
          {version === 'local' &&
            <>
              <br />
              <br />
              <Input
                type='text'
                label={
                  t('project_dashboard_page.web_dev_mode_view.label.custom_engine_location')
                }
                value={engineUrl}
                onChange={onEngineLocationChange}
              />
            </>
          }
        </div>
      </div>
      <Grid columns={2} divided stackable>
        <Grid.Row>
          <Grid.Column>
            <Header as='h3'>
              {t('project_dashboard_page.web_dev_mode_view.header.this_browser')}
              <Header.Subheader>
                {t('project_dashboard_page.web_dev_mode_view.subheader.authorize_this_browser')}
              </Header.Subheader>
            </Header>
            <div>
              {browserName && osName &&
                t('project_dashboard_page.web_dev_mode_view.browser_on_operating_system',
                  {browserName, osName})
              }
              {installedDevCookie.version &&
                <Label
                  pointing='left'
                  content={t('project_dashboard_page.web_dev_mode_view.label.authorized')}
                  className='authorized'
                  icon='check'
                />}
              {!installedDevCookie.version &&
                <Label
                  pointing='left'
                  content={t('project_dashboard_page.web_dev_mode_view.label.not_authorized')}
                />
              }
            </div>
            <br />
            <p>
              {installedDevCookie.version &&
                <Button onClick={removeAuthorization} className='ui button'>
                  {t('project_dashboard_page.web_dev_mode_view.button.remove_authorization')}
                </Button>
              }
              {(!installedDevCookie.version || currentTokenDiffers) &&
                <Button
                  onClick={() => openTokenWindow(devInviteRes.url)}
                  className='ui primary button'
                  disabled={devInviteStatus !== 'VALID'}
                  content={currentTokenDiffers
                    ? t('project_dashboard_page.web_dev_mode_view.button.update_token')
                    : t('project_dashboard_page.web_dev_mode_view.button.authorize_this_browser')
                  }
                />
              }
            </p>
            {BuildIf.ALL_QA && (
              <div>
                <Header as='h3'>[QA Only] This browser simulator</Header>
                <Input
                  type='text'
                  size='mini'
                  value={customToken ?? devInviteRes.token}
                  onChange={e => setCustomToken(e.target.value)}
                />
                <Button
                  onClick={() => {
                    openTokenIframe(replaceUrlWithCustomToken(devInviteRes.url, customToken))
                  }}
                  size='mini'
                  attached='left'
                  className='ui button'
                  content='Authorize'
                />
                <Button
                  onClick={() => {
                    openTokenIframe(
                      `https://www.8thwall.com/public/token/${customToken || devInviteRes.token}`
                    )
                  }}
                  attached='right'
                  className='ui button'
                  primary
                  size='mini'
                  content='Authorize prod'
                />
                <br />
                <Button
                  onClick={() => openTokenIframe('https://apps.8thwall.com/token')}
                  attached='left'
                  className='ui button'
                  size='mini'
                  content='View com prod token'
                />
                <Button
                  onClick={() => openTokenIframe('https://www.dev.8thwall.app/token/dump')}
                  attached='right'
                  className='ui button'
                  size='mini'
                  content='View app prod token'
                />
              </div>
            )}
            {BuildIf.DEV_TOKEN_SIMULATOR_20240618 && (
              <>
                <p>{tokenIframeRef.current?.src}</p>
                <iframe
                  title={t('project_dashboard_page.web_dev_mode_view.button.update_token')}
                  ref={tokenIframeRef}
                  width='100%'
                  height='300px'
                  style={{display: 'none'}}
                />
              </>
            )}
          </Grid.Column>
          <Grid.Column>
            <Header as='h3'>
              {t('project_dashboard_page.web_dev_mode_view.header.mobile_browser')}
              <Header.Subheader>
                {t('project_dashboard_page.web_dev_mode_view.button.subheader.' +
                'authorize_mobile_browser')}
              </Header.Subheader>
            </Header>
            {deviceWasAuthorized
              ? (
                <div className='scan-success'>
                  <Icon stroke='checkmark' size={1.2} inline />{' '}
                  {t('project_dashboard_page.web_dev_mode_view.device_has_been_authorized')}
                </div>
              )
              : (
                <div className='qr-container'>
                  {devInviteRes.url
                    ? <BasicQrCode url={devInviteRes.url} />
                    : <Loader />
                  }
                </div>
              )
            }
            {BuildIf.DEV_TOKEN_SIMULATOR_20240618 &&
              <p style={{textAlign: 'center'}}>Token <Label>{devInviteRes.token}</Label></p>
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}

export default WebDevelopmentModeView
