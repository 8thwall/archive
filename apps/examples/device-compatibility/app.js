const onxrloaded = () => {
  const allowed = XR8.XrConfig.device().MOBILE

  document.head.insertAdjacentHTML('beforeend', `
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  `)

  const pre = document.createElement('pre')
  const code = document.createElement('code')
  code.textContent = '[Compatibility Details]\n'
  pre.appendChild(code)
  document.body.appendChild(pre)

  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    code.textContent += 'Browser reports getUserMedia exists\n'
  }

  if (XR8.XrDevice.isDeviceBrowserCompatible({allowedDevices: allowed})) {
    code.textContent += 'Browser is Compatible\n'
  } else {
    code.textContent += 'Not Compatible. Reasons:\n'

    const reasons = XR8.XrDevice.incompatibleReasons()
    reasons.forEach((element) => {
      const reason = Object.keys(XR8.XrDevice.IncompatibilityReasons).find(k => XR8.XrDevice.IncompatibilityReasons[k] === element)
      code.textContent += `${reason}\n`
    })

    const details = XR8.XrDevice.incompatibleReasonDetails
    if (Object.keys(details).length !== 0) {
      code.textContent += 'Additional Details:\n'
      if (details.inAppBrowser) {
        code.textContent += `inAppBrowser: ${details.inAppBrowser}\n`
      }
      if (details.inAppBrowserType) {
        code.textContent += `inAppBrowserType: ${details.inAppBrowserType}\n`
      }
    }
  }
}
window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
