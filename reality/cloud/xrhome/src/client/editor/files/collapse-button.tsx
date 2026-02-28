import React from 'react'

import {createUseStyles} from 'react-jss'

import {Icon} from '../../ui/components/icon'
import {combine} from '../../common/styles'

const useStyles = createUseStyles({
  collapseButton: {
    marginLeft: '0.4em',
    padding: '0.5em',
    alignItems: 'center',
    cursor: 'pointer',
  },
  hidden: {
    visibility: 'hidden',
  },
})

interface ICollapseButton {
  onClick: () => void
  showFiles: boolean
  hidden?: boolean
}

const CollapseButton: React.FunctionComponent<ICollapseButton> =
  ({onClick, showFiles, hidden = false}) => {
    const classes = useStyles()
    return (
      <button
        className={combine('style-reset', classes.collapseButton, hidden && classes.hidden)}
        aria-label='Toggle Group'
        type='button'
        onClick={onClick}
      >
        <Icon
          stroke={showFiles ? 'caretDown' : 'caretRight'}
          block
        />
      </button>
    )
  }

export {CollapseButton}
