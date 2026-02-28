import React, {useState} from 'react'
import {Trans, useTranslation} from 'react-i18next'

import {Icon} from 'semantic-ui-react'

import {Loader} from '../ui/components/loader'
import ErrorMessage from '../home/error-message'
import {sortByUser} from '../common'
import {isEditorEnabled} from '../../shared/account-utils'
import WorkspaceCrumbHeading from '../widgets/workspace-crumb-heading'
import {useFormInput} from '../common/form-change-hook'
import RoleInfoPopup from './role-info-popup'
import useCurrentAccount from '../common/use-current-account'
import {useSelector} from '../hooks'
import {ACCOUNT_TYPE_TO_MAX_TEAM_SIZE} from '../../shared/account-constants'
import type {IAccount} from '../common/types/models'
import useActions from '../common/use-actions'
import teamActions from './team-actions'
import type {TeamRole} from './types'
import {LeaveRoleConfirmationModal} from './leave-role-confirmation-modal'
import {TeamMember} from './team-member'
import {useCurrentUser} from '../user/use-current-user'
import {VALID_ACCOUNT_HANDLE_PATTERN} from '../../shared/account-constants'
import {PrimaryButton} from '../ui/components/primary-button'
import {TertiaryButton} from '../ui/components/tertiary-button'
import {createThemedStyles} from '../ui/theme'
import {StandardTextInput} from '../ui/components/standard-text-input'
import {StaticBanner} from '../ui/components/banner'
import {StandardModal} from '../editor/standard-modal'
import {centeredSectionMaxWidth} from '../static/styles/settings'

const useStyles = createThemedStyles(theme => ({
  teamPage: {
    'display': 'flex',
    'flexDirection': 'column',
    'gap': '1rem',
    '& h1': {
      '& span': {
        marginRight: '0.25em',
      },
    },
  },
  confirmUserHandleChangeModal: {
    margin: '1em',
    paddingLeft: '1em',
    paddingRight: '1em',
  },
  formColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: '1rem',
    width: '100%',
    maxWidth: '600px',
  },
  emailInput: {
    flex: 2,
  },
  teamPageTableContainer: {
    overflowX: 'auto',
    width: '100%',
  },
  teamPageTable: {
    'width': `calc(${centeredSectionMaxWidth} - 2em)`,  // account for ribbon padding
    'border': `1px solid ${theme.modalContainerBg}`,
    'borderRadius': '8px',
    'borderSpacing': '0',
    '& th': {
      padding: '0.5em 0.5em',
      borderBottom: `1px solid ${theme.modalContainerBg}`,
      fontWeight: 600,
    },
    '& td': {
      padding: '0.5em 0.5em',
      verticalAlign: 'middle',
    },
    '& tr': {
      position: 'relative',
    },
    '& tr:not(:last-child) > td': {
      borderBottom: `1px solid ${theme.modalContainerBg}`,
    },
  },
}))

const AddUser: React.FC = () => {
  const {t} = useTranslation(['account-pages'])
  const [emails, onFormEmails] = useFormInput('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [message, setMessage] = React.useState('')
  const team = useSelector(state => state.team.roles)
  const account = useCurrentAccount()
  const {invite} = useActions(teamActions)
  const classes = useStyles()
  const isButtonDisabled = isSubmitting || !emails || !emails.trim().length

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    invite({emails}).then((invited) => {
      // TODO(alvinportillo): Delete this text. It doesn't even render. The promise for inviting
      // a user does not return anything.
      const msg = !invited ? '' : `Invitation${invited.length > 1 ? 's' : ''} sent to ${invited}`
      setIsSubmitting(false)
      setMessage(msg)
    })
  }

  const limitTeamSize = (teamSize: number, acc: IAccount) => {
    const teamSizeLimit = ACCOUNT_TYPE_TO_MAX_TEAM_SIZE[acc?.accountType]
    setIsSubmitting(!!teamSizeLimit &&
    teamSize >= ACCOUNT_TYPE_TO_MAX_TEAM_SIZE[acc.accountType])
  }
  // On render check to see if account has more than 3 or more users.
  React.useEffect(() => {
    limitTeamSize(team.length, account)
  }, [team])

  return (
    <form onSubmit={handleSubmit}>
      <div className={classes.formColumn}>
        <div className={classes.formRow}>
          <div className={classes.emailInput}>
            <StandardTextInput
              height='small'
              id='invite-emails-input'
              placeholder='john@company.com, bob@company.com'
              value={emails}
              onChange={onFormEmails}
            />
          </div>
          <PrimaryButton
            /* eslint-disable-next-line local-rules/ui-component-styling */
            className='offset-shadow'
            height='small'
            disabled={isButtonDisabled}
            type='submit'
          >
            <Icon name='add user' />{t('team_page.invite_form.button.invite')}
          </PrimaryButton>
        </div>
        {message && <StaticBanner type='danger'>{message}</StaticBanner>}
      </div>
    </form>
  )
}

