import {Page} from '../lib/material-ui-components'
import {path} from '../lib/routes'
import {roomState, maybeCreateRoom} from '../scripts/create-room'

// For AFrame initialization
import {configTargetsComponent, imageTargetPortalComponent} from '../components/image-target-portal'
import {responsiveImmersiveComponent} from '../components/responsive-immersive'
import {characterInputComponent, characterAnimationComponent} from '../components/character-movement'
import {myHiderMaterialComponent} from '../components/hider-material'
import {resetButtonComponent} from '../components/reset-character'
import {randomColor} from '../components/random-color'

declare let MaterialUI: any
declare let AFRAME: any
declare let React: any
declare let ReactRouterDOM: any
declare let NAF: any
// Import from unpkg, see head.html
declare let QRCode: any

const {Link, useLocation} = ReactRouterDOM

const {makeStyles, Button} = MaterialUI

let aframeInitialized = false
const initializeAframe = () => {
  if (aframeInitialized) {
    return
  }

  AFRAME.registerComponent('image-target-portal', imageTargetPortalComponent())
  AFRAME.registerComponent('config-targets', configTargetsComponent)

  AFRAME.registerComponent('responsive-immersive', responsiveImmersiveComponent)

  AFRAME.registerComponent('character-input', characterInputComponent)
  AFRAME.registerComponent('character-animation', characterAnimationComponent)

  AFRAME.registerComponent('my-hider-material', myHiderMaterialComponent)

  AFRAME.registerComponent('reset-button', resetButtonComponent)

  AFRAME.registerComponent('random-color', randomColor)

  // we only want to register components and primitives for aframe once
  aframeInitialized = true
}

// Call this only after <a-scene> is defined.
const addNAFSchemas = () => {
  NAF.schemas.add({
    template: '#avatar-template',
    components: [
      'position',
      'rotation',
      'random-color',
    ],
  })

  NAF.schemas.add({
    template: '#portal-template',
    components: [
      // We don't want to sync the position and rotation of portal-template. The portal template is
      // used to translate the robot positions to where the image target is in the world.
      // Position and rotation are added by default if we don't include a template, but since
      // we don't include position and rotation in this custom template, they are not synced.
      // 'position',
      // 'rotation',
      'unused',  // We have to include a field here otherwise NAF will give us an undefined error.
    ],
  })

  NAF.schemas.add({
    template: '#offset-template',
    components: [
      // 'position',
      // 'rotation',
      'unused',
    ],
  })
}

const useStyles = makeStyles(theme => ({
  instructions: {
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Nunito, monospace',
    textShadow: '0px 0px 5px rgba(0,0,0,0.5)',
    zIndex: 10,
    position: 'absolute',
    bottom: '0vh',
    left: '50%',
    transform: 'translate(-50%, 0)',
  },
  infoBar: {
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Nunito, monospace',
    textShadow: '0px 0px 5px rgba(0,0,0,0.5)',
    zIndex: 10,
    position: 'absolute',
    top: '0vh',
    left: '50%',
    transform: 'translate(-50%, 0)',
  },
  inviteShare: {
    'textAlign': 'center',
    'color': 'white',
    'background': '#464647',
    'fontFamily': 'Nunito, monospace',
    'textShadow': '0px 0px 5px rgba(0,0,0,0.5)',
    'zIndex': 10,
    'position': 'absolute',
    'top': '50%',
    'left': '50%',
    'transform': 'translate(-50%, -50%)',
    'borderRadius': '0.5em',
    'padding': '1em 1.5em',
    '& div + div': {
      margin: '1em 0',
    },
  },
  shareUrl: {
    maxWidth: '30em',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverlow: 'ellipsis',
  },
}))

const ArExperience = ({}) => {
  const classes = useStyles()
  const location = useLocation()
  const [showInviteShare, setShowInviteShare] = React.useState(false)
  const [gameId, setGameId] = React.useState(null)
  const [playerId, setPlayerId] = React.useState(null)
  const [roomId, setRoomId] = React.useState(null)
  const [connectedClients, setConnectedClients] = React.useState([])

  // Setting up and cleaning A-Frame related things
  React.useEffect(() => {
    // Create the room if we are not joining a room from a url param.
    maybeCreateRoom().then(roomId_ => setRoomId(roomId_))

    // register our aframe components and primitives
    initializeAframe()
    NAF.connection.onConnect(() => {
      setPlayerId(NAF.clientId)
      setGameId(NAF.room)

      // Initial state of the room with peers already in the room.
      setConnectedClients(Object.keys(NAF.connection.connectedClients))
      // Add peer event listeners
      document.body.addEventListener('clientConnected', (evt: any) => {
        setConnectedClients(Object.keys(NAF.connection.connectedClients))
      })
      document.body.addEventListener('clientDisconnected', (evt: any) => {
        setConnectedClients(Object.keys(NAF.connection.connectedClients))
      })
    })

    // Keep the scene containing only A-Frame DOM
    const sceneHtml = require('./ar-experience.html')
    const html = document.getElementsByTagName('html')[0]
    const origHtmlClass = html.className
    document.body.insertAdjacentHTML('beforeend', sceneHtml)

    addNAFSchemas()

    return () => {
      // Remove the a-scene
      const ascene = document.getElementsByTagName('a-scene')[0]
      ascene.parentNode.removeChild(ascene)
      html.className = origHtmlClass
    }
  }, [])

  const shareUrl = roomId ? window.location.href : null
  const [qrCodeDataUrl, setQrCodeDataUrl] = React.useState('')
  const toggleInviteShare = () => {
    if (!showInviteShare && shareUrl) {
      QRCode.toDataURL(shareUrl).then(dataUrl => setQrCodeDataUrl(dataUrl))
    }
    setShowInviteShare(!showInviteShare)
  }

  let shareButtonMessage = ''
  if (!roomId) {
    shareButtonMessage = 'Waiting for room to be created'
  } else if (showInviteShare) {
    shareButtonMessage = 'Cancel Share'
  } else {
    shareButtonMessage = 'Share Link'
  }

  return (
    <Page className={`centered ${classes.page}`} title='Multiplayer with 8th Wall' top={true}>
      <div id='overlay'></div>
      <div className={classes.infoBar}>
        {gameId && <div>Game ID: {gameId}</div>}
        {playerId && <div>Player ID: {playerId}</div>}
        {<div>Connected Clients: {`(${connectedClients.length})`} {`[${connectedClients.join(', ')}]`}</div>}
      </div>
      <div className={classes.instructions}>
        <h3>DRAG TO MOVE</h3>
        <Button variant='contained'
          disabled={!roomId}  // If we don't have the roomId yet then we can't allow the user to share a link to join a room
          onClick={toggleInviteShare} className={`${classes.button} ${classes.primary}`}
          color={showInviteShare ? 'primary' : 'secondary'}>
          {shareButtonMessage}
        </Button>
        <Button component={Link} to={path(location, '..')} className={`${classes.button}}`}>
          New Game
        </Button>
      </div>
      {showInviteShare &&
        <div className={classes.inviteShare}>
          <div>Show QR code to a friend or Copy Shareable Link</div>
          <div><img src={qrCodeDataUrl} /></div>
          <div>
            <div className={classes.shareUrl}>{shareUrl}</div>
            <Button variant='contained' color='secondary'
              onClick={() => navigator.clipboard?.writeText(shareUrl)}>Copy Shareable Link</Button>
          </div>
        </div>
      }
      <div id='recenterButtonContainer'>
        <img src={require('../assets/images/recenter.png')} />
      </div>
    </Page>
  )
}

export {ArExperience}
