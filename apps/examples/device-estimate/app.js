const onxrloaded = () => {
  document.head.insertAdjacentHTML('beforeend', `
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  `)

  const pre = document.createElement('pre')
  const code = document.createElement('code')
  code.textContent = '[Device data will show here]'
  pre.appendChild(code)
  document.body.appendChild(pre)
  code.textContent = JSON.stringify(XR8.XrDevice.deviceEstimate(), null, 2)
  code.textContent += '\n User-Agent String:' + navigator.userAgent
}
window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
