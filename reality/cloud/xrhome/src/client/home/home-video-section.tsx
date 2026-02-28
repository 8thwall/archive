import React from 'react'

import {createThemedStyles} from '../ui/theme'
import sizzleReelVideo from '../static/video/ftue_world_effects.mp4'  // TODO(kim): Replace!
import {hexColorWithAlpha} from '../../shared/colors'

const useStyles = createThemedStyles(theme => ({
  videoSection: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '1600px',
    zIndex: 9,
    border: `1px solid ${hexColorWithAlpha(theme.fgMain, 0.2)}`,
    backgroundColor: hexColorWithAlpha(theme.fgMain, 0.05),
    borderRadius: '20px 20px 0 0',
    padding: '1em 1em 3em 1em',
    mask: 'linear-gradient(to bottom, #fff 90%, transparent)',
    boxShadow: `0 0 15px 0 ${hexColorWithAlpha(theme.fgMain, 0.25)}`,
    marginBottom: '2em',
    backdropFilter: 'blur(50px)',
  },
  video: {
    borderRadius: '20px 20px 0 0',
    mask: 'linear-gradient(to bottom, #fff 40%, transparent)',
  },
}))

const HomeVideoSection: React.FC = () => {
  const classes = useStyles()

  return (
    <div className={classes.videoSection}>
      <video loop autoPlay muted playsInline className={classes.video} src={sizzleReelVideo} />
    </div>
  )
}

export {HomeVideoSection}
