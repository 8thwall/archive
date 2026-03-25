export const resizeFeedComponent = {
  schema: { },
  init() {
    let feed_
    const noopVertexSource =
      'attribute vec3 position;\n' +
      'attribute vec2 uv;\n' +
      'varying vec2 texUv;\n' +
      'void main() {\n' +
      '  gl_Position = vec4(position, 1.0);\n' +
      '  texUv = uv;\n' +
      '}\n'
    const noopFragmentSource =
      'precision lowp float;\n' +
      'varying vec2 texUv;\n' +
      'uniform sampler2D sampler;\n' +
      'void main() {\n' +
      '  gl_FragColor = texture2D(sampler, texUv);\n' +
      '}\n'
    XR8.addCameraPipelineModule({
      name: 'secondfeed',
      onAttach: () => {
        const canvas = document.createElement('CANVAS')
        canvas.id = 'second'
        canvas.style.zIndex = 999
        canvas.style.display = 'block'
        canvas.style.position = 'absolute'
        canvas.style.left = '50%'
        canvas.style.top = '50%'
        canvas.style.transform = 'translate(-50%, -50%)'
        document.body.insertBefore(canvas, document.body.firstChild)
        const cxt = canvas.getContext('webgl')
        feed_ = XR8.GlTextureRenderer.create({
          GLctx: cxt,
          vertexSource: noopVertexSource,
          fragmentSource: noopFragmentSource,
        })
        console.log(feed_)
      },
      onUpdate: ({frameStartResult, processCpuResult}) => {
        const cameraTexture = processCpuResult.reality
          ? processCpuResult.reality.realityTexture
          : frameStartResult.cameraTexture
        feed_.render({renderTexture: cameraTexture, viewport: {width: 300, height: 300}})
      },
    })
  },
}
