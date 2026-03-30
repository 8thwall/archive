const portalNames = [
  'apollo',
  'athena',
  'cassini',
  'curiosity',
  'gemini',
  'hayabusa',
  'osiris',
  'pioneer',
  'sputnik',
  'voyager',
]

const codeNames = [
  'moonlight',
  'megalith',
  'perspective',
  'rover',
  'reflection',
  'swarm',
  'asteroid',
  'paradox',
  'disarray',
  'sighting',
]

const isDev = window.location.href.includes('10.8.8.')
const resetTimeoutMillis  = 30 * 1000
const logbookUrl = isDev ? '/' : '/portalhunt'

const currentPortal = portalNames.find(name => window.location.href.includes(name)) || isDev && portalNames[codeNames.findIndex(name=>window.location.href.includes(name))]

const almostTherePath = '/shared/almostthere.html'
const goToAlmostThere = parameters => {
  parameters = parameters || {}
  parameters.u = parameters.u || window.location.href
  const p = new URLSearchParams()
  Object.keys(parameters).forEach(k=>parameters[k] && p.set(k, parameters[k]))
  window.location.href = almostTherePath + '?' + p.toString()
}

// Load extra required scripts and get current user data
const scriptUrls = [
  '/shared/portalhunt.js',
  '//unpkg.com/axios/dist/axios.min.js',
  '//cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/core.js',
]

const scriptUrlsAfter = [
  '//cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/sha1.min.js',
]

const loadScript = url => {
  const scriptElement = document.createElement('script')
  scriptElement.src = url

  const loadPromise = new Promise((resolve, reject) => {
    scriptElement.onload = resolve
    scriptElement.onerror = reject
  })
  document.head.appendChild(scriptElement)
  return loadPromise
}

Promise.all(scriptUrls.map(loadScript))
.then(() => Promise.all(scriptUrlsAfter.map(loadScript)))
.then(() => {
  const currentUser = getLoggedInUser()

  const logbookContainer = document.getElementById('logbookContainer')
  logbookContainer && (logbookContainer.href = logbookUrl)

  if (currentUser && currentPortal) {
    getUserData(currentUser, (res, err) => {

      if (res) {
        const isAlreadyComplete = res.lockedPortals[currentPortal] > 0 || res.unlockedPortals[currentPortal] > 0
        console.log('alreadycomplete', isAlreadyComplete)
        if (isAlreadyComplete) {
          document.body.classList.add('collected')
        }
      }
    })
  }
})
.catch(() => {
  goToAlmostThere()
})

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.body.classList.add('loading')
  }, 100)
})

AFRAME.registerComponent('portal-loading', {
  init: function() {
    this.el.sceneEl.addEventListener('realityready', () => {
      document.body.classList.add('loaded')
    })
  }
})

let hasMotion = false
const handleOrientation = () => {
  window.removeEventListener('devicemotion', handleOrientation)
  hasMotion = true
}
window.addEventListener('devicemotion', handleOrientation)


AFRAME.registerComponent('almost-there', {
  schema: {
    url: { type: 'string' },
    domain: { type: 'string' },
    requireMotion: { default: false },
  },
  init: function() {
    const redirectToError = parameters => {
      parameters = parameters || {}
      parameters.u = parameters.u || this.data.url
      goToAlmostThere(parameters)
    }

    this.el.sceneEl.addEventListener('realityready', () => {
      if (this.data.requireMotion && !hasMotion) {
        return redirectToError({ m: 'motion' })
      }
    })

    this.el.sceneEl.addEventListener('realityerror', e => {
      const reasons = XR8.XrDevice.incompatibleReasons()
      const device = XR8.XrDevice.deviceEstimate()

      if (reasons.length === 0) {
        return redirectToError()
      }

      if (device.os === 'iOS') {
        const isMissingWebAssembly = reasons.includes(XR8.XrDevice.IncompatibilityReasons.MISSING_WEB_ASSEMBLY)
        if (isMissingWebAssembly) {
          redirectToError({ m: 'update' })
        } else {
          redirectToError({ m: 'webview' })
        }
      } else if (device.os === 'Android') {
        redirectToError({ m: 'unsupported' })
      } else {
        redirectToError({ m: 'desktop' })
      }
    })

    this.el.sceneEl.addEventListener('camerastatuschange', e => {
      if (e.detail.status === 'failed') {

        let browser = XR8.XrDevice.deviceEstimate().browser.name.toLowerCase()
        if (browser.includes('afari')) {
          browser = 'safari'
        } else if (browser.includes('amsung')) {
          browser = 'samsung'
        }

        redirectToError({
          m: 'camera',
          d: this.data.domain,
          b: browser,
        })
      }
    })
  },
})

