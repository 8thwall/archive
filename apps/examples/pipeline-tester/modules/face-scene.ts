import '../global'

interface ImageData2D {
  rows: number
  cols: number
  rowBytes: number
  pixels: Uint8Array
}

interface Detection {
  confidence: number
  viewport: {
    offsetX: number
    offsetY: number
    width: number
    height: number
  },
  roi: {
    corners: {
      upperLeft: {
        x: number
        y: number
      },
      upperRight: {
        x: number
        y: number
      },
      lowerLeft: {
        x: number
        y: number
      },
      lowerRight: {
        x: number
        y: number
      },
    },
    renderTexToImageTexMatrix44f: number[]
  },
  points: {
    x: number
    y: number
    z: number
  }[]
}

interface Position {
  x: number
  y: number
  z: number
}

interface DebugOutputs {
  renderedImg?: ImageData2D
  detections?: {
    faces?: Detection[]
    meshes?: Detection[]
    ears?: Detection[]
    earsInFaceRoi?: Position[]
    earsInCameraFeed?: Position[]
    videoWidth?: number
    videoHeight?: number
  }
  earRenderedImg?: ImageData2D
}

// Make a sphere object3d with basic materials
const makeSphere = (radius = 0.1, color = 0xffff00) => {
  const geometry = new THREE.SphereGeometry(radius, 32, 16)
  const material = new THREE.MeshBasicMaterial({color})
  const sphere = new THREE.Mesh(geometry, material)
  return sphere
}

