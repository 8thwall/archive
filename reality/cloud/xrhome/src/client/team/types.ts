/* eslint-disable camelcase */
import type {enum_User_Accounts_role} from '../common/types/db'

interface TeamRole {
  uuid: string
  email: string
  family_name: string
  given_name: string
  role: enum_User_Accounts_role | 'INVITED'
  handle: string
  preferred: string
  profileImage?: string
}

interface Invitation {
  accountName: string
  accountType: string
  accountUuid: string
  from: string  // email
  to: string  // email
  token: string  // invitation token
}

type TeamPendingState = {
  leaveTeam?: boolean
}

interface TeamState {
  roles: TeamRole[]
  invitation: Invitation
  invitationError: string
  pending: TeamPendingState
}

export {
  TeamRole,
  Invitation,
  TeamState,
}
