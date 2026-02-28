import React from 'react'
import {Redirect} from 'react-router-dom'

import {getPathForServiceUnavailablePage} from '../common/paths'
import userActions from './user-actions'
import useActions from '../common/use-actions'
import {useCurrentUser} from './use-current-user'
import {Loader} from '../ui/components/loader'

const SignUpOk = ({children}: {children: React.ReactElement}) => {
  const signUpOk = useCurrentUser(user => user.signUpOk)
  const {checkSignUpOk} = useActions(userActions)

  React.useEffect(() => {
    if (signUpOk === null) {
      checkSignUpOk()
    }
  }, [])

  if (signUpOk === false) {
    return <Redirect to={getPathForServiceUnavailablePage()} />
  } else if (signUpOk === null) {
    return <Loader />
  }

  return children
}

export default SignUpOk
