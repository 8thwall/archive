declare const React: any

const DeviceWebXr = () => {
  const [xrSession, setXrSession] = React.useState(null)
  const [err, setErr] = React.useState(null)

  const hasWebXR = !!navigator.xr

  const requestWebXr = (sessionType) => {
    navigator.xr.requestSession(sessionType).then((session) => {
      const StringifiedSession = JSON.stringify({
        status: 'hasSessionWebXr',
        sessionType,
        session,
        environmentBlendMode: session.environmentBlendMode,
        // depthDataFormat: session.depthDataFormat,
        // depthUsage: session.depthUsage,
        domOverlayState: session.domOverlayState,
        inputSources: session.inputSources,
        inputSourcesLength: session.inputSources.length,
        interactionMode: session.interactionMode,
        preferredReflectionFormat: session.preferredReflectionFormat,
        renderState: session.renderState,
        visibilityState: session.visibilityState,
      }, (k, v) => (v === undefined ? 'undefined' : v), 2)
      console.log('Session Started', StringifiedSession)
      setErr(null)
      setXrSession(StringifiedSession)
      session.end()
    }).catch((err) => {
      console.error(err)
      setXrSession(null)
      setErr(err)
    })
  }
  return (
    <div className='container'>
      <h1>WebXR</h1>
      <p>Browser has WebXR? {hasWebXR ? 'Yes' : 'No'}</p>
      <p>
        <button
          disable={!hasWebXR}
          onClick={() => requestWebXr('immersive-vr')}
        >
          Request immersive-vr WebXR
        </button>
        <button disable={!hasWebXR}
          onClick={() => requestWebXr('immersive-ar')}
          >
          Request immersive-ar WebXR
        </button>
      </p>
      <p>
        <pre>{xrSession}</pre>
      </p>
      <p>
        <pre>{err?.stack}</pre>
      </p>
    </div>
  )
}

export {DeviceWebXr}