// Shared Portal UI manager
document.addEventListener('DOMContentLoaded', () => {

  let overlay, objectivePrompt, objectiveProgress, alertBar, interactionPrompt, interactImage
  let showedCollected = false

  const animationMillis = 500

  let isShowing = false
  let isAnimatingIn = false
  let isAnimatingOut = false

  let clearAfterEnter = false
  let showAfterClear = null

  let clearTimeout = null

  const onAfterEnter = () => {
    isAnimatingIn = false
    if (clearAfterEnter) {
      clearAlert()
      clearAfterEnter = false
    }
  }

  const onAfterClear = () => {
    isAnimatingOut = false
    isShowing = false
    if (showAfterClear) {
      showAlert(showAfterClear)
      showAfterClear = null
    }
  }

  const showAlert = alert => {
    if (!isShowing) {
      const {text, duration} = alert
      alertBar.classList.remove('animate-out')
      alertBar.classList.remove('animate-in')
      alertBar.textContent = text
      alertBar.classList.add('animate-in')
      isAnimatingIn = true
      isShowing = true
      setTimeout(() => {
        isAnimatingIn = false

        if (clearAfterEnter) {
          clearAlert()
        }
      }, animationMillis)

      if (duration) {
        setTimeout(clearAlert, animationMillis + duration)
      }
    } else {
      showAfterClear = alert
      clearAlert()
    }
  }

  const clearAlert = () => {
    if (!isShowing) {
      return
    }

    if (isAnimatingOut) {
      return
    }

    if (isAnimatingIn) {
      clearAfterEnter = true
    } else if (!isAnimatingOut) {
      alertBar.classList.remove('animate-in')
      alertBar.classList.add('animate-out')
      isAnimatingOut = true
      setTimeout(onAfterClear, animationMillis)
    }
  }

  const generateMainOverlay = parent => {

    const topBar = document.createElement('div')
    topBar.classList.add('top-bar', 'shadowed')

    const logbookContainer = document.createElement('a')
    logbookContainer.id = 'logbookContainer'
    logbookContainer.classList.add('logbook-container')
    logbookContainer.href = logbookUrl
    const logbookIcon = document.createElement('img')
    logbookIcon.classList.add('logbook-container')
    logbookIcon.src = '/shared/svg/logbook.svg'
    logbookContainer.appendChild(logbookIcon)

    const logbookMarker = document.createElement('div')
    logbookMarker.classList.add('logbook-marker')
    logbookContainer.appendChild(logbookMarker)

    topBar.appendChild(logbookContainer)

    objectivePrompt = document.createElement('div')
    objectivePrompt.classList.add('objective-prompt', 'futura', 'fade-in-on-scan')
    topBar.appendChild(objectivePrompt)

    objectiveProgress = document.createElement('div')
    objectiveProgress.classList.add('objective-progress', 'fade-in-on-scan')
    topBar.appendChild(objectiveProgress)

    alertBar = document.createElement('div')
    alertBar.id = 'alertBar'
    alertBar.classList.add('shadowed')

    interactionPrompt = document.createElement('div')
    interactionPrompt.classList.add('interaction-prompt', 'shadowed')

    interactImage = document.createElement('img')
    interactImage.classList.add('interaction-image')
    interactionPrompt.appendChild(interactImage)

    interactionText = document.createElement('span')
    interactionText.classList.add('interaction-text')
    interactionPrompt.appendChild(interactionText)

    const signUpModal = document.createElement('div')
    signUpModal.classList.add('sign-up-modal', 'absolute-center', 'shadowed')

    signUpModal.innerHTML = 'Congratulations, Explorer!<br> You\'ve completed your first portal. Sign up to save your progress and become eligible to win the contest!'

    const signUpLink = document.createElement('a')
    signUpLink.classList.add('sign-up-link')
    signUpLink.textContent = 'Sign Up'
    signUpLink.href = isDev ? '/#register' : '/portalhunt#logbook'
    signUpModal.appendChild(signUpLink)

    const signUpDismiss = document.createElement('a')
    signUpDismiss.classList.add('sign-up-dismiss')
    signUpDismiss.textContent = 'Dismiss'
    signUpDismiss.addEventListener('click', () => {
      document.body.classList.remove('sign-up')
    })
    signUpModal.appendChild(signUpDismiss)

    parent.appendChild(signUpModal)

    const replayButton = document.createElement('button')
    replayButton.classList.add('replay-button', 'share-tech')
    replayButton.textContent = 'Replay'
    replayButton.addEventListener('click', () => {
      window.location.reload()
    })
    parent.appendChild(replayButton)

    parent.prepend(interactionPrompt)
    parent.prepend(alertBar)
    parent.prepend(topBar)
  }

  // Populate / generate UI elements
  overlay = document.getElementById('overlay')
  if (!overlay) {
    overlay = document.createElement('div')
    overlay.id = 'overlay'
    overlay.classList.add('absolute-fill', 'share-tech')
    document.body.appendChild(overlay)
  }

  alertBar = document.getElementById('alertBar')
  if (!alertBar) {
    generateMainOverlay(overlay)
  }

  window.addEventListener('newalert', e => {
    showAlert(e.detail)
  })

  window.addEventListener('clearalert', clearAlert)

  window.addEventListener('changeobjective', e => {
    objectivePrompt.textContent = e.detail.text
  })

  window.addEventListener('clearobjective', () => {
    objectivePrompt.textContent = ''
  })

  window.addEventListener('changeprogress', e => {
    objectiveProgress.textContent = e.detail.text
  })

  window.addEventListener('clearprogress', () => {
    objectiveProgress.textContent = ''
  })

  window.addEventListener('changeprompt', e => {
    interactionText.textContent = e.detail.text

    if(!e.detail.icon) {
      interactImage.style.display = 'none'
      return
    }

    if(e.detail.text.includes('fire')) {
      interactionPrompt.style.bottom = '20vh'
    }

    interactImage.style.display = 'block'

    switch (e.detail.icon) {
      case 'tap':
        //use tap symbol
        interactImage.src = '/shared/interact-tap.svg'
        console.log('use tap sym')
        break;
      case 'swipe':
        //use swipe symbol
        interactImage.src = '/shared/interact-swipe.svg'
        console.log('use swipe sym')
        break;
      case 'move':
        //use move symbol
        interactImage.src = '/shared/interact-move.svg'
        console.log('use move sym')
        break;
    }
  })

  window.addEventListener('clearprompt', () => {
    interactionText.textContent = ''
    interactImage.style.display = 'none'
  })

  window.addEventListener('scanned', () => {
    document.body.classList.add('scanned')
  })

  window.addEventListener('collected', e => {
    if (showedCollected) {
      return
    }
    showedCollected = true
    showAlert({ text: 'Collected!', duration: 3500 })
    document.body.classList.add('collected')

    if (currentPortal) {
      const currentUser = getLoggedInUser()
      if (currentUser) {
        solvePortal(currentPortal, currentUser)
      } else {
        localStorage.setItem('completedChallenge', currentPortal)
        setTimeout(() => {
          document.body.classList.add('sign-up')
        }, 3000)
      }
    }

    if (e.detail && e.detail.replay) {
      setTimeout(()=>{
        document.body.classList.add('show-replay')
      }, e.detail.replayDelay || 3500)
    }
  })
})

