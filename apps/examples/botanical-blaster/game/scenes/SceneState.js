export const ScreenStateEvents = Object.freeze({
  Entered: 'entered',
  Exited: 'exited',
  StateUpdated: 'state-updated',
})
/**
 * @template State
 */
export class ScreenState extends EventTarget {
  /**
   * @param {State} state
   */
  constructor(state) {
    super()
    /**
     * @type {State} state
     */
    this.state = state

    /**
     * @type {ScreenStateEvents} events
     */
    this.events = ScreenStateEvents
  }

  /**
   * @param {State} state
   */
  update(state) {
    this.state = {
      ...this.state,
      ...state,
    }
    this.dispatchEvent(
      new CustomEvent(ScreenStateEvents.StateUpdated, {detail: this.state})
    )
  }
}

ScreenState.Events = ScreenStateEvents
