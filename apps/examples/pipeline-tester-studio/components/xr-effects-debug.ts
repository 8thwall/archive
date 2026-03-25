import * as ecs from '@8thwall/ecs'

const xrEvents = [
  'xr.camerastatuschange',
  'xr.stop',
]

const worldEffectEvents = [
  'reality.trackingstatus',
  'reality.locationscanning',
  'reality.locationfound',
  'reality.locationupdated',
  'reality.locationlost',
  'reality.meshfound',
  'reality.meshlost',
  'reality.imageloading',
  'reality.imagescanning',
  'reality.imagefound',
  'reality.imageupdated',
  'reality.imagelost',
  // Currently not supporting other world effects events.
]

const faceEffectEvents = [
  'facecontroller.faceloading',
  'facecontroller.facescanning',
  'facecontroller.facefound',
  'facecontroller.faceupdated',
  'facecontroller.facelost',
  'facecontroller.mouthopened',
  'facecontroller.mouthclosed',
  'facecontroller.lefteyeopened',
  'facecontroller.lefteyeclosed',
  'facecontroller.righteyeopened',
  'facecontroller.righteyeclosed',
  'facecontroller.lefteyebrowraised',
  'facecontroller.lefteyebrowlowered',
  'facecontroller.righteyebrowraised',
  'facecontroller.righteyebrowlowered',
  'facecontroller.righteyewinked',
  'facecontroller.lefteyewinked',
  'facecontroller.blinked',
  'facecontroller.interpupillarydistance',

  // Currently not supporting ear events.
  'facecontroller.earpointfound',
  'facecontroller.earpointlost',

  // Debugging face.
  'facecontroller.debug',
]

const eventsFound: string[] = []
let blinkCount_ = 0
let leftEyeWinkCount_ = 0
let rightEyeWinkCount_ = 0
let xrStopCount_ = 0

const onXrDebug = (event: any) => {
  let element = null

  switch (event.name) {
    case 'xr.camerastatuschange':
      element = document.getElementById('camera-status')
      if (element) element.innerHTML = event.data.status
      break
    case 'xr.stop':
      element = document.getElementById('xr-stop')
      xrStopCount_ += 1
      if (element) element.innerHTML = xrStopCount_
      break
    default:
      break
  }
}

const onWorldUpdate = (event: any) => {
  let element = null

  switch (event.name) {
    case 'reality.trackingstatus':
      element = document.getElementById('world-status')
      if (element) element.innerHTML = event.data.status

      element = document.getElementById('world-reason')
      if (element) element.innerHTML = event.data.reason
      break
    case 'reality.locationscanning':
      element = document.getElementById('location-status')
      if (element) element.innerHTML = 'Scanning'
      break
    case 'reality.locationfound':
      element = document.getElementById('location-status')
      if (element) element.innerHTML = 'Found'
      break
    case 'reality.locationupdated':
      element = document.getElementById('location-status')
      if (element) element.innerHTML = 'Updated'
      break
    case 'reality.locationlost':
      element = document.getElementById('location-status')
      if (element) element.innerHTML = 'Lost'
      break
    case 'reality.meshfound':
      element = document.getElementById('mesh-status')
      if (element) element.innerHTML = 'Found'
      break
    case 'reality.meshlost':
      element = document.getElementById('mesh-status')
      if (element) element.innerHTML = 'Lost'
      break
    case 'reality.imageloading':
      element = document.getElementById('imageload-status')
      if (element) element.innerHTML = 'LOADING'
      break
    case 'reality.imagescanning':
      element = document.getElementById('imageload-status')
      if (element) element.innerHTML = 'SCANNING'
      break
    case 'reality.imagefound':
      element = document.getElementById('imagefound-status')
      if (element) element.innerHTML = 'FOUND'
      break
    case 'reality.imageupdated':
      element = document.getElementById('imagefound-status')
      if (element) element.innerHTML = 'UPDATED'
      break
    case 'reality.imagelost':
      element = document.getElementById('imagefound-status')
      if (element) element.innerHTML = 'LOST'
      break
    default:
      break
  }
}

