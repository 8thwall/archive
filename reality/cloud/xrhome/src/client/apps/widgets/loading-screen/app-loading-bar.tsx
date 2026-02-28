import React from 'react'

import type {IG8GitProgressLoad} from '../../../git/g8-dto'
import {gitLoadProgress} from '../../../editor/git-load-progress'
import {createThemedStyles} from '../../../ui/theme'
import {tinyViewOverride} from '../../../static/styles/settings'

const useStyles = createThemedStyles(theme => ({
  appLoadingBar: {
    width: '100%',
    height: '1.67em',
    backgroundColor: theme.tooltipBg,
    borderRadius: '12px',
    border: theme.studioSectionBorder,
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '-3px 3px 20px 0px rgba(0, 0, 0, 0.80) inset',
  },
  appLoadingBarProgress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    transition: 'width 0.5s ease-in-out',
    borderRadius: '12px',
    padding: '0 0.5em',
    background: 'linear-gradient(90deg, #5C0D8F 0.46%, #FF4713 55.21%, #FFBF00 100.01%)',
    boxShadow: (
      '0px -15px 8px 0px rgba(0, 0, 0, 0.25) inset,' +
      ' 0px 5px 8px 0px rgba(255, 255, 255, 0.50) inset'
    ),
    fontWeight: 800,
    [tinyViewOverride]: {
      padding: '0 0.2em',
    },
  },
}))

interface IAppLoadingBar {
  progress: IG8GitProgressLoad
}

const AppLoadingBar: React.FC<IAppLoadingBar> = ({progress = 'UNSPECIFIED'}) => {
  const classes = useStyles()
  const {progress: progressValue} = gitLoadProgress[progress]
  const progressValuePercent = `${progressValue * 100}%`

  return (
    <div className={classes.appLoadingBar}>
      <div
        className={classes.appLoadingBarProgress}
        style={{width: progressValuePercent}}
      >{progressValuePercent}
      </div>
    </div>
  )
}

export {
  AppLoadingBar,
}
