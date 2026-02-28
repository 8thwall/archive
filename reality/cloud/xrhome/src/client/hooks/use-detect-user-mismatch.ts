import {useEffect} from 'react'
import {useDispatch} from 'react-redux'

import {addUserLogoutListener, removeUserLogoutListener} from '../user/user-logout-broadcast'

// A user mismatch happens when a user logs out from an active session on
// a separate tab.
const useDetectUserMismatch = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const logoutListener = () => {
      dispatch({type: 'USER_MISMATCH', userMismatch: true})
    }
    addUserLogoutListener(logoutListener)

    return () => {
      removeUserLogoutListener(logoutListener)
    }
  }, [])
}

export {
  useDetectUserMismatch,
}
