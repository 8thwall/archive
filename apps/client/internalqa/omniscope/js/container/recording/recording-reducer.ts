const initialState = {
  status: 'STOPPED',
  currentId: null,
  initialized: false,
  count: 0,
  fail: 0,
  queue: 0,
  lastQueueMs: 0,
  durationFromLastQueue: -1,
}

const Reducer = (state = initialState, action) => {
  let thisQueueMs
  switch (action.type) {
    case 'RECORDING/NEW':
      return {...state, currentId: action.currentId, count: 0, queue: 0, fail: 0}
    case 'RECORDING/SET_STATUS':
      return {...state, status: action.status}
    case 'RECORDING/SET_READY':
      return {...state, initialized: true}
    case 'RECORDING/INCREMENT_COUNT':
      return {...state, count: state.count + 1}
    case 'RECORDING/INCREMENT_FAIL':
      return {...state, count: state.fail + 1}
    case 'RECORDING/INCREMENT_QUEUE':
      thisQueueMs = performance.now()
      return {
        ...state,
        queue: state.queue + 1,
        durationFromLastQueue: thisQueueMs - state.lastQueueMs,
        lastQueueMs: thisQueueMs,
      }
    default:
      return state
  }
}

export default Reducer
