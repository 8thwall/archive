import React from 'react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import {useSelector} from '../hooks'
import type {TeamRole} from './types'
import {MAX_HANDLE_LENGTH} from '../../shared/user-handle'
import useActions from '../common/use-actions'
import teamActions from './team-actions'
import useCurrentAccount from '../common/use-current-account'
import type {UserAccountRole} from '../common/types/db'
import {useCurrentUser} from '../user/use-current-user'
import {gray3} from '../static/styles/settings'
import {TeamMemberProfileIcon} from './team-member-profile-icon'
import {Icon} from '../ui/components/icon'
import {StandardDropdownField} from '../ui/components/standard-dropdown-field'
import {StandardTextInput} from '../ui/components/standard-text-input'
import {TertiaryButton} from '../ui/components/tertiary-button'
import {TeamRibbon} from './team-ribbon'

const useStyles = createUseStyles({
  avatarCell: {
    maxWidth: '100%',
    whiteSpace: 'nowrap',
  },
  inline: {
    whiteSpace: 'nowrap',
  },
  roleHandleCell: {
    'display': 'flex',
    'flexDirection': 'row',
    'flexWrap': 'nowrap',
    '& > *:not(:last-child)': {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
    '& > *:not(:first-child)': {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
  },
  profileIcon: {
    height: '3.5em',
    width: '3.5em',
    minWidth: '3.5em',
    borderRadius: '50%',
    overflow: 'hidden',
    marginRight: '0.25em',
    border: `1px solid ${gray3}`,
  },
})

type RoleOptions = UserAccountRole | 'INVITED'

const ROLE_PERMISSION_LEVEL = {
  'OWNER': 2,
  'ADMIN': 1,
  'BILLMANAGER': 0,
  'DEV': 0,
  'INVITED': 0,
} as const

const canUserEditRole = (userRole: UserAccountRole, role: RoleOptions) => {
  const userLevel = ROLE_PERMISSION_LEVEL[userRole]
  const level = ROLE_PERMISSION_LEVEL[role]
  return userLevel !== 0 && userLevel >= level &&
    role !== 'INVITED' && (userLevel === 2 || role !== 'BILLMANAGER')
}

const optionsForRole = (userRole: UserAccountRole): Partial<UserAccountRole[]> => (
  ROLE_PERMISSION_LEVEL[userRole] === 2
    ? ['OWNER', 'BILLMANAGER', 'ADMIN', 'DEV']
    : ['ADMIN', 'DEV']
)

interface ITeamMember {
  teamRole: TeamRole
  userHandle: string
  updateUserHandle: (value: string) => void
  doUpdateUserHandle: () => void
  leaveTeam: () => void
}

const TeamMember: React.FC<ITeamMember> = ({
  teamRole, userHandle, updateUserHandle, doUpdateUserHandle, leaveTeam,
}) => {
  const {t} = useTranslation(['account-pages'])
  const classes = useStyles()
  const account = useCurrentAccount()
  const {deleteRole, uninvite, updateRole} = useActions(teamActions)
  const otherWorkspaces = useSelector(state => state.accounts.allAccounts)
  const user = useCurrentUser()

  const billing = account?.stripeId
  const role = account?.Users.find(u => u.UserUuid === user.uuid)?.role
  const {email} = user
  const isItYou = teamRole.email === email
  const handle = isItYou ? userHandle : teamRole.handle
  const handleNeedsUpdate = isItYou && userHandle !== teamRole.handle
  const showRoleDropdown = !isItYou && canUserEditRole(role, teamRole.role)
  const options = showRoleDropdown && optionsForRole(role)
    .filter(o => (billing || o !== 'BILLMANAGER'))
    .map((r, i) => ({value: r, content: r, key: i}))

  const showRemoveMember = !isItYou && ROLE_PERMISSION_LEVEL[role] > 0 && teamRole.role !== 'OWNER'
  const showLeaveButton = otherWorkspaces.length >= 2 && isItYou && teamRole.role !== 'OWNER'

  const removeMember = () => (
    teamRole.role === 'INVITED' ? uninvite(teamRole) : deleteRole(teamRole)
  )

  const fullName = `${teamRole.given_name} ${teamRole.family_name}`
  return (
    <tr>
      <td className={classes.avatarCell}>
        <div className={classes.profileIcon}>
          <TeamMemberProfileIcon
            profilePhotoUrl={teamRole.profileImage}
            fullName={fullName}
          />
        </div>
      </td>
      <td>
        <span>{fullName}</span>
      </td>
      <td>{teamRole.email}</td>
      <td>
        {showRoleDropdown
          ? (
            <StandardDropdownField
              label={null}
              options={options}
              value={teamRole.role}
              width='maxContent'
              height='small'
              onChange={(value: string) => (
                value !== teamRole.role && updateRole({...teamRole, role: value as UserAccountRole})
              )}
            />
          )
          : <span>{teamRole.role}</span>
        }
      </td>
      <td>
        {isItYou
          ? (
            <span className={classes.roleHandleCell}>
              <StandardTextInput
                id={`team-handle-input-${teamRole.uuid}`}
                maxLength={MAX_HANDLE_LENGTH}
                width={4}
                value={handle}
                onChange={e => updateUserHandle(e.target.value)}
              />
              <TertiaryButton
                disabled={!handleNeedsUpdate}
                onClick={doUpdateUserHandle}
              >
                ✓
              </TertiaryButton>
            </span>)
          : handle}
      </td>
      <td>
        {showRemoveMember &&
          // eslint-disable-next-line local-rules/ui-component-styling
          <TertiaryButton className={classes.inline} onClick={removeMember}>
            <Icon stroke='trashAlternateOutline' inline />
            {t(teamRole.role === 'INVITED'
              ? 'team_page.member_table.button.uninvite'
              : 'team_page.member_table.button.remove')}
          </TertiaryButton>
        }
        {showLeaveButton &&
          // eslint-disable-next-line local-rules/ui-component-styling
          <TertiaryButton className={classes.inline} onClick={leaveTeam}>
            <Icon stroke='signOutAlternate' inline />
            {t('team_page.member_table.button.leave')}
          </TertiaryButton>
        }
      </td>
      {isItYou && (
        <TeamRibbon>
          {t('team_page.member_table.label.its_you')}
        </TeamRibbon>
      )}
    </tr>
  )
}

export {
  TeamMember,
}
