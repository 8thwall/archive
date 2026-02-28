import React from 'react'
import {Redirect} from 'react-router-dom'

import {Loader} from '../ui/components/loader'
import userActions from './user-actions'
import useActions from '../common/use-actions'
import {useUserHasSession} from './use-current-user'

const LogoutPage: React.FC<{}> = () => {
  const isLoggedIn = useUserHasSession()
  const {signOut} = useActions(userActions)

  React.useEffect(() => {
    if (isLoggedIn) {
      signOut()
    }
  }, [isLoggedIn])

  if (!isLoggedIn) {
    return (
      <Redirect to='/' />
    )
  }

  return (
    <Loader />
  )
}

export default LogoutPage
