import * as React from 'react'

import CheckedIcon from '../static/verifiedBadge.png'
import {createCustomUseStyles} from '../common/create-custom-use-styles'

const useStyles = createCustomUseStyles<{height: number}>()({
  accountBadge: ({height}) => ({
    height: `${height}em`,
    position: 'relative',
    top: '0.1em',
  }),
})

const CheckedCertificateIcon = ({height = 0.8}) => {
  const classes = useStyles({height})

  return (
    <img className={classes.accountBadge} src={CheckedIcon} alt='8th Wall Partner' />
  )
}

export {
  CheckedCertificateIcon,
}