window.emit = (name, detail) => {
  window.dispatchEvent(new CustomEvent(name, { detail }))
}

AFRAME.registerComponent('unnamed-image-target', {
  schema: {
    name: { default: '' },
    hideDelay: { default: 500 },
    hideOnLost: { default: true },
    skyElement: { type: 'selector' },
  },
  init: function() {

    const object3D = this.el.object3D

    this.updateTarget = ({detail}) => {
      if (this.data.name && detail.name !== this.data.name) {
        return
      }

      clearTimeout(this.hideTimeout)

      if (this.data.skyElement) {
        this.data.skyElement.object3D.visible = true
      }
      object3D.visible = true

      object3D.position.copy(detail.position)
      object3D.quaternion.copy(detail.rotation)
      object3D.scale.set(detail.scale, detail.scale, detail.scale)
    }

    const hideTarget = () => {
      if (this.data.skyElement) {
        this.data.skyElement.object3D.visible = false
      }
      object3D.visible = false
    }

    this.handleTargetLost = ({detail}) => {
      if (this.data.name && detail.name !== this.data.name) {
        return
      }

      if (this.data.hideOnLost) {
        clearTimeout(this.hideTimeout)
        if (this.data.hideDelay) {
          this.hideTimeout = setTimeout(hideTarget, this.data.hideDelay)
        } else {
          hideTarget()
        }
      }
    }

    hideTarget()

    this.el.sceneEl.addEventListener('xrimagefound', this.updateTarget)
    this.el.sceneEl.addEventListener('xrimageupdated', this.updateTarget)
    this.el.sceneEl.addEventListener('xrimagelost', this.handleTargetLost)
  },
  remove: function() {
    this.el.sceneEl.removeEventListener('xrimagefound', this.updateTarget)
    this.el.sceneEl.removeEventListener('xrimageupdated', this.updateTarget)
    this.el.sceneEl.removeEventListener('xrimagelost', this.handleTargetLost)
  }
})

