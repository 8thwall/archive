import React from 'react'
import {createUseStyles} from 'react-jss'

import {useTranslation} from 'react-i18next'

import {createBrowserUrl} from '../../shared/studiohub/create-browser-url'
import {SpaceBetween} from '../ui/layout/space-between'
import {Container} from './container'
import {Popup} from '../ui/components/popup'
import type {IIconButton} from '../ui/components/icon-button'
import {AccountPathEnum, getPathForAccount} from '../common/paths'
import {useEnclosedAccount} from '../accounts/enclosed-account-context'
import {WHITE_20} from './colors'
import {combine} from '../common/styles'
import {Icon, IIcon} from '../ui/components/icon'
import {createStudioHubUrl} from './create-studiohub-url'
import {getHomePath} from './desktop-paths'

const useStyles = createUseStyles({
  sidebarButton: {
    'padding': '0.5rem',
    'cursor': 'pointer',
    'display': 'block',
    '&:disabled': {
      cursor: 'default',
      opacity: '0.5',
    },
    '&:hover': {
      borderRadius: '0.5rem',
      background: WHITE_20,
      boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.55), 0 1px 2px 0 rgba(255, 255, 255, 0.25) inset',
    },
  },
})

interface ISidebarButton {
  onClick: () => void
  stroke: IIcon['stroke']
  text: string
}

const SideBarButton: React.FC<ISidebarButton> = ({stroke, text, onClick}) => {
  const classes = useStyles()
  return (
    <button
      type='button'
      className={combine('style-reset', classes.sidebarButton)}
      onClick={onClick}
      aria-label={text}
    >
      <Icon
        block
        stroke={stroke}
        color='white'
      />
    </button>
  )
}

interface ISideBarLinkOut extends Pick<IIconButton, 'stroke' | 'text'> {
  url: string
}

const SideBarLinkOut: React.FC<ISideBarLinkOut> = ({url, stroke, text}) => {
  const popupContent = (
    <SpaceBetween direction='horizontal' narrow centered>
      <span>{text}</span>
      <Icon stroke='arrowUpRight' color='main' />
    </SpaceBetween>
  )

  return (
    <Popup content={popupContent} position='right' alignment='center' size='tiny' delay={250}>
      <SideBarButton stroke={stroke} text={text} onClick={() => window.open(url, '_blank')} />
    </Popup>
  )
}

// TODO(Johnny): Update the icons to match the design when they are complete.
const SideNavBar: React.FC = () => {
  const account = useEnclosedAccount()
  const shortName = account?.shortName
  const {t} = useTranslation(['studio-desktop-pages'])

  return (
    <SpaceBetween direction='vertical'>
      <SpaceBetween narrow direction='vertical'>
        {shortName &&
          <Container padding='tiny'>
            <SpaceBetween direction='vertical' extraNarrow>
              <SideBarLinkOut
                url={createBrowserUrl(getPathForAccount(shortName, AccountPathEnum.workspace))}
                stroke='home'
                text={t('sidebar.tooltip.home')}
              />
              <SideBarLinkOut
                url={createBrowserUrl(getPathForAccount(shortName, AccountPathEnum.team))}
                stroke='team'
                text={t('sidebar.tooltip.team')}
              />
              <SideBarLinkOut
                url={createBrowserUrl(getPathForAccount(shortName, AccountPathEnum.account))}
                stroke='settings'
                text={t('sidebar.tooltip.settings')}
              />
            </SpaceBetween>
          </Container>
        }
        <Container padding='tiny'>
          <SpaceBetween direction='vertical' extraNarrow>
            <SideBarLinkOut
              url={createBrowserUrl('projects', {
                // eslint-disable-next-line local-rules/hardcoded-copy
                framework: 'Studio',
                desktopRedirect: createStudioHubUrl(getHomePath(account.uuid)),
              })}
              stroke='templates'
              text={t('sidebar.tooltip.templates')}
            />
            <SideBarLinkOut
              url='https://www.8thwall.com/tutorials'
              stroke='tutorials'
              text={t('sidebar.tooltip.tutorials')}
            />
            <SideBarLinkOut
              url='https://www.8thwall.com/docs'
              stroke='documentation'
              text={t('sidebar.tooltip.docs')}
            />
            <SideBarLinkOut
              url='https://forum.8thwall.com'
              stroke='forum'
              text={t('sidebar.tooltip.forum')}
            />
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </SpaceBetween>
  )
}

export {
  SideNavBar,
}
