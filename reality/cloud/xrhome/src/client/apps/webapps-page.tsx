import React from 'react'
import {Header} from 'semantic-ui-react'

import {getSelectedAccountField} from '../accounts/account-select'
import {UsageProgressBar} from '../uiWidgets/usage-progress-bar'
import {InlineMessage} from '../uiWidgets/messages'
import {listWebUpgradeAccounts} from '../../shared/account-utils'
import {useSelector} from '../hooks'
import {useUserGivenName} from '../user/use-current-user'
import {Icon} from '../ui/components/icon'

// NOTE(christoph): Legacy view that is not visible to new users
/* eslint-disable local-rules/hardcoded-copy */

export const WebUsage: React.FC = () => {
  const isFree = useSelector(s => getSelectedAccountField(s, 'accountType') === 'WebDeveloper')
  const totalViews = useSelector(s => s.usage.views.reduce((o, {calls}) => o + Number(calls), 0))
  const name = useUserGivenName()
  const usageTier = {
    freeUpTo: 1000,
  }

  const getEncouragingTicks = () => {
    if (isFree || totalViews < 2000) {
      return [
        {val: usageTier.freeUpTo, location: 0.5},
        {val: 2000, location: 0.75},
        {val: 10000, location: 1},
      ]
    } else {
      return [
        {val: usageTier.freeUpTo, location: 0.2},
        {val: 2000, location: 0.4},
        {val: 10000, location: 0.6},
        {val: 100000, location: 0.8},
        {val: 1000000, location: 1},
      ]
    }
  }

  return (
    <div className='usage-section'>
      {isFree && totalViews > 400 &&
        <Header as='h3'>Whoa, {name}, your 8th Wall Web Apps are on 🔥!</Header>
      }
      <p>
        {totalViews === 0 && 'You\'ve had no recent views. '}
        {totalViews > 0 && `You've reached ${totalViews} total views in the last 30 days. `}
      </p>
      <UsageProgressBar
        value={totalViews}
        locked={isFree}
        ticks={getEncouragingTicks()}
        lockedTierStart={0}
        lockedMessage={`<tspan class='icon'>&#xf023;</tspan> ${listWebUpgradeAccounts()} Plan`}
      />
      {isFree && (totalViews > usageTier.freeUpTo
        ? (
          <InlineMessage error>
            <Icon stroke='danger' />
            <strong>Your web apps are currently disabled.</strong>
            &nbsp;To unlock additional views, you must upgrade your plan to an&nbsp;
            {listWebUpgradeAccounts()} Plan.
          </InlineMessage>
        )
        : (totalViews > usageTier.freeUpTo * 0.75) &&
          <InlineMessage warning>
            <Icon stroke='danger' />
            <strong>Don&#39;t let your web apps be disabled.</strong>
            &nbsp;Unlock additional views by upgrading to an&nbsp;
            {listWebUpgradeAccounts()} Plan.
          </InlineMessage>
      )
      }
    </div>
  )
}
