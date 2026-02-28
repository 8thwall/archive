import React from 'react'

import {createThemedStyles} from '../ui/theme'

const useStyles = createThemedStyles(theme => ({
  standardModalContent: {
    color: theme.modalFg,
    backgroundColor: theme.modalContentBg,
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    padding: '2rem 1.5rem',
    lineHeight: '1.5rem',
  },
}))

interface IStandardModalContent {
  children: React.ReactNode
}

const StandardModalContent: React.FC<IStandardModalContent> = ({children}) => {
  const classes = useStyles()
  return (
    <div className={classes.standardModalContent}>
      {children}
    </div>
  )
}

export {StandardModalContent}
