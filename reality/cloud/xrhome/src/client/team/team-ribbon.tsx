import React from 'react'

import {combine} from '../common/styles'
import {createThemedStyles} from '../ui/theme'
import {hexColorWithAlpha} from '../../shared/colors'
import {brandWhite} from '../static/styles/settings'

const useStyles = createThemedStyles(theme => ({
  label: {
    display: 'inline-block',
    minWidth: 'max-content',
    name: 'light',
    borderRadius: '4px 0 0 4px',
    padding: '7px 17px 7px 17px',
    // Colors
    color: brandWhite,
    background: theme.teamRibbonBg,
    // Positioning
    position: 'absolute',
    top: '50%',
    right: '-17px',
    transform: 'translateY(-50%)',
  },
  content: {
    '&::after': {
      position: 'absolute',
      top: '100%',
      content: '""',
      left: 'auto',
      right: 0,
      borderStyle: 'solid',
      borderWidth: '1.2em 1.2em 0 0',
      borderColor: 'transparent',
      borderTopColor: hexColorWithAlpha(theme.teamRibbonBg, 0.5),
    },
  },
}))

interface Ribbon {
  className?: string
  children?: React.ReactNode
}

const TeamRibbon: React.FC<Ribbon> = ({
  className,
  children,
}) => {
  const classes = useStyles()
  return (
    <div className={combine(classes.label, className)}>
      <div className={classes.content}>
        {children}
      </div>
    </div>
  )
}

export {TeamRibbon}
