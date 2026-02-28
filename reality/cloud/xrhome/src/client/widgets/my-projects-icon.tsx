/* eslint-disable max-len */
import React from 'react'
import {createUseStyles} from 'react-jss'

import {combine} from '../common/styles'

const useStyles = createUseStyles({
  icon: {
    '&.default': {
      width: '1.25em',
      height: '1.25em',
      marginRight: '1em',
      verticalAlign: 'middle',
    },
  },
})

interface IMyProjectsIcon {
  className?: string
}

const FeaturedIcon: React.FC<IMyProjectsIcon> = ({className = 'default'}) => {
  const classes = useStyles()

  return (
    <svg className={combine(className, classes.icon, 'icon')} height='24' width='24' fill='currentColor' xmlns='http://www.w3.org/2000/svg' data-name='Layer 2' viewBox='0 0 24 24' x='0px' y='0px'>
      <path d='M8.99961 0H1.49993C0.675297 0 0 0.673853 0 1.5V22.5C0 23.3232 0.675297 24 1.49993 24H8.99961C9.82424 24 10.4995 23.3232 10.4995 22.5V1.5C10.4995 0.673853 9.82424 0 8.99961 0Z' />
      <path d='M22.5001 0H15.0004C14.1758 0 13.5005 0.673853 13.5005 1.5V9C13.5005 9.8232 14.1758 10.5 15.0004 10.5H22.5001C23.3247 10.5 24 9.8232 24 9V1.5C24 0.673853 23.3247 0 22.5001 0Z' />
      <path d='M22.5001 13.5H15.0004C14.1758 13.5 13.5005 14.1739 13.5005 15V22.5C13.5005 23.3232 14.1758 24 15.0004 24H22.5001C23.3247 24 24 23.3232 24 22.5V15C24 14.1739 23.3247 13.5 22.5001 13.5Z' />
    </svg>

  )
}

export default FeaturedIcon
