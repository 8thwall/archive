import React from 'react'
import {useTranslation} from 'react-i18next'

import {gray4, mint} from '../../static/styles/settings'
import {Icon} from '../../ui/components/icon'
import {Tooltip} from '../../ui/components/tooltip'
import {hexColorWithAlpha} from '../../../shared/colors'
import {createCustomUseStyles} from '../../common/create-custom-use-styles'
import type {IApp} from '../../common/types/models'
import {isArchived} from '../../../shared/app-utils'

const useStyles = createCustomUseStyles<{isCampaignCompleted: boolean}>()({
  statusContainer: {
    display: 'flex',
    gap: '0.25em',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ({isCampaignCompleted}) => (isCampaignCompleted
      ? hexColorWithAlpha(gray4, 0.3)
      : hexColorWithAlpha(mint, 0.3)),
    borderRadius: '0.25em',
    padding: '0.15em',
  },
  tooltip: {
    maxWidth: '10em',
  },
})

interface IAppSubscriptionIcon {
  app: IApp
  isCampaignCompleted?: boolean
}

const AppSubscriptionIcon: React.FunctionComponent<IAppSubscriptionIcon> = ({
  app, isCampaignCompleted = false,
}) => {
  const {t} = useTranslation(['account-pages'])
  const classes = useStyles({isCampaignCompleted})

  return (
    <Tooltip
      position='top-start'
      content={(
        <div className={classes.tooltip}>
          {isArchived(app)
            ? t('account_dashboard_page.app_subscription_status.tooltip_expired')
            : t('account_dashboard_page.app_subscription_status.tooltip_active')}
        </div>
      )}
    >
      <span className={classes.statusContainer}>
        <Icon stroke='filledCrown' color={isCampaignCompleted ? 'gray4' : 'successDark'} />
      </span>
    </Tooltip>

  )
}

export {AppSubscriptionIcon}