AFRAME.registerComponent('portal-hider', {
  schema: {
    ringDepth: { default: 0.07 },
    ringSegments: { default: 12 },
    side: { default: 'double' },
  },
  init: function() {
    const ring = document.createElement('a-ring')
    ring.setAttribute('radius-inner', 0.5)
    ring.setAttribute('radius-outer', 100000)
    ring.setAttribute('hider-material', { side: this.data.side })
    ring.setAttribute('segments-theta', this.data.ringSegments)
    ring.setAttribute('theta-start', 180 / this.data.ringSegments)
    ring.object3D.scale.set(0.001, 0.001, 0.001)
    this.el.prepend(ring)

    const hole = document.createElement('a-cylinder')
    hole.setAttribute('radius', 0.5)
    hole.setAttribute('open-ended', 'true')
    hole.setAttribute('rotation', '90 0 0')
    hole.setAttribute('segments-radial', this.data.ringSegments)
    hole.setAttribute('theta-start', 180 / this.data.ringSegments)
    hole.object3D.scale.y = this.data.ringDepth
    hole.object3D.position.z = hole.object3D.scale.y / -2
    hole.setAttribute('material', { side: 'double', flatShading: true })
    hole.setAttribute('color', 'gray')
    ring.appendChild(hole)

    const animateRing = () => {
      window.removeEventListener('scanned', animateRing)
      ring.removeAttribute('animation__open')
      setTimeout(() => {
        ring.setAttribute('animation__open', {
          property: 'scale',
          from: {x: 0.001, y: 0.001, z: 0.001},
          to: {x: 0.7, y: 0.92, z: 1},
          easing: 'easeOutElastic',
          dur: 1700,
        })
      }, 10)
    }
    window.addEventListener('scanned', animateRing)

    const cubeSize = 25
    const halfCubeSize = cubeSize / 2
    const rightAngle = Math.PI / 2

    const walls = [
      { position: { x: 0, y: halfCubeSize, z: halfCubeSize }, rotation: { x: rightAngle , y: 0 } }, // Ceiling
      { position: { x: 0, y: -halfCubeSize, z: halfCubeSize }, rotation: { x: -rightAngle , y: 0 } }, // Floor
      { position: { x: 0, y: 0, z: cubeSize }, rotation: { x: 0 , y: 0 } }, // Back wall
      { position: { x: -halfCubeSize, y: 0, z: halfCubeSize }, rotation: { x: -rightAngle , y: rightAngle } }, // Left wall
      { position: { x: halfCubeSize, y: 0, z: halfCubeSize }, rotation: { x: -rightAngle , y: rightAngle } }, // Right wall
    ]

    for (let wall of walls) {
      const plane = document.createElement('a-plane')
      plane.setAttribute('material', 'side: double')
      plane.setAttribute('hider-material', { side: this.data.side })
      plane.object3D.scale.set(cubeSize, cubeSize, cubeSize)
      plane.object3D.position.copy(wall.position)
      plane.object3D.rotation.x = wall.rotation.x
      plane.object3D.rotation.y = wall.rotation.y
      this.el.appendChild(plane)
    }
  }
})

AFRAME.registerComponent('hider-material', {
  schema: {
    side: { default: 'double' },
  },
  init: function() {
    const mesh = this.el.getObject3D('mesh')
    mesh.material.side = parseSide(this.data.side)
    mesh.material.colorWrite = false
    mesh.renderOrder = -1
    this.el.object3D.renderOrder = -1
    this.el.sceneEl.renderer.sortObjects = true
  },
})

const parseSide = side => {
  switch (side) {
    case 'back': {
      return THREE.BackSide;
    }
    case 'double': {
      return THREE.DoubleSide;
    }
    default: {
      return THREE.FrontSide;
    }
  }
}

AFRAME.registerComponent('portal-sky', {
  schema: {
    src: { default: '#sky' },
    rotation: { default: 0 },
    useImageTarget: { default: true },
    targetName: { default: '' },
  },
  init: function() {
    if (this.data.useImageTarget) {
      this.el.object3D.scale.set(100, 100, 100)
    }

    if (this.data.src) {
      const sky = document.createElement('a-sky')
      sky.setAttribute('material', { color: 'white', src: this.data.src })
      sky.setAttribute('geometry', { radius: 100 })
      sky.object3D.rotation.x = this.data.rotation
      this.el.appendChild(sky)
    }

    this.el.sceneEl.addEventListener('xrimagefound', e => {
      if (this.data.targetName && e.detail.name !== this.data.targetName) {
        return
      }
      this.el.object3D.quaternion.copy(e.detail.rotation)
    })
  }
})

