const colors = [
  '#ff3b30', '#ff9500', '#ffcc00', '#4cd964', '#5ac8fa', '#007aff', '#AD50FF', '#ff2d90',
]
const pressEvents = ['abuttondown', 'bbuttondown', 'ybuttondown', 'xbuttondown', 'trackpaddown']

const addCube = scene => scene.insertAdjacentHTML('beforeend', `
  <a-box
    class="throwable"
    src="#boxTexture"
    dynamic-body="mass: 1"
    color="${colors[Math.floor(Math.random() * colors.length)]}"
    position="0 2 -.67"
    scale=".2 .2 .2"
    shadow>
  </a-box>`)

// AFRAME components can only be registered once and cannot be easily unregistered. It is often
// useful to wrap their registration in a method that can be called multiple times without error.
let needsRegister = true
const registerComponents = () => {
  if (!needsRegister) {
    return
  }
  needsRegister = false

  AFRAME.registerComponent('add-cube-on-button-press', {
    init() {
      this.cubeAdder = () => addCube(this.el.sceneEl)
      this.el.sceneEl.addEventListener('click', this.cubeAdder)
      pressEvents.forEach(e => this.el.addEventListener(e, this.cubeAdder))
    },
    remove() {
      this.el.sceneEl.removeEventListener('click', this.cubeAdder)
      pressEvents.forEach(e => this.el.removeEventListener(e, this.cubeAdder))
    },
  })
}

export {registerComponents}
