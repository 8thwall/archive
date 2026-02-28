import type {IUserAccount} from '../client/common/types/models'
import {BILLING_ROLES, PROFILE_ROLES} from './account-constants'

const canUpdatePublicProfile = (user: IUserAccount) => PROFILE_ROLES.includes(user.role)

const isBillingRole = (role: string) => (<readonly string[]>BILLING_ROLES).includes(role)

export {
  canUpdatePublicProfile,
  isBillingRole,
}
