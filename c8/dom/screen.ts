// @sublibrary(:dom-core-lib)

// NOTE(lreyna): The values in this class represent the physical values of the screen in CSS Pixels
// and not the values of the viewport / logical screen
// https://www.w3schools.com/js/js_window_screen.asp
class Screen {
  // eslint-disable-next-line class-methods-use-this
  get width(): number {
    const screenWidth = (globalThis as any).__niaScreenWidth
    const {devicePixelRatio} = (globalThis as any).window

    if (typeof screenWidth === 'number' && typeof devicePixelRatio === 'number' &&
      devicePixelRatio > 0) {
      return screenWidth / devicePixelRatio
    }

    return (globalThis as any).window.innerWidth
  }

  // eslint-disable-next-line class-methods-use-this
  get height(): number {
    const screenHeight = (globalThis as any).__niaScreenHeight
    const {devicePixelRatio} = (globalThis as any).window

    if (typeof screenHeight === 'number' && typeof devicePixelRatio === 'number' &&
      devicePixelRatio > 0) {
      return screenHeight / devicePixelRatio
    }

    return (globalThis as any).window.innerHeight
  }

  // TODO(lreyna): Available width and height should be calculated based on the screen space the app
  // can actually use, excluding any system UI elements like the MacOS menu bar or Windows taskbar.
  // For example, if the MacOS menu bar is visible on the top of a 1080 height screen, the available
  // height might be 1080 - 25 = 1055.
  // For now, we'll just return the same values as width and height
  get availWidth(): number {
    return this.width
  }

  get availHeight(): number {
    return this.height
  }

  readonly colorDepth = 24

  readonly pixelDepth = 24

  readonly [Symbol.toStringTag]: string = 'Screen'
}
export default Screen
