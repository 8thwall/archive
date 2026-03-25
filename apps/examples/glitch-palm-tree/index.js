const peekDistance = 2
const stayDistance = 1.5
const rock1Position = new THREE.Vector3(-3, 0, -2.5)
const rock2Position = new THREE.Vector3(0, 0, -5.5)
const rock3Position = new THREE.Vector3(3, 0, -3)

const rock1To2Angle = Math.PI / -4
const rock2To3Angle = -Math.PI / 2

const peekActions = []

// Peek from center rock
const rock2PositionStay = rock2Position.clone()
rock2PositionStay.z -= stayDistance
peekActions.push({
  type: 'peek',
  from: rock2PositionStay,
  to: rock2PositionStay.clone().add(new THREE.Vector3(peekDistance, 0, 0))
})

peekActions.push({
  type: 'peek',
  angle: Math.PI / 6,
  from: rock2PositionStay,
  to: rock2PositionStay.clone().add(new THREE.Vector3(-peekDistance, 0, 0))
})

// Peek from left rock
const rock1PositionStay = rock1Position.clone()
rock1PositionStay.z -= stayDistance
peekActions.push({
  type: 'peek',
  angle: Math.PI / 8,
  from: rock1PositionStay,
  to: rock1PositionStay.clone().add(new THREE.Vector3(peekDistance, 0, 0))
})

// Peek from right rock
const rock3PositionStay = rock3Position.clone()
rock3PositionStay.z -= stayDistance
peekActions.push({
  type: 'peek',
  from: rock3PositionStay,
  to: rock3PositionStay.clone().add(new THREE.Vector3(-peekDistance, 0, 0))
})

// Move right
peekActions.push({
  type: 'move',
  from: rock1PositionStay,
  to: rock2PositionStay,
  angle: rock1To2Angle,
  isRight: true,
})

peekActions.push({
  type: 'move',
  from: rock2PositionStay,
  to: rock3PositionStay,
  angle: rock2To3Angle,
  isRight: true,
})

// Move left
peekActions.push({
  type: 'move',
  from: rock3PositionStay,
  to: rock2PositionStay,
  angle: rock2To3Angle,
})

peekActions.push({
  type: 'move',
  from: rock2PositionStay,
  to: rock1PositionStay,
  angle: rock1To2Angle,
})

const raycaster = new THREE.Raycaster()
const tmpVector3 = new THREE.Vector3()

const objectIsInView = (object, cameraObject3D, cameraObject, scene) => {
  object.getWorldPosition(tmpVector3)
  const projection = tmpVector3.clone().project(cameraObject)

  if (Math.abs(projection.x) > 1 || Math.abs(projection.y) > 1) {
    return false
  }

  tmpVector3.sub(cameraObject3D.position)
  const distanceToTarget = tmpVector3.length()

  tmpVector3.normalize()
  raycaster.set(cameraObject3D.position, tmpVector3)

  const intersections = raycaster.intersectObjects(scene.children, true)

  if (!intersections.length) {
    return false
  }

  const intersection = intersections[0]

  if (intersection.object.userData.isTarget || intersection.object.parent.userData.isTarget) {
    return { position: projection, distanceToTarget }
  }
}

