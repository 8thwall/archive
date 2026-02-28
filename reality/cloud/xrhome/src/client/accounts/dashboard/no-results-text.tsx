import React from 'react'
import {createUseStyles} from 'react-jss'

import {gray4} from '../../static/styles/settings'

const useStyles = createUseStyles({
  noResults: {
    paddingTop: '4rem',
    textAlign: 'center',
    color: gray4,
  },
})

const NoResultsText: React.FC = () => {
  const classes = useStyles()

  return <p className={classes.noResults}>No results found</p>
}

export {
  NoResultsText,
}