const onFaceUpdate = (event: any) => {
  let element = null
  let faceDebug = null
  let faceCanvasCtx = null

  switch (event.name) {
    case 'facecontroller.faceloading':
      element = document.getElementById('face-loading')
      if (element) element.innerHTML = 'loading'
      break
    case 'facecontroller.facescanning':
      element = document.getElementById('face-scanning')
      if (element) element.innerHTML = 'scanning'
      break
    case 'facecontroller.facefound':
      element = document.getElementById('face-found')
      if (element) element.innerHTML = 'found'
      break
    case 'facecontroller.faceupdated':
      element = document.getElementById('face-found')
      if (element) element.innerHTML = 'updated'
      break
    case 'facecontroller.facelost':
      element = document.getElementById('face-found')
      if (element) element.innerHTML = 'lost'
      break
    case 'facecontroller.mouthopened':
      element = document.getElementById('mouth-state')
      if (element) element.innerHTML = 'opened'
      break
    case 'facecontroller.mouthclosed':
      element = document.getElementById('mouth-state')
      if (element) element.innerHTML = 'closed'
      break
    case 'facecontroller.lefteyeopened':
      element = document.getElementById('left-eye-state')
      if (element) element.innerHTML = 'opened'
      break
    case 'facecontroller.leftyeclosed':
      element = document.getElementById('left-eye-state')
      if (element) element.innerHTML = 'closed'
      break
    case 'facecontroller.righteyeopened':
      element = document.getElementById('right-eye-state')
      if (element) element.innerHTML = 'opened'
      break
    case 'facecontroller.righteyeclosed':
      element = document.getElementById('right-eye-state')
      if (element) element.innerHTML = 'closed'
      break
    case 'facecontroller.lefteyebrowraised':
      element = document.getElementById('left-eyebrow-state')
      if (element) element.innerHTML = 'raised'
      break
    case 'facecontroller.lefteyebrowlowered':
      element = document.getElementById('left-eyebrow-state')
      if (element) element.innerHTML = 'lowered'
      break
    case 'facecontroller.righteyebrowraised':
      element = document.getElementById('right-eyebrow-state')
      if (element) element.innerHTML = 'raised'
      break
    case 'facecontroller.righteyebrowlowered':
      element = document.getElementById('right-eyebrow-state')
      if (element) element.innerHTML = 'lowered'
      break
    case 'facecontroller.righteyewinked':
      rightEyeWinkCount_++
      element = document.getElementById('right-eye-wink')
      if (element) element.innerHTML = rightEyeWinkCount_.toString()
      break
    case 'facecontroller.lefteyewinked':
      leftEyeWinkCount_++
      element = document.getElementById('left-eye-wink')
      if (element) element.innerHTML = leftEyeWinkCount_.toString()
      break
    case 'facecontroller.blinked':
      blinkCount_++
      element = document.getElementById('blinked')
      if (element) element.innerHTML = blinkCount_.toString()
      break
    case 'facecontroller.interpupillarydistance':
      element = document.getElementById('ipd')
      if (element) {
        element.innerHTML = (
          `${event.detail.interpupillaryDistance.toFixed(2)}mm`
        )
      }
      break
    case 'facecontroller.debug':
      faceDebug = event.data.faceDebug
      if (faceDebug.renderedImg) {
        // Update face rendered image
        const img = faceDebug.renderedImg
        if (img.rowBytes !== img.cols * 4) {
          throw new Error(`Cannot suport row stride skipping rowBytes=${img.rowBytes} cols=${img.cols}`)
        }
        const dataArr = new Uint8ClampedArray(img.pixels, 0)
        const imageData = new ImageData(dataArr, img.cols, img.rows)

        element = document.getElementById('face-debug')

        if (!faceCanvasCtx) {
          faceCanvasCtx = (document.getElementById('face-debug') as HTMLCanvasElement)?.getContext('2d')
        }

        if (faceCanvasCtx) {
          faceCanvasCtx.putImageData(imageData, 0, 0)
        }
      }
      break
    default:
      break
  }
}

const XrEventsDebug = ecs.registerComponent({
  name: 'xr-events-debug',
  add: (world, component) => {
    const debugElement = document.createElement('div')
    debugElement.id = 'xr-events-debug'
    debugElement.setAttribute('style', 'position: fixed; z-index: 2; background-color: rgba(0,0,0,0.5); color: white; padding: 4px; border-radius: 0px 0px 10px 0px')
    document.body.insertAdjacentElement('afterbegin', debugElement)

    debugElement.innerHTML += `
      <div>
        <label>Status</label>
        <span id='camera-status'></span>
      </div>
      <div>
        <label>XR stop</label>
        <span id='xr-stop'</span>
      </div>
      `

    xrEvents.forEach((eventName) => {
      world.events.addListener(component.eid, eventName, onXrDebug)
      world.events.addListener(world.events.globalId, eventName, onXrDebug)
    })
  },
  remove: (world, component) => {
    document.body.removeChild(document.getElementById('xr-events-debug')!)
    xrEvents.forEach((eventName) => {
      world.events.removeListener(component.eid, eventName, onXrDebug)
      world.events.removeListener(world.events.globalId, eventName, onXrDebug)
    })
  },
})

