import React from 'react'
import {Trans, useTranslation} from 'react-i18next'
import type {TFunction} from 'i18next'
import {useDispatch} from 'react-redux'

import {useCurrentUser} from '../user/use-current-user'
import {
  ACTION_NAMESPACE_MAP, ActionTypes, ERROR_TYPE_MAP,
} from '../user-niantic/user-niantic-errors'
import {StandardLink} from '../ui/components/standard-link'
import {StaticBanner} from '../ui/components/banner'
import {getPathForLoginPage, getPathForSignUp, SignUpPathEnum} from '../common/paths'
import {acknowledgeError} from '../user-niantic/user-niantic-action-types'

const getErrorMessage = (t: TFunction, errorCode: string) => (
  <div>
    <Trans
      t={t}
      i18nKey={errorCode}
      components={{
        signUpLink: (
          <StandardLink bold color={null} to={getPathForSignUp(SignUpPathEnum.step1Register)} />
        ),
        loginLink: (
          <StandardLink
            bold
            underline
            color={null}
            to={getPathForLoginPage()}
          />
        ),
      }}
    />
  </div>
)

interface IUserErrorMessage {
  action: ActionTypes
}

const UserErrorMessage: React.FC<IUserErrorMessage> = ({action}) => {
  const {t} = useTranslation(ACTION_NAMESPACE_MAP[action])
  const dispatch = useDispatch()
  const errorCode = useCurrentUser(user => user.error[action])

  React.useEffect(() => {
    dispatch(acknowledgeError(action))
  }, [])

  if (!errorCode) {
    return null
  }

  return (
    <StaticBanner type={ERROR_TYPE_MAP[errorCode] || 'danger'}>
      {getErrorMessage(t, errorCode)}
    </StaticBanner>
  )
}

export {
  UserErrorMessage,
}
