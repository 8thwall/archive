import {createUseStyles} from 'react-jss'
import {Modal, Button} from 'semantic-ui-react'
import * as React from 'react'

import {useDetectUserMismatch} from '../hooks/use-detect-user-mismatch'
import {useCurrentUser} from '../user/use-current-user'

const useStyles = createUseStyles({
  modal: {
    padding: '2em',
  },
})

const LoggedOutMessage = () => {
  useDetectUserMismatch()
  const styles = useStyles()
  const showMsg = useCurrentUser(user => user.userMismatch)

  if (!showMsg) {
    return null
  }
  return (
    <Modal open className={styles.modal}>
      <h1>You have been logged out</h1>
      <p>Refresh the page to continue.</p>
      <Button
        className='ui button primary offset-shadow'
        a8='click;logged-out-refresh'
        onClick={() => window.location.reload()}
      >
        Refresh
      </Button>
    </Modal>
  )
}

export {
  LoggedOutMessage,
}
