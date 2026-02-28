import * as React from 'react'
import {Button, List, ListItem} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {connect} from 'react-redux'
import {Link, useParams} from 'react-router-dom'
import {PlayArrow, Pause} from '@material-ui/icons'

import {images} from 'apps/client/internalqa/omniscope/js/omni-image-targets'
import FullscreenContainer
  from 'apps/client/internalqa/omniscope/js/container/widgets/fullscreen-container'

import actions from './view-actions'

// TODO(dat): Consider moving this to a separate file
declare const Omni8 : any
declare const XR8 : any

// Whether to use WebGL 2.
const useWebGl2 = false
// The gl context config. Could pass something like below if you'd like:
const glContextConfig = {antialias: false}

// Tell typescript about XR8
declare global {
  interface Window { XR8: any}
}
window.XR8 = window.XR8 || {}

const useStyles = makeStyles({
  viewMetadata: {
    flex: '1 1 0',
    display: 'flex',
    alignItems: 'center',
  },
  actions: {
    flex: '0 0 auto',
  },
  viewList: {
    flex: '1 1 auto',
    overflow: 'scroll',
  },
  groupName: {
    letterSpacing: '2px',
    textTransform: 'uppercase',
    background: '#369',
    color: '#fff',
    padding: '5px 10px',
    margin: '0 0 10px 0',
    lineHeight: '24px',
    transformOrigin: '0 0',
    transform: 'rotate(90deg)',
    position: 'absolute',
    top: '1em',
    left: '2em',
  },
  innerList: {
    paddingLeft: '0.5em',
  },
})

const displayCanvasSize = {
  width: 240,
  height: 320,
}