interface ConfirmUserHandleChangeModalProps {
  modalOpen: boolean
  confirmSwitch: () => void
  rejectSwitch: () => void
  newHandle: string
  workspaceName: string
}

const ConfirmUserHandleChangeModal: React.FC<ConfirmUserHandleChangeModalProps> = (
  {modalOpen, confirmSwitch, rejectSwitch, newHandle, workspaceName}
) => {
  const {t} = useTranslation(['account-pages'])
  const classes = useStyles()
  const devPreviewUrl = `${newHandle}-default-${workspaceName}.dev.8thwall.app`
  return modalOpen && (
    // TODO (tri) replace this StandardModal with the new StandardModal component that use floating
    <StandardModal onClose={rejectSwitch} closeOnDimmerClick={false}>
      <div className={classes.confirmUserHandleChangeModal}>
        <h2>{t('team_page.change_handle_modal.title')}</h2>
        <p>
          <Trans
            ns='account-pages'
            i18nKey='team_page.change_handle_modal.url_preview_description'
            values={{newHandle, workspaceName}}
            components={{1: <span className='emphasized' />, 3: <span className='emphasized' />}}
          />
          <ul>
            <li>
              <Trans
                ns='account-pages'
                i18nKey='team_page.change_handle_modal.url_preview_list_item'
                values={{devPreviewUrl}}
                components={{1: <span className='emphasized' />}}
              />
            </li>
          </ul>
          {t('team_page.change_handle_modal.save_work_description')}
          <ul>
            <li>
              <Trans
                ns='account-pages'
                i18nKey='team_page.change_handle_modal.save_work_list_item_1'
                values={{workspaceName}}
                components={{1: <span className='emphasized' />}}
              />
            </li>
            <li>
              <Trans
                ns='account-pages'
                i18nKey='team_page.change_handle_modal.save_work_list_item_2'
                values={{workspaceName}}
                components={{1: <span className='emphasized' />}}
              />
            </li>
          </ul>
        </p>
        <PrimaryButton onClick={confirmSwitch}>
          {t('team_page.change_handle_modal.button.confirm')}
        </PrimaryButton>
        <TertiaryButton
          onClick={rejectSwitch}
        >{t('team_page.change_handle_modal.button.cancel')}
        </TertiaryButton>
      </div>
    </StandardModal>
  )
}

