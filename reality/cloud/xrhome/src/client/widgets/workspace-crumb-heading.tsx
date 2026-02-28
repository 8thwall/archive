import * as React from 'react'
import {createUseStyles} from 'react-jss'

import {getPathForAccount} from '../common/paths'
import type {IAccount, IApp} from '../common/types/models'
import {getDisplayNameForApp} from '../../shared/app-utils'
import HeadingBreadCrumbs from './heading-breadcrumbs'
import CrossAccountBadge from './cross-account-badge'
import useAppSharingInfo from '../common/use-app-sharing-info'
import {mobileViewOverride, tinyViewOverride} from '../static/styles/settings'
import {useAppPathsContext} from '../common/app-container-context'

const useStyles = createUseStyles({
  headingContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    marginBottom: '1em',
    [mobileViewOverride]: {
      flexDirection: 'column',
      gap: '1em',
      alignItems: 'flex-start',
    },
  },
  leftSide: {
    display: 'flex',
    [tinyViewOverride]: {
      gap: '0.5em',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  rightSide: {
    textAlign: 'right',
    marginLeft: 'auto',
    [tinyViewOverride]: {
      marginLeft: '0',
    },
  },
})

interface IWorkspaceCrumbHeading {
  text: string
  account: IAccount
  app?: IApp
  className?: string
  dark?: boolean
  children?: React.ReactNode
}

const WorkspaceCrumbHeading: React.FC<IWorkspaceCrumbHeading> = ({
  text, account, app, className, children, dark = false,
}) => {
  const classes = useStyles()
  const {isExternalApp, sharingAccounts, memberInviteeAccount} = useAppSharingInfo(app)
  const appPathsContext = useAppPathsContext()
  const currentAccountName = app ? account.shortName : account.name
  const links = [
    {
      path: getPathForAccount(isExternalApp ? memberInviteeAccount : account),
      text: isExternalApp ? memberInviteeAccount.name : currentAccountName,
      key: 'account-name',
    },
  ]
  const isSharedApp = isExternalApp || sharingAccounts.length > 0
  if (app) {
    const {getPathForApp} = appPathsContext
    links.push({
      path: getPathForApp(),
      text: app.hostingType === 'AD' ? app.appTitle : app.appName,
      key: 'project-name',
    })
  }

  return (
    <div className={classes.headingContainer}>
      <div className={classes.leftSide}>
        <HeadingBreadCrumbs
          className={className}
          title={`${app ? getDisplayNameForApp(app) : account.name} - ${text}`}
          text={text}
          dark={dark}
          links={links}
        />
        {isSharedApp &&
          <CrossAccountBadge app={app} />
        }
      </div>

      {children && <div className={classes.rightSide}>{children}</div>}
    </div>
  )
}

export default WorkspaceCrumbHeading

export type {IWorkspaceCrumbHeading}
