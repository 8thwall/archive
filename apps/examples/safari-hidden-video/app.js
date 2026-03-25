// Copyright (c) 2020 8th Wall, Inc.
//
// Elicits an issue where Safari stops streaming the camera feed to a <video> tag when the element
// is not visible, either because it is display none, or it is fully occluded by other DOM elements.
// Streaming to an off-screen <video> is common when drawing the camera feed to a texture, for
// example to apply visual effects on top of the camera feed, or to synchronize display of the
// camera feed with the result of some visual processing (QR code detection, image target tracking,
// SLAM, etc.).
//
// One workaround solution is to make the camera feed visible but all-but-hidden, e.g. by displaying
// as a block element behind the drawing canvas, offset by one pixel:
//
//   const setVideoForSafari = ({video, canvas}) => {
//     if (!canvas.style['z-index']) {
//       canvas.style['z-index'] = 1
//     }
//     canvas.style.top = '1px'
//     canvas.style.left = '0px'
//     canvas.style.position = 'absolute'
//     video.setAttribute('playsinline', true)
//     video.style.display = 'block'
//     video.style['z-index'] = canvas.style['z-index'] - 1
//     video.style.top = '0px'
//     video.style.left = '0px'
//     video.style.position = 'absolute'
//     video.style.opacity = '0.01'
//     video.parentNode.style.position = 'absolute'
//   }
//
// This approach adds inefficiency because camera pixels are drawn twice, and adds a subtle visual
// defect because the camera feed is one-pixel visible.

document.head.insertAdjacentHTML('beforeend', `
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <style type="text/css">
    body {margin: 0; border: 0; padding: 0;}
    button {width: 80%; font-size: 18px;}
    .debuginfo {
      position: fixed; z-index: 1000; vertical-align: middle;
      left: 5%; top: 3%; width: 90%; min-height: 12%;
      color: #AD50FF; background-color: #323232; opacity: 1.0;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      font-family: mono; font-size: 5vh; text-align: center;
    }
    canvas #camera {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;  z-index: 500;
      margin: 0; border: 0; padding: 0; width: 100%; height: 100%;
    }
    .info {
      position: fixed; z-index: 1000; vertical-align: middle;
      color: #FFFFFF; background-color: #323232; opacity: 1.0;
      left: 5%; bottom: 3%; width: 90%; min-height: 12%;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      font-family: sans-serif; font-size: 2vh; text-align: left;
    }
    .info a {color: #AD50FF;}
    .info a:visited {color: #AD50FF;}
  </style>
`)

const updateStatus = (video) => {
  const status = document.querySelector('#status')
  status.innerHTML = video ? `display: ${video.style.display}` : '(no &lt;video&gt;)'
}

const toggleVideoVisibility = () => {
  const video = document.querySelector('video')
  console.log(`Toggle video, display was ${video.style.display}`)
  if (video.style.display === 'block') {
    video.style.display = 'none'
  } else {
    video.style.display = 'block'
  }
  updateStatus(video)
  console.log(`Toggle video, display is now ${video.style.display}`)
}

// Add a canvas to the document for our xr scene.
document.body.insertAdjacentHTML('beforeend', `
<canvas id="camera" width="${window.innerWidth}" height="${window.innerHeight}"></canvas>
<div class="debuginfo">
  <button onclick="toggleVideoVisibility()">Toggle &lt;video&gt; display</button>
  <br><span id="status"></span>
</div>
<div class="info">
Try this demo by navigating to this page (<a href="https://8th.io/k4c5d">8th.io/k4c5d</a>) on 
Safari on your iOS device. This demo elicits an effect where webkit fails to stream camera data to
an offscreen &lt;video&gt; tag. The camera feed is drawn with a shader to a &lt;canvas&gt;. When
the &lt;video&gt; is set to "display: block;", it is drawn behind the &lt;canvas&gt; with a 1 pixel
offset so it remains visible. If the &lt;video&gt; is "display: none;" or is completely covered by
other DOM elements, streaming halts.</div>`)

updateStatus()


const onxrloaded = () => {
  // Use a sepia visual effect when drawing the camera feed to the canvas.
  XR8.GlTextureRenderer.configure({fragmentSource: ` 
    precision mediump float;  // Sepia.
    varying vec2 texUv;
    uniform sampler2D sampler;
    void main() {
      vec4 c = texture2D(sampler, texUv);
      gl_FragColor.r = dot(c.rgb, vec3(.393, .769, .189));
      gl_FragColor.g = dot(c.rgb, vec3(.349, .686, .168));
      gl_FragColor.b = dot(c.rgb, vec3(.272, .534, .131));
      gl_FragColor.a = c.a;
    }
  `})
  XR8.addCameraPipelineModules([                                   // Add camera pipeline modules.
    XR8.GlTextureRenderer.pipelineModule(),                        // Draws the camera feed.
    {name: 'status', onAttach: ({video}) => updateStatus(video)},  // Set initial video status.
  ])
  XR8.run({canvas: document.getElementById('camera')})  // Open the camera and start the run loop.
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
window.toggleVideoVisibility = toggleVideoVisibility
