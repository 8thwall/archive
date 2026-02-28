/* eslint-disable max-len, local-rules/hardcoded-copy */
import * as React from 'react'
import {Header} from 'semantic-ui-react'

import {getSelectedAccountField} from '../accounts'
import {UsageProgressBar} from '../uiWidgets/usage-progress-bar'
import {InlineMessage} from '../uiWidgets/messages'
import {connect} from '../common/connect'
import {Icon} from '../ui/components/icon'

const RawCameraUsage = ({isFree, totalViews, user}) => {
  const usageTier = {
    freeUpTo: 1000,
  }

  const getEncouragingTicks = () => {
    if (isFree) {
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
        <Header as='h3'>Wow, {user.given_name}, your AR Cameras are on 🔥!</Header>
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
        lockedMessage="<tspan class='icon'>&#xf023;</tspan> AR Camera Pro Plan"
      />
      {isFree && (totalViews > usageTier.freeUpTo
        ? (
          <InlineMessage error>
            <Icon stroke='danger' /><strong>Your cameras are currently disabled.</strong> To unlock additional views, you must upgrade your plan to AR Camera Pro.
          </InlineMessage>
        )
        : (totalViews > usageTier.freeUpTo * 0.75) &&
          <InlineMessage warning>
            <Icon stroke='danger' />
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            <strong>Don't let your cameras be disabled.</strong> Unlock additional views by upgrading to AR Camera Pro.
          </InlineMessage>
      )
      }
    </div>
  )
}
export const CameraUsage = connect(state => ({
  isFree: getSelectedAccountField(state, 'accountType') === 'WebCamera',
  totalViews: state.usage.views.reduce((o, {calls}) => o + Number(calls), 0),
  user: state.user,
}), null)(RawCameraUsage)
