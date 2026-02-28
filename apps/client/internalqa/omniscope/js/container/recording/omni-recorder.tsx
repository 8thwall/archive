import React from 'react'
import {connect} from 'react-redux'
import {makeStyles} from '@material-ui/core/styles'
import {Button, CircularProgress, Switch} from '@material-ui/core'
import {Add, FiberManualRecord, Pause} from '@material-ui/icons'

import actions, {getRecorder, RecordingActions} from
  'apps/client/internalqa/omniscope/js/container/recording/recording-actions'

import FullscreenContainer
  from 'apps/client/internalqa/omniscope/js/container/widgets/fullscreen-container'

import {FullViewCanvasFactory} from 'apps/client/internalqa/omniscope/js/recorder/full-view-canvas'
import {CompressionFormat} from 'reality/app/xr/js/src/types/recorder'
import type {RecorderModule} from 'apps/client/internalqa/omniscope/js/recorder/recorder'

declare const XR8: any

declare global {
  interface Window { Recorder8: any }
}
window.Recorder8 = window.Recorder8 || {}

const getCameraConfigDirection = (isFrontCamera: boolean) => (isFrontCamera
  ? XR8.XrConfig.camera().FRONT
  : XR8.XrConfig.camera().BACK)

const useStyles = makeStyles({
  topBar: {
    flex: '1 1 0',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '0 0.5em',
    backgroundColor: '#ebebf1',
  },
  topBar2: {
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '0 0.5em',
    backgroundColor: '#d5d7e4',
  },
  canvasContainer: {
    position: 'relative!important' as any,
  },
  menu: {
    display: 'flex',
    flexDirection: 'row',
    flex: '1 0 0',
    justifyContent: 'flex-end',
    padding: '0.25em',
    alignItems: 'center',
  },
  item: {
    '& + &': {
      marginLeft: '0.25em',
    },
  },
  message: {
    textAlign: 'center',
  },
})

const QueueCount = connect(state => ({
  recordingCount: state.recording.count,
  recordingQueued: state.recording.queue,
  recordingFail: state.recording.fail,
}))(({recordingCount, recordingQueued, recordingFail}) => (
  <span>
    sent {recordingCount}/{recordingQueued}&nbsp;
    {recordingFail > 0 && `failed:${recordingFail}`}
  </span>
))

const deviceEstimateString = deviceEstimate => deviceEstimate.model.split('/')[0]
  .replace(/[^a-zA-Z0-9\-]/g, '-')
  .toLowerCase()

interface CIOmniRecorder extends RecordingActions {
  initialized: boolean
  isRecording: boolean
  fps: string
  currentId: string
  sentDone: boolean
}

