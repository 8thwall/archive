const querySupportedSessionType = async () => {
  if (!('xr' in navigator)) {
    return window.XR8.XrDevice.isDeviceBrowserCompatible(
      {allowedDevices: window.XR8.XrConfig.device().MOBILE}
    ) ? 'XR8' : ''
  }

  try {
    if (await navigator.xr.isSessionSupported('immersive-ar')) {
      if (window.XR8.XrDevice.deviceEstimate().browser.name === 'Edge') {
        return 'immersive-ar'
      }
    }
  } catch {
    // fall through
  }

  try {
    if (await navigator.xr.isSessionSupported('immersive-vr')) {
      if (window.XR8.XrDevice.deviceEstimate().browser.name === 'Oculus Browser') {
        return 'immersive-vr'
      }
    }
  } catch {
    // fall through
  }
  return window.XR8.XrDevice.isDeviceBrowserCompatible(
    {allowedDevices: window.XR8.XrConfig.device().MOBILE}
  ) ? 'XR8' : ''
}

const createSvgX = () => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', 38)
  svg.setAttribute('height', 38)
  Object.assign(svg.style, {
    position: 'absolute',
    right: '20px',
    top: '20px',
    display: 'none',
  })

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', 'M 12,12 L 28,28 M 28,12 12,28')
  path.setAttribute('stroke', '#fff')
  path.setAttribute('stroke-width', 2)
  svg.appendChild(path)

  return svg
}

const closeImmersiveSessionDomOverlay = (el, stopSession) => {
  document.body.appendChild(el)
  el.addEventListener('click', () => stopSession())
  return el
}

const defaultButtonText = {
  start: 'START',
  stop: 'STOP',
  notSupported: 'XR NOT SUPPORTED',
}

const createButtonAndText = (userButtonText) => {
  const buttonText = {...defaultButtonText, ...(userButtonText || {})}
  const button = document.createElement('button')
  button.id = 'enterresponsive-8w'
  button.style.display = 'none'
  return {button, buttonText}
}

const showARNotSupported = (button, buttonText) => {
  button.style.display = ''
  button.classList.add('noresponsive-8w')

  button.onmouseenter = null
  button.onmouseleave = null
  button.onclick = null
  button.textContent = buttonText.notSupported
}

const showStartText = (button, buttonText) => {
  button.textContent = buttonText.start
  button.style.display = ''
}

const showStopText = (button, buttonText, sessionType) => {
  button.textContent = buttonText.stop
  button.style.display = sessionType === 'XR8' ? 'none' : ''
}

const styleButtonInteractable = (button) => {
  button.classList.add('responsive-8w')
  button.onmouseenter = () => Object.assign(button.style, {opacity: '1.0'})
  button.onmouseleave = () => Object.assign(button.style, {opacity: '0.5'})
}

const arButton = (userButtonText, startSession, stopSession, addSessionEndListener) => {
  let started_ = false
  let closeElement_ = null
  const {button, buttonText} = createButtonAndText(userButtonText)

  const showStartAR = (sessionType) => {
    styleButtonInteractable(button)
    showStartText(button, buttonText)

    const onSessionEnded = () => {
      closeElement_.removeEventListener('onclick', onSessionEnded)

      started_ = false
      showStartText(button, buttonText)
      closeElement_.style.display = 'none'
    }

    const stopSessionCb = stopSession(onSessionEnded)
    closeElement_ = closeImmersiveSessionDomOverlay(createSvgX(), stopSessionCb)

    const onSessionStarted = () => {
      started_ = true
      closeElement_.addEventListener('onclick', onSessionEnded)
      addSessionEndListener(onSessionEnded)

      showStopText(button, buttonText, sessionType)
      closeElement_.style.display = ''
    }

    button.onclick = () => {
      if (started_) {
        return stopSessionCb()
      }
      return startSession(sessionType, closeElement_).then(onSessionStarted)
    }
  }

  querySupportedSessionType().then(sessionType => (
    sessionType ? showStartAR(sessionType) : showARNotSupported(button, buttonText)
  ))

  return button
}

export {
  arButton,
}
