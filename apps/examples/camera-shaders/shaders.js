const fragmentShaders = [  // Define some simple shaders to apply to the camera feed.
  ` precision mediump float;  // Just the camera feed.
    varying vec2 texUv;
    uniform sampler2D sampler;
    void main() { gl_FragColor = texture2D(sampler, texUv); }`,
  ` precision mediump float;  // Color boost.
    varying vec2 texUv;
    uniform sampler2D sampler;
    void main() {
      vec4 c = texture2D(sampler, texUv);
      float y = dot(c.rgb, vec3(0.299, 0.587, 0.114));
      float u = dot(c.rgb, vec3(-.159, -.331, .5)) * 6.0;
      float v = dot(c.rgb, vec3(.5, -.419, -.081)) * 3.0;
      gl_FragColor = vec4(y + 1.4 * v, y - .343 * u - .711 * v, y + 1.765 * u, c.a);
    }`,
  ` precision mediump float;  // Vignette.
    varying vec2 texUv;
    uniform sampler2D sampler;
    void main() {
      float x = texUv.x - .5;
      float y = texUv.y - .5;
      float v = 1.5 - sqrt(x * x + y * y) * 2.5;
      vec4 c = texture2D(sampler, texUv);
      gl_FragColor = vec4(c.rgb * (v > 1.0 ? 1.0 : v), c.a);
    }`,
  ` precision mediump float;  // Black and white.
    varying vec2 texUv;
    uniform sampler2D sampler;
    void main() {
      vec4 c = texture2D(sampler, texUv);
      gl_FragColor = vec4(vec3(dot(c.rgb, vec3(0.299, 0.587, 0.114))), c.a);
    }`,
  ` precision mediump float;  // Sepia.
    varying vec2 texUv;
    uniform sampler2D sampler;
    void main() {
      vec4 c = texture2D(sampler, texUv);
      gl_FragColor.r = dot(c.rgb, vec3(.393, .769, .189));
      gl_FragColor.g = dot(c.rgb, vec3(.349, .686, .168));
      gl_FragColor.b = dot(c.rgb, vec3(.272, .534, .131));
      gl_FragColor.a = c.a;
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

const vertexShaders = [  // Vertex shaders for swapping whether or not drawing is mirrored.
  ` attribute vec3 position;  // Normal drawing
    attribute vec2 uv;
    varying vec2 texUv;
    void main() {
      gl_Position = vec4(position, 1.0);
      texUv = uv;
    }`,
  ` attribute vec3 position;  // Mirrored drawing
    attribute vec2 uv;
    varying vec2 texUv;
    void main() {
      gl_Position = vec4(position, 1.0);
      texUv = vec2(1.0 - uv.x, uv.y);
    }`,
]

// Define a custom pipeline module. This module cycles through a set of pre-defined shaders each
// time the next button is pressed. It also updates the button style on orientation changes.
const nextbuttonPipelineModule = () => {
  const nextButton = document.getElementById('nextbutton')
  let idx = 0  // Index of the shader to use next.
  let uniforms

  const nextShader = () => {
    // Reconfigure the texture renderer pipline module to use the next shader.
    XR8.GlTextureRenderer.configure({fragmentSource: fragmentShaders[idx]})
    idx = (idx + 1) % fragmentShaders.length
  }

  nextShader()  // Call 'nextShader' once to set the first shader.
  nextButton.onclick = nextShader  // Switch to the next shader when the next button is pressed.

  const adjustButtonTextCenter = ({orientation}) => {  // Update the line height on the button.
    const ww = window.innerWidth
    const wh = window.innerHeight

    // Wait for orientation change to take effect before handling resize.
    if (((orientation === 0 || orientation === 180) && ww > wh) ||
      ((orientation === 90 || orientation === -90) && wh > ww)) {
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
    onDeviceOrientationChange: ({orientation}) => {
      adjustButtonTextCenter({orientation})
    },
    onUpdate: ({frameStartResult, processGpuResult}) => {
      if (processGpuResult.gltexturerenderer) {
        const {shader} = processGpuResult.gltexturerenderer
        const {GLctx} = frameStartResult

        const timeLoc = GLctx.getUniformLocation(shader, 'time')
        if (timeLoc) {
          const p = XR8.GlTextureRenderer.getGLctxParameters(GLctx)
          GLctx.useProgram(shader)
          GLctx.uniform1f(timeLoc, uniforms)
          XR8.GlTextureRenderer.setGLctxParameters(GLctx, p)
          uniforms += 0.1
        }
      }
    },
  }
}

// Define a custom pipeline module. This module cycles through the front and back cameras.
const swapbuttonPipelineModule = () => {
  const swapButton = document.getElementById('swapbutton')
  let idx = 0  // Index of the current shader.

  const swapShader = () => {
    // Stop the camera and re-open on the reverse side. If front facing, mirror the camera feed.
    idx = (idx + 1) % vertexShaders.length
    XR8.stop()
    XR8.GlTextureRenderer.configure({vertexSource: vertexShaders[idx]})
    const direction = idx === 1 ? XR8.XrConfig.camera().FRONT : XR8.XrConfig.camera().BACK
    XR8.run({canvas: document.getElementById('camerafeed'), cameraConfig: {direction}})
  }

  swapButton.onclick = swapShader  // Switch to the next shader when the next button is pressed.

  const adjustButtonTextCenter = ({orientation}) => {  // Update the line height on the button.
    const ww = window.innerWidth
    const wh = window.innerHeight

    // Wait for orientation change to take effect before handling resize.
    if (((orientation === 0 || orientation === 180) && ww > wh) ||
      ((orientation === 90 || orientation === -90) && wh > ww)) {
      window.requestAnimationFrame(() => adjustButtonTextCenter({orientation}))
      return
    }

    swapButton.style.lineHeight = `${swapButton.getBoundingClientRect().height}px`
  }

  // Return a pipeline module that updates the state of the UI on relevant lifecycle events.
  return {
    name: 'swapbutton',
    onStart: ({orientation}) => {
      swapButton.style.visibility = 'visible'
      adjustButtonTextCenter({orientation})
    },
    onDeviceOrientationChange: ({orientation}) => {
      adjustButtonTextCenter({orientation})
    },
  }
}

export {nextbuttonPipelineModule, swapbuttonPipelineModule}