// Line component that uses cylinders instead
AFRAME.registerComponent('cylinder-line', {
  schema: {
    start: { type: 'vec3' },
    end: { type: 'vec3' },
    color: { type: 'color', default: 'black' },
    width: { default: 0.015 },
    opacity: { default: 0.5 },
  },
  init: function() {
    this.cylinder = document.createElement('a-cylinder')
    if (this.data.opacity !== 1) {
      this.cylinder.setAttribute('material', { shader: 'flat', transparent: true, opacity: this.data.opacity })
    } else {
      this.cylinder.setAttribute('material', { shader: 'flat', transparent: false, opacity: 1 })
    }
    this.cylinder.object3D.position.y = 0.5
    this.el.appendChild(this.cylinder)
    this.el.object3D.scale.set(this.data.width, 1, this.data.width)

    this.up = new THREE.Vector3(0, 1, 0)
    this.tempVector3 = new THREE.Vector3()
  },
  update: function() {
    if (!this.data) {
      return
    }

    this.tempVector3.copy(this.data.end).sub(this.data.start)

    const length = this.tempVector3.length()
    this.tempVector3.multiplyScalar(1 / length)

    this.el.object3D.position.copy(this.data.start)
    this.el.object3D.quaternion.setFromUnitVectors(this.up, this.tempVector3)
    this.el.object3D.scale.set(this.data.width, length, this.data.width)

    this.cylinder.setAttribute('material', { color: this.data.color })
  }
})

const spinRelic = (relic, duration = 1500, start= 0) => {
  if (!AFRAME.components.animation) {
    console.error('Spin relic depends on animation component')
  }

  relic.removeAttribute('animation__spin')
  relic.setAttribute('animation__spin', {
    property: 'object3D.rotation.y',
    from: start,
    to: 2 * Math.PI + start,
    dur: duration,
    easing: 'linear',
    loop: true,
  })
}

const cameraZoomRelic = camera => {
  const relic = document.createElement('a-entity')
  relic.setAttribute('gltf-model', '#relicModel')
  relic.object3D.position.set(0, -0.5, -0.5)
  spinRelic(relic, 2000, Math.PI)
  camera.appendChild(relic)
  setTimeout(()=> {
    zoomRelic(relic, 0.5, 'y', 2000, 'linear')
    setTimeout(() => {
      camera.removeChild(relic)
    }, 2000)
  }, 10)
}

const zoomRelic = (relic, distance = 10, axis = 'y', duration = 2000, easing = 'easeInQuad', hide = true) => {
  if (!AFRAME.components.animation) {
    console.error('Zoom relic depends on animation component')
  }
  relic.removeAttribute('animation__zoom')
  relic.setAttribute('animation__zoom', {
    property: 'object3D.position.' + axis,
    easing: easing,
    loop: false,
    to: distance,
    dur: duration,
  })
  if (hide) {
    setTimeout(() => {
      relic.object3D.visible = false
    }, duration)
  }
}

const getSkyElement = (base, skyProps, imageTargetProps) => {
  let skyElement = base
  if (hasMotion) {
    skyElement = document.createElement('a-entity')
    skyElement.id = 'portal-sky'
    AFRAME.scenes[0].appendChild(skyElement)
    base.setAttribute('unnamed-image-target', { skyElement: '#' + skyElement.id, ...imageTargetProps })
  } else {
    base.setAttribute('unnamed-image-target', { ...imageTargetProps })
  }
  skyElement.setAttribute('portal-sky', { useImageTarget: hasMotion, ...skyProps })
  return skyElement
}

const goBackToLogbook = () => {
  window.location.href = logbookUrl
}

let blurTimeout
window.addEventListener('blur', () => {
  clearTimeout(blurTimeout)
  blurTimeout = setTimeout(goBackToLogbook, resetTimeoutMillis)
})

window.addEventListener('focus', () => {
  clearTimeout(blurTimeout)
})

let videoTimeout
let previousTime
window.addEventListener('xrloaded', () => {
  XR8.addCameraPipelineModule({
    name: 'monitor',
    onProcessGpu: ({frameStartResult: { videoTime }}) => {
      if (!previousTime) {
        previousTime = videoTime
        return
      }
      if (previousTime < videoTime) {
        if (videoTimeout) {
          clearTimeout(videoTimeout)
          videoTimeout = null
        }
      } else if (!videoTimeout) {
        videoTimeout = setTimeout(goBackToLogbook, 1500)
      }
      previousTime = videoTime
    }
  })
})
