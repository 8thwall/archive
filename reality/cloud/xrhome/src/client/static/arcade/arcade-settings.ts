const white = '#ffffff'

const brandGray1 = '#f1f5f9'
const brandGray2 = '#bdc1da'
const brandGray3 = '#8487a9'
const brandGray4 = '#333b44'

const brandBlack = '#0f0e1a'
const brandBlue = '#44bbd1'
const brandYellow = '#ffc758'
const brandGreen = '#3d8f43'
const brandRed = '#ff4713'
const brandMintGreen = '#00edaf'
const brandOrange = '#ff4713'

const orangeGradient = `linear-gradient(293deg, ${brandOrange} -50%, ${brandOrange} 41%)`
const orangeGradientHighlight = `linear-gradient(281deg, ${brandOrange} 4%, #ff6c42 106%)`

const mobileWidthBreakpointInPixels = 576
const tabletWidthBreakpointInPixels = 1024
const desktopWidthBreakpointInPixels = 1920

const mobileWidthBreakpoint = `${mobileWidthBreakpointInPixels}px`
const tabletWidthBreakpoint = `${tabletWidthBreakpointInPixels}px`
const desktopWidthBreakpoint = `${desktopWidthBreakpointInPixels}px`

const centeredSectionMaxWidth = '1520px'

// Use these directly in your jss
const mobileViewOverride = `@media (max-width: ${mobileWidthBreakpoint})`
const tabletViewOverride = `@media (max-width: ${tabletWidthBreakpoint})`
const desktopViewOverride = `@media (max-width: ${desktopWidthBreakpoint})`

export {
  white,
  brandGray1,
  brandGray2,
  brandGray3,
  brandGray4,
  brandBlack,
  brandBlue,
  brandYellow,
  brandGreen,
  brandRed,
  brandMintGreen,
  brandOrange,
  orangeGradient,
  orangeGradientHighlight,
  mobileWidthBreakpointInPixels,
  tabletWidthBreakpointInPixels,
  desktopWidthBreakpointInPixels,
  mobileWidthBreakpoint,
  tabletWidthBreakpoint,
  desktopWidthBreakpoint,
  mobileViewOverride,
  tabletViewOverride,
  desktopViewOverride,
  centeredSectionMaxWidth,
}
