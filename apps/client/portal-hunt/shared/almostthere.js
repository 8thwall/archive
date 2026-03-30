const tryParseUrl = url => {
  try {
    return new URL(url)
    return valid
  } catch (e) {}

  try {
    return new URL('https://' + url)
  } catch (e) {}

  return null
}

const removeAllClass = c => {
  Array.from(document.getElementsByClassName(c)).forEach(e => {
    e.classList.remove(c)
  })
}

const showIf = name => {
  const classToShow = 'show-if-' + name
  Array.from(document.getElementsByClassName(classToShow)).forEach(e => {
    Array.from(e.classList).filter(c=>c.startsWith('show-if-')).forEach(c => {
      e.classList.remove(c)
    })
  })
}

const fill = (selector, content) => {
  Array.from(document.querySelectorAll(selector)).forEach(e => {
    e.textContent = content
  })
}

const parameters = new URLSearchParams(window.location.search)
const rawUrl = parameters.get('u')
const parsedUrl = rawUrl && tryParseUrl(rawUrl)
const redirectUrl = parsedUrl ? parsedUrl.href : rawUrl
const urlDomain = parameters.get('d') || parsedUrl && parsedUrl.hostname || rawUrl
const browser = parameters.get('b')
const message = parameters.get('m')
const status = parameters.get('s')

const currentBaseUrl = window.location.href.slice(0, window.location.href.length - window.location.search.length)

let continueLink

switch (message || null) {
  case 'motion':
    parameters.set('s','check')
    continueLink = currentBaseUrl + '?' + parameters.toString()
    break

  case 'desktop':
    const scriptElem = document.createElement("script")
    scriptElem.type = "text/javascript"
    scriptElem.src = "https://cdn.8thwall.com/web/share/qrcode8.js"
    scriptElem.onload = () => {
      // NOTE(rigel): Change to new API using generateQR8Svg
      document.getElementById('qrcode').innerHTML = qrcode8.generateQRHtml(rawUrl, 250, 1, 80, null, ['black', 'gray'], [0, 0, 1, 1], 'L')
    }
    document.body.appendChild(scriptElem)
    break

  case 'camera':
    continueLink = redirectUrl
    break

  case null:
    continueLink = redirectUrl
    break
}

if (message === 'motion' && status === 'check') {
  const handleOrientation = () => {
    window.removeEventListener('devicemotion', handleOrientation)
    window.location = redirectUrl
  }
  window.addEventListener('devicemotion', handleOrientation)
}

const userAgent = navigator.userAgent || navigator.vendor || window.opera

const hasGetUserMedia = !!(window.navigator && window.navigator.mediaDevices && window.navigator.mediaDevices.getUserMedia)
const isInSafari = hasGetUserMedia && (userAgent.includes('AppleWebKit/') && userAgent.includes('Mobile/') && userAgent.includes('Version/'))
if (redirectUrl && message === 'webview' && isInSafari) {
  window.location = redirectUrl
}

browser && showIf(browser)
rawUrl && fill('.fill-raw-url', rawUrl)
urlDomain && fill('.fill-domain', urlDomain)
message ? showIf(message) : removeAllClass('hide-if-message')

if (continueLink) {
  document.getElementById('continue').style.display = 'initial'
  document.getElementById('continue').href = continueLink
}

if (message !== 'desktop') {
  removeAllClass('hide-if-desktop')
}

if (redirectUrl) {
  fill('.fill-url', redirectUrl)
  showIf('url')
}

const copyUrl = e => {
  const el = document.createElement('textarea')
  el.value = rawUrl
  document.body.appendChild(el)
  Object.assign(el.style, {
    zIndex: '-99999',
    position: 'absolute',
  })

  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      el.contentEditable = true
      el.readOnly = false
      const s = window.getSelection()
      s.removeAllRanges()

      const range = document.createRange()
      range.selectNodeContents(el)
      s.addRange(range)

      el.setSelectionRange(0, 999999)
  } else {
      el.select()
  }

  document.execCommand('copy')
  document.body.removeChild(el)
  document.body.classList.add('copied')
}
