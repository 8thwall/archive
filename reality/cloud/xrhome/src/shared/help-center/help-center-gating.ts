import type {IAccount} from '../../client/common/types/models'
import {isUpgradedWebAccount} from '../account-utils'
import {SupportTicketType} from './help-center-types'

const ALLOWED_SUPPORT_ACCOUNT_TYPES = ['WebAgency', 'WebEnterprise']

const isRequestSupportEnabled = (account: Pick<IAccount, 'accountType'>) => (
  ALLOWED_SUPPORT_ACCOUNT_TYPES.includes(account.accountType)
)

const isReportBugEnabled = (account: Pick<IAccount, 'accountType'>) => (
  isUpgradedWebAccount(account)
)

const canRequestTicketType = (
  account: Pick<IAccount, 'accountType'>,
  ticketType: SupportTicketType
) => (
  ticketType === SupportTicketType.REPORT_BUG
    ? isReportBugEnabled(account)
    : isRequestSupportEnabled(account)
)

export {
  isRequestSupportEnabled,
  isReportBugEnabled,
  canRequestTicketType,
}
