const createButton = (callbacks, sessionInit = {}) => {
  require('./main.css')
  const button = document.createElement('button')

  const showStartAR = (/* device */) => {
    let currentSession = null

    const onSessionStarted = (session) => {
      session.addEventListener('end', onSessionEnded)
      
      button.textContent = 'STOP AR'

      currentSession = session
      callbacks.sessionStarted(session)
    }

    const onSessionEnded = (/* event */) => {
      currentSession.removeEventListener('end', onSessionEnded)

      button.textContent = 'START AR'

      currentSession = null
      callbacks.sessionEnded()
    }

    //

    Object.assign(button.style, {
      display: '',
      cursor: 'pointer',
      left: 'calc(50%-50px)',
      width: '100px',
    })
    
    button.textContent = 'START AR'

    button.onmouseenter = () => {
      button.style.opacity = '1.0'
    }

    button.onmouseleave = () => {
      button.style.opacity = '0.5'
    }

    button.onclick = () => {
      if (currentSession === null) {
        navigator.xr.requestSession('immersive-ar', sessionInit).then(onSessionStarted)
      } else {
        currentSession.end()
      }
    }
  }

  const disableButton = () => {
    Object.assign(button.style, {
      display: '',
      cursor: 'auto',
      left: 'calc(50%-75px)',
      width: '150px',
    })

    button.onmouseenter = null
    button.onmouseleave = null

    button.onclick = null
  }

  const showARNotSupported = () => {
    disableButton()

    button.textContent = 'AR NOT SUPPORTED'
  }

  const stylizeElement = (element) => {
    Object.assign(element.style, {
      position: 'absolute',
      bottom: '20px',
      padding: '12px 6px',
      border: '1px solid #fff',
      borderRadius: '4px',
      background: 'rgba(0, 0, 0, 0.1)',
      color: '#fff',
      font: 'normal 13px sans-serif',
      textAlign: 'center',
      opacity: '0.5',
      outline: 'none',
      zIdex: '999',
    })
  }

  if ('xr' in navigator) {
    button.id = 'ARButton'
    button.style.display = 'none'

    stylizeElement(button)

    navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
      supported ? showStartAR() : showARNotSupported()
    }).catch(showARNotSupported)

    return button
  } else {
    const message = document.createElement('a')

    if (window.isSecureContext === false) {
      message.href = document.location.href.replace(/^http:/, 'https:')
      message.innerHTML = 'WEBXR NEEDS HTTPS'  // TODO Improve message
    } else {
      message.href = 'https://immersiveweb.dev/'
      message.innerHTML = 'WEBXR NOT AVAILABLE'
    }

    Object.assign(message.style, {
      left: 'calc(50% - 90px)',
      width: '180px',
      textDecoration: 'none',
    })

    stylizeElement(message)

    return message
  }
}

const ARButton = {
  createButton,
}

export {ARButton}
