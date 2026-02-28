import {useMemo} from 'react'

import useScreenSize from './use-screen-size'
import ScreenType from './screen-types'
import {
  mobileWidthBreakpointInPixels,
  tabletWidthBreakpointInPixels,
  desktopWidthBreakpointInPixels,
} from '../../static/arcade/arcade-settings'

const useScreenType = (): ScreenType => {
  const {width} = useScreenSize()

  const screenType = useMemo(() => {
    if (width <= mobileWidthBreakpointInPixels) {
      return ScreenType.Mobile
    } else if (width <= tabletWidthBreakpointInPixels) {
      return ScreenType.Tablet
    } else if (width <= desktopWidthBreakpointInPixels) {
      return ScreenType.Desktop
    } else {
      return ScreenType.XL
    }
  }, [width])

  return screenType
}

export default useScreenType
