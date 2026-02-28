import React from 'react'

import {createThemedStyles} from '../../ui/theme'

const useStyles = createThemedStyles(theme => ({
  moduleTargetOption: {
    display: 'flex',
    gap: '.75rem',
    whiteSpace: 'pre',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  description: {
    lineHeight: '20px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  time: {
    color: theme.fgMuted,
    fontStyle: 'italic',
  },
  badgeArea: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    alignItems: 'center',
    minWidth: 0,
    flex: '0 1 30rem',
  },
}))

interface IModuleTargetOption {
  selected: boolean
  description: React.ReactNode
  badges?: React.ReactNode
  rightContent?: React.ReactNode
}

const ModuleTargetOption: React.FC<IModuleTargetOption> = ({
  selected, description, badges, rightContent,
}) => {
  const classes = useStyles()
  return (  // TODO(johnny): Replace wrap on badges with [+#more] to keep everything on one line.
    <div className={classes.moduleTargetOption}>
      <div className={classes.badgeArea}>
        <div className={classes.description}>
          {description}
        </div>
        {badges}
      </div>
      {!selected &&
        <div className={classes.time}>
          {rightContent}
        </div>
      }
    </div>
  )
}

export {ModuleTargetOption}
