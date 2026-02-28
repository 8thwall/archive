import React from 'react'

import {useTranslation} from 'react-i18next'

import {createStudioHubUrl} from './create-studiohub-url'
import {createBrowserUrl} from '../../shared/studiohub/create-browser-url'
import AutoHeading from '../widgets/auto-heading'
import bannerBackground from '../static/studio-desktop/banner-background.png'
import arStartersImage from '../static/studio-desktop/ar-starters.png'
import allTemplatesImage from '../static/studio-desktop/all-templates.png'
import {BLACK_75, WHITE_20, WHITE_50} from './colors'
import AutoHeadingScope from '../widgets/auto-heading-scope'
import {SpaceBetween} from '../ui/layout/space-between'
import {SecondaryButton} from '../ui/components/secondary-button'
import {Icon} from '../ui/components/icon'
import {combine} from '../common/styles'
import {useEnclosedAccount} from '../accounts/enclosed-account-context'
import {getHomePath} from './desktop-paths'
import {createThemedStyles} from '../ui/theme'

const useStyles = createThemedStyles(theme => ({
  featuredProjectPanel: {
    width: '100%',
    height: '12.5em',
    backgroundImage: `url(${bannerBackground})`,
    backgroundColor: 'lightgray',
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    borderRadius: '0.5rem',
    boxShadow: `inset 0 0 0 1px ${WHITE_20}`,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: '3rem 1.5rem',
    fontFamily: 'Geist Mono !important',
  },
  featuredProjectContent: {
    backdropFilter: 'blur(10px)',
    borderRadius: '0.5rem',
    padding: '1rem 1rem 1rem 1rem',
    border: `1px solid ${WHITE_20}`,
    background: BLACK_75,
    textAlign: 'start',
    color: '#fff',
    width: '40rem',
  },
  featuredProjectHeader: {
    fontSize: '25px',
    margin: 0,
    color: theme.fgWarning,
  },
  featuredProjectDescription: {
    color: WHITE_50,
  },
  line: {
    width: '1px',
    height: '16px',
    backgroundColor: WHITE_20,
  },
  templateButton: {
    'fontFamily': 'Geist Mono !important',
    'borderRadius': '0.5rem',
    'height': '5rem',
    'flexGrow': 1,
    'backgroundColor': 'lightgray',
    'position': 'relative',
    'color': 'white',
    'display': 'flex',
    'alignItems': 'center',
    'overflow': 'hidden',
    'justifyContent': 'center',
    'zIndex': 1,
    '&::before': {
      zIndex: -1,
      content: '""',
      position: 'absolute',
      top: -10,
      left: -10,
      right: -10,
      bottom: -10,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '50%',
      backgroundColor: 'lightgray',
      filter: 'blur(5px) brightness(0.4)',
      transition: 'filter 0.3s ease',
    },
    '&:hover::before': {
      zIndex: -1,
      filter: 'blur(0px) brightness(0.7)',
    },
    '&:hover': {
      cursor: 'pointer',
    },
  },
  arStartersImage: {
    '&::before': {
      backgroundImage: `url(${arStartersImage})`,
    },
  },
  allTemplatesImage: {
    '&::before': {
      backgroundImage: `url(${allTemplatesImage})`,
    },
  },
}))

const TemplatePicker: React.FC = () => {
  const classes = useStyles()
  const {t} = useTranslation(['studio-desktop-pages'])
  const account = useEnclosedAccount()

  return (
    <AutoHeadingScope>
      <SpaceBetween direction='vertical' narrow>
        <div className={classes.featuredProjectPanel}>
          <div className={classes.featuredProjectContent}>
            <SpaceBetween direction='vertical'>
              <AutoHeading className={classes.featuredProjectHeader}>
                <Icon stroke='info' /> {t('template_picker.banner.title')}
              </AutoHeading>
              <span className={classes.featuredProjectDescription}>
                {t('template_picker.banner.description')}
              </span>
              <SpaceBetween>
                <SecondaryButton
                  height='small'
                  onClick={() => window.open(createBrowserUrl('https://8th.io/update'))}
                >
                  {t('template_picker.banner.button')}
                </SecondaryButton>
              </SpaceBetween>
            </SpaceBetween>
          </div>
        </div>
        <SpaceBetween narrow grow>
          <button
            type='button'
            onClick={() => window.open(createBrowserUrl('projects', {
              // eslint-disable-next-line local-rules/hardcoded-copy
              tech: 'World Effects,VPS,Image Targets - Curved,Image Targets - Flat,Face Effects',
              // eslint-disable-next-line local-rules/hardcoded-copy
              framework: 'Studio',
              desktopRedirect: createStudioHubUrl(getHomePath(account.uuid)),
            }))}
            className={combine('style-reset', classes.templateButton, classes.arStartersImage)}
          >
            <span>{t('template_picker.title.ar_starters')}</span>
          </button>
          <button
            type='button'
            onClick={() => window.open(createBrowserUrl('projects', {
              // eslint-disable-next-line local-rules/hardcoded-copy
              framework: 'Studio',
              desktopRedirect: createStudioHubUrl(getHomePath(account.uuid)),
            }))
            }
            className={combine('style-reset', classes.templateButton, classes.allTemplatesImage)}
          >
            <span>{t('template_picker.title.all_templates')}</span>
          </button>
        </SpaceBetween>
      </SpaceBetween>
    </AutoHeadingScope>
  )
}

export {
  TemplatePicker,
}
