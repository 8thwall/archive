import React from 'react'
import {createUseStyles} from 'react-jss'

const useStyles = createUseStyles({
  mainHeader: {
    fontWeight: 600,
    fontSize: '2.25rem',
    marginTop: '2em',
  },
  secondaryHeader: {
    fontWeight: 400,
    fontSize: '1.75rem',
  },
})

export const MainHeader = ({children}) => {
  const classes = useStyles()
  return (
    <h1 className={classes.mainHeader}>{children}</h1>
  )
}

export const SecondaryHeader = ({children}) => {
  const classes = useStyles()
  return (
    <h2 className={classes.secondaryHeader}>{children}</h2>
  )
}