const WorldEffectDebug = ecs.registerComponent({
  name: 'world-effect-debug',
  add: (world, component) => {
    if (document.getElementById('world-effect-debug')) {
      return
    }
    const debugElement = document.createElement('div')
    debugElement.id = 'world-effect-debug'
    debugElement.setAttribute('style', 'position: fixed; z-index: 2; background-color: rgba(0,0,0,0.5); color: white; padding: 4px; border-radius: 0px 0px 10px 0px')
    document.body.insertAdjacentElement('afterbegin', debugElement)

    debugElement.innerHTML += `
      <div>
        <label>Status</label>
        <span id='world-status'></span>
      </div>
      <div>
        <label>Reason</label>
        <span id='world-reason'></span>
      </div>
      <div>
        <label>Location</label>
        <span id='location-status'></span>
      </div>
      <div>
        <label>Mesh</label>
        <span id='mesh-status'></span>
      </div>
      <div>
        <label>Load Status:</label>
        <span id='imageload-status'></span>
      </div>
      <div>
        <label>Found Status:</label>
        <span id='imagefound-status'></span>
      </div>
      `
    worldEffectEvents.forEach((eventName) => {
      world.events.addListener(component.eid, eventName, onWorldUpdate)
      world.events.addListener(world.events.globalId, eventName, onWorldUpdate)
    })
  },
  remove: (world, component) => {
    if (document.getElementById('world-effect-debug')) {
      document.body.removeChild(document.getElementById('world-effect-debug')!)
    }
    worldEffectEvents.forEach((eventName) => {
      world.events.removeListener(component.eid, eventName, onWorldUpdate)
    })
  },
})

const FaceEffectDebug = ecs.registerComponent({
  name: 'face-effect-debug',
  schema: {
    showFaceDebug: 'boolean',
  },
  schemaDefaults: {
    showFaceDebug: false,
  },
  add: (world, component) => {
    const debugElement = document.createElement('div')
    const {schema} = component
    debugElement.id = 'face-effect-debug'
    debugElement.setAttribute('style', 'position: fixed; z-index: 2; background-color: rgba(0,0,0,0.5); color: white; padding: 4px; border-radius: 0px 0px 10px 0px')
    document.body.insertAdjacentElement('afterbegin', debugElement)

    blinkCount_ = 0
    leftEyeWinkCount_ = 0
    rightEyeWinkCount_ = 0

    if (schema.showFaceDebug) {
      debugElement.innerHTML += `
        <div>
          <canvas id='face-debug' height='384' width='384'></canvas>
        </div>
        `
    }

    debugElement.innerHTML += `
      <div>
        <label>Face Loading</label>
        <span id='face-loading'></span>
      </div>
      <div>
        <label>Face Scanning</label>
        <span id='face-scanning'></span>
      </div>
      <div>
        <label>Face Found</label>
        <span id='face-found'></span>
      </div>
      <div>
        <label>Mouth</label>
        <span id='mouth-state'></span>
      </div>
      <div>
        <label>Left Eyebrow</label>
        <span id='left-eyebrow-state'></span>
      </div>
      <div>
        <label>Right Eyebrow</label>
        <span id='right-eyebrow-state'></span>
      </div>
      <div>
        <label>Left Eye</label>
        <span id='left-eye-state'></span>
      </div>
      <div>
        <label>Right Eye</label>
        <span id='right-eye-state'></span>
      </div>
      <div>
        <label>IPD</label>
        <span id='ipd'></span>
      </div>
      <div>
        <label>Left wink</label>
        <span id='left-eye-wink'></span>
      </div>
      <div>
        <label>Right wink</label>
        <span id='right-eye-wink'></span>
      </div>
      <div>
        <label>Blink</label>
        <span id='blinked'></span>
      </div>
    `

    faceEffectEvents.forEach((eventName) => {
      world.events.addListener(component.eid, eventName, onFaceUpdate)
    })
  },
  remove: (world, component) => {
    if (document.getElementById('face-effect-debug')) {
      document.body.removeChild(document.getElementById('face-effect-debug')!)
    }
    faceEffectEvents.forEach((eventName) => {
      world.events.removeListener(component.eid, eventName, onFaceUpdate)
    })
  },
})

export {
  WorldEffectDebug,
  FaceEffectDebug,
  XrEventsDebug,
}
