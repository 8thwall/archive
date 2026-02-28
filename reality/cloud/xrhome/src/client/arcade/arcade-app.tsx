import React from 'react'
import {createUseStyles} from 'react-jss'
import {Router, useLocation} from 'react-router-dom'
import type {History} from 'history'

import AppSwitch from './arcade-app-switch'
import {white, brandBlack} from '../static/arcade/arcade-settings'

const useStyles = createUseStyles({
  '@global': {
    '@import': [
      'url(https://fonts.googleapis.com/css' +
      '?family=Nunito:400,500,600,700&subset=latin&display=swap)',
    ],
    'body': {
      margin: 0,
      padding: 0,
      height: '100vh',
      color: white,
      fontFamily: 'Nunito',
      background: brandBlack,
    },
  },
})

const ScrollToTopWrapper = ({children}) => {
  const location = useLocation()

  React.useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    children
  )
}

interface IApp {
  history: History
}

const App: React.FC<IApp> = ({history}) => {
  useStyles()

  return (
    <Router history={history}>
      <ScrollToTopWrapper>
        <AppSwitch />
      </ScrollToTopWrapper>
    </Router>
  )
}

export default App
