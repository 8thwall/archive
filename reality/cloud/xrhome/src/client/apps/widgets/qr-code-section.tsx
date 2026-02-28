import * as React from 'react'
import {useState} from 'react'
import {Icon} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {useTranslation, Trans} from 'react-i18next'

import WebUrlInput from './web-url-input'
import LinkEmbedModal from './link-embed-modal'
import {bool, combine} from '../../common/styles'
import ButtonLink from '../../uiWidgets/button-link'
import {BasicQrCode} from '../../widgets/basic-qr-code'
import {QrCodeDownloadOptions} from './qr-code-download-options'
import {isStarter} from '../../../shared/account-utils'
import {deriveLegacyHostedUrl} from '../legacy-hosted-url'
import {gray4, tinyViewOverride} from '../../static/styles/settings'
import {MILLISECONDS_PER_SECOND} from '../../../shared/time-utils'
import {TooltipIcon} from '../../widgets/tooltip-icon'

const DELAY_IN_MILLISECONDS = 3 * MILLISECONDS_PER_SECOND

const useStyles = createUseStyles({
  qrCodeSection: {
    overflow: 'auto',
  },
  qrCodeContent: {
    display: 'flex',
    flexDirection: 'row',
    overflow: 'auto',
    [tinyViewOverride]: {
      flexDirection: 'column',
    },
  },
  qrCodeInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    float: 'left',
    width: 'fit-content',
  },
  qrCodeDisplay: {
    'flex': 1,
    'textAlign': 'center',
    'display': 'flex',
    [tinyViewOverride]: {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  copyLink: {
    'cursor': 'pointer',
  },
  copyMessage: {
    color: gray4,
  },
  shortLink: {
    marginRight: '0.3em',
  },
  linkBlock: {
    'marginBottom': '1em',
    '& p': {
      marginBottom: '0.5em',
    },
  },
  qrCode: {
    maxWidth: '150px',
    flex: '1',
    [tinyViewOverride]: {
      maxWidth: '200px',
      flex: 'none',
    },
  },
  qrCodeButtonGroup: {
    display: 'flex',
    width: '60%',
    textAlign: 'left',
    flexDirection: 'column',
    justifyContent: 'center',
    [tinyViewOverride]: {
      textAlign: 'center',
      width: '100%',
    },
  },
  qrCodeButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1em',
    [tinyViewOverride]: {
      justifyContent: 'center',
    },
  },
})

const QrCodeSection = ({app, account, updateApp, editApp}) => {
  const hasShortLink = !!app.shortLink && !!app.webUrl
  const shortLinkUrl = app.shortLink && `8th.io/${app.shortLink}`
  const legacyHostedUrl = deriveLegacyHostedUrl(app, account.shortName)
  const webUrl = app.webUrl || legacyHostedUrl
  const [copiedShortLink, setCopiedShortLink] = useState(false)
  const styles = useStyles()
  const {t} = useTranslation(['app-pages', 'common'])
  // The 'hostingType' check is a band-aid for Cloud Editor projects, preventing users from entering
  // an arbitrary URL (which doesn't actually change the project URL) and sending their shortlink
  // to a URL that doesn't exist. See https://github.com/8thwall/code8/issues/22385.
  const canEditWebUrl = !app.isCamera &&
    (app.hostingType === 'SELF' || !!app.connectedDomain) &&
    !isStarter(account)

  const shortlinkDestContent = t('project_dashboard_page.qr_code_8.subheader.trigger')

  React.useEffect(() => {
    let timer
    if (copiedShortLink) {
      timer = setTimeout(() => setCopiedShortLink(false), DELAY_IN_MILLISECONDS)
    }
    return () => {
      clearTimeout(timer)
    }
  }, [copiedShortLink])

  if (webUrl && !hasShortLink) {
    // This can happen to cameras or hosted apps. After publishing, cameras have a hostedUrl but
    // haven't gotten a shortLink.
    // So we generate shortLink on the fly. After the app updates with a webUrl, we will render
    // content.
    updateApp({uuid: app.uuid, webUrl})
    return null
  }

  const copyShortLink = () => setCopiedShortLink(true)

  return (
    <div className={styles.qrCodeSection}>
      <p className='cam-section'>{t('project_dashboard_page.qr_code_8.header')}</p>
      <div className={styles.qrCodeContent}>
        <div className={combine(styles.qrCodeInfo, bool(!hasShortLink, 'full-width'))}>

          {webUrl && <p>{t('project_dashboard_page.qr_code_8.blurb.your_convenience')}</p>}

          {!legacyHostedUrl && app.isCamera &&
            <p>
              <Trans
                ns='app-pages'
                i18nKey='project_dashboard_page.qr_code_8.blurb.publish_app_to_generate'
              >
                <ButtonLink onClick={editApp}>
                  Publish the camera
                </ButtonLink> to generate an QR 8.Code
              </Trans>
            </p>
        }

          {!webUrl &&
          canEditWebUrl &&
            <p>{t('project_dashboard_page.qr_code_8.blurb.connect_url_to_generate')}</p>}

          {hasShortLink &&
            <div className={styles.linkBlock}>
              <p>
                {t('project_dashboard_page.qr_code_8.subheader.shortlink')}
              </p>
              <a
                className={styles.shortLink}
                href={`https://${shortLinkUrl}`}
              >{shortLinkUrl}
              </a>
              <CopyToClipboard text={shortLinkUrl} onCopy={copyShortLink}>
                <Icon
                  className={styles.copyLink}
                  name='copy outline'
                  title='copy'
                />
              </CopyToClipboard>
              {copiedShortLink &&
                <span className={styles.copyMessage}>{t('button.copied', {ns: 'common'})}</span>}
            </div>
        }

          {(webUrl || canEditWebUrl) &&
            <div>
              <p>
                {t('project_dashboard_page.qr_code_8.subheader.shortlink_destination')}
                <TooltipIcon
                  content={shortlinkDestContent}
                  position={webUrl ? 'top left' : 'right center'}
                />
              </p>
              <WebUrlInput
                updateApp={updateApp}
                app={app}
                webUrl={webUrl}
                canEdit={canEditWebUrl}
                account={account}
              />
            </div>
        }
        </div>
        {hasShortLink &&
          <div className={styles.qrCodeDisplay}>
            <BasicQrCode className={styles.qrCode} url={shortLinkUrl} />
            <div className={styles.qrCodeButtonGroup}>
              <p>{t('project_dashboard_page.qr_code_8.blurb.scan_smartphone_to_visit')}</p>
              <div className={styles.qrCodeButtons}>
                <LinkEmbedModal app={app} />
                <QrCodeDownloadOptions content={shortLinkUrl} />
              </div>
            </div>
          </div>
      }
      </div>
    </div>
  )
}

export {
  QrCodeSection,
}
