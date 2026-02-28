import {combineReducers, createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {routerMiddleware, connectRouter} from 'connected-react-router'
import {createBrowserHistory} from 'history'

import view from './view/view-reducer'
import recording from './recording/recording-reducer'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
  }
}

const history = createBrowserHistory()

const createRootReducer = historyToConnect => combineReducers({
  router: connectRouter(historyToConnect),
  view,
  recording,
})

export default (preloadedState?) => {
  const middleware = [
    routerMiddleware(history),
    thunk,
  ]
  let enhancer = applyMiddleware(...middleware)
  if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    enhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(enhancer)
  }
  const store = createStore(
    createRootReducer(history),
    preloadedState,
    enhancer
  )
  return store
}
