import React from 'react'

import {hexColorWithAlpha} from '../../shared/colors'
import {createThemedStyles} from '../ui/theme'

const useStyles = createThemedStyles(theme => ({
  outerContainer: {
    color: theme.fgMain,
    zIndex: 4,
    backgroundColor: hexColorWithAlpha(theme.modalBg, 0.2),
    padding: '0.5em',
    borderRadius: '2em',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${theme.subtleBorder}`,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'stretch',
  },
  innerContainer: {
    backgroundColor: theme.bgMain,
    border: `1px solid ${theme.subtleBorder}`,
    padding: '3em 2em',
    borderRadius: '1.5em',
    width: '100%',
    flex: 1,
  },
}))

interface IHeroContainer {
  children: React.ReactNode
}

const HeroContainer: React.FC<IHeroContainer> = ({children}) => {
  const classes = useStyles()

  return (
    <div className={classes.outerContainer}>
      <div className={classes.innerContainer}>
        {children}
      </div>
    </div>
  )
}

export {
  HeroContainer,
}