AFRAME.registerComponent('sighting', {
  init: function() {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    const container = document.createElement('div')
    container.id = 'photoModeContainer'
    container.classList.add('fade-in-on-scan')

    const image = document.createElement('img')
    image.id = 'photoModeImage'
    container.appendChild(image)

    const flash = document.createElement('div')
    flash.id = 'flash'
    container.appendChild(flash)

    const shutterButton = document.createElement('div')
    shutterButton.id = 'shutterButton'
    container.appendChild(shutterButton)

    const closeButton = document.createElement('div')
    closeButton.id = 'closeButton'
    container.appendChild(closeButton)

    document.body.appendChild(container)

    const camera = document.getElementById('camera')
    const cameraObject3D = camera.object3D
    const cameraObject = camera.getObject3D('camera')

    const target = document.createElement('a-entity')
    target.setAttribute('portal-hider', '')

    getSkyElement(target)

    let photosTaken = 0
    const photosRequired = 5
    window.emit('changeobjective', { text: 'Collect evidence' })
    window.emit('changeprogress', { text: `0/${photosRequired}` })

    const handleTargetScanned = () => {
      this.el.sceneEl.removeEventListener('xrimagefound', handleTargetScanned)
      window.emit('changeprompt', { text: 'Press shutter button to capture photo' })
      window.emit('scanned')
    }
    this.el.sceneEl.addEventListener('xrimagefound', handleTargetScanned)

    const base = document.createElement('a-entity')
    base.object3D.position.y = -1
    base.object3D.scale.set(0.5, 0.5, 0.5)

    const directionalLight = document.createElement('a-light')
    directionalLight.setAttribute('position', '150 250 100')
    base.appendChild(directionalLight)

    const mountain = document.createElement('a-entity')
    mountain.object3D.scale.set(500, 500, 500) 
    mountain.object3D.position.y = -2.5
    mountain.setAttribute('gltf-model', '#mountainModel')
    mountain.object3D.position.z = -52
    base.appendChild(mountain)

    const alien = document.createElement('a-entity')
    alien.setAttribute('gltf-model', '#alien')
    alien.object3D.scale.set(5, 5, 5)
    alien.object3D.position.z = -1
    alien.object3D.userData.isTarget = true
    alien.setAttribute('peeker', '')

    const alienChild = document.createElement('a-sphere')
    alienChild.setAttribute('material', { transparent: true, opacity: 0 })
    alienChild.object3D.scale.set(0.08, 0.08, 0.08)
    alienChild.object3D.position.y = 0.13
    alienChild.object3D.userData.isTarget = true
    alien.appendChild(alienChild)

    base.appendChild(alien)

    const blockerScale = 30

    let blocker = document.createElement('a-entity')
    blocker.setAttribute('gltf-model', '#rock2')
    blocker.setAttribute('color', 'gray')
    blocker.object3D.scale.set(blockerScale, blockerScale, blockerScale)
    blocker.object3D.position.copy(rock2Position)
    blocker.object3D.position.z = -5
    base.appendChild(blocker)

    blocker = document.createElement('a-entity')
    blocker.setAttribute('gltf-model', '#rock1')
    blocker.setAttribute('color', 'gray')
    blocker.object3D.scale.set(blockerScale, blockerScale, blockerScale)
    blocker.object3D.position.copy(rock3Position)
    base.appendChild(blocker)

    blocker = document.createElement('a-entity')
    blocker.setAttribute('gltf-model', '#rock3')
    blocker.setAttribute('color', 'gray')
    blocker.object3D.scale.set(blockerScale, blockerScale, blockerScale)
    blocker.object3D.position.copy(rock1Position)
    base.appendChild(blocker)

    target.appendChild(base)
    this.el.sceneEl.appendChild(target)

    let complete = false
    const successAlerts = ['Got \'em!', 'There it is!', 'I knew it!', 'This will show them!', 'This proves it!' ]
    const failedAlerts = ['Just my imagination?', 'So close!', 'Shy little bugger!', 'I want to believe!', 'Where did it go?']

    closeButton.addEventListener('click', () => {
      if (complete) {
        window.emit('collected', { replay: true })

        const relic = document.createElement('a-entity')
        relic.setAttribute('gltf-model', '#relicModel')
        relic.object3D.scale.set(10, 10, 10)
        relic.object3D.position.x = 0
        relic.object3D.position.y = 1.5
        relic.object3D.position.z = -2
        base.appendChild(relic)
  
        zoomRelic(relic, 2.8, 'y', 3000, 'easeOutQuad', false)
        spinRelic(relic)
        setTimeout(() => {
          zoomRelic(relic, 100)
          setTimeout(()=>{
            window.emit('collected')
          }, 1500)
        }, 3000)
      }
      container.classList.remove('photo')
    })

    shutterButton.addEventListener('click', () => {

      window.emit('clearprompt')

      alien.emit('move-pause')

      this.inView = objectIsInView(alienChild.object3D, cameraObject3D, cameraObject, this.el.sceneEl.object3D)

      console.log('inView: ' + this.inView)
      container.classList.add('flash')
      this.el.sceneEl.emit('screenshotrequest')
    })

    const contrastAmount = 2
    const contrastBasis = 255 * (0.5 - contrastAmount / 2)

    this.el.sceneEl.addEventListener('screenshotready', e => {
      const inView = this.inView
      this.inView = false
      alien.emit('move-resume')
      if (!e.detail) {
        container.classList.remove('flash')
        return
      }

      if (inView) {

        image.onload = () => {
          image.onload = null
          canvas.width = image.naturalWidth
          canvas.height = image.naturalHeight

          // Filter is 'none' by default if supported, undefined otherwise
          const supportsFilter = ctx.filter === 'none'

          if (supportsFilter) {
            ctx.filter = `grayscale(1) contrast(${contrastAmount})`
          }

          ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight)

          if (!supportsFilter) {
            // Fallback for browsers that don't support filter (Safari)
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const data = imageData.data
            const end = data.length

            for (let i = 0; i < end; i += 4) {
              const grayscale = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]
              const rawContrasted = grayscale * contrastAmount + contrastBasis
              const contrasted = Math.max(0, Math.min(255, rawContrasted))
              data[i] = data[i + 1] = data[i + 2] = rawContrasted
            }

            ctx.putImageData(imageData, 0, 0)
          } else {
            ctx.filter = 'none'
          }
          const x = (inView.position.x / 2 + 0.5) * image.naturalWidth
          const y = (-inView.position.y / 2 + 0.5) * image.naturalHeight
          ctx.strokeStyle = 'red'
          const circleWidth = Math.min(image.naturalWidth, image.naturalHeight) / 5
          ctx.lineWidth = circleWidth / 10
          ctx.beginPath()
          ctx.arc(x, y, circleWidth, 0, 2 * Math.PI)
          ctx.stroke()

          image.src = canvas.toDataURL('image/jpeg')
          container.classList.remove('flash')

          window.emit('newalert', { text: successAlerts[photosTaken], duration: 700 })

          photosTaken ++
          window.emit('changeprogress', { text: `${photosTaken}/${photosRequired}` })

          if (photosTaken >= photosRequired) {

            complete = true

            alien.object3D.position.set(0, 0, -1.7)
            alien.object3D.rotation.set(0, 0, 0)
            alien.removeAttribute('peeker')
            alien.setAttribute('animation-mixer', { clip: 'dance', timeScale: 1 } )
          }
        }
      } else {
        container.classList.remove('flash')

        window.emit('newalert', { text: failedAlerts[Math.floor(Math.random() * failedAlerts.length)], duration: 700 })
      }

      image.src = 'data:image/jpeg;base64,' + e.detail
      container.classList.add('photo')
    })
  }
})