const TeamPage: React.FC = () => {
  const {t} = useTranslation(['account-pages'])
  const classes = useStyles()
  const account = useCurrentAccount()
  const team = Array.from(useSelector(state => state.team.roles)).sort(sortByUser)
  const user = useCurrentUser()
  const leaveTeamPending = useSelector(state => state.team.pending?.leaveTeam)
  const role = account?.Users.find(u => u.UserUuid === user.uuid)?.role
  const userHandle = team.find(member => member.uuid === user.uuid)?.handle

  const {error, updateRole, leaveTeam} = useActions(teamActions)

  const [userHandleInputValue, setUserHandleInputValue] = useState(userHandle)
  const [handleConfirmationModalOpen, setHandleConfirmationModalOpen] = useState(false)
  const [leavingMember, setLeavingMember] = useState(null)

  const onClickLeaveTeamButton = async () => {
    await leaveTeam(leavingMember, account.uuid)
    setLeavingMember(null)
  }

  const onUserHandleUpdateConfirm = async (member: TeamRole) => {
    // TODO(nb): delete all repos from this workspace from indexeddb and delete branches on the
    // server.
    await updateRole(member as any)
    setHandleConfirmationModalOpen(false)
    error('')
  }
  const teamSizeLimit = ACCOUNT_TYPE_TO_MAX_TEAM_SIZE[account.accountType]
  const teamInviteTitle = !teamSizeLimit
    ? t('team_page.invite_form.title.unlimited')
    : t('team_page.invite_form.title.limited', {count: teamSizeLimit - 1})

  const inviteSection = (role === 'OWNER' || role === 'ADMIN') && (
    <div className='withTopMargin'>
      <h2>{teamInviteTitle}</h2>
      <p>{t('team_page.invite_form.subtitle')}</p>
      <AddUser />
    </div>
  )

  // TODO(alvinportillo): Error messages need to be migrated to i18n.
  const onUpdateUserHandleClick = async (member: TeamRole) => {
    if (!member.handle) {
      error('Handle cannot be empty')
      return
    }
    if (!VALID_ACCOUNT_HANDLE_PATTERN.test(member.handle)) {
      error('Handle can only contain numbers (0-9) and lower case letters (a-z).')
      return
    }
    if (team.some(u => u.handle === member.handle)) {
      error(`Handles must be unique. "${member.handle}" is already taken.`)
      return
    }

    // If this is not yet a studio account, we don't need to warn the user about the effect on
    // studio, so just update.
    if (!isEditorEnabled(account)) {
      onUserHandleUpdateConfirm(member)
      return
    }

    // If this is a studio account, it is helpful to give more context about the consequences
    // of changing your handle.
    setHandleConfirmationModalOpen(true)
  }

  return (
    <>
      <WorkspaceCrumbHeading text={t('team_page.heading')} account={account} />
      {!team.length
        ? <Loader size='large' />
        : (
          <div className={classes.teamPage}>
            {inviteSection}
            <ErrorMessage />
            <h2>{t('team_page.member_table.heading')}</h2>
            <div className={classes.teamPageTableContainer}>
              <table className={classes.teamPageTable}>
                <thead>
                  <tr>
                    <th align='left'>
                      {t('team_page.member_table.column_header.name')}
                    </th>
                    <th>&nbsp;</th>
                    <th align='left'>
                      {t('team_page.member_table.column_header.email')}
                    </th>
                    <th align='left'>
                      {t('team_page.member_table.column_header.role')}
                      <RoleInfoPopup
                        trigger={(
                          <Icon
                            name='info circle'
                            color='grey'
                            size='small'
                            style={{marginLeft: '2px'}}
                          />
                        )}
                      />
                    </th>
                    <th align='left'>
                      {t('team_page.member_table.column_header.handle')}
                    </th>
                    <th>&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {team.map(m => (
                    <TeamMember
                      key={m.email}
                      teamRole={m}
                      userHandle={userHandleInputValue}
                      updateUserHandle={setUserHandleInputValue}
                      doUpdateUserHandle={() => onUpdateUserHandleClick(
                        {...m, handle: userHandleInputValue}
                      )}
                      leaveTeam={() => setLeavingMember(m)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      }
      {leavingMember &&
        <LeaveRoleConfirmationModal
          account={account}
          leaveButtonLoading={leaveTeamPending}
          onLeaveButtonClick={onClickLeaveTeamButton}
          onCloseClick={() => setLeavingMember(null)}
        />}
      <ConfirmUserHandleChangeModal
        modalOpen={handleConfirmationModalOpen}
        confirmSwitch={() => onUserHandleUpdateConfirm({
          ...team.find(member => member.uuid === user.uuid),
          handle: userHandleInputValue,
        })}
        rejectSwitch={() => setHandleConfirmationModalOpen(false)}
        newHandle={userHandleInputValue}
        workspaceName={account.shortName}
      />
    </>
  )
}

export default TeamPage