// Setting this to 1024 to match getUserMedia resolution
const MAX_DIMENSION = 1024
const OmniRecorder: React.FC<CIOmniRecorder> = ({
  isRecording, currentId, initialized, fps, sentDone, initializeIfNeeded, newRecording, newRecorder,
  startRecording, stopRecording, appendRecording, streamRecordingsToServer,
}) => {
  const canvasRef = React.useRef()
  const classes = useStyles()
  const recorderModuleRef = React.useRef<RecorderModule>()
  const [recordedSequenceCount, setRecordedSequenceCount] = React.useState(0)
  const [deviceEstimate, setDeviceEstimate] = React.useState('')
  const deviceSuffix = () => `${deviceEstimate}-${recordedSequenceCount}`
  const [cameraStarted, setCameraStarted] = React.useState<boolean>(false)
  const [isDataCompression, setIsDataCompression] = React.useState(true)
  const [isMp4, setIsMp4] = React.useState(true)

  const onDataAvailable = (data: Uint8Array) => {
    appendRecording(currentId, data)
  }

  const startRecordingAndUpdateSuffix = () => {
    if (isMp4) {
      if (!recorderModuleRef.current) {
        throw new Error('Recorder Module is not ready')
      }
      newRecorder(recorderModuleRef.current.getGumStream())
    }

    // We still need to initialize the capnp recording on the server
    newRecording(deviceSuffix())
  }

  const stopRecordingAndUpdateCount = () => {
    stopRecording(currentId)
    setRecordedSequenceCount(recordedSequenceCount + 1)
    recorderModuleRef.current.setRunning(false)
  }

  // Actually kick off recording (mediaRecorder starts + frames being appended)
  const start = () => {
    startRecording()
    recorderModuleRef.current.markStartRecording()
    recorderModuleRef.current.setRunning(true)
    recorderModuleRef.current.setDataAvailableCb(onDataAvailable)
  }

  React.useEffect(() => {
    if (!initialized) {
      initializeIfNeeded()
    }
  }, [initialized])

  const [isFrontCamera, setIsFrontCamera] = React.useState<boolean>(false)

  const startCamera = (): void => {
    if (!initialized || !canvasRef.current || !window.XR8) {
      return
    }
    XR8.addCameraPipelineModule(FullViewCanvasFactory().pipelineModule())
    // this module draws the camera texture onto the canvas
    XR8.addCameraPipelineModule(XR8.GlTextureRenderer.pipelineModule())
    // this module draws the camera texture then read it into a pixel buffer
    XR8.addCameraPipelineModule(XR8.YuvPixelsArray.pipelineModule({MAX_DIMENSION}))
    // this module does the data recording
    recorderModuleRef.current = getRecorder().pipelineModule()
    recorderModuleRef.current.setDataAvailableCb(onDataAvailable)
    XR8.addCameraPipelineModule(recorderModuleRef.current)

    // NOTE(dat): Calling XR8.run the 2nd time seems to make recorderModule into a bad state.
    // We will get [XR] Error: RuntimeError: memory access out of bounds
    // when calling Object._c8EmAsm_setEventQueue (recorder-wasm.js)
    XR8.run({
      canvas: canvasRef.current,
      verbose: true,
      allowedDevices: XR8.XrConfig.device().ANY,
      cameraConfig: {direction: getCameraConfigDirection(isFrontCamera)},
    })

    XR8.XrDevice.deviceInfo().then((deviceInfo) => {
      setDeviceEstimate(deviceEstimateString(deviceInfo))
      setCameraStarted(true)
    })
  }

  React.useEffect(() => {
    if (!initialized || !canvasRef.current || !window.XR8) {
      return undefined
    }
    return () => {
      if (cameraStarted) {
        setCameraStarted(false)
        XR8.stop()
      }
    }
  }, [initialized, canvasRef.current, window.XR8])

  React.useEffect(() => {
    if (recorderModuleRef.current && initialized) {
      recorderModuleRef.current.setDataCompression(isDataCompression
        ? CompressionFormat.JPG_RGBA : CompressionFormat.UNSPECIFIED)
    }
  }, [isDataCompression, initialized, recorderModuleRef.current])

  React.useEffect(() => {
    if (recorderModuleRef.current && initialized) {
      recorderModuleRef.current.setRecordCameraImage(!isMp4)
    }
  }, [isMp4, initialized, recorderModuleRef.current])

  const onFrontCameraChange = (e) => {
    const isFront = e.target.checked
    setIsFrontCamera(isFront)
  }

  const [isSending, setIsSending] = React.useState<boolean>(false)
  const sendAll = async () => {
    setIsSending(true)
    await streamRecordingsToServer(deviceSuffix(), isMp4)
    setIsSending(false)
  }
  return (
    <FullscreenContainer topBar={() => (
      <div className={classes.topBar}>
        <div className={classes.menu}>
          <Button
            className={classes.item}
            disabled={!sentDone || !cameraStarted}
            variant='contained'
            color='secondary'
            startIcon={<Add />}
            onClick={startRecordingAndUpdateSuffix}
          >
            New
          </Button>
          {isRecording ? (
            <Button
              className={classes.item}
              variant='outlined'
              color='primary'
              startIcon={<Pause />}
              disabled={!currentId || !cameraStarted}
              onClick={stopRecordingAndUpdateCount}
            >
              Stop
            </Button>
          ) : (
            <Button
              className={classes.item}
              variant='contained'
              color='primary'
              startIcon={<FiberManualRecord />}
              disabled={!currentId || !cameraStarted}
              onClick={start}
            >
              Start
            </Button>
          )}
        </div>
      </div>
    )}
    >
      <div className={classes.topBar2}>
        <Switch
          disabled={isMp4}
          checked={isDataCompression}
          onChange={e => setIsDataCompression(e.target.checked)}
        /> JPG
        <Switch
          checked={isMp4}
          onChange={e => setIsMp4(e.target.checked)}
        /> Video
        <Switch checked={isFrontCamera} onChange={onFrontCameraChange} /> Front Cam
        <Button
          className={classes.item}
          variant='contained'
          color='primary'
          disabled={cameraStarted}
          onClick={startCamera}
        >
          Start Camera @{MAX_DIMENSION * 0.75}x{MAX_DIMENSION}
        </Button>
      </div>
      <div className={classes.topBar2}>
        <div>fps:{fps} <QueueCount /></div>
        <div className={classes.menu}>
          {currentId && <div className={classes.item}>ID: {currentId}-{deviceSuffix()}</div>}
        </div>
      </div>
      <div className={classes.canvasContainer}>
        <canvas ref={canvasRef} id='recorderCanvas' width={300} />
      </div>
      {!initialized && (
        <div className={classes.message}><CircularProgress /> <br />Initializing Recorder WASM ...</div>
      )}
      <div>
        <h2>Recorded sequences</h2>
        <Button variant='contained' disabled={isSending} onClick={sendAll}>
          {isSending ? 'Sending' : 'Send all '}
        </Button>
      </div>
    </FullscreenContainer>
  )
}

export default connect(state => ({
  isRecording: state.recording.status === 'RUNNING',
  currentId: state.recording.currentId,
  initialized: state.recording.initialized,
  sentDone: state.recording.queue === 0 || state.recording.queue === state.recording.count,
  fps: (1000 / state.recording.durationFromLastQueue).toFixed(0),
}), actions)(OmniRecorder)
