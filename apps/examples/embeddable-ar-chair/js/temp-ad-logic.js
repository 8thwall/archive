const adFlowComponent = {
  init() {
    let isDesktop
    let isAR = false
    let hasGestureIcons = false
    let hasFallenBack = false

    // 3D elements
    const scene = this.el.sceneEl
    const modelObj = document.getElementById('model')
    const cameraObj = document.getElementById('camera')
    const groundObj = document.getElementById('ground')
    const skyObj = document.getElementById('sky')

    // 2D elements
    const displayOverlay = document.getElementById('display-overlay')
    const whiteBg = document.getElementById('fadeElem')
    const desktopOverlay = document.getElementById('desktop-overlay')
    const videoPreviewSection = document.getElementById('video-preview-section')
    const qrPreviewSection = document.getElementById('qr-code-section')
    const arBtnSection = document.getElementById('ar-button-section')
    const arBtn = document.getElementById('ar-btn')
    const configBtnSection = document.getElementById('config-button-section')
    const configBtn = document.getElementById('config-btn')
    const questionCloseBtnSection = document.getElementById('question-close-button-section')
    const previewCloseBtnSection = document.getElementById('preview-close-button-section')
    const containerSection = document.getElementById('container')
    const ctaBtnSection = document.getElementById('cta-button-section')
    const qstMarkSection = document.getElementById('question-mark-section')
    const qstOverlay = document.getElementById('question-overlay')
    const qstBtn = document.getElementById('question-btn')
    const debugSection = document.getElementById('debug-section')
    const debugBtn = document.getElementById('debug-btn')
    const gestureSection = document.getElementById('gesture-section')
    const logoSection = document.getElementById('logo-section')
    const ctaText = document.getElementById('cta-text')
    const ctaImg = document.getElementById('cta-img')

    // image assets
    const mouseDragImg = require('.././assets/icons/mouse-drag.svg')
    const mouseScrollImg = require('.././assets/icons/mouse-scroll.svg')
    const holdDragImg = require('.././assets/icons/hold-drag.svg')
    const pinchImg = require('.././assets/icons/pinch.svg')
    const oneFingerSwipeImg = require('.././assets/icons/one-finger-swipe.svg')
    const twoFingerRotateImg = require('.././assets/icons/two-finger-rotate.svg')

    // check if desktop
    const isTouchDevice =
    (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0))

    // fade out white bg
    const fadeOutElem = () => {
      setTimeout(() => {
        whiteBg.classList.add('fade-out')
      }, 600)

      setTimeout(() => {
        whiteBg.classList.remove('fade-out')
        whiteBg.style.opacity = 0
      }, 1000)
    }

    // check iOS version; no AR button for iOS 13/14 (no cross-origin iframe feature-policy support)
    const iOS15Check = () => {
      const {os, osVersion, model, browser} = XR8.XrDevice.deviceEstimate()
      const errorText = ''
      if (os === 'iOS') {
        if (model.includes('iPad')) {  // allow iPad
          return
        }
        switch (osVersion) {
          case '13.0':
          case '13.1':
          case '13.1.1':
          case '13.1.2':
          case '13.1.3':
          case '13.2':
          case '13.2.1':
          case '13.2.2':
          case '13.2.3':
          case '13.3':
          case '13.3.1':
          case '13.4':
          case '13.4.1':
          case '13.5':
          case '13.5.1':
          case '13.6':
          case '13.6.1':
          case '13.7':
          case '14.0':
          case '14.0.1':
          case '14.1':
          case '14.2':
          case '14.2.1':
          case '14.3':
          case '14.4':
          case '14.4.1':
          case '14.4.2':
          case '14.5':
          case '14.5.1':
          case '14.6':
          case '14.7':
          case '14.7.1':
          case '14.8':
          case '14.8.1':
            // dont render "see in space" button
            arBtnSection.style.display = 'none'
            ctaBtnSection.classList.remove('top-right')
            ctaBtnSection.classList.add('bottom-center')
            ctaText.classList.add('text-shadow')
            ctaImg.classList.add('img-shadow')
            ctaBtnSection.style.display = 'block'
            break
          default:
            break
        }
      }
    }
    window.XR8 ? iOS15Check() : window.addEventListener('xrloaded', iOS15Check)

    // fall back to 3D mode when camera permissions denied
    const handleCameraStatusChange = function handleCameraStatusChange(event) {
      if (event.detail.status === 'failed') {
        displayOverlay.style.display = 'none'
        whiteBg.style.display = 'none'
        arBtnSection.style.display = 'none'
        ctaBtnSection.classList.remove('top-right')
        ctaBtnSection.classList.add('bottom-center')
        ctaBtnSection.style.display = 'block'
        ctaText.classList.add('text-shadow')
        ctaImg.classList.add('img-shadow')
        hasGestureIcons = false
        gestureSection.innerHTML = ''
        hasFallenBack = true
      }
    }
    scene.addEventListener('camerastatuschange', handleCameraStatusChange)

    // show / hide desktop "see in space" overlay
    const toggleDesktopOverlay = (onStatus, type) => {
      let isOn = onStatus
      isDesktop = !isTouchDevice
      if (isOn) {
        if (type === 'preview') {
          // show desktop overlay
          previewCloseBtnSection.style.display = 'block'
          videoPreviewSection.style.display = 'block'
          qrPreviewSection.style.display = 'block'
          desktopOverlay.style.display = 'block'
        }

        if (type === 'question' && isAR === true) {
          // show question overlay
          questionCloseBtnSection.style.display = 'block'
          debugSection.style.display = 'block'
          previewCloseBtnSection.style.display = 'none'
          desktopOverlay.style.display = 'block'
          gestureSection.style.display = 'flex'

          if (hasGestureIcons === false) {
            gestureSection.insertAdjacentHTML('beforeend',
              `
          <div class="gesture-icon-section">
            <img src="${holdDragImg}">
            <p>Hold<br>to Drag</p>
          </div>
          <div class="gesture-icon-section">
            <img src="${twoFingerRotateImg}">
            <p>Swipe<br>to Rotate</p>
          </div>
          <div class="gesture-icon-section">
            <img src="${pinchImg}">
            <p>Pinch<br>to Scale</p>
          </div>
          `)
            hasGestureIcons = true
          }
          console.log('AR MODE')
        }

        if (type === 'question' && isDesktop === true) {
          // show question overlay
          questionCloseBtnSection.style.display = 'block'
          debugSection.style.display = 'block'
          previewCloseBtnSection.style.display = 'none'
          desktopOverlay.style.display = 'block'
          gestureSection.style.display = 'flex'

          if (hasGestureIcons === false) {
            gestureSection.insertAdjacentHTML('beforeend',
              `
            <div class="gesture-icon-section">
              <img src="${mouseDragImg}">
              <p>Drag<br>to Rotate</p>
            </div>
            <div class="gesture-icon-section">
              <img src="${mouseScrollImg}">
              <p>Scroll<br>to Zoom</p>
            </div>
            `)
            hasGestureIcons = true
          }
          console.log('DESKTOP 3D MODE')
        }

        if (type === 'question' && isDesktop === false && isAR === false) {
          // show question overlay
          questionCloseBtnSection.style.display = 'block'
          debugSection.style.display = 'block'
          previewCloseBtnSection.style.display = 'none'
          desktopOverlay.style.display = 'block'
          gestureSection.style.display = 'flex'

          if (hasGestureIcons === false) {
            gestureSection.insertAdjacentHTML('beforeend',
              `
            <div class="gesture-icon-section">
              <img src="${oneFingerSwipeImg}">
              <p>Swipe<br>to Rotate</p>
            </div>
            <div class="gesture-icon-section">
              <img src="${pinchImg}">
              <p>Pinch<br>to Zoom</p>
            </div>
            `)
            hasGestureIcons = true
          }
          console.log('MOBILE 3D MODE')
        }

        // hide scene overlay
        arBtnSection.style.display = 'none'
        ctaBtnSection.style.display = 'none'
        qstMarkSection.style.display = 'none'
        containerSection.style.display = 'none'
        isOn = true
      } else {
        // show scene overlay
        if (isAR === false && hasFallenBack === false) {
          arBtnSection.style.display = 'block'
        }
        ctaBtnSection.style.display = 'block'
        qstMarkSection.style.display = 'block'
        containerSection.style.display = 'flex'
        debugSection.style.display = 'none'

        // hide desktop overlay
        previewCloseBtnSection.style.display = 'none'
        videoPreviewSection.style.display = 'none'
        qrPreviewSection.style.display = 'none'
        desktopOverlay.style.display = 'none'
        gestureSection.style.display = 'none'
        isOn = false
      }
    }

    // handle 3D fallback from AR when clicking 'close' button
    questionCloseBtnSection.addEventListener('click', () => {
      toggleDesktopOverlay(false, 'question')
      questionCloseBtnSection.style.display = 'none'
      if (isDesktop === false && isAR === true) {
        previewCloseBtnSection.style.display = 'block'
      }
    })

    // handle 3D fallback from AR when clicking 'close' button
    previewCloseBtnSection.addEventListener('click', () => {
      // close preview overlay
      if (isDesktop) {
        toggleDesktopOverlay(false, 'preview')
      } else {
        scene.removeAttribute('xrweb')
        scene.removeAttribute('coaching-overlay')

        modelObj.setAttribute('position', '0 0 0')
        modelObj.setAttribute('scale', '1 1 1')
        modelObj.setAttribute('cubemap-static', '')
        modelObj.removeAttribute('xrextras-hold-drag')
        modelObj.removeAttribute('xrextras-two-finger-rotate')
        modelObj.removeAttribute('absolute-pinch-scale')
        modelObj.removeAttribute('cubemap-realtime')

        cameraObj.setAttribute('position', '0 1 1')
        cameraObj.setAttribute('orbit-controls', {
          enabled: true,
          target: '#pivot',
          enablePan: false,
          autoRotate: true,
          autoRotateSpeed: 0.3,
          minDistance: 0.5,
          maxDistance: 2,
        })
        previewCloseBtnSection.style.display = 'none'
        skyObj.setAttribute('visible', true)

        groundObj.setAttribute('material', {
          shader: 'standard',
          repeat: '800 800',
          src: '#woodTex',
        })

        gestureSection.innerHTML = ''
        hasGestureIcons = false
        hasFallenBack = true
        isAR = false
      }
    })

    qstBtn.addEventListener('click', () => {
      toggleDesktopOverlay(true, 'question')
    })

    debugBtn.addEventListener('click', () => {
      window.location = 'https://8th.io/iframe'
    })

    // fade out white bg when camera opens
    scene.addEventListener('realityready', () => {
      fadeOutElem()
    })

    const openAR = () => {
      if (!isTouchDevice) {
        isDesktop = true
        toggleDesktopOverlay(true, 'preview')
      } else {
        isDesktop = false
        displayOverlay.style.zIndex = 413
        displayOverlay.style.display = 'block'
        displayOverlay.style.opacity = 1
        whiteBg.style.opacity = 1
        scene.setAttribute('xrweb', {
          scale: 'absolute',
        })
        scene.setAttribute('coaching-overlay', '')

        window.addEventListener('xrtrackingstatus', (e) => {
          if (e.detail.status === 'LIMITED' && e.detail.reason === 'INITIALIZING') {
            modelObj.setAttribute('visible', false)
            modelObj.removeAttribute('absolute-pinch-scale')
          }
          if (e.detail.status === 'NORMAL') {
            modelObj.setAttribute('visible', true)
            modelObj.setAttribute('absolute-pinch-scale', '')
          }
        })

        const reset = () => {
          scene.emit('recenter', {
            origin: {x: 0, y: 0, z: 1},
            facing: {w: 1, x: 0, y: 0, z: 0},
          })
          skyObj.setAttribute('visible', false)

          modelObj.removeAttribute('cubemap-static', '')
          modelObj.setAttribute('xrextras-hold-drag', {riseHeight: 0.25})
          modelObj.setAttribute('xrextras-two-finger-rotate', '')
          modelObj.setAttribute('cubemap-realtime', '')
          modelObj.setAttribute('rotation', {x: 0, y: 30, z: 0})

          arBtnSection.style.display = 'none'
          ctaBtnSection.classList.remove('top-right')
          ctaBtnSection.classList.add('bottom-center')
          ctaText.classList.add('text-shadow')
          ctaImg.classList.add('img-shadow')
          ctaBtnSection.style.display = 'block'
          previewCloseBtnSection.style.display = 'block'

          cameraObj.setAttribute('orbit-controls', {enabled: false})

          groundObj.setAttribute('material', {
            shader: 'shadow',
          })
          displayOverlay.classList.add('fade-out')
          gestureSection.innerHTML = ''
          hasGestureIcons = false
          isAR = true
        }
        scene.addEventListener('realityready', reset)
      }
    }

    // enter AR mode on mobile when "See in space" button is clicked
    arBtn.addEventListener('click', openAR)

    if (!isTouchDevice) {
      arBtnSection.children[1].style.display = 'none'
      arBtnSection.style.bottom = '10px'
    }

    // parameter check logic
    // sample URL: https://8w.8thwall.app/embeddable-ar-chair/?intro=video&format=ar
    const params = new URLSearchParams(document.location.search.substring(1))
    const introType = params.get('intro')
    const formatType = params.get('format')
    // console.log(`introType: ${introType} | formatType: ${formatType}`)

    switch (introType) {
      case 'video':  // video intro
        displayOverlay.children[1].src = require('.././assets/creative/vid-2mb.mp4')
        configBtnSection.style.display = 'block'
        configBtn.addEventListener('click', () => {
          displayOverlay.style.display = 'none'
          displayOverlay.style.pointerEvents = 'none'
          displayOverlay.children[1].style.display = 'none'
          configBtn.style.display = 'none'
          displayOverlay.children[0].src = require('.././assets/creative/permissions-bg.png')
          if (formatType === 'ar') {
            openAR()
          }
        })
        fadeOutElem()
        break
      case 'image':  // image intro
        logoSection.style.display = 'none'
        displayOverlay.children[0].src = require('.././assets/creative/display-bg.png')
        displayOverlay.addEventListener('click', () => {
          displayOverlay.style.opacity = 0
          displayOverlay.style.pointerEvents = 'none'
          displayOverlay.children[0].src = require('.././assets/creative/permissions-bg.png')
          logoSection.style.display = 'block'
          if (formatType === 'ar') {
            openAR()
          }
        })
        fadeOutElem()
        break
      default:  // no intro
        displayOverlay.style.display = 'none'
        displayOverlay.children[0].src = require('.././assets/creative/permissions-bg.png')
        displayOverlay.style.pointerEvents = 'none'
        if (formatType === 'ar') {
          openAR()
        } else {
          fadeOutElem()
        }
    }
  },
}

export {adFlowComponent}