// Build a pipeline module that initializes and updates the three.js scene based on facecontroller
// events.
const faceScenePipelineModule = () => {
  // Start loading mesh url early.
  let canvas_
  let modelGeometry_
  let head_
  let faceTexture_
  let headMesh_
  let scene_
  let renderer_
  let headGltf_
  let faceTextureGltf_
  let morphValue = 0.0

  let leftEyeWinkCount_ = 0
  let rightEyeWinkCount_ = 0
  let blinkCount_ = 0

  let noseAttachment_

  let once = true

  // debug output related
  let faceCanvasCtx_
  let earCanvasCtx_
  let earOnCameraCanvasCtx_

  const earAttachmentNameToObject3d = {
    'leftHelix': makeSphere(0.015, 0xff0000),
    'leftCanal': makeSphere(0.01, 0x00ff00),
    'leftLobe': makeSphere(0.01, 0x0000ff),
    'rightHelix': makeSphere(0.015, 0xff0000),
    'rightCanal': makeSphere(0.01, 0x00ff00),
    'rightLobe': makeSphere(0.01, 0x0000ff),
  }

  // init is called by onAttach and by facecontroller.faceloading. It needs to be called by both
  // before we can start.
  const init = ({canvas, detail}) => {
    if (head_) {
      return
    }

    canvas_ = canvas_ || canvas
    modelGeometry_ = modelGeometry_ || detail

    if (!(canvas_ && modelGeometry_)) {
      return
    }

    console.log('pointsPerDetection: ', modelGeometry_.pointsPerDetection)
    console.log('indices: ', modelGeometry_.indices.length)
    console.log('uvs: ', modelGeometry_.uvs.length)
    console.log('leftEyebrowIndices: ', modelGeometry_.leftEyebrowIndices)
    console.log('rightEyebrowIndices: ', modelGeometry_.rightEyebrowIndices)

    // Get the 3js scene from XR
    scene_ = XR8.Threejs.xrScene().scene
    renderer_ = XR8.Threejs.xrScene().renderer

    // sets render sort order to the order of objects added to scene (for alpha rendering).
    THREE.WebGLRenderer.sortObjects = false

    // add lights.
    const targetObject = new THREE.Object3D()
    targetObject.position.set(0, 0, -1)
    scene_.add(targetObject)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.castShadow = true
    directionalLight.position.set(0, 0.25, 0)
    directionalLight.target = targetObject
    scene_.add(directionalLight)

    const bounceLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5)
    scene_.add(bounceLight)

    // GLTF head mesh
    // const loader = new THREE.OBJLoader()
    const loader = new THREE.GLTFLoader()
    loader.load(
      // require('../assets/face/face-nose-moving2.glb'),
      require('../assets/face/horse-v2.glb'),
      (gltf) => {
        // gltf.scene.traverse((o) => {
        //   if (o.isMesh) {
        //     o.material.envMap = cubeCamera.renderTarget.texture
        //     o.castShadow = true
        //   }
        // })
        // gltf.scene.position.set(0, 0.5, 0)
        // gltf.scene.scale.set(0.1, 0.1, 0.1)
        // gltf.scene.rotation.set(0, -Math.PI / 4, 0)
        console.log('starting adding of gltf')
        headGltf_ = gltf.scene
        faceTextureGltf_ = new THREE.Texture()
        var materialGltf = materialGltf = new THREE.MeshBasicMaterial({wireframe: true})

        const faceTextToggle = <HTMLInputElement>document.getElementById('horseTexture')
        faceTextToggle.addEventListener('change', (e) => {
          if (faceTextToggle.checked) {          
            materialGltf = new THREE.MeshBasicMaterial({map: faceTextureGltf_, side: THREE.DoubleSide})
            headGltf_.children[0].material = materialGltf
          } else {
            materialGltf = new THREE.MeshBasicMaterial({wireframe: true})
            headGltf_.children[0].material = materialGltf
          }
        })

        if ((<HTMLInputElement>document.getElementById('horseTexture')).checked) {
          materialGltf = new THREE.MeshBasicMaterial({map: faceTextureGltf_, side: THREE.DoubleSide})
        } else {
        }

        // const indices = new Array(modelGeometry_.indices.length * 3)
        // for (let i = 0; i < modelGeometry_.indices.length; ++i) {
        //   indices[i * 3] = modelGeometry_.indices[i].a
        //   indices[i * 3 + 1] = modelGeometry_.indices[i].b
        //   indices[i * 3 + 2] = modelGeometry_.indices[i].c
        // }
        // headGltf_.children[0].geometry.setIndex(indices)
        // debugger
        // headGltf_.children[0].geometry.index.needsUpdate = true

        headGltf_.children[0].material = materialGltf
        scene_.add(gltf.scene)
        console.log('finished adding of gltf')
      }
    )

    // HEAD MESH
    head_ = new THREE.Object3D()
    head_.visible = false

    faceTexture_ = new THREE.Texture()
    const material = new THREE.MeshBasicMaterial({map: faceTexture_, side: THREE.DoubleSide})

    // headMesh draws content on the face.
    headMesh_ = XRExtras.ThreeExtras.faceMesh(
      modelGeometry_,
      material
    )
    head_.add(headMesh_.mesh)

    scene_.add(head_)

    // nose attachment point
    noseAttachment_ = makeSphere(0.01, 0xff0000)
    head_.add(noseAttachment_)

    // Ear attachment points
    Object.values(earAttachmentNameToObject3d).forEach((obj3d) => {
      head_.add(obj3d)
    })

    // prevent scroll/pinch gestures on canvas.
    canvas_.addEventListener('touchmove', event => event.preventDefault())
  }

  const showDebug = (debugOutputs: DebugOutputs) => {
    if (debugOutputs.renderedImg) {
      // Update ear rendered image
      const img = debugOutputs.renderedImg
      if (img.rowBytes !== img.cols * 4) {
        throw new Error(`Cannot suport row stride skipping rowBytes=${img.rowBytes} cols=${img.cols}`)
      }
      const dataArr = new Uint8ClampedArray(img.pixels, 0)
      const imageData = new ImageData(dataArr, img.cols, img.rows)

      // initialize 2d canvas context once
      if (!faceCanvasCtx_) {
        faceCanvasCtx_ = (document.getElementById('debugFace') as HTMLCanvasElement)?.getContext('2d')
      }
      faceCanvasCtx_?.putImageData(imageData, 0, 0)

      // Draw visualizations of the ear landmarks on the face roi.
      if (debugOutputs.detections && debugOutputs.detections.earsInFaceRoi) {
        const {earsInFaceRoi} = debugOutputs.detections
        const ear0 = debugOutputs.detections.ears[0]
        const ear1 = debugOutputs.detections.ears[1]

        if (ear0 && (earsInFaceRoi.length > 0)) {
          const earViewport = debugOutputs.detections.ears[0].viewport
          for (let i = 0; i < 3; i += 1) {
            const point = earsInFaceRoi[i]
            faceCanvasCtx_.fillStyle = 'LightGreen'
            faceCanvasCtx_.fillRect(point.x * earViewport.width + earViewport.offsetX, point.y * earViewport.height + earViewport.offsetY, 4, 4)
          }
        }

        if (ear1 && (earsInFaceRoi.length > 3)) {
          const earViewport = debugOutputs.detections.ears[1].viewport
          for (let i = 3; i < earsInFaceRoi.length; i += 1) {
            const point = earsInFaceRoi[i]
            faceCanvasCtx_.fillStyle = 'SkyBlue'
            faceCanvasCtx_.fillRect(point.x * earViewport.width + earViewport.offsetX, point.y * earViewport.height + earViewport.offsetY, 4, 4)
          }
        }
      }
    }

    if (debugOutputs.earRenderedImg) {
      // Update ear rendered image
      const img = debugOutputs.earRenderedImg
      if (img.rowBytes !== img.cols * 4) {
        throw new Error(`Cannot suport row stride skipping rowBytes=${img.rowBytes} cols=${img.cols}`)
      }
      const dataArr = new Uint8ClampedArray(img.pixels, 0)
      const imageData = new ImageData(dataArr, img.cols, img.rows)

      // initialize 2d canvas context once
      if (!earCanvasCtx_) {
        earCanvasCtx_ = (document.getElementById('debugEar') as HTMLCanvasElement)?.getContext('2d')
      }
      earCanvasCtx_?.putImageData(imageData, 0, 0)

      // Draw ear landmarks on the ear rois.
      if (debugOutputs.detections) {
        const ear0 = debugOutputs.detections.ears[0]
        const ear1 = debugOutputs.detections.ears[1]

        // Constants are found in reality/engine/ears/ear-types.h for landmark detection window.
        const detectionInputWidth = 112
        const detectionInputHeight = 160

        if ((ear0) && (ear0.points.length > 2)) {
          for (let i = 2; i < ear0.points.length; i += 1) {
            const point = ear0.points[i]
            earCanvasCtx_.fillStyle = 'LightGreen'
            earCanvasCtx_.fillRect(point.x * detectionInputWidth, point.y * detectionInputHeight, 4, 4)
          }
        }

        if (ear1) {
          for (let i = 2; i < ear1.points.length; i += 1) {
            const point = ear1.points[i]
            earCanvasCtx_.fillStyle = 'SkyBlue'
            earCanvasCtx_.fillRect(point.x * detectionInputWidth, (1 + point.y) * detectionInputHeight, 4, 4)
          }
        }
      }
    }

    const camerafeedCanvas = (document.getElementById('camerafeed') as HTMLCanvasElement)
    const earOnCameraCanvas = (document.getElementById('debugEarOnCamera') as HTMLCanvasElement)
    if (debugOutputs.detections && debugOutputs.detections.earsInCameraFeed && camerafeedCanvas && earOnCameraCanvas) {
      if (!earOnCameraCanvasCtx_) {
        earOnCameraCanvasCtx_ = (document.getElementById('debugEarOnCamera') as HTMLCanvasElement)?.getContext('2d')

        const aspectRatio = camerafeedCanvas.getBoundingClientRect().height / camerafeedCanvas.getBoundingClientRect().width
        const desiredWidth = window.innerWidth
        const desiredHeight = aspectRatio * desiredWidth
        if (earOnCameraCanvas.width !== desiredWidth) {
          earOnCameraCanvas.width = desiredWidth
        }
        if (earOnCameraCanvas.height !== desiredHeight) {
          earOnCameraCanvas.height = desiredHeight
        }
      }

      // Need to adjust the aspect ratio to accomodate the cropping that happens to the camera feed
      // when displayed. Currently not accurate (TODO)
      const aspectRatio = debugOutputs.detections.videoWidth / debugOutputs.detections.videoHeight
      const detectionInputWidth = earOnCameraCanvas.width
      const detectionInputHeight = earOnCameraCanvas.width / aspectRatio
      const {earsInCameraFeed} = debugOutputs.detections
      const heightDiff = (detectionInputHeight - earOnCameraCanvas.height) / 2

      earOnCameraCanvasCtx_.clearRect(0, 0, earOnCameraCanvasCtx_.canvas.width,
        earOnCameraCanvasCtx_.canvas.height)
      earOnCameraCanvasCtx_.beginPath()

      for (let i = 0; i < earsInCameraFeed.length; i += 1) {
        const point = earsInCameraFeed[i]
        earOnCameraCanvasCtx_.fillStyle = 'LightGreen'
        if (i > 2) {
          earOnCameraCanvasCtx_.fillStyle = 'SkyBlue'
        }
        earOnCameraCanvasCtx_.fillRect(point.x * detectionInputWidth,
          point.y * detectionInputHeight - heightDiff, 5, 5)
      }
    }
  }

  const onUpdate = ({processCpuResult}) => {
    if (!processCpuResult) {
      console.log('no processCpuResult')
      return
    }
    if (!processCpuResult.facecontroller) {
      console.log('no facecontroller in processCpuResult')
      return
    }
    if (!processCpuResult.facecontroller.cameraFeedTexture) {
      console.log('no cameraFeedTexture in facecontroller')
      return
    }
    const {cameraFeedTexture} = processCpuResult.facecontroller
    // console.log('\n\ngot camera feed')
    const texProps = renderer_.properties.get(faceTexture_)
    // console.log('got texProps')
    texProps.__webglTexture = cameraFeedTexture
    // console.log('set __webglTexture')
    if (faceTextureGltf_ === undefined || faceTextureGltf_ === null) {
      console.log('faceTextureGltf_ not loaded yet')
      return
    }
    const texPropsGltf = renderer_.properties.get(faceTextureGltf_)
    // console.log('got textPropsGLtf')
    texPropsGltf.__webglTexture = cameraFeedTexture
    // console.log('finished on update')

    // Show debug data
    if (processCpuResult.facecontroller.debug) {
      showDebug(processCpuResult.facecontroller.debug)
    }
  }

  const onDetach = () => {
    canvas_ = null
    modelGeometry_ = null
  }

  const show = (event) => {
    const {transform, uvsInCameraFrame, vertices, attachmentPoints} = event.detail

    if (once) {
      console.log('uvsInCameraFrame: ', uvsInCameraFrame.length)
      once = false
    }

    const camPos = new THREE.Vector3(transform.position.x, transform.position.y, transform.position.z)
    const nosePos = new THREE.Vector3(attachmentPoints.noseTip.x, attachmentPoints.noseTip.y, attachmentPoints.noseTip.z)

    const camToNoseDist = camPos.distanceTo(nosePos)
    // console.log("nose pos", attachmentPoints.noseTip, 'camToNoseDist', camToNoseDist)

    // Update the overall head position.
    head_.position.copy(transform.position)
    head_.setRotationFromQuaternion(transform.rotation)
    head_.scale.set(transform.scale, transform.scale, transform.scale)

    headGltf_.position.copy(transform.position)
    headGltf_.setRotationFromQuaternion(transform.rotation)
    // not sure why z needed to be inverted....
    headGltf_.scale.set(transform.scale, transform.scale, -transform.scale)

    // debugger
    // @ts-ignore
    if (window.leggo) {
    // if (false) {
      const morphTarget = 'Key 1'
      headGltf_.traverse((o) => {
        if (o.morphTargetInfluences && o.userData.targetNames) {
          const pos = o.userData.targetNames.indexOf(morphTarget)
          // console.log(`Updating morphtarget ${morphTarget}`)
          o.morphTargetInfluences[pos] = Math.min(morphValue, 1.0)
          // o.morphTargetInfluences[pos] = morphValue % 1.0
          morphValue += 0.02
        }
      })
    }

    const gltfVertices = new Float32Array(vertices.length * 3)
    for (let i = 0; i < vertices.length; ++i) {
      gltfVertices[i * 3] = vertices[i].x
      gltfVertices[i * 3 + 1] = vertices[i].y
      gltfVertices[i * 3 + 2] = -vertices[i].z
    }
    headGltf_.children[0].geometry.setAttribute('position', new THREE.BufferAttribute(gltfVertices, 3))
    headGltf_.children[0].geometry.attributes.position.needsUpdate = true

    const uvs = new Float32Array(uvsInCameraFrame.length * 2)
    for (let i = 0; i < uvsInCameraFrame.length; ++i) {
      uvs[i * 2] = uvsInCameraFrame[i].u
      uvs[i * 2 + 1] = uvsInCameraFrame[i].v
    }

    head_.children[0].geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    headGltf_.children[0].geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))

    // update nose attachment point
    noseAttachment_.position.copy(attachmentPoints.noseTip.position)

    // update ear attachment points
    Object.entries(earAttachmentNameToObject3d).forEach(([locationName, object3d]) => {
      if (!attachmentPoints[locationName]) {
        return
      }

      const {position} = attachmentPoints[locationName]
      object3d.position.copy(position)
    })

    // Update the face mesh.
    headMesh_.show(event)
    head_.visible = true
  }

  const hide = () => {
    head_.visible = false
    headMesh_.hide()
  }

  const onBlinkWink = (event) => {
    switch (event.name) {
      case 'facecontroller.lefteyewinked':
        leftEyeWinkCount_++
        document.getElementById('left-eye-wink').innerHTML = `${leftEyeWinkCount_}`
        break
      case 'facecontroller.righteyewinked':
        rightEyeWinkCount_++
        document.getElementById('right-eye-wink').innerHTML = `${rightEyeWinkCount_}`
        break
      case 'facecontroller.blinked':
        blinkCount_++
        document.getElementById('blinked').innerHTML = `${blinkCount_}`
        break
      default:
      // code block
        break
    }
  }

  const onFaceStateUpdate = (event) => {
    // console.log(`${event.name} + ${JSON.stringify(event.detail)}`)
    let element = null
    switch (event.name) {
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
      case 'facecontroller.lefteyeclosed':
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
      case 'facecontroller.interpupillarydistance':
        element = document.getElementById('ipd')
        if (element) {
          element.innerHTML = (
            `${event.detail.interpupillaryDistance.toFixed(2)}mm`
          )
        }
        break
      case 'facecontroller.earfound':
        {
          const elmId = `${event.detail.ear}-ear-state`
          element = document.getElementById(elmId)
          if (element) element.innerHTML = 'found'
        }
        break
      case 'facecontroller.earlost':
        {
          const elmId = `${event.detail.ear}-ear-state`
          element = document.getElementById(elmId)
          if (element) element.innerHTML = 'lost'
        }
        break
      case 'facecontroller.earpointfound':
        element = document.getElementById(event.detail.point)
        element.innerHTML = 'found'
        break
      case 'facecontroller.earpointlost':
        element = document.getElementById(event.detail.point)
        element.innerHTML = 'lost'
        break
      default:
      // code block
        break
    }
  }

  return {
    name: 'facescene',
    onAttach: init,
    onDetach,
    onUpdate,
    listeners: [
      {event: 'facecontroller.faceloading', process: init},
      {event: 'facecontroller.facefound', process: show},
      {event: 'facecontroller.faceupdated', process: show},
      {event: 'facecontroller.facelost', process: hide},
      {event: 'facecontroller.mouthopened', process: onFaceStateUpdate},
      {event: 'facecontroller.mouthclosed', process: onFaceStateUpdate},
      {event: 'facecontroller.lefteyeopened', process: onFaceStateUpdate},
      {event: 'facecontroller.lefteyeclosed', process: onFaceStateUpdate},
      {event: 'facecontroller.righteyeopened', process: onFaceStateUpdate},
      {event: 'facecontroller.righteyeclosed', process: onFaceStateUpdate},
      {event: 'facecontroller.lefteyebrowraised', process: onFaceStateUpdate},
      {event: 'facecontroller.lefteyebrowlowered', process: onFaceStateUpdate},
      {event: 'facecontroller.righteyebrowraised', process: onFaceStateUpdate},
      {event: 'facecontroller.righteyebrowlowered', process: onFaceStateUpdate},
      {event: 'facecontroller.interpupillarydistance', process: onFaceStateUpdate},
      {event: 'facecontroller.lefteyewinked', process: onBlinkWink},
      {event: 'facecontroller.righteyewinked', process: onBlinkWink},
      {event: 'facecontroller.blinked', process: onBlinkWink},
      {event: 'facecontroller.earfound', process: onFaceStateUpdate},
      {event: 'facecontroller.earlost', process: onFaceStateUpdate},
      {event: 'facecontroller.earpointfound', process: onFaceStateUpdate},
      {event: 'facecontroller.earpointlost', process: onFaceStateUpdate},
    ],
  }
}

export {faceScenePipelineModule}
