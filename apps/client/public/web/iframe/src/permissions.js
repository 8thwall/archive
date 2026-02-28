
let didInject = false
const injectPromptStyle = () => {
  if (didInject) {
    return
  }
  didInject = true
  const styleElement = document.createElement('style')
  styleElement.textContent = `
      .prompt-box-8w-iframe {
        font-family: 'Nunito', 'Nunito Regular', 'Varela-Round', sans-serif;
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 90vmin;
        width: 15em;
        max-width: 100%;
        font-size: 20px;
        z-index: 888;
        background-color: white;
        filter: drop-shadow(0 0 3px #0008);
        overflow: hidden;
        border-radius: 0.5em;
        padding: 0.5em;
        background-color: #3A3B55;
        color: #fff;
        text-align: center;
      }

      .prompt-box-8w-iframe * {
        font-family: inherit;
      }

      .prompt-box-8w-iframe p {
        margin: 0.5em 0.5em 1em;
      }

      .prompt-button-container-8w-iframe {
        display: flex;
      }

      .prompt-button-8w-iframe {
        flex: 1 0 0;
        min-width: 5em;
        text-align: center;
        color: white;
        background-color: #8083A2;
        font-size: inherit;
        font-family: inherit;
        display: block;
        outline: none;
        border: none;
        margin: 0;
        border-radius: 0.25em;
        padding: 0.37em;
      }

      .prompt-button-8w-iframe:not(:last-child) {
        margin-right: 0.5em;
      }

      .button-primary-8w-iframe {
        background-color: #AD50FF;
      }
    `
  document.head.prepend(styleElement)
}

const showPermissionPrompt = () => {
  injectPromptStyle()
  const promptBox = document.createElement('div')
  promptBox.classList.add('prompt-box-8w-iframe')

  const promptText = document.createElement('p')
  promptText.textContent = 'AR requires access to device motion sensors'
  promptBox.appendChild(promptText)

  const promptButtonContainer = document.createElement('div')
  promptButtonContainer.classList.add('prompt-button-container-8w-iframe')

  const cancelButton = document.createElement('button')
  cancelButton.classList.add('prompt-button-8w-iframe')
  cancelButton.textContent = 'Cancel'
  promptButtonContainer.appendChild(cancelButton)

  const continueButton = document.createElement('button')
  continueButton.classList.add('prompt-button-8w-iframe', 'button-primary-8w-iframe')
  continueButton.textContent = 'Continue'

  promptButtonContainer.appendChild(continueButton)
  promptBox.appendChild(promptButtonContainer)
  document.body.appendChild(promptBox)

  return new Promise((resolve, reject) => {
    cancelButton.addEventListener('click', () => {
      document.body.removeChild(promptBox)
      reject(new Error('User denied permission prompt'))
    }, {once: true})

    continueButton.addEventListener('click', () => {
      document.body.removeChild(promptBox)
      resolve()
    }, {once: true})
  })
}

const requestPermission = eventClass => new Promise((resolve) => {
  if (eventClass && eventClass.requestPermission) {
    eventClass.requestPermission()
      .then(resolve)
      .catch(() => {
        resolve('retry')
      })
    return
  }
  resolve('granted')
})

const requestMotionPermissions = () => {
  const requests = [
    requestPermission(window.DeviceMotionEvent),
    requestPermission(window.DeviceOrientationEvent),
  ]

  return Promise.all(requests)
    .then(results => results.find(result => result !== 'granted') || 'granted')
}

module.exports = {showPermissionPrompt, requestMotionPermissions}
