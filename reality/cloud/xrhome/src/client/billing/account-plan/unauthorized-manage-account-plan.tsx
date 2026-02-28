import React from 'react'
import {Link} from 'react-router-dom'
import {Trans} from 'react-i18next'

import useCurrentAccount from '../../common/use-current-account'
import {tinyViewOverride} from '../../static/styles/settings'
import {getDescriptionForAccountType} from '../../../shared/account-utils'
import AutoHeading from '../../widgets/auto-heading'
import {AccountPathEnum, getPathForAccount} from '../../common/paths'
import {createThemedStyles} from '../../ui/theme'

const useStyles = createThemedStyles(theme => ({
  planType: {
    color: theme.fgMuted,
    margin: '0',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    margin: '0',
  },
  rowElementsSpacedBetween: {
    'extend': 'row',
    'justifyContent': 'space-between',
    '& button': {
      fontSize: '16px',
    },

    [tinyViewOverride]: {
      'flexDirection': 'column',
      '& button': {
        margin: '2em 0',
      },
    },
  },
  contactOwner: {
    lineHeight: '2em',
  },
}))

const UnauthorizedManageAccountPlan = () => {
  const account = useCurrentAccount()
  const classes = useStyles()
  const teamPath = getPathForAccount(account, AccountPathEnum.team)

  return (
    <div className={classes.rowElementsSpacedBetween}>
      <AutoHeading className={classes.planType}>
        {getDescriptionForAccountType(account.accountType)}
      </AutoHeading>
      <p className={classes.contactOwner}>
        <Trans
          ns='account-pages'
          i18nKey='plan_billing_page.unauthorized_manage_plan.description.contact_owner'
        >
          Contact the&nbsp;<Link to={teamPath}>workspace owner</Link>&nbsp;to manage plan.
        </Trans>
      </p>
    </div>
  )
}

export {
  UnauthorizedManageAccountPlan,
}
