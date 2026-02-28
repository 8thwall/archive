import {
  createGradientRenderer,
  type GradientRenderer,
} from './nae-load-renderers/gradient-renderer'

import {
  createSplashImageRenderer,
  type SplashImageRenderer,
} from './nae-load-renderers/splash-image-renderer'

import {
  createSpinnerRenderer,
  type SpinnerRenderer,
} from './nae-load-renderers/spinner-renderer'

import {
  NAE_SPLASH_SCREEN_LOGO,
} from './shared/resource-constants'

type NaeSplashState = 'splash' | 'spinner'

const showNaeLoadScreen = (showSplashScreen: boolean) => {
  let canvas: HTMLCanvasElement
  let gl: WebGL2RenderingContext
  let gradientRenderer: GradientRenderer | null = null
  let imageRenderer: SplashImageRenderer | null = null
  let spinnerRenderer: SpinnerRenderer | null = null
  let currentState: NaeSplashState = 'splash'

  // Animation properties
  let startTime: number = 0  // For image intro animation

  // Fade out properties
  let isFadingOut: boolean = false
  let fadeOutStartTime: number = 0
  let currentFadeOutDuration: number = 1000  // Default fade-out duration
  let onFadeOutCompleteCallback: (() => void) | null = null

  let animationFrameId: number | null = null
  let isCleanedUp: boolean = false
  let drawingReady: boolean = false

  const drawScene = (timestamp: number): void => {
    (gl as any).eglSwapBuffers()
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    // NOTE: Clear with black to give spinner case a black background.
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    let overallAlpha = 1.0
    if (isFadingOut) {
      const fadeOutElapsedTime = timestamp - fadeOutStartTime
      overallAlpha = Math.max(0.0, 1.0 - (fadeOutElapsedTime / currentFadeOutDuration))
    }

    if (currentState === 'splash') {
      // Draw Gradient
      gradientRenderer.draw(overallAlpha, isFadingOut, startTime, timestamp)

      // Draw Image
      imageRenderer.draw(overallAlpha, isFadingOut, startTime, timestamp)
    } else if (currentState === 'spinner') {
      // Draw Spinner
      spinnerRenderer?.draw()
    }
  }

  const onWindowResize = () => {
    canvas.width = Math.floor(window.innerWidth * window.devicePixelRatio)
    canvas.height = Math.floor(window.innerHeight * window.devicePixelRatio)

    imageRenderer?.onResize()
  }

  const cleanup = (): void => {
    if (isCleanedUp) {
      return
    }
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }

    gradientRenderer?.cleanup()
    imageRenderer?.cleanup()
    spinnerRenderer?.cleanup()
    gradientRenderer = null
    imageRenderer = null
    spinnerRenderer = null

    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas)
    }

    window.removeEventListener('resize', onWindowResize)

    isFadingOut = false
    isCleanedUp = true
  }

  const runRenderLoop = (): void => {
    const loop = (timestamp: number) => {
      if (isCleanedUp) {
        return
      }
      if (drawingReady) {
        drawScene(timestamp)
      }
      if (isFadingOut) {
        const fadeOutElapsedTime = timestamp - fadeOutStartTime
        if (fadeOutElapsedTime >= currentFadeOutDuration) {
          cleanup()
          if (onFadeOutCompleteCallback) {
            onFadeOutCompleteCallback()
            onFadeOutCompleteCallback = null
          }
          return
        }
      }

      if (!isCleanedUp) {
        animationFrameId = requestAnimationFrame(loop)
      }
    }

    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
    }
    animationFrameId = requestAnimationFrame(loop)
  }

  const show = (): void => {
    if (isCleanedUp) {
      // eslint-disable-next-line no-console
      console.warn('Loading screen is already cleaned up. Cannot show again.')
      return
    }
    if (animationFrameId !== null && !isFadingOut) {
      return
    }

    isFadingOut = false
    startTime = performance.now()

    // NOTE(lreyna): Following what Three JS does when implicitly creating a canvas.
    // eslint-disable-next-line max-len
    // https://github.com/mrdoob/three.js/blob/4dd9c05c1a4f5f7e8ccfa9f8a5a338d70f3a1efc/src/renderers/WebGLRenderer.js#L621

    onWindowResize()

    window.addEventListener('resize', onWindowResize)

    drawingReady = true

    runRenderLoop()
  }

  const fadeOut = (duration: number = 2000): Promise<void> => {
    if (isCleanedUp) {
      return Promise.resolve()
    }

    isFadingOut = true
    fadeOutStartTime = performance.now()
    currentFadeOutDuration = duration

    return new Promise<void>((resolve) => {
      onFadeOutCompleteCallback = resolve
      if (animationFrameId === null) {
        runRenderLoop()
      }
    })
  }

  const canvasElement = document.createElement('canvas') as HTMLCanvasElement
  // TODO: The data splash screen is still included to prevent bugs that come from releasing shell
  // versions that still refer to it by name. Once some releases are made with both attributes,
  // we can remove the data-splash-screen attribute completely and switch the shell references.
  canvasElement.setAttribute('data-splash-screen', 'true')
  canvasElement.id = 'splash-screen-canvas'
  canvasElement.setAttribute('data-load-screen', 'true')
  document.body.appendChild(canvasElement)
  if (!canvasElement || !(canvasElement instanceof HTMLCanvasElement)) {
    throw new Error('Canvas element not found or is not a canvas.')
  }
  canvas = canvasElement

  const context = canvasElement.getContext('webgl2')

  if (!context) {
    throw new Error('Failed to get WebGL context. Your browser might not support it.')
  }
  gl = context

  if (showSplashScreen) {
    currentState = 'splash'
    const gradientInit = {
      gl,
      colorCenter: [0.4627, 0.0667, 0.7137, 1.0] as [number, number, number, number],  // #7611B6
      colorMiddle: [0.3255, 0.0627, 0.5059, 1.0] as [number, number, number, number],  // #531081
      colorEdge: [0.0588, 0.0549, 0.1020, 1.0] as [number, number, number, number],  // #0F0E1A
    }
    const imageInit = {
      gl,
      logoUrl: NAE_SPLASH_SCREEN_LOGO,
    }

    gradientRenderer = createGradientRenderer(gradientInit)
    imageRenderer = createSplashImageRenderer(imageInit)
  } else {
    currentState = 'spinner'
    spinnerRenderer = createSpinnerRenderer({gl})
  }

  show()

  return {
    fadeOut,
    cleanup,
  }
}

export {showNaeLoadScreen}
