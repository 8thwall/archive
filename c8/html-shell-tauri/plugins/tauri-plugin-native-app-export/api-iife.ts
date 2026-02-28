// @rule(js_binary)

// NOTE(lreyna): When building with the packager, `target = node` is being set on this target.
// Setting target to web doesn't fix it, so using globalThis to prevent type errors with window.
const globalObj = globalThis as any

const vibrateOverride = (pattern: number | number[] | Iterable<number>): boolean => {
  try {
    // Convert pattern to array of numbers following web spec:
    // https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API
    let patternArray: number[]

    if (typeof pattern === 'number') {
      patternArray = [pattern]
    } else if (Array.isArray(pattern)) {
      patternArray = pattern
    } else {
      patternArray = Array.from(pattern)
    }

    patternArray = patternArray.map(val => Math.max(0, Math.floor(val)))

    const tauri = globalObj.__TAURI_INTERNALS__ || globalObj.__TAURI__
    if (tauri && tauri.invoke) {
      tauri.invoke('plugin:native-app-export|vibrate', {pattern: patternArray})
        .catch(() => {})
    }

    return true
  } catch (error) {
    return false
  }
}

const main = () => {
  globalObj.navigator.vibrate = vibrateOverride
}

main()
