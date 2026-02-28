import React from 'react'
import {createUseStyles} from 'react-jss'

import {gray3, gray4} from '../static/styles/settings'
import ProjectModulesIcon from '../apps/widgets/project-modules-icon'

const useStyles = createUseStyles({
  emptyModulesSection: {
    'display': 'block',
    'width': '100%',
    'padding': '3rem 0',
    'textAlign': 'center',
    'marginBottom': '10em',
    '& p': {
      color: gray3,
    },
    '& strong': {
      fontWeight: 'bold',
      color: gray4,
      fontSize: '1.5em',
    },
  },
  moduleIcon: {
    width: '10em',
    opacity: '15%',
    marginBottom: '2em',
  },
})

const ModuleEmptySection: React.FC<React.PropsWithChildren> = ({children}) => {
  const classes = useStyles()
  return (
    <div className={classes.emptyModulesSection}>
      <ProjectModulesIcon className={classes.moduleIcon} />
      <p>
        {children}
      </p>
    </div>
  )
}

export {
  ModuleEmptySection,
}
