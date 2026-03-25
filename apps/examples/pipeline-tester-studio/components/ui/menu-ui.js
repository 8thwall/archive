class _MenuUI {
  init(mainPage) {
    this.initialized = false
    this.container = mainPage

    this.container.innerHTML = `
      <div class='home-header'>
        <h1>Studio Pipeline Tester<br />XR8 QA</h1>
      </div>
    `

    this.homeContainer = document.createElement('div')
    this.homeContainer.className = 'home'
    this.container.appendChild(this.homeContainer)

    // SLAM
    this.homeContainer.innerHTML += `
      <h3>SLAM</h3>
    `
    this.slamContainer = document.createElement('div')
    this.slamContainer.className = 'button-container'
    this.homeContainer.appendChild(this.slamContainer)

    this.worldEffectsButton = document.createElement('button')
    this.worldEffectsButton.className = 'navigation-button'
    this.worldEffectsButton.innerHTML = 'World Effects'
    this.worldEffectsButton.onclick = () => {
      document.dispatchEvent(new CustomEvent('world-effects', {
        detail: {mainPage},
        bubbles: true,
        cancelable: true,
        composed: true,
      }))
    }
    this.slamContainer.appendChild(this.worldEffectsButton)

    this.imageTargetButton = document.createElement('button')
    this.imageTargetButton.className = 'navigation-button'
    this.imageTargetButton.innerHTML = 'Image Targets'
    this.imageTargetButton.onclick = () => {
      console.log('button')
      document.dispatchEvent(new CustomEvent('image-targets', {
        detail: {mainPage},
        bubbles: true,
        cancelable: true,
        composed: true,
      }))
    }
    this.slamContainer.appendChild(this.imageTargetButton)

    // VPS
    this.homeContainer.innerHTML += `
      <h3>VPS</h3>
    `

    // Human pose
    this.homeContainer.innerHTML += `
      <h3>Human Pose 💁</h3>
    `
    this.humanPoseContainer = document.createElement('div')
    this.humanPoseContainer.className = 'button-container'
    this.homeContainer.appendChild(this.humanPoseContainer)

    this.faceEffectsButton = document.createElement('button')
    this.faceEffectsButton.className = 'navigation-button'
    this.faceEffectsButton.innerHTML = 'Face Effects'
    this.faceEffectsButton.onclick = () => {
      document.dispatchEvent(new CustomEvent('face-effects', {
        detail: {mainPage},
        bubbles: true,
        cancelable: true,
        composed: true,
      }))
    }
    this.humanPoseContainer.appendChild(this.faceEffectsButton)

    this.multiFaceButton = document.createElement('button')
    this.multiFaceButton.className = 'navigation-button'
    this.multiFaceButton.innerHTML = 'Multi Face Effects'
    this.multiFaceButton.onclick = () => {
      document.dispatchEvent(new CustomEvent('multi-face-effects', {
        detail: {mainPage},
        bubbles: true,
        cancelable: true,
        composed: true,
      }))
    }
    this.humanPoseContainer.appendChild(this.multiFaceButton)

    this.homeContainer.innerHTML += `
      <h3>Targets</h3>
      <p>Make sure to test with Pixel (4, 5a, 6) as they have 16:9 aspect ratio camera feed</p>
      <h4>Flat & Curve Targets</h4>
    `

    this.initialized = true
  }
}

const MenuUI = new _MenuUI()
export default MenuUI
