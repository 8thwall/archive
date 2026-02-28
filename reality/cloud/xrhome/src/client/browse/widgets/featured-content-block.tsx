import React from 'react'
import {createUseStyles} from 'react-jss'

import {tinyViewOverride} from '../../static/styles/settings'

const useStyles = createUseStyles({
  featuredContentBlock: {
    marginBottom: '4rem',
    userSelect: 'text',
    [tinyViewOverride]: {
      marginBottom: '2.5rem',
    },
  },
})

const FeaturedContentBlock: React.FC<React.PropsWithChildren> = ({children}) => {
  const classes = useStyles()
  return (
    <div className={classes.featuredContentBlock}>
      {children}
    </div>
  )
}

export default FeaturedContentBlock
