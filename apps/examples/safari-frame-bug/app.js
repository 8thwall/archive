// Copyright (c) 2020 8th Wall, Inc.
//
// Elicit and characterize an issue where Safari appears to resurrect arbitrarily old camera
// frames when reading webgl textures from <video> tags, which is exacerbated by heavy CPU
// processing.

const SPIN_FACTOR = 2.5            // Add more artificial delay between frames.
const DEDUP_HISTORY_LENGTH = 120   // Max number of frames back to search for duplicates.
const ENABLE_DOUBLE_RAF = false    // Enable double-RAF mitigation for this bug.

const origRaf = window.requestAnimationFrame

// Frame hash constructs a small (100 byte) statistic of an image in a fast way that can be used
// to check for equality with another image.
const frameHash = ({rows, cols, rowBytes, pixels}) => {
  const hashValues_ = new Uint8Array(100)
  const cstep = cols / 11.0  // Compute the size of each cell that form a 10x10 grid over the image.
  const rstep = rows / 11.0
  let r = rstep * .5  // Start in the middle if the first grid row.
  let idx = 0
  for (let i = 0; i < 10; ++i) {
    let c = cstep * .5  // Start in the middle of the first grid column.
    let y = Math.floor(Math.round(r)) * rowBytes
    for (let j = 0; j < 10; ++j) {
      const p = y + Math.floor(Math.round(c))  // Locate the pixel in the center of each grid cell.
      // Sample the UInt8 pixel values of 5 pixles in a row around the central point and XOR them.
      hashValues_[idx++] = pixels[p - 2] ^ pixels[p - 1] ^ pixels[p] ^ pixels[p + 1] ^ pixels[p + 2]
      c += cstep
    }
    r += rstep
  }
  return {
    hashValue: (i) => hashValues_[i],
    equals: (b) => hashValues_.every((v, i) => v === b.hashValue(i)),
  }
}

// Maintain a circular buffer of DEDUP_HISTORY_LENGTH (e.g. 120) hashes of frames history, which can
// be used to check when the last time we saw this frame was.
const frameHashSet = () => {
  const hashes_ = []   // The circular buffer of frame hash history.
  let numInSet_ = 0    // The number of items in the circular buffer, up to DEDUP_HISTORY_LENGTH.
  let nextAddIdx_ = 0  // The location in the circular buffer where the next item should be added.
  
  for (let i = 0; i < DEDUP_HISTORY_LENGTH; ++i) {
    hashes_.push(null)  // Initialize the array with empty data.
  }
  
  return {
    // Perform a backward search to see if a candidate frame was seen in the history. If seen,
    // return the amount of time it's been since we saw this frame. If not seen, add a hash of this
    // frame to the history and return 0.
    checkAndAdd: (p) => {
      // Compute a new frame hash for this frame.
      const h = frameHash(p)
      
      // Compute the range of valid history using 
      const startCheck = nextAddIdx_ + hashes_.length - 1
      const endCheck = startCheck - numInSet_
      
      // Reverse search to see if this frame is in the history.
      for (let i = startCheck; i > endCheck; --i) {
        if (h.equals(hashes_[i % hashes_.length])) {
          return startCheck - i + 1  // If found, return the historical duplicate and don't add.
        }
      }
  
      // Add the hash to the set and increment circular buffer counters.
      hashes_[nextAddIdx_] = h
      if (numInSet_ < hashes_.length) {
        numInSet_++
      }
      nextAddIdx_ = (nextAddIdx_ + 1) % hashes_.length
      
      return 0  // Return 0 for previously unseen.
    }
  }
}

const safariFrameBugPipelineModule = () => {
  const skipHistory_ = []  // Stats.
  let skipNum_ = 0
  const frameHashes_ = frameHashSet()  // History of frame hashes for finding duplicate frames.
  const debuginfo_ = document.querySelector('.debuginfo')  // Display
  
  return {
    name: 'safariframebug',
    onAttach: () => {
      // Undo the double RAF strategy that mitigates this issue.
      if (!ENABLE_DOUBLE_RAF && window.requestAnimationFrame !== origRaf) {
        console.log('Resetting original RAF.')
        window.requestAnimationFrame = origRaf
      }
    },
    onProcessCpu: ({processGpuResult}) => {
      let framesBack = 0  // Check whether we've seen the current frame in the last 120 frames.
      if (processGpuResult.camerapixelarray && processGpuResult.camerapixelarray.pixels) {
        framesBack = frameHashes_.checkAndAdd(processGpuResult.camerapixelarray)
      }

      const now = Date.now()  // Delay for a random amount of time.
      const target = now + (Math.floor(Math.random() * 70) + 7) * SPIN_FACTOR
      let spins = 0
      while (Date.now() < target) {
        ++spins
      }
     
      return {framesBack}  // Propagate whether we've scene this frame to update.
    },
    onUpdate: ({processCpuResult}) => {
      const { safariframebug } = processCpuResult
      if (safariframebug.framesBack > 1) {  // Update stats about frame skips.
        skipHistory_.push(safariframebug.framesBack)
        if (skipHistory_.length > 5) {
          skipHistory_.shift()
        }
        skipNum_++
      }
      
      // Update display text in the dom.
      debuginfo_.innerHTML = `[# back] (# total):<br>[${skipHistory_.join(',')}] (${skipNum_})`
    },
  }
}

document.head.insertAdjacentHTML('beforeend', `
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <style type="text/css">
    body {margin: 0; border: 0; padding: 0;}
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

// Add a canvas to the document for our xr scene.
document.body.insertAdjacentHTML('beforeend', `
<canvas id="camera" width="${window.innerWidth}" height="${window.innerHeight}"></canvas>
<div class="debuginfo"></div>
<div class="info">
Try this demo by navigating to this page (<a href="https://8th.io/ft4h9">8th.io/ft4h9</a>) on 
Safari on your iOS device. This demo elicits and characterizes an effect where webkit appears to
supply camera frames that are up to a few seconds old when reading webgl textures 
from &lt;video&gt; tags. This effect appears to be exacerbated by long RAF times, which we add 
artificially. We detect these duplicate frames, and for the last 5 duplicates, print how many frames
back the source frame was.</div>`)

const onxrloaded = () => {
  XR8.addCameraPipelineModules([                 // Add camera pipeline modules.
    XR8.GlTextureRenderer.pipelineModule(),      // Draws the camera feed.
    XR8.CameraPixelArray.pipelineModule({luminance: true, maxDimension: 960}), // Captures frame.
    safariFrameBugPipelineModule(),              // Adds random delays and checks for duplicates.
  ])
  XR8.run({canvas: document.getElementById('camera')})  // Open the camera and start the run loop.
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
