import {Screen} from './Components/Screen'
const ScreenManagerEvents = Object.freeze({
  ExitScreen: 'exit-screen',
  EnterScreen: 'enter-screen',
})

export class ScreenChangeEvent extends Event {
  /**
   * @param {string} type
   * @param {{id:string}} data
   */
  constructor(type, data) {
    super(type)
    /**
     * @type {{id:string}} data
     */
    this.data = data
  }
}

class ScreenRef {
  constructor(id, div) {
    /**
     * @type {string}
     */
    this.id = id
    /**
     * @type {HTMLDivElement}
     */
    this.div = div
  }

  async enter() {
    return new Promise((resolve) => {
      const animation = this.div.animate([{opacity: 0}, {opacity: 1}], {
        duration: 500,  // Duration in milliseconds
        fill: 'forwards',  // Retain the final state after animation
      })

      animation.onfinish = () => {
        resolve()
      }
    })
  }

  async exit() {
    return new Promise((resolve) => {
      const animation = this.div.animate([{opacity: 1}, {opacity: 0}], {
        duration: 500,  // Duration in milliseconds
        fill: 'forwards',  // Retain the final state after animation
      })

      animation.onfinish = () => {
        resolve()
      }
    })
  }
}

class ScreenComponent {
  constructor(id, compoennt) {
    /**
     * @type {string}
     */
    this.id = id
    /**
     * @type {*}
     */
    this.compoennt = compoennt
  }

  render() {
    return React.createElement(
      Screen,
      {id: this.id},
      React.createElement(this.compoennt, {id: this.id})
    )
  }
}

class ScreenManagerClass extends EventTarget {
  constructor() {
    super()
    /**
     * @type {ScreenRef|null} currentScreen
     */
    this.currentScreen = null
    /**
     * @type {Map<string,ScreenComponent>}
     */
    this.screens = new Map()
    /**
     * @type {ScreenManagerEvents}
     */
    this.events = ScreenManagerEvents
  }

  /**
   * @param {string} id
   *  @param {Function} screen
   */
  registerScreen(id, screen) {
    this.screens.set(id, new ScreenComponent(id, screen))
  }

  /**
   * @param {string} id
   */
  getScreen(id) {
    const screen = this.screens.get(id)
    if (!screen) {
      throw new Error(`Screen with id ${id} does not exist`)
    }
    return screen
  }

  mountScreen(id, div) {
    this.currentScreen = new ScreenRef(id, div)

    return this.currentScreen
  }

  async enterScreen(id) {
    if (this.currentScreen) {
      this.dispatchEvent(
        new ScreenChangeEvent(ScreenManagerEvents.ExitScreen, {
          id,
        })
      )
      await this.currentScreen.exit()
    }

    this.dispatchEvent(
      new ScreenChangeEvent(ScreenManagerEvents.EnterScreen, {
        id,
      })
    )
  }
}

export const ScreenManager = new ScreenManagerClass()
