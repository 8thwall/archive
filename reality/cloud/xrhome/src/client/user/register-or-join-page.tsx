import React from 'react'
import {useLocation} from 'react-router-dom'

const JoinPage = React.lazy(() => import('./invited/join-page'))
const NianticIdRegisterPage = React.lazy(() => import('./sign-up/niantic-id-sign-up-page'))

const RegisterOrJoinPage = () => {
  const location = useLocation()
  const inviteCode = new URLSearchParams(location.search).get('invite')

  const registerPageComponent = <NianticIdRegisterPage />
  const joinPageComponent = <JoinPage />

  return (
    inviteCode ? joinPageComponent : registerPageComponent
  )
}

export default RegisterOrJoinPage