function PausableTimeout(callback, duration) {
  let waitStart
  let elapsed = 0
  let callbackTimeout

  this.complete = false
  this.pause = () => {
    if (!callbackTimeout) {
      return
    }
    clearTimeout(callbackTimeout)
    callbackTimeout = null
    elapsed += performance.now() - waitStart
  }

  this.resume = () => {
    if (callbackTimeout) {
      return
    }
    waitStart = performance.now()
    callbackTimeout = setTimeout(callback, duration - elapsed)
  }

  this.resume()
}

AFRAME.registerComponent('peeker', {
  init: function() {

    const startPeek = () => {
      this.waitingTimeout = null
      // console.log('starting animation')
      const actionIndex = Math.floor(Math.random() * peekActions.length)
      const action = peekActions[actionIndex]
      this.el.removeAttribute('animation__peek-out')
      this.el.removeAttribute('animation__peek')
      this.el.object3D.visible = true

      if (action.type === 'peek') {
        this.el.setAttribute('animation-mixer', { clip: 'jump', timeScale: 2, loop: 'pingpong' })
        this.el.object3D.rotation.y = action.angle || 0

        this.el.setAttribute('animation__peek-out', {
          property: 'position',
          from: action.from.toArray().join(' '),
          to: action.to.toArray().join(' '),
          dur: 500,
          loop: false,
          easing: 'linear',
          pauseEvents: 'move-pause',
          resumeEvents: 'move-resume',
        })

        this.peekTimeout = new PausableTimeout(() => {
          this.peekTimeout = null
          this.el.setAttribute('animation__peek', {
            property: 'position',
            from: action.to.toArray().join(' '),
            to: action.from.toArray().join(' '),
            dur: 500,
            loop: false,
            easing: 'linear',
            pauseEvents: 'move-pause',
            resumeEvents: 'move-resume',
          })
        }, 1100)

      } else if (action.type === 'move') {
        this.el.setAttribute('animation-mixer', { clip: 'strafe', timeScale: action.isRight ? -1 : 1, loop: 'repeat' })
        this.el.object3D.rotation.y = action.angle
        this.el.setAttribute('animation__peek', {
          property: 'position',
          from: action.from.toArray().join(' '),
          to: action.to.toArray().join(' '),
          dur: 1200,
          loop: false,
          easing: 'linear',
          pauseEvents: 'move-pause',
          resumeEvents: 'move-resume',
        })
      }
    }

    this.el.addEventListener('move-pause', () => {
      this.peekTimeout && this.peekTimeout.pause()
      this.waitingTimeout && this.waitingTimeout.pause()
    })


    this.el.addEventListener('move-resume', () => {
      this.peekTimeout && this.peekTimeout.resume()
      this.waitingTimeout && this.waitingTimeout.resume()
    })

    this.el.addEventListener('animationcomplete__peek', () => {
      this.el.removeAttribute('animation-mixer')
      // console.log('animation ended')
      this.el.object3D.visible = false
      this.waitingTimeout = new PausableTimeout(startPeek, 1000 + Math.random() * 1000)
    })

    startPeek()
  },
  remove: function() {
    this.waitingTimeout && this.peekTimeout.pause()
    this.peekTimeout && this.peekTimeout.pause()
    this.el.removeAttribute('animation__peek')
    this.el.removeAttribute('animation__peek-out')

  }
})
