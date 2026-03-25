declare const React: any
declare const XR8: any
declare const XRExtras: any

let shouldThrow = false

function RuntimeErrorView() {
  React.useEffect(() => {
    XR8.addCameraPipelineModules([
      XR8.GlTextureRenderer.pipelineModule(),
      XRExtras.FullWindowCanvas.pipelineModule(),
      XRExtras.AlmostThere.pipelineModule(),
      XRExtras.RuntimeError.pipelineModule(),
      {
        name: 'error-thrower',
        onUpdate: () => {
          if (shouldThrow) {
            shouldThrow = false
            throw new Error()
          }
        },
      },
    ])

    document.body.insertAdjacentHTML('beforeend', '<canvas id="camerafeed"></canvas>')
    XR8.run({canvas: document.getElementById('camerafeed'), verbose: true, allowedDevices: 'any'})

    // Cleanup
    return () => {
      const canvas = document.getElementById('camerafeed')
      canvas.parentNode.removeChild(canvas)
      XR8.stop()
      XR8.clearCameraPipelineModules()
    }
  }, [])

  return (
    <React.Fragment>
      <button className="hud top-right" onClick={() => { shouldThrow = true }}>Throw error</button>
    </React.Fragment>
  )
}

export {RuntimeErrorView}
