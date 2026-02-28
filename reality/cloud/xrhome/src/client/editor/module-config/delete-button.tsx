import React from 'react'

import {combine} from '../../common/styles'

import {createThemedStyles} from '../../ui/theme'

const useStyles = createThemedStyles(theme => ({
  deleteButton: {
    'color': theme.fgMuted,
    'cursor': 'pointer',
    'border': 0,
    'background': 'transparent',
    '&:hover': {
      color: theme.fgMain,
    },
  },
}))

interface IDeleteButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type?: 'button' | 'submit' | 'reset'
}

const DeleteButton: React.FC<IDeleteButton> = ({id, type, className, onClick, ...rest}) => {
  const classes = useStyles()
  return (
    <button
      {...rest}
      id={id}
      // eslint-disable-next-line react/button-has-type
      type={type || 'button'}
      onClick={onClick}
      className={combine(className, classes.deleteButton)}
    >
      <svg
        width='16px'
        height='16px'
        viewBox='0 0 16 16'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          fill='currentColor'
          fillRule='evenodd'
          clipRule='evenodd'
          // eslint-disable-next-line max-len
          d='M13.5 2.5H10.9247L9.86219 0.728126C9.59095 0.276173 9.10241 -0.000250504 8.57531 1.70348e-07H5.42469C4.89782 -3.09035e-05 4.40956 0.276365 4.13844 0.728126L3.07531 2.5H0.5C0.223858 2.5 0 2.72386 0 3V3.5C0 3.77614 0.223858 4 0.5 4H1V14.5C1 15.3284 1.67157 16 2.5 16H11.5C12.3284 16 13 15.3284 13 14.5V4H13.5C13.7761 4 14 3.77614 14 3.5V3C14 2.72386 13.7761 2.5 13.5 2.5ZM8.375 13H9.125C9.33211 13 9.5 12.8321 9.5 12.625V5.875C9.5 5.66789 9.33211 5.5 9.125 5.5H8.375C8.16789 5.5 8 5.66789 8 5.875V12.625C8 12.8321 8.16789 13 8.375 13ZM5.53125 1.5C5.46524 1.49982 5.404 1.53435 5.37 1.59094L4.82469 2.5H9.17531L8.62969 1.59094C8.59575 1.53445 8.53465 1.49993 8.46875 1.5H5.53125ZM11.5 14.5H2.5V4H11.5V14.5ZM5.625 13H4.875C4.66789 13 4.5 12.8321 4.5 12.625V5.875C4.5 5.66789 4.66789 5.5 4.875 5.5H5.625C5.83211 5.5 6 5.66789 6 5.875V12.625C6 12.8321 5.83211 13 5.625 13Z'
        />
      </svg>
    </button>
  )
}

export {
  DeleteButton,
}
