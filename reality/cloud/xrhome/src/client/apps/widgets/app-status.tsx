import React from 'react'

import type {IApp} from '../../common/types/models'
import DisabledAppLabel from './disabled-app-label'
import {isArchived} from '../../../shared/app-utils'
import {VIOLATION_RESOLUTION_INSTRUCTIONS} from '../../violations/resolutions'
import {AppSubscriptionIcon} from './app-subscription-icon'

interface IAppStatus {
  app: IApp
  className?: string
}

const AppStatus: React.FunctionComponent<IAppStatus> = ({
  app, className,
}) => {
  if (app.violationStatus === 'Violation' && app.PolicyViolations) {
    const violationTypes = new Set<string>()
    app.PolicyViolations
      .forEach(viol => viol.status === 'Violation' && violationTypes.add(viol.violationType))
    const resolutionInstructions =
      Array.from(violationTypes).map(viol => VIOLATION_RESOLUTION_INSTRUCTIONS[viol])
    return (
      <DisabledAppLabel className={className} resolutionInstructions={resolutionInstructions} />
    )
  }

  const isCampaignCompleted = app.isCommercial &&
      ['DEVELOP', 'COMPLETE', 'CANCELED'].includes(app.commercialStatus)
  const hasSubscription = (app?.isCommercial && (app.commercialStatus === 'LAUNCH')) ||
   isArchived(app)
  return (
    hasSubscription &&
      <AppSubscriptionIcon app={app} isCampaignCompleted={isCampaignCompleted} />
  )
}

export default AppStatus
