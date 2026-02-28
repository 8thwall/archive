import * as React from 'react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import {StandardTextField} from '../ui/components/standard-text-field'
import {PrimaryButton} from '../ui/components/primary-button'
import {brandWhite, gray2, gray3, gray4, gray5, tinyViewOverride} from '../static/styles/settings'
import {Icon} from '../ui/components/icon'
import {LinkButton} from '../ui/components/link-button'
import {hexColorWithAlpha} from '../../shared/colors'
import {PasswordChangeModal} from './password-change-modal'
import {StaticBanner} from '../ui/components/banner'
import {useCurrentUser} from './use-current-user'
import {ProfilePageIconField} from './profile-page-icon-field'
import {ProfilePageEmailField} from './profile-page-email-field'
import useActions from '../common/use-actions'
import userNianticActions from '../user-niantic/user-niantic-actions'
import {COGNITO_AUTH_PROVIDER_ID} from '../../shared/users/users-niantic-constants'
import {userPreferredHandle} from '../../shared/user-handle'

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '30em',
    margin: '0 auto',
    padding: '2em 0',
    gap: '2em',
  },
  border: {
    borderTop: `1px solid ${gray2}`,
  },
  iconContainer: {
    margin: '0 auto',
    gap: '0.5em',
    position: 'relative',
  },
  profileIcon: {
    height: '8em',
    width: '8em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: brandWhite,
    boxShadow: `2px 2px 10px 1px ${hexColorWithAlpha(gray5, 0.1)}`,
    overflow: 'hidden',
  },
  clearPhoto: {
    'height': '1.5em',
    'width': '1.5em',
    'background': gray3,
    'borderRadius': '50%',
    'display': 'flex',
    'alignItems': 'flex-end',
    'justifyContent': 'flex-end',
    'position': 'absolute',
    'top': '0.5em',
    'right': '0.5em',
    '& svg': {
      position: 'absolute',
      left: '0.45em',
      top: '0.4em',
    },
  },
  noPhoto: {
    color: gray4,
    textAlign: 'center',
    fontSize: '1.5em',
    fontWeight: 500,
    overflowWrap: 'break-word',
  },
  nameContainer: {
    display: 'flex',
    gap: '1em',
    [tinyViewOverride]: {
      flexDirection: 'column',
      gap: '2em',
    },
  },
  inputContainer: {
    flex: 1,
  },
  passwordContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1em',
  },
  changePasswordBtn: {
    display: 'flex',
    gap: '0.5em',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  nianticProfile: {
    maxWidth: '12em',
    margin: '2em auto',
  },
})

interface IProfilePageForm {
  givenName: string
  familyName: string
  handle: string
  profileIcon: string
  profileIconFile: File
}

const getInitialFormState = (user): IProfilePageForm => (
  {
    givenName: user.givenName,
    familyName: user.familyName,
    handle: userPreferredHandle(user),
    profileIcon: user.profileIcon,
    profileIconFile: undefined,
  }
)

const ProfilePageUserForm: React.FC = () => {
  const {t} = useTranslation(['user-profile-page', 'common'])
  const user = useCurrentUser().loggedInUser
  const {logins} = user
  const cognitoLogin = logins?.find(login => login.provider === COGNITO_AUTH_PROVIDER_ID)
  const [initialFormState, setInitialFormState] = React.useState(getInitialFormState(user))
  const [formState, setFormState] = React.useState(initialFormState)
  const classes = useStyles()
  const profileLoading = useCurrentUser(u => u.pending?.patchUser)
  const [passwordModalOpen, setPasswordModalOpen] = React.useState(false)
  const [error, setError] = React.useState<string>(null)
  const [passwordChanged, setPasswordChanged] = React.useState(false)
  const {patchUser} = useActions(userNianticActions)

  const onTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {id, value} = e.target
    // Replace newline/return(s) with one single space
    const noNewLineValue = value.replace(/[\r\n]+/g, ' ')
    const newState = {...formState}
    newState[id] = noNewLineValue
    setFormState(newState)
  }

  const pwFields = ['old_password', 'new_password', 'pwconf']

  // get the changed non-password fields with exclusions
  const getChangedFieldsExcluding = (
    excludeKeys: string[] = []
  ): Partial<IProfilePageForm> => Object.keys(formState)
    .filter(key => pwFields.indexOf(key) < 0)
    .filter(key => !excludeKeys.includes(key))
    .filter(key => formState[key] !== initialFormState[key])
    .reduce((o, v) => {
      o[v] = formState[v]
      return o
    }, {})

  const isFormDisabled = !Object.keys(getChangedFieldsExcluding(['profileIconFile'])).length

  const handleSubmit = async () => {
    setError(null)

    const change = getChangedFieldsExcluding(['profileIcon'])
    const newHandle = change.handle

    if (newHandle) {
      if (!/^[a-z0-9]+$/.test(newHandle)) {
        setError('user_profile_page.error.handle_only_contains_numbers_lowercase')
        return
      }
    }

    const succeeded = await patchUser(change)
    if (succeeded) {
      setInitialFormState(formState)
    }
  }

  const handlePasswordChangeSuccess = () => {
    setPasswordChanged(true)
  }

  const onIconChange = (
    profileIcon: string,
    profileIconFile: File
  ) => {
    const newState = {...formState, profileIcon, profileIconFile}
    setFormState(newState)
  }

  return (
    <div className={classes.container}>
      {error &&
        <StaticBanner type='danger'>{t(error)}</StaticBanner>
      }
      <ProfilePageIconField
        user={user}
        onIconChange={onIconChange}
        currentIcon={formState.profileIcon}
      />
      <div className={classes.nameContainer}>
        <div className={classes.inputContainer}>
          <StandardTextField
            id='givenName'
            label={<b>{t('user_profile_page.label.first_name')}</b>}
            value={formState.givenName}
            onChange={onTextFieldChange}
          />
        </div>
        <div className={classes.inputContainer}>
          <StandardTextField
            id='familyName'
            label={<b>{t('user_profile_page.label.last_name')}</b>}
            value={formState.familyName}
            onChange={onTextFieldChange}
          />
        </div>
      </div>
      <div>
        <StandardTextField
          id='handle'
          label={<b>{t('user_profile_page.label.preferred_handle')}</b>}
          value={formState.handle}
          onChange={onTextFieldChange}
        />
      </div>
      <PrimaryButton
        type='submit'
        spacing='full'
        disabled={isFormDisabled}
        onClick={handleSubmit}
        loading={profileLoading}
      >
        {t('button.update', {ns: 'common'})}
      </PrimaryButton>
      <ProfilePageEmailField />
      {cognitoLogin &&
        <div className={classes.passwordContainer}>
          <div className={classes.changePasswordBtn}>
            <Icon color='purple' stroke='lock' />
            <LinkButton
              onClick={() => setPasswordModalOpen(true)}
            >
              {t('user_profile_page.button.change_your_password')}
            </LinkButton>
          </div>
          {passwordChanged &&
            <StaticBanner type='info'>
              {t('user_profile_page.message.password_successfully_changed')}
            </StaticBanner>
          }
        </div>
      }
      {cognitoLogin &&
        <PasswordChangeModal
          email={cognitoLogin.email}
          open={passwordModalOpen}
          handleClose={() => setPasswordModalOpen(false)}
          handlePasswordChangeSuccess={handlePasswordChangeSuccess}
        />
      }
    </div>
  )
}

export {ProfilePageUserForm}
