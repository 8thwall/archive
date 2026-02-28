import React from 'react'
import {ThemeProvider} from 'react-jss'

import {
  brandWhite, gray3, accessibleHighlight, gray4, brandPurple, brandBlack,
} from '../../static/styles/settings'

const LightTheme = {
  name: 'light',
  fgMain: brandPurple,
  fgMuted: gray3,
  fgPrimary: accessibleHighlight,
  primaryBtnHoverBg: brandWhite,
  primaryBtnDisabledFg: gray4,
  primaryBtnDisabledBg: '#684a99',
  headerBg: brandWhite,
  headerPosition: 'block',
  headerWidth: '100%',
  navLogo: 'purple',
  loginLink: brandPurple,
  navText: brandBlack,
  navHighlight: accessibleHighlight,
} as const

const TransparentTheme = {
  name: 'transparent',
  fgMain: brandWhite,
  fgMuted: gray3,
  fgPrimary: accessibleHighlight,
  primaryBtnHoverBg: brandWhite,
  primaryBtnDisabledFg: gray4,
  primaryBtnDisabledBg: '#684a99',
  headerBg: 'transparent',
  headerPosition: 'absolute',
  headerWidth: '100%',
  loginLink: brandWhite,
  navLogo: 'white',
  navText: brandWhite,
  navHighlight: brandWhite,
} as const

type PageHeaderTheme = typeof LightTheme | typeof TransparentTheme

type PageHeaderThemes = 'transparent' | 'light'
type ThemeProps = keyof typeof LightTheme

interface IPageHeaderThemeProvider {
  mode?: PageHeaderThemes
  children?: React.ReactNode
}

const themeMap = {
  light: LightTheme,
  transparent: TransparentTheme,
}

const PageHeaderThemeProvider: React.FC<IPageHeaderThemeProvider> = (
  {children, mode = 'light'}
) => {
  const theme = themeMap[mode]

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}
export {
  PageHeaderThemeProvider,
}

export type {
  PageHeaderThemes,
  PageHeaderTheme,
  ThemeProps,
}
