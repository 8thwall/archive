import * as React from 'react'

import AppCard from './app-card'
import type {IApp} from '../../common/types/models'
import {ResponsiveCardGroup} from '../../widgets/responsive-card-group'

interface IAppCardGroup {
  /**
   * List of apps that should be displayed as cards in the group.
   */
  apps: Array<IApp>

  /** card don't have links to their individual projects */
  noLink?: boolean

  /** Whether account information should be displayed in the footers of each app card.  */
  accountFooters?: boolean

  /** Additional classes. */
  className?: string
}

const AppCardGroup: React.FC<IAppCardGroup> = ({
  apps, className, accountFooters, noLink = false,
}) => (
  <ResponsiveCardGroup className={className}>
    {apps.map(app => (
      <AppCard noLink={noLink} key={app.appKey} app={app} accountFooter={accountFooters} />
    ))}
  </ResponsiveCardGroup>
)

export default AppCardGroup