const OmniViewer = ({viewNames, currentViewId, viewGroups, currentGroupName, setCurrentViewId,
  setCurrentGroupName, setViews, setViewGroups}) => {
  const classes = useStyles()
  const canvasRef = React.useRef<NonNullable<HTMLCanvasElement>>()

  React.useEffect(() => {
    Omni8.getViewNames().then((omniViewNames) => {
      setViews(omniViewNames)
    })

    Omni8.getViewGroups().then((omniViewGroups) => {
      setViewGroups(omniViewGroups)
    })
  }, [])

  // TODO(dat): Get view name mapping from engine via Omni8
  const [name, setName] = React.useState()

  // TODO(dat): Add back pauseLater feature
  React.useEffect(() => {
    // set up XR8 with Omni8 camera module
    if (!window.XR8) {
      return null
    }

    // set up view port sizing update
    // TODO(dat): Update this via the normal flow in React
    const updateViewLayout = ({displayWidth, displayHeight, name}) => {
      const canvas = canvasRef.current
      const ww = window.innerWidth
      const wh = window.innerHeight

      const dw = displayWidth
      const dh = displayHeight

      const sw = dw / ww
      const sh = dh / wh
      const sl = Math.max(sw, sh)
      const ss = Math.max(Math.floor(1 / sl * window.devicePixelRatio), 1)

      const csw = dw / sl
      const csh = dh / sl
      const cx = (ww - csw) / 2
      const cy = (wh - csh) / 2

      canvas.style.width = `${csw}px`
      canvas.style.height = `${csh}px`
      canvas.style.left = `${cx}px`
      canvas.style.top = `${cy}px`
      displayCanvasSize.width = ss * dw
      displayCanvasSize.height = ss * dh
      canvas.width = displayCanvasSize.width
      canvas.height = displayCanvasSize.height

      // eslint-disable-next-line no-console
      console.log([
        `[omni-viewer] ww: ${ww}, wh: ${wh},`,
        `sw: ${sw}, sh: ${sh}, sl: ${sl}, ss: ${ss},`,
        `csw: ${csw}, csh: ${csh}, cx: ${cx}, cy: ${cy},`,
        `cw: ${canvas.width}, ch: ${canvas.height}, name: ${name}`].join(' '))
      setName(name)
    }

    // set up render function
    let usingWebGl2 = useWebGl2
    let ctx = useWebGl2
      ? canvasRef.current.getContext('webgl2', glContextConfig)
      : canvasRef.current.getContext('webgl', glContextConfig)
    if (!ctx) {
      ctx = canvasRef.current.getContext('webgl', glContextConfig)
      usingWebGl2 = false
    }
    // eslint-disable-next-line no-console
    console.log(`[omni-viewer] useWebGl2 was ${useWebGl2}, resulting usingWebGl2 is ${usingWebGl2}`)
    const renderer = XR8.GlTextureRenderer.create({
      GLctx: ctx,
    })
    const render = renderTexture => renderer.render({
      renderTexture,
      viewport: {offsetX: 0, offsetY: 0, ...displayCanvasSize},
    })

    XR8.addCameraPipelineModules([
      Omni8.omniscopeCoreModule({updateViewLayout, render}),
      {name: 'omniimageloader', onAttach: () => images.forEach(v => Omni8.loadImage(v))},
    ])

    Omni8.initializedPromise.then(() => {
      console.log('[omni-viewer] XR8.run')
      XR8.run({
        canvas: canvasRef.current,
        verbose: true,
        allowedDevices: XR8.XrConfig.device().ANY,
        webgl2: usingWebGl2,
        glContextConfig,
      })
    })

    // Plumb canvas' touch events into omni8
    const handleClickEvent = (e) => {
      // Send touch data to the omniscope backend.
      Omni8.gotTouchCount(e.touches.length)
    }

    function handleVisibilityChange(this: Document, ev: Event): any {
      if (this.visibilityState === 'visible') {
        XR8.resume()
      } else {
        XR8.pause()
      }
    }

    canvasRef.current.addEventListener('touchstart', handleClickEvent, true)
    document.addEventListener('visibilitychange', handleVisibilityChange, false)

    return () => {
      // clean up XR8
      XR8.stop()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [window.XR8])

  const [isPaused, setIsPaused] = React.useState(false)
  const onPauseToggle = () => {
    if (XR8.isPaused()) {
      XR8.resume()
      setIsPaused(false)
    } else {
      XR8.pause()
      setIsPaused(true)
    }
  }

  const goViewId = (groupName, viewId) => () => {
    setCurrentViewId(viewId)
    setCurrentGroupName(groupName)
  }

  React.useEffect(() => {
    // We activate the move after the user has loaded the group names and views from wasm
    if (viewNames.length == 0 || Object.keys(viewGroups).length == 0 ||
      currentViewId === undefined || currentGroupName === undefined) {
      return
    }
    Omni8.goViewId(currentGroupName, Number(currentViewId))
  }, [currentGroupName, currentViewId, viewNames, viewGroups])


  const {viewId, viewGroup} = useParams()
  React.useEffect(() => {
    goViewId(viewGroup || 'Viewer', viewId || 0)()
  }, [viewId, viewGroup])


  return (
    <FullscreenContainer topBar={() => (
      <>
        <div className={classes.viewMetadata}>{name}</div>
        <div className={classes.actions}>
          <Button
            color='secondary'
            variant='contained'
            onClick={onPauseToggle}
          >
            {isPaused ? 'Resume' : 'Pause'}
            {isPaused ? <PlayArrow /> : <Pause />}
          </Button>
        </div>
      </>
    )}
    >
      <canvas ref={canvasRef} id='omnicanvas' />
      <List className={classes.viewList}>
        {Object.keys(viewGroups).map(groupName => (
          <ListItem key={groupName}>
            <span className={classes.groupName}>{groupName}</span>
            <List className={classes.innerList}>
              {viewGroups[groupName].map((viewName, i) => (
                <ListItem
                  key={viewName}
                  onClick={goViewId(groupName, i)}
                  selected={currentGroupName === groupName && currentViewId === i}
                >
                  <Link to={`/viewer/${groupName}/${i}`}>{viewName}</Link>
                </ListItem>
              ))}
            </List>
          </ListItem>
        ))}
      </List>
    </FullscreenContainer>
  )
}

export default connect(state => ({
  currentViewId: state.view.currentViewId,
  currentGroupName: state.view.currentGroupName,
  viewNames: state.view.viewNames,
  viewGroups: state.view.viewGroups,
}), actions)(OmniViewer)
