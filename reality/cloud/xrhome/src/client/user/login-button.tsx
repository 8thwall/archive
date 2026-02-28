import React from 'react'
import {createUseStyles} from 'react-jss'

import {SecondaryButton} from '../ui/components/secondary-button'

const useStyles = createUseStyles({
  loginButtonContents: {
    'display': 'flex',
    'flexGrow': 1,
    'justifyContent': 'space-between',
    'gap': '0.5rem',
    'textAlign': 'center',
    'textWrap': 'nowrap',
  },
})

const LoginButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (
  {children, onClick, ...rest}
) => {
  const classes = useStyles()
  return (
    <SecondaryButton
      onClick={onClick}
      {...rest}
    >
      <span className={classes.loginButtonContents}>{children}</span>
    </SecondaryButton>
  )
}

export {
  LoginButton,
}
