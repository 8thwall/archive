const handlers: ((newPath: string) => void)[] = []

// NOTE(wayne): This is for GA content grouping when history changes
// which is by pushing a dataLayer variable contentGroup before history.pushState()
// So when GTM fires a history change event, the contentGroup sent together is already up-to-date
const initializeHistoryListener = (history) => {
  // Called when a new history entry is created
  // e.g. Browsing between different pages inside xrhome
  const {pushState} = history
  history.pushState = (state, title, url) => {
    handlers.forEach(handler => handler(url))
    return pushState.call(history, state, title, url)
  }

  // Called when the active history entry changes
  // e.g. Hitting the forward/back buttons of the browser
  window.addEventListener('popstate', () => {
    const {pathname: path} = window.location
    handlers.forEach(handler => handler(path))
  }, {capture: true})
}

const addHistoryChangeHandler = (handler: (newPath: string) => void) => {
  if (handlers.indexOf(handler) === -1) {
    handlers.push(handler)
  }
}

const removeHistoryChangeHandler = (handler: (newPath: string) => void) => {
  const location = handlers.indexOf(handler)
  if (location === -1) {
    return
  }
  handlers.splice(location, 1)
}

export {
  initializeHistoryListener,
  addHistoryChangeHandler,
  removeHistoryChangeHandler,
}
