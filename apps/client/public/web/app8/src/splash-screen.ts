import {
  APP8_SPLASH_SCREEN_LOGO,
  APP8_FONT_FAMILY_WOFF,
  APP8_FONT_FAMILY_TTF,
} from './shared/resource-constants'

const isTauri = !!(window as any).__TAURI__

const showSplashScreen = () => {
  let viewport: HTMLMetaElement = document.querySelector('meta[name=viewport]')
  let addedMeta: HTMLMetaElement = null
  if (!viewport) {
    addedMeta = document.createElement('meta')
    addedMeta.name = 'viewport'
    addedMeta.content = ''
    document.head.appendChild(addedMeta)
    viewport = document.querySelector('meta[name=viewport]')
  }

  const origContent = viewport.content

  // Set the viewport for the splash screen, including user-scalable=0
  viewport.setAttribute('content',
    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0')

  // Add css style for animation keyframe references which are difficult to otherwise inline.
  const style8 = document.createElement('style')
  style8.innerHTML = `
  @-webkit-keyframes fi8 {0% {opacity: 0;} 100% {opacity: 1;}}
  @-webkit-keyframes fo8 {0% {opacity: 1;} 50% {opacity: 0;} 100% {opacity: 0;}}
  @keyframes fi8 {0% {opacity: 0;} 100% {opacity: 1;}}
  @keyframes fo8 {0% {opacity: 1;} 50% {opacity: 0;} 100% {opacity: 0;}}
  @font-face {
    font-family: 'Nunito';
    src: url('${APP8_FONT_FAMILY_WOFF}') format('woff'), /* Modern Browsers */
         url('${APP8_FONT_FAMILY_TTF}')  format('truetype') /* Safari, Android, iOS */
  }
  `
  document.head.appendChild(style8)

  // Create and style a div for the splash screen.
  const splash8 = document.createElement('div')
  splash8.style.setProperty('all', 'initial', 'important')
  splash8.style.setProperty('z-index', '100', 'important')
  splash8.style.setProperty('position', 'fixed', 'important')
  splash8.style.setProperty('background-position', 'center', 'important')
  splash8.style.setProperty('background-repeat', 'no-repeat', 'important')
  splash8.style.setProperty('background-size', 'cover', 'important')
  splash8.style.setProperty('top', '0', 'important')
  splash8.style.setProperty('left', '0', 'important')
  splash8.style.setProperty('width', '100%', 'important')
  splash8.style.setProperty('height', '100%', 'important')
  splash8.style.setProperty('animation', 'fi8 0.75s', 'important')
  splash8.style.setProperty('background',
    'radial-gradient(ellipse at center, #7611B6 0%, #531081 50%, #0F0E1A 100%)', 'important')
  document.body.appendChild(splash8)

  // Create and style the logo div for the splash screen.
  const logo8 = document.createElement('div')
  splash8.appendChild(logo8)

  const handleLogoResize = (r?: ResizeObserverEntry) => {
    const fw = r?.contentRect.width ?? splash8.clientWidth
    const fh = r?.contentRect.height ?? splash8.clientHeight
    const mw = Math.min(fw, fh)
    const dw = mw * 0.35
    const hdw = dw * 0.5
    const hw = fw * 0.5
    const hh = fh * 0.5

    logo8.style.setProperty('z-index', '200', 'important')
    logo8.style.setProperty('position', 'absolute', 'important')
    logo8.style.setProperty('background-position', 'center', 'important')
    logo8.style.setProperty('background-repeat', 'no-repeat', 'important')
    logo8.style.setProperty('background-size', 'contain', 'important')
    logo8.style.setProperty('top', `${hh - hdw}px`, 'important')
    logo8.style.setProperty('left', `${hw - hdw}px`, 'important')
    logo8.style.setProperty('width', `${dw}px`, 'important')
    logo8.style.setProperty('height', `${dw}px`, 'important')
    logo8.style.setProperty('animation', 'fi8 0.75s', 'important')
    logo8.style.setProperty('background-image',
      `url("${APP8_SPLASH_SCREEN_LOGO}")`, 'important')
  }

  const resizeObserver = new ResizeObserver(elements => elements.forEach(e => handleLogoResize(e)))
  resizeObserver.observe(splash8)
  handleLogoResize()  // Initial call to set the logo size.

  const cta8 = document.createElement('a')
  cta8.textContent = 'Build your own game at 8thwall.com'
  // eslint-disable-next-line max-len
  cta8.href = 'https://www.8thwall.com/?utm_source=splash-screen&utm_medium=8thwall-app&utm_campaign=splash-screen-cta'
  cta8.target = '_blank'
  cta8.rel = 'noopener noreferrer'

  cta8.style.setProperty('text-decoration', 'none', 'important')
  cta8.style.setProperty('z-index', '200', 'important')
  cta8.style.setProperty('position', 'absolute', 'important')
  if (isTauri && window.innerHeight > window.innerWidth) {
    cta8.style.setProperty('bottom', '0', 'important')
  } else {
    cta8.style.setProperty('top', '0', 'important')
  }
  cta8.style.setProperty('left', '0', 'important')
  cta8.style.setProperty('width', '100%', 'important')
  cta8.style.setProperty('height', `${splash8.clientHeight * 0.08}px`, 'important')
  cta8.style.setProperty('background-color', 'rgb(45, 46, 67)', 'important')
  cta8.style.setProperty('color', '#ffffff', 'important')
  cta8.style.setProperty('font-family', 'Nunito', 'important')
  cta8.style.setProperty('font-size', 'min(4vw, 36px)', 'important')
  cta8.style.setProperty('display', 'flex', 'important')
  cta8.style.setProperty('justify-content', 'center', 'important')
  cta8.style.setProperty('align-items', 'center', 'important')
  cta8.style.setProperty('animation', 'fi8 0.75s', 'important')
  splash8.appendChild(cta8)

  return {
    fadeOut: () => {
      // Remove the splash screen from the dom. Animate for 1s, but remove after 0.5s. If the
      // animation completes before removing the dom element, its opacity will revert to 1 and cause
      // a flash before removing.
      splash8.style.setProperty('animation', 'fo8 1s', 'important')
      logo8.style.setProperty('animation', 'fo8 1s', 'important')
      cta8.style.setProperty('animation', 'fo8 1s', 'important')
      setTimeout(() => {
        splash8.remove()
        style8.remove()
      }, 500)

      // Restore the user's original viewport or revert to unset if it wasn't set.
      if (addedMeta) {
        addedMeta.remove()
      } else {
        viewport.setAttribute('content', origContent)
      }
    },
  }
}

export {
  showSplashScreen,
}
