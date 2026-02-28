import * as React from 'react'

import {makeStyles} from '@material-ui/core/styles'

import OmniscopeTrayMenu from 'apps/client/internalqa/omniscope/js/container/widgets/tray-menu'

const useStyles = makeStyles({
  hud: {
    position: 'relative',
    width: '100%',
    top: 0,
    left: 0,
  },
  menu: {
    display: 'flex',
    flexDirection: 'row',
  },
  fullScreen: {
    display: 'flex',
    height: 'calc(100vh - 3em)', // so address bar doesn't put the last element below visible
    flexDirection: 'column',
  },
})

interface IFullscreenContainer {
  topBar(): void | React.ReactNode
}

const FullscreenContainer : React.FunctionComponent<IFullscreenContainer> = ({
  topBar, children,
}) => {
  const classes = useStyles()
  return (
    <div className={classes.fullScreen}>
      <div className={classes.hud}>
        <div className={classes.menu}>
          <OmniscopeTrayMenu />
          {topBar()}
        </div>
      </div>
      {children}
    </div>
  )
}

export default FullscreenContainer
