const initialState: {
  pathStack: string[]
} = {
  pathStack: [],
}

const handlers = {
  'NAVIGATION_PUSH': (state, action) => (
    {
      ...state,
      pathStack: [
        ...state.pathStack,
        action.path,
      ],
    }
  ),
  'NAVIGATION_POP': state => (
    {
      ...state,
      pathStack: [
        ...state.pathStack.slice(0, -1),
      ],
    }
  ),
}

const Reducer = (state = {...initialState}, action) => {
  if (handlers[action.type]) {
    return handlers[action.type](state, action)
  }
  return state
}

export default Reducer
