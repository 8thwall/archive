// @sublibrary(:dom-core-lib)
import os from 'os'

const internalWarnOnceSet = new Set<string>()
const warnOnce = (key: string, content: string) => {
  if (!internalWarnOnceSet.has(key)) {
    // eslint-disable-next-line no-console
    console.warn(content)
    internalWarnOnceSet.add(key)
  }
}

// https://html.spec.whatwg.org/multipage/system-state.html#the-navigator-object
// Most of these values are just hardcoded.
class Navigator {
  readonly appCodeName: string = 'Mozilla'

  readonly appName: string = 'Netscape'

  readonly product: string = 'Gecko'

  readonly platform: string = os.platform()

  readonly language: string = (globalThis as any).__niaSystemLocale || 'en-US';

  readonly userAgent: string = (globalThis as any).__niaUserAgent ||
    'Mozilla/5.0 AppleWebKit/537.36 Chrome/127.0.0.0 Safari/537.36'

  readonly cookieEnabled: boolean = true

  readonly version: string = '1.0.0'

  readonly vendor: string = ''

  readonly vendorSub: string = ''

  // eslint-disable-next-line class-methods-use-this
  vibrate(pattern: number | number[]): boolean {
    const nativeVibrateMethod: ((p: Int32Array) => boolean) = (globalThis as any).__niaVibrate
    if (!nativeVibrateMethod) {
      warnOnce('vibration-not-supported', 'Vibration API is not implemented on this platform.')
      return false
    }

    const patternArray = new Int32Array(Array.isArray(pattern) ? pattern : [pattern])
    return nativeVibrateMethod(patternArray)
  }
}

export default Navigator
