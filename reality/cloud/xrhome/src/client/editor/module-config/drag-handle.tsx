import React from 'react'
import {SortableHandle} from 'react-sortable-hoc'

import {createThemedStyles} from '../../ui/theme'

const useStyles = createThemedStyles(theme => ({
  gripButton: {
    'position': 'absolute',
    'right': '50%',
    'top': '50%',
    'cursor': 'pointer',
    'border': 0,
    'background': 'transparent',
    'transform': 'translate(-50%, -50%)',
    'padding': '0.5rem 1rem',
    'color': theme.fgMuted,
    '&:hover': {
      color: theme.fgMain,
    },
  },
}))

const DragHandleButton: React.FC = () => {
  const classes = useStyles()
  return (
    <span className={classes.gripButton}>
      <svg
        width='17px'
        height='6px'
        viewBox='0 0 17 6'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          fill='currentColor'
          fillRule='evenodd'
          clipRule='evenodd'
          // eslint-disable-next-line max-len
          d='M16 4H1C0.725 4 0.5 4.225 0.5 4.5V5.5C0.5 5.775 0.725 6 1 6H16C16.275 6 16.5 5.775 16.5 5.5V4.5C16.5 4.225 16.275 4 16 4ZM16 0H1C0.725 0 0.5 0.225 0.5 0.5V1.5C0.5 1.775 0.725 2 1 2H16C16.275 2 16.5 1.775 16.5 1.5V0.5C16.5 0.225 16.275 0 16 0Z'
        />
      </svg>
    </span>
  )
}

const DragHandle = SortableHandle(DragHandleButton)

export {
  DragHandle,
}
