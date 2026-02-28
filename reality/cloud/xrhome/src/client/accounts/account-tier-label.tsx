import * as React from 'react'
import {Label} from 'semantic-ui-react'

import {getSelectedAccount} from './account-select'
import {
  isPro,
  isBusiness,
  isEnterprise,
  isLegacyPro,
  getPlanTypeDescription,
} from '../../shared/account-utils'
import type {IAccount} from '../common/types/models'
import '../static/styles/account-tier-label.scss'
import {connect} from '../common/connect'

interface AccountCardProps {
  account?: IAccount

  selectedAccount?: IAccount

  /** Additional styles. */
  style?: React.CSSProperties

  /* Use basic style for the label */
  basic?: boolean

  /* Use thin label style */
  thin?: boolean
}

const AccountTierLabel: React.FunctionComponent<AccountCardProps> =
  ({selectedAccount, account, basic, style = {}, thin}) => {
    const labelAccount = account || selectedAccount
    const classes = `account-tier-label ${thin ? 'thin-label' : ''}`

    if (isPro(labelAccount)) {
      return (
        <Label className={classes} basic style={style}>
          {getPlanTypeDescription(labelAccount)?.toUpperCase()}
        </Label>
      )
    } else if (isLegacyPro(labelAccount)) {
      return (
        <Label className={classes} basic={basic} style={style}>PRO</Label>
      )
    } else if (isBusiness(labelAccount) || isEnterprise(labelAccount)) {
      const color = !basic ? 'black' : undefined
      return (
        <Label className={classes} color={color} basic={basic} style={style}>
          {getPlanTypeDescription(labelAccount)?.toUpperCase()}
        </Label>
      )
    } else {
      return (
        <span>&nbsp;</span>
      )
    }
  }

export default connect(state => ({
  selectedAccount: getSelectedAccount(state),
}))(AccountTierLabel)
