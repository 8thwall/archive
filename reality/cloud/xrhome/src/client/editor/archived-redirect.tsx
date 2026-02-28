import React, {FunctionComponent, useState} from 'react'
import {createUseStyles} from 'react-jss'

import {Icon} from 'semantic-ui-react'

import {editorBlue, green, mobileWidthBreakpoint} from '../static/styles/settings'
import {combine} from '../common/styles'
import useCurrentApp from '../common/use-current-app'
import {makeHostedProductionUrl, withoutHttps} from '../../shared/hosting-urls'
import useCurrentAccount from '../common/use-current-account'

import {AppPathEnum, getPathForApp, getPublicPathForApp} from '../common/paths'
import {SetRedirectModal} from './modals/archived-redirect-modal'
import LinkOut from '../uiWidgets/link-out'

const useStyles = createUseStyles({
  pub: {
    color: green,
  },
  featured: {
    color: editorBlue,
  },
  spaceRight: {
    marginRight: '1em',
  },
  halfSpaceRight: {
    marginRight: '0.5em',
  },
  pointer: {
    cursor: 'pointer',
  },
  archivedRedirect: {
    marginTop: '1em',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'var(--accent-background)',
    flexWrap: 'wrap',
    padding: '.5em 0',
    [mobileWidthBreakpoint]: {
      paddingLeft: '5em',
      paddingRight: '5em',
      div: {
        marginBottom: '.5em',
      },
    },
  },
})

export const ArchivedRedirect: FunctionComponent = () => {
  const {pub, featured, spaceRight, halfSpaceRight, pointer, archivedRedirect} = useStyles()
  const [showRedirectModal, setShowRedirectModal] = useState(false)

  const app = useCurrentApp()
  const account = useCurrentAccount()

  const workspace = account.shortName
  const redirectUrl = app.campaignRedirectUrl
  const isFeatured = app.publicFeatured && account.publicFeatured
  const {appName} = app
  const appUuid = app.uuid

  const deploymentUrl = makeHostedProductionUrl(workspace, appName)
  const featuredUrl = getPublicPathForApp(workspace, appName)
  const featuredSettingsUrl = getPathForApp(account, app, AppPathEnum.featureProject)

  const showModal = () => setShowRedirectModal(true)

  const noRedirectJsx = isFeatured
    ? (
      <>
        <span className={combine(featured, halfSpaceRight)}>Featured Project Page</span>
        <LinkOut url={featuredUrl} className={combine(halfSpaceRight, 'inline-link')}>
          8thwall.com{featuredUrl}
        </LinkOut>
      </>
    )
    : (
      <>
        <Icon name='warning sign' color='yellow' />
        {/* TODO(pawel) Fix <ButtonLink> styling so we can use inline-link with it. */}
        <span
          className={combine(pointer, halfSpaceRight, 'inline-link')}
          onClick={showModal}
          onKeyPress={showModal}
          role='button'
          tabIndex={0}
        >
          set campaign redirect url
        </span>
      </>
    )

  return (
    <div className={archivedRedirect}>
      <div>
        <span className={combine(pub, halfSpaceRight)}>Public</span>
        <LinkOut
          url={deploymentUrl}
          className={combine(spaceRight, 'inline-link')}
        >
          {withoutHttps(deploymentUrl)}
        </LinkOut>
        <span className={halfSpaceRight}>redirects to &rarr;</span>
      </div>
      <div>
        {redirectUrl
          ? (
            <LinkOut
              url={redirectUrl}
              className={combine(halfSpaceRight, 'inline-link')}
            >
              {redirectUrl}
            </LinkOut>
          )
          : noRedirectJsx
        }
        <Icon className={pointer} name='pencil' onClick={showModal} />
      </div>

      {showRedirectModal &&
        <SetRedirectModal
          featuredSettingsUrl={featuredSettingsUrl}
          isFeatured={isFeatured}
          initialRedirectUrl={redirectUrl}
          appUuid={appUuid}
          featuredUrl={featuredUrl}
          onClose={() => setShowRedirectModal(false)}
        />
      }
    </div>
  )
}
