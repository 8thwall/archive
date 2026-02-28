import React from 'react'

import {UiThemeProvider, UiThemeMode} from './theme'
import {getExteriorTheme} from '../brand8/brand8-gating'
import {Loader} from './components/loader'
import {useThemedGlobalStyles} from './globals'

const PageLoadingScreen = () => {
  useThemedGlobalStyles()
  return (
    <Loader />
  )
}

// Set the theme for a whole page
// There should only be one per page at atime
const UiPageThemeProvider = ({mode, children}: {mode: UiThemeMode, children: React.ReactNode}) => (
  <UiThemeProvider mode={mode}>
    <React.Suspense fallback={<PageLoadingScreen />}>
      {children}
    </React.Suspense>
  </UiThemeProvider>
)

const withPageTheme = (
  Component: React.ComponentType<{}>,
  mode: UiThemeMode
): React.FC => () => (
  <UiPageThemeProvider mode={mode}>
    <Component />
  </UiPageThemeProvider>
)

const withExteriorPageTheme = (Component: React.ComponentType<{}>) => (
  withPageTheme(Component, getExteriorTheme())
)

export {
  UiThemeProvider,
  withPageTheme,
  withExteriorPageTheme,
}

export type {
  UiThemeMode,
}
