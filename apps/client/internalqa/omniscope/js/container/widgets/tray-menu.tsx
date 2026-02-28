/* eslint-disable quote-props, import/no-unresolved */
import * as React from 'react'
import {useRouteMatch, Link} from 'react-router-dom'
import {Button, Drawer, List, ListItem, ListItemIcon} from '@material-ui/core'
import {Menu, Videocam, PlayArrow} from '@material-ui/icons'
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles({
  link: {
    textDecoration: 'none',
    color: '#464766',
  },
})

const OmniscopeTrayMenu = () => {
  const match = useRouteMatch()
  const view = match.path.split('/')[1]
  const [showDrawer, setShowDrawer] = React.useState(false)

  const classes = useStyles()
  return (
    <>
      <Button onClick={() => setShowDrawer(true)}><Menu /></Button>
      <Drawer anchor='left' open={showDrawer} onClose={() => setShowDrawer(false)}>
        <List component='nav' aria-label='navigate between views'>
          <ListItem button selected={view === 'recorder'}>
            <ListItemIcon>
              <Videocam />
            </ListItemIcon>
            <Link
              className={classes.link}
              onClick={() => setShowDrawer(false)}
              to='/recorder'
            >Recorder
            </Link>
          </ListItem>
          <ListItem button selected={view === 'viewer'}>
            <ListItemIcon>
              <PlayArrow />
            </ListItemIcon>
            <Link
              className={classes.link}
              onClick={() => setShowDrawer(false)}
              to='/viewer/'
            >Viewer
            </Link>
          </ListItem>
        </List>
      </Drawer>
    </>
  )
}

export default OmniscopeTrayMenu
