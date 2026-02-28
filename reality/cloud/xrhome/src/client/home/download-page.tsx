import React from 'react'
import {useTranslation} from 'react-i18next'

import {combine} from '../common/styles'
import withTranslationsLoaded from '../i18n/with-translations-loaded'
import {fontSize} from '../static/styles/settings'
import appleMacIcon from '../static/icons/apple_mac.svg'
import windowsIcon from '../static/icons/windows_white.svg'
import logoIcon from '../static/infin8_Purple.svg'
import {mobileViewOverride} from '../static/styles/settings'
import {SecondaryButton} from '../ui/components/secondary-button'
import {PrimaryButton} from '../ui/components/primary-button'
import {SpaceBetween} from '../ui/layout/space-between'
import Page from '../widgets/page'
import NavLogo from '../widgets/nav-logo'
import vscodeIcon from '../static/icons/vscode.svg'
import AutoHeadingScope from '../widgets/auto-heading-scope'
import AutoHeading from '../widgets/auto-heading'
import {StandardLink} from '../ui/components/standard-link'
import {Badge} from '../ui/components/badge'
import {HeroContainer} from '../widgets/hero-container'
import {WelcomeBackground} from '../widgets/welcome-background'
import {createThemedStyles} from '../ui/theme'

const MAC_SILICON_URL = 'https://8th.io/mac-arm64-latest'
const MAC_INTEL_URL = 'https://8th.io/mac-intel-latest'
const WINDOWS_X64_URL = 'https://8th.io/win-x64-latest'

const useStyles = createThemedStyles(theme => ({
  container: {
    'height': '100%',
    'width': '100%',
    'overflow-x': 'hidden',
    'backgroundRepeat': 'no-repeat',
    '& .page-content': {
      'display': 'flex !important',
      'margin': '0 auto',
      [mobileViewOverride]: {
        padding: '0 1em',
      },
    },
  },
  form: {
    zIndex: 4,
    width: '100%',
    fontSize: `${fontSize}`,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '50em',
    [mobileViewOverride]: {
      paddingBottom: '1em',
      margin: '2em 0',
    },
  },
  headerContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    padding: '4em',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    [mobileViewOverride]: {
      paddingBottom: '1em',
    },
  },
  heading: {
    fontFamily: 'Mozilla Headline, sans-serif',
    fontSize: '2.25em',
    fontWeight: '600',
    textAlign: 'left',
    lineHeight: '1em',
    margin: 0,
    [mobileViewOverride]: {
      fontSize: '2em',
      textAlign: 'center',
    },
  },
  subheading: {
    textAlign: 'center',
    fontSize: '1em',
    maxWidth: '30em',
    [mobileViewOverride]: {
      fontSize: '1.125em',
    },
  },
  downloadButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: '1.5em',
    width: '100%',
  },
  osContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    [mobileViewOverride]: {
      gridTemplateColumns: '1fr',
    },
  },
  dither: {
    position: 'absolute',
    zIndex: 2,
    mixBlendMode: 'soft-light',
    left: '50%',
    transform: 'translateX(-50%)',
    maskImage: 'linear-gradient(180deg, black 80%, transparent)',
  },
  gradients: {
    position: 'absolute',
    zIndex: 1,
    left: '50%',
    transform: 'translateX(-50%)',
  },
  backgroundBokeh: {
    '&::after': {
      content: '""',
      borderRadius: '50%',
      filter: 'blur(6em)',
      position: 'absolute',
      height: '27em',
      width: '35em',
      background: theme.bgMain,
      zIndex: '-1',
      left: 0,
    },
  },
  sectionHeading: {
    fontFamily: 'Mozilla Headline, sans-serif',
    fontSize: '2.25em',
    paddingBottom: '8px',
    fontWeight: '600',
    textAlign: 'left',
    lineHeight: '1em',
    [mobileViewOverride]: {
      fontSize: '2em',
    },
  },
  iconContainer: {
    width: '35px',
    height: '40px',
    position: 'relative',
    top: '8px',
    marginRight: '0.5em',
    objectFit: 'contain',
  },
  header: {
    position: 'absolute',
    zIndex: 3,
  },
  navLogo: {
    padding: '1.5rem',
    display: 'inline-block',
  },
  agentOptions: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  headerIcon: {
    width: '40px',
    height: '70px',
    display: 'block',
    objectFit: 'contain',
    marginBottom: '1rem',
  },
}))

interface ISectionHeading {
  imageSrc: string
  title: string
}

