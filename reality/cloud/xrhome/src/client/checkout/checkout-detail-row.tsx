import React from 'react'
import {createUseStyles} from 'react-jss'

import {brandPurple, gray4} from '../static/styles/settings'

const useStyles = createUseStyles({
  detailsRow: {
    display: 'flex',
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: '0.3em',
    fontWeight: '600',
    fontStyle: 'italic',
    color: gray4,
    fontSize: '1.16em',
  },
  detailsValue: {
    color: brandPurple,
  },
})

interface ICheckoutDetailsRowProps {
  label: string
  value: string
}
const CheckoutDetailsRow: React.FC<ICheckoutDetailsRowProps> = ({label, value}) => {
  const classes = useStyles()
  return (
    <div className={classes.detailsRow}>
      <div>{label}</div>
      <div className={classes.detailsValue}>{value}</div>
    </div>
  )
}

export default CheckoutDetailsRow
