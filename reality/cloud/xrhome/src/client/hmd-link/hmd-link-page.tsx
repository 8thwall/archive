import React, {useState} from 'react'
import {createUseStyles} from 'react-jss'
import {Trans, useTranslation} from 'react-i18next'

import Page from '../widgets/page'
import {
  almostBlack, brandBlack, brandWhite, gray1, headerSanSerif, mobileViewOverride, tinyViewOverride,
} from '../static/styles/settings'
import NavLogo from '../widgets/nav-logo'
import sonar from '../static/sonar.svg'
import wifi from '../static/icons/wifi.svg'
import {useWebsocketHandler} from '../hooks/use-websocket-handler'
import {getChannelSpecifier} from './get-channel-socket-specifier'
import actions from './hmd-link-actions'
import useActions from '../common/use-actions'
import {useAbandonableEffect} from '../hooks/abandonable-effect'
import {
  getShareLinkSpecifier, ShareMessageType, ShareLink, LocalLinkActionType,
} from './hmd-link-types'
import {HmdLinkCard} from './hmd-link-card'
import websocketPool from '../websockets/websocket-pool'
import {useUuid} from '../hooks/use-uuid'
import {Icon} from '../ui/components/icon'
import {HmdLinkHelpModal} from './hmd-link-help-modal'
import {combine} from '../common/styles'

const useStyles = createUseStyles({
  hmdLinkPage: {
    backgroundColor: brandBlack,
    fontFamily: headerSanSerif,
    color: brandWhite,
    backgroundImage: `url('${sonar}')`,
    backgroundPosition: 'bottom 0 left 50%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    height: '100vh',
    overflow: 'hidden',
  },
  linkPageHeader: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    top: 0,
    paddingTop: '30px',
    zIndex: 10,
    position: 'sticky',
    justifyContent: 'center',
    [tinyViewOverride]: {
      position: 'initial',
    },
  },
  linkPageFooter: {
    zIndex: 2,
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    paddingBottom: '30px',
    gap: '.5rem',
    fontSize: '14px',
    fontWeight: '600',
    position: 'absolute',
    bottom: '0',
  },
  helpGroup: {
    // TODO (tri): update alignment to match link list
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    justifyContent: 'center',
  },
  helpText: {
    fontWeight: '600',
    fontSize: '14px',
    [tinyViewOverride]: {
      fontSize: '0',
    },
  },
  emptyText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: '700',
    lineHeight: '1.5em',
  },
  navLogo: {
    '& > img': {
      [mobileViewOverride]: {
        height: '3.5rem',
      },
    },
  },
  contentContainer: {
    'zIndex': 1,
    'height': 'calc(100% - 2rem)',
    'position': 'absolute',
    'width': '100%',
    'bottom': 0,
    'overflowY': 'scroll',
    'scrollbar-width': 'none',

    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  fakePreviewButton: {
    borderRadius: '0.5em',
    padding: '0.6em 0.8em',
    fontSize: '13px',
    lineHeight: '12px',
    color: almostBlack,
    backgroundColor: gray1,
  },
  wifiIcon: {
    width: '1.2em',
    height: '1em',
  },
  smokeContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    position: 'fixed',
    height: '10rem',
    width: '100vw',
    left: 0,
    bottom: '-1px',
    paddingBottom: '1px',
    justifyContent: 'center',
  },
  smoke: {
    background: 'linear-gradient(180deg, #00000000 0%,  #2d2e431a 41.12%, #2d2e43fa 67.21%)',
  },
  spacer: {
    width: '100%',
    height: '20vh',
    [mobileViewOverride]: {
      padding: '0 40px 24px 40px',
      height: '0',
    },
    [tinyViewOverride]: {
      padding: '0 24px 24px 24px',
      height: '5rem',
    },
  },
  blur: {
    filter: 'blur(3px)',
  },
  section: {
    margin: '0 auto',
    padding: '0 88px',
    [mobileViewOverride]: {
      padding: '0 40px 24px 40px',
    },
    [tinyViewOverride]: {
      padding: '0 24px 24px 24px',
    },
  },
  linkPageCardHolder: {
    'position': 'relative',
    'display': 'grid',
    'gridTemplateColumns': 'repeat(auto-fill, minmax(280px, 1fr))',
    'rowGap': '3.5em',
    'columnGap': '2.4em',
    'justifyContent': 'center',
    [mobileViewOverride]: {
      gridTemplateColumns: '1fr 1fr',
      rowGap: '3em',
      maxWidth: '720px',
      margin: '0 auto',
    },
    [tinyViewOverride]: {
      gridTemplateColumns: '1fr',
      rowGap: '2.7em',
      padding: '0 6px',
      maxWidth: '380px',
    },
  },
  hmdSceneContainer: {
    position: 'absolute',
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  },
  hoverOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    zIndex: 1,
    background: 'linear-gradient(74.81deg, rgba(45, 46, 67, 0) -22.01%, #1C1D2A 79.73%)',
    borderRadius: '0.5em',
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 16,
  },
  controllerContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: 100,
    textAlign: 'center',
    cursor: 'pointer',
  },
  controllerTextBox: {
    textAlign: 'center',
    color: '#FFFFFF',
  },
})

