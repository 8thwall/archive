// Copyright (c) 2019 8th Wall, Inc.

const fragmentShaders = [  // Define some simple shaders to apply to the camera feed.
  ` precision mediump float;  // Just the camera feed.
    varying vec2 texUv;
    uniform sampler2D sampler;
    void main() { gl_FragColor = texture2D(sampler, texUv); }`,
  ` precision mediump float;  // Black and white.
    varying vec2 texUv;
    uniform sampler2D sampler;
    void main() {
      vec4 c = texture2D(sampler, texUv);
      gl_FragColor = vec4(vec3(dot(c.rgb, vec3(0.299, 0.587, 0.114))), c.a);
    }`,
  ` precision mediump float;  // Purple.
    varying vec2 texUv;
    uniform sampler2D sampler;
    void main() {
      vec4 c = texture2D(sampler, texUv);
      float y = dot(c.rgb, vec3(0.299, 0.587, 0.114));
      vec3 p = vec3(.463, .067, .712);
      vec3 rgb = y < .25 ? (y * 4.0) * p : ((y - .25) * 1.333) * (vec3(1.0, 1.0, 1.0) - p) + p;
      gl_FragColor = vec4(rgb, c.a);
    }`,
  ` precision mediump float;  // Shader with time variable
    uniform float time;
    varying vec2 texUv;
    uniform sampler2D sampler;
    void main( void ) {
      vec2 position = texUv;
      float color = 0.0;
      color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
      color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
      color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
      color *= sin( time / 10.0 ) * 0.5;
      gl_FragColor = texture2D(sampler, texUv) + vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
    }`,
]

// Define a custom pipeline module. This module cycles through a set of pre-defined shaders each
// time the next button is pressed. It also updates the button style on orientation changes.
const nextbuttonPipelineModule = () => {
  let uniforms
  const nextButton = document.getElementById('nextbutton')
  let idx = 0  // Index of the shader to use next.

  const nextShader = () => {
    // Reconfigure the texture renderer pipline module to use the next shader.
    XR8.GlTextureRenderer.configure({fragmentSource: fragmentShaders[idx]})
    idx = (idx + 1) % fragmentShaders.length
  }

  nextShader()                     // Call 'nextShader' once to set the first shader.
  nextButton.onclick = nextShader  // Switch to the next shader when the next button is pressed.

  const adjustButtonTextCenter = ({orientation}) => { // Update the line height on the button.
    const ww = window.innerWidth
    const wh = window.innerHeight

    // Wait for orientation change to take effect before handling resize.
    if (((orientation == 0 || orientation == 180) && ww > wh)
      || ((orientation == 90 || orientation == -90) && wh > ww)) {
      window.requestAnimationFrame(() => adjustButtonTextCenter({orientation}))
      return
    }

    nextButton.style.lineHeight = `${nextButton.getBoundingClientRect().height}px`
  }

  // Return a pipeline module that updates the state of the UI on relevant lifecycle events.
  return {
    name: 'nextbutton',
    onStart: ({orientation}) => {
      nextButton.style.visibility = 'visible'
      adjustButtonTextCenter({orientation})
      uniforms = 1.0
    },
    onUpdate: ({frameStartResult, processGpuResult}) => {
      if (processGpuResult.gltexturerenderer) {
        const {shader} = processGpuResult.gltexturerenderer
        const {GLctx} = frameStartResult

        const timeLoc = GLctx.getUniformLocation(shader, "time")
        if (timeLoc) {
          const p = XR8.GlTextureRenderer.getGLctxParameters(GLctx)
          GLctx.useProgram(shader)
          GLctx.uniform1f(timeLoc, uniforms)
          XR8.GlTextureRenderer.setGLctxParameters(GLctx, p)
          uniforms += 0.1
        }
      }


    },
    onDeviceOrientationChange: ({orientation}) => { adjustButtonTextCenter({orientation}) },
  }
}

const onxrloaded = () => {
  XR8.addCameraPipelineModules([  // Add camera pipeline modules.
    // Existing pipeline modules.
    XR8.GlTextureRenderer.pipelineModule(),      // Draws the camera feed.
    XRExtras.AlmostThere.pipelineModule(),       // Detects unsupported browsers and gives hints.
    XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window.
    XRExtras.Loading.pipelineModule(),           // Manages the loading screen on startup.
    XRExtras.RuntimeError.pipelineModule(),      // Shows an error image on runtime error.
    // Custom pipeline modules.
    nextbuttonPipelineModule(),             // Cycles through shaders and keeps UI up to date.
  ])

  // Request camera permissions and run the camera.
  XR8.run({canvas: document.getElementById('camerafeed')})
}

// Show loading screen before the full XR library has been loaded.
const load = () => { XRExtras.Loading.showLoading({onxrloaded}) }
window.onload = () => { window.XRExtras ? load() : window.addEventListener('xrextrasloaded', load) }