const SectionHeading: React.FC<ISectionHeading> = ({imageSrc, title}) => {
  const classes = useStyles()
  return (
    <AutoHeading className={classes.sectionHeading}>
      <img alt='' src={imageSrc} className={classes.iconContainer} />
      {title}
    </AutoHeading>
  )
}

const OnlyLogoHeader: React.FC = () => {
  const classes = useStyles()

  return (
    <header className={classes.header}>
      <NavLogo size='wide' color='white' className={classes.navLogo} />
    </header>
  )
}

const DownloadHeaderContainer = () => {
  const classes = useStyles()
  const {t} = useTranslation(['desktop-download-page'])

  return (
    <div className={combine(classes.headerContainer, classes.backgroundBokeh)}>
      <SpaceBetween direction='vertical' justifyCenter centered>
        <img
          // eslint-disable-next-line local-rules/hardcoded-copy
          alt='8thWall Logo'
          src={logoIcon}
          className={classes.headerIcon}
        />
        <SpaceBetween centered>
          <h1 className={classes.heading}>
            {t('download_page.heading.download_desktop_app')}
          </h1>
          <Badge color='gray' variant='pastel'>{t('download_page.badge.beta')}</Badge>
        </SpaceBetween>
        <div className={classes.subheading}>
          {t('download_page.description.download_desktop_app')}
        </div>
      </SpaceBetween>
    </div>
  )
}

const MacDownloadContainer: React.FC = () => {
  const {t} = useTranslation(['desktop-download-page'])
  return (
    <HeroContainer>
      <SectionHeading imageSrc={appleMacIcon} title={t('download_page.heading.mac_os')} />
      <SpaceBetween direction='vertical'>
        <PrimaryButton
          spacing='full'
          onClick={() => window.open(MAC_SILICON_URL)}
        >
          { t('download_page.button.download_app_apple_silicon')}
        </PrimaryButton>
        <SecondaryButton
          spacing='full'
          onClick={() => {
            window.open(MAC_INTEL_URL)
          }}
        >
          {t('download_page.button.download_app_intel_v2')}
        </SecondaryButton>
      </SpaceBetween>
    </HeroContainer>
  )
}

const WindowsDownloadContainer: React.FC = () => {
  const {t} = useTranslation(['desktop-download-page'])
  return (
    <AutoHeadingScope>
      <HeroContainer>
        <SectionHeading
          imageSrc={windowsIcon}
          title={t('download_page.heading.windows_os')}
        />
        <PrimaryButton
          spacing='full'
          onClick={() => {
            window.open(WINDOWS_X64_URL)
          }}
        >
          { t('download_page.button.download_app_windows_x64')}
        </PrimaryButton>
      </HeroContainer>
    </AutoHeadingScope>
  )
}

const AgentDownloadSection = () => {
  const {t} = useTranslation(['desktop-download-page'])
  const classes = useStyles()

  return (
    <AutoHeadingScope>
      <HeroContainer>
        <SectionHeading
          imageSrc={vscodeIcon}
          title={t('download_page.heading.vscode_extension')}
        />
        <div className={classes.agentOptions}>
          <div>
            <PrimaryButton
              onClick={() => {
                window.open('https://8th.io/agent-vscode-marketplace')
              }}
            >
              {t('download_page.button.download_vscode_extension')}
            </PrimaryButton>
          </div>
          <SpaceBetween direction='vertical'>
            <SecondaryButton
              onClick={() => {
                window.open('https://8th.io/agent-vsix-latest')
              }}
            >
              {t('download_page.button.download_vsix')}
            </SecondaryButton>
            <StandardLink href='https://8th.io/agent-docs-install'>
              {t('download_page.link.install_vsix')}
            </StandardLink>
          </SpaceBetween>
        </div>
      </HeroContainer>
    </AutoHeadingScope>
  )
}

const DownloadPageForm = withTranslationsLoaded(() => {
  const classes = useStyles()

  return (
    <div className={classes.form}>
      <SpaceBetween direction='vertical'>
        <DownloadHeaderContainer />
        <div className={classes.osContainer}>
          <MacDownloadContainer />
          <WindowsDownloadContainer />
        </div>
        {BuildIf.DOWNLOAD_EXTENSION_20251022 && <AgentDownloadSection />}
      </SpaceBetween>
    </div>
  )
})

const DownloadPage = () => {
  const classes = useStyles()

  return (
    <Page
      className={classes.container}
      hasFooter={false}
      centered={false}
      customHeader={<OnlyLogoHeader />}
    >
      <WelcomeBackground />
      <DownloadPageForm />
    </Page>
  )
}

export default DownloadPage
