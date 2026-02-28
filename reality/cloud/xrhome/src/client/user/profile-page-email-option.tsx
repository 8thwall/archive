import React from 'react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import {combine} from '../common/styles'
import {
  brandBlack, brandPurple, brandWhite, gray1, gray2, gray3, gray5, mobileViewOverride, moonlight,
} from '../static/styles/settings'
import type {UserLogin} from '../../shared/users/users-niantic-types'
import {
  APPLE_AUTH_PROVIDER_ID,
  COGNITO_AUTH_PROVIDER_ID,
} from '../../shared/users/users-niantic-constants'
import {useSelector} from '../hooks'
import {Popup} from '../ui/components/popup'
import {ProfilePageCognitoInput} from './profile-page-cognito-input'

const useStyles = createUseStyles({
  emailSelectContainer: {
    display: 'flex',
    background: brandWhite,
    border: `1px solid ${gray2}`,
    borderRadius: '0.25em',
    color: gray3,
    position: 'relative',
    alignItems: 'stretch',
  },
  emailHandle: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    padding: '0.5em 0 0.5em 1em',
  },
  emailDomain: {
    whiteSpace: 'nowrap',
    flex: 1,
    padding: '0.5em 0.5em 0.5em 0',
  },
  emailManageText: {
    color: gray3,
    padding: '0.5em 1em 0.5em 0',
    fontSize: '0.825em',
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
  },
  emailRadioInput: {
    opacity: 0,
    height: 0,
    width: 0,
    position: 'absolute',
  },
  radioContainer: {
    borderLeft: `1px solid ${gray2}`,
    padding: '0.5em',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    height: '100%',
  },
  disabledRadioContainer: {
    background: moonlight,
  },
  radio: {
    height: '16px',
    width: '16px',
    borderRadius: '50%',
    border: `1px solid ${gray3}`,
  },
  selected: {
    border: `1px solid ${gray5}`,
    boxShadow: `inset 0 0 0 0.325em ${gray5}`,
  },
  disabledRadio: {
    border: `1px solid ${gray1}`,
  },
  popover: {
    'display': 'none',
    'position': 'absolute',
    'color': brandWhite,
    'background': brandBlack,
    'maxWidth': '20em',
    'padding': '1em',
    'borderRadius': '0.25em',
    'right': '-70%',
    'top': '-25%',
    'zIndex': 10,
    '&:before': {
      content: '""',
      width: 0,
      height: 0,
      position: 'absolute',
      border: '0.75em solid transparent',
      borderLeft: '0',
      borderRightColor: brandBlack,
      left: '-0.75em',
      top: '20%',
    },
    [mobileViewOverride]: {
      'top': '140%',
      'right': 0,
      '&:before': {
        border: '0.75em solid transparent',
        borderBottomColor: brandBlack,
        borderTop: '0',
        top: '-0.75em',
        marginLeft: '50%',
      },
    },
  },
  editButton: {
    color: brandPurple,
    border: 'none',
    background: 'transparent',
    fontWeight: 600,
    marginRight: '0.75em',
    cursor: 'pointer',
  },
})

interface IProfilePageEmailOption {
  login: UserLogin
  isSelected: boolean
  onChange: () => void
  disabled?: boolean
  isSingleOption?: boolean
}

const ProfilePageEmailOption: React.FC<IProfilePageEmailOption> = ({
  login, isSelected, onChange, disabled, isSingleOption,
}) => {
  const classes = useStyles()
  const {t} = useTranslation(['user-profile-page', 'common'])
  const isCognito = login.provider === COGNITO_AUTH_PROVIDER_ID
  const isSmallScreen = useSelector(state => state.common.isSmallScreen)
  const [isEditing, setEditing] = React.useState(false)
  const emailHandleIndex = login.email.indexOf('@')

  const radioButton = (
    <Popup
      content={
        login.provider === APPLE_AUTH_PROVIDER_ID
          ? t('connected_account_settings.popover.disabled_apple_login')
          : t('profile_page_email_option.popup.already_selected_email')
      }
      popupDisabled={!disabled}
      position={isSmallScreen ? 'top' : 'right'}
      alignment='right'
    >
      <label
        className={combine(classes.radioContainer, disabled && classes.disabledRadioContainer)}
        htmlFor={login.provider}
      >
        <input
          type='radio'
          name={t('user_profile_page.label.email')}
          id={login.provider}
          checked={isSelected && !disabled}
          className={classes.emailRadioInput}
          onChange={disabled ? undefined : onChange}
          readOnly={disabled}
        />
        <span
          className={combine(
            classes.radio,
            isSelected && !disabled && classes.selected,
            disabled && classes.disabledRadio
          )}
        />
      </label>
    </Popup>
  )

  const displayButtonContent = (
    <div className={classes.emailSelectContainer}>
      <div className={classes.emailHandle}>{login.email.slice(0, emailHandleIndex)}</div>
      <div className={classes.emailDomain}>{login.email.slice(emailHandleIndex)}</div>
      {!!login.provider && login.provider !== COGNITO_AUTH_PROVIDER_ID &&
        <div className={classes.emailManageText}>
          {t(`profile_page_email_option.managed_by_${login.provider}`)}
        </div>
      }
      {isCognito &&
        <button
          type='button'
          className={classes.editButton}
          onClick={() => setEditing(true)}
        >
          {t('button.edit', {ns: 'common'})}
        </button>
      }
      {!isSingleOption && radioButton}
    </div>
  )

  return (
    <>
      {!isEditing && displayButtonContent}
      {isEditing &&
        <ProfilePageCognitoInput
          email={login.email}
          onClose={() => setEditing(false)}
        />
      }
    </>
  )
}

export {ProfilePageEmailOption}
