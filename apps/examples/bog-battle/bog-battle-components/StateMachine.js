class StateMachine {
  constructor(initialState) {
    this.currentState = initialState
    this.states = {}
  }

  addState(name, config) {
    this.states[name] = config
  }

  transition(stateName) {
    const state = this.states[stateName]
    if (!state) {
      console.error(`State ${stateName} does not exist`)
      return
    }

    if (this.currentState === stateName) {
      return
    }

    if (this.currentState && this.states[this.currentState].onExit) {
      this.states[this.currentState].onExit()
    }

    this.currentState = stateName
    if (state.onEnter) {
      state.onEnter()
    }
  }

  update() {
    const state = this.states[this.currentState]
    if (state && state.onUpdate) {
      state.onUpdate()
    }
  }
}

export {StateMachine}
