import React from 'react'
import {Icon, SemanticICONS as IconName} from 'semantic-ui-react'

import {combine} from '../../common/styles'
import {createThemedStyles} from '../../ui/theme'

const useStyles = createThemedStyles(theme => ({
  toolbarLabel: {
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: '1px',
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'no-wrap',
    width: '1px',
  },
  toolbarButton: {
    'borderRadius': '0.25em',
    'margin': '0.25em',
    'width': '2em',
    'height': '2em',
    'color': theme.toolbarBtnColor,
    'textAlign': 'center',
    '&:not([disabled])': {
      'cursor': 'pointer',
    },
    '&:hover:not([disabled])': {
      background: theme.toolbarBtnHoverBg,
    },
    '&:active:not([disabled])': {
      background: theme.toolbarBtnBgActive,
    },
    '&:focus': {
      'boxShadow': theme.toolbarBtnFocusShadow,
      '&:not(:focus-visible)': {
        boxShadow: 'none',
      },
    },
    '&[disabled]': {
      color: theme.toolbarBtnDisabledColor,
    },
  },
}))

interface IToolbarToggleButton {
  text: string
  onClick: () => void
  icon: IconName
  disabled?: boolean
}

// TODO (tri) combine this with showcase-description-editor toggle button
const ToolbarToggleButton: React.FC<IToolbarToggleButton> = ({text, onClick, icon, disabled}) => {
  const classes = useStyles()

  return (
    <button
      type='button'
      onClick={onClick}
      className={combine('style-reset', classes.toolbarButton)}
      title={text}
      disabled={disabled}
    >
      <span className={classes.toolbarLabel}>{text}</span>
      <Icon name={icon} fitted />
    </button>
  )
}

export {ToolbarToggleButton}

export type {IToolbarToggleButton}