const FakePreviewButton: React.FC<{children?: React.ReactNode}> = ({children}) => {
  const classes = useStyles()
  return (
    <span className={classes.fakePreviewButton}>{children}</span>
  )
}

const WifiIcon: React.FC = () => {
  const {t} = useTranslation(['hmd-link-page'])
  const classes = useStyles()
  return (
    <img className={classes.wifiIcon} src={wifi} alt={t('page.footer.wifi_icon.alt')} />
  )
}

const SmokeFooter: React.FC = () => {
  const classes = useStyles()
  return (
    <div className={classes.smokeContainer}>
      <div className={classes.smoke} />
    </div>
  )
}

const HmdLinkPage: React.FC = () => {
  const {t} = useTranslation(['hmd-link-page'])
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([])
  const [showHelp, setShowHelp] = useState<boolean>(false)
  const classes = useStyles()
  const [channelName, setChannelName] = useState<string>('')

  const sessionId = useUuid()

  const {getChannelName} = useActions(actions)

  useAbandonableEffect((maybeAbandon) => {
    const updateName = async () => {
      const name = await maybeAbandon(getChannelName())
      setChannelName(name)
      websocketPool.broadcastMessage(getChannelSpecifier(name), {
        action: LocalLinkActionType.READY,
        data: {sessionId},
      })
    }
    updateName()
  }, [])

  const upsertShareLink = (link: ShareLink) => {
    const newShareLinks = [...shareLinks]
    const i = newShareLinks.findIndex(l => getShareLinkSpecifier(l) === getShareLinkSpecifier(link))
    if (i >= 0) {
      newShareLinks[i] = link
    } else {
      newShareLinks.push(link)
    }
    setShareLinks(newShareLinks)
  }

  const removeShareLink = (link: ShareLink) => {
    const newShareLinks = [...shareLinks].filter(
      l => getShareLinkSpecifier(l) !== getShareLinkSpecifier(link)
    )
    setShareLinks(newShareLinks)
  }

  const handleWebsocketMessage = ({data}: {data: ShareMessageType}) => {
    switch (data.action) {
      case LocalLinkActionType.START: {
        upsertShareLink(data.data)
        break
      }
      case LocalLinkActionType.STOP: {
        removeShareLink(data.data)
        break
      }
      case LocalLinkActionType.UPDATE: {
        upsertShareLink(data.data)
        break
      }
      default:
        break
    }
  }

  useWebsocketHandler(handleWebsocketMessage, getChannelSpecifier(channelName))

  const header = (
    <header className={classes.linkPageHeader}>
      <div />
      <NavLogo className={classes.navLogo} size='wide' color='white' />
      <div
        className={classes.helpGroup}
        onKeyDown={() => setShowHelp(true)}
        onClick={() => setShowHelp(true)}
        role='button'
        tabIndex={0}
      >
        <span className={classes.helpText}>
          {t('page.button.project_not_appearing')}
        </span>
        <Icon block inline color='white' stroke='questionMark12' />
      </div>
    </header>
  )

  const footer = (
    <footer className={classes.linkPageFooter}>
      <WifiIcon />{t('page.footer.stream_message')}
    </footer>
  )

  const cards = (
    <div className={classes.section}>
      <div className={classes.spacer} />
      <div className={classes.linkPageCardHolder}>
        {shareLinks.map(o => (
          <HmdLinkCard
            key={getShareLinkSpecifier(o)}
            {...o}
          />
        ))}
      </div>
      <SmokeFooter />
    </div>
  )

  const emptyContent = (
    <div className={classes.emptyText}>
      <Trans
        ns='hmd-link-page'
        i18nKey='page.content.empty_cta'
        components={{
          1: <FakePreviewButton />,
        }}
      />
    </div>
  )

  const contentToShow = shareLinks.length ? cards : emptyContent

  return (
    <Page
      title={t('page.meta.title')}
      description={t('page.meta.description')}
      customHeader={header}
      className={combine(classes.hmdLinkPage, showHelp && classes.blur)}
      customFooter={footer}
      centered={false}
    >
      <div className={classes.contentContainer}>
        {contentToShow}
      </div>
      {showHelp && <HmdLinkHelpModal setOpen={setShowHelp} />}
    </Page>
  )
}

export default HmdLinkPage
