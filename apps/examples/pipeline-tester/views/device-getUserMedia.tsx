import '../style/device-getUserMedia.scss'

declare const React: any
declare const XR8: any
const ASPECT_RATIO = 3 / 4

const DeviceGetUserMediaView = () => {
  const [width, setWidth] = React.useState(960)
  const [height, setHeight] = React.useState(720)
  const [backCam, setBackCam] = React.useState(true)
  const [videoProps, setVideoProps] = React.useState('{}')
  const [stream, setStream] = React.useState(null)
  const [requestDeviceId, setRequestDeviceId] = React.useState(null)

  // camera constraints returned by the user
  const [camConstraints, setCamConstraints] = React.useState({})
  // constraints we sent to getUserMedia
  const [requestedConstraints, setRequestedConstraints] = React.useState({})
  const [gumError, setGumError] = React.useState(null)
  const [pickedDeviceId, setPickedDeviceId] = React.useState(null)

  let gumStream
  const requestCamera = (overrideConstraints?: MediaStreamConstraints): Promise<void> => {
    const video : HTMLVideoElement = document.querySelector('video#video')

    if (stream) {
      video.srcObject = null
      stream.getTracks().forEach(t => t.stop())
    }

    const gumConstraints: MediaStreamConstraints = overrideConstraints || {
      audio: true,  // requesting by deviceId won't work if audio device has the same ID
      video: {
        width: {exact: width},
        height: {exact: height},
        facingMode: backCam ? 'environment' : 'user',
        // This is from testing whether we should be setting this in the engine: https://github.com/8thwall/code8/pull/17368/files
        // frameRate: {
        //   ideal: 60,
        //   min: 1,
        //   max: 60,
        // },
      },
    }
    if (requestDeviceId) {
      gumConstraints.video = {
        deviceId: {
          exact: requestDeviceId,
        },
      }
    }

    setRequestedConstraints(gumConstraints)

    console.log('About to GetUserMedia', JSON.stringify(gumConstraints))
    gumStream = navigator.mediaDevices.getUserMedia(gumConstraints).then((mediaStream) => {
      video.srcObject = mediaStream
      const videoTrack = mediaStream.getVideoTracks()[0]
      setCamConstraints(videoTrack.getConstraints())
      setPickedDeviceId(videoTrack.getCapabilities().deviceId)

      setVideoProps(`
Constraints: ${JSON.stringify(videoTrack.getConstraints(), null, 2)}\n
SupportedConstraints: ${JSON.stringify(navigator.mediaDevices.getSupportedConstraints(), null, 2)}\n
Settings: ${JSON.stringify(videoTrack.getSettings(), null, 2)}\n
Capabilities: ${JSON.stringify(videoTrack.getCapabilities(), null, 2)}\n
`)

      setStream(mediaStream)
      setGumError(null)
    }).catch(err => {
      setGumError(`${err.name}: ${err.message}`)
    })
    return gumStream
  }

  const [deviceInfos, setDeviceInfos] = React.useState([] as MediaDeviceInfo[])
  const enumerateDevices = () => {
    if (!navigator.mediaDevices?.enumerateDevices) {
      console.error('enumerateDevices() not supported.')
    } else {
      return navigator.mediaDevices.enumerateDevices()
        .then((devices) => {
          setDeviceInfos(devices)
        })
        .catch((err) => {
          console.error(`${err.name}: ${err.message}`)
        })
    }
  }

  React.useEffect(() => {
    // Sometimes, you can only enumerate with labels when you have already gotten user media
    // NOTE(dat): on iOS this happens potentially prior to you clicking anything if you arrive at
    // this page directly instead of from our index page.
    requestCamera().then(enumerateDevices)
    return () => {
      console.log('[device-getUserMedia] Closing stream\'s videoTracks on unmount')
      if (gumStream.getVideoTracks) {
        gumStream.getVideoTracks().forEach(track => track.stop())
      } else {
        console.log('[device-getUserMedia] gumStream.getVideoTracks is not a function, skipping')
      }
    }
  }, [])

  const videoTagWidth = '300px'
  const videoTagHeight = '400px'

  const selectByAudio = () => {
    if (!deviceInfos) {
      console.error('Cannot select by audio without enumerated devices')
      return
    }

    const audioInputIds = new Set(deviceInfos.filter(deviceInfo => deviceInfo.kind === 'audioinput').map(d => d.deviceId))
    const videoInputs = deviceInfos.filter(deviceInfo => deviceInfo.kind === 'videoinput')
    if (videoInputs[0].label) {
      videoInputs.sort((a, b) => a.label.localeCompare(b.label))
    }
    const targetVideoInput = videoInputs.find(videoDeviceInfo => audioInputIds.has(videoDeviceInfo.deviceId))
    if (!targetVideoInput) {
      return
    }

    requestCamera({
      video: {
        deviceId: {
          exact: targetVideoInput.deviceId
        },
        width: {
          ideal: width,
        },
        height: {
          ideal: height,
        },
      },
    })
  }


  return (
    <div className='container'>
      <h1>getUserMedia</h1>
      <p>
        w=<input value={width} onChange={e => setWidth(e.target.value)} />
        <br />
        <button onClick={e => setWidth(640)}>640</button>
        <button onClick={e => setWidth(960)}>960</button>
        <button onClick={e => setWidth(1280)}>1280</button>
        <br />
        h=<input value={height} onChange={e => setHeight(e.target.value)} />
        <br />
        <button onClick={e => setHeight(480)}>480</button>
        <button onClick={e => setHeight(540)}>540</button>
        <button onClick={e => setHeight(720)}>720</button>
        <button onClick={e => setHeight(960)}>960</button>
        <br />
        Back cam?<input type='checkbox' checked={backCam} onChange={e => setBackCam(e.target.checked)} /> <br />

        <button onClick={() => requestCamera()}>Request Camera</button>
      </p>
      <div>
        Video tag w={videoTagWidth} h={videoTagHeight}
        <video id='video' style={{width: videoTagWidth, height: videoTagHeight, outline: '1px solid black'}} autoplay='true' muted='true' playsinline='true'></video>
      </div>
      {gumError && <div>{gumError}</div>}

      <h1>Selection strategies</h1>
      <p>Note: by default, the camera selected above is not following the strategy we use within the engine. On iOS, 
      the engine prefers non-triple non-double cameras. i.e. in Core experience, the camera would not switch between
      different lens as you come closer to an object.</p>
      <button onClick={selectByAudio}>Select By Audio</button>

      <h1>Available Devices</h1>
      <table className='deviceTable'>
        <thead>
          <tr>
            <th>Label</th>
            <th>Kind</th>
            <th><button onClick={() => setRequestDeviceId(null)}>Unset</button> Device ID</th>
            <th>Group ID</th>
          </tr>
        </thead>
        <tbody>
          {deviceInfos.map(d => (
            <tr>
              <td>{d.label}{d.deviceId === pickedDeviceId && '✓'}</td>
              <td>{d.kind}</td>
              <td>
                {d.kind === 'videoinput' && <button onClick={() => setRequestDeviceId(d.deviceId)}>Set</button>} {d.deviceId}
              </td>
              <td>{d.groupId}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Requested Constraints</h2>
      <pre>
        {JSON.stringify(requestedConstraints, null, 2)}
      </pre>
      <h2>Constraints</h2>
      <pre>
        {JSON.stringify(camConstraints, null, 2)}
      </pre>

      <h2>Video Properties</h2>
      <pre>
        {videoProps}
      </pre>
    </div>
  )
}

export {DeviceGetUserMediaView}
