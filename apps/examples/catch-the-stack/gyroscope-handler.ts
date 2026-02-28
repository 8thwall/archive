let gyroscopeActive: boolean = false

const GlobalGyroscopeActive = {
  getGyroscopeActive: () => gyroscopeActive,
}

const addiOSPermissionOverlay = (
  onClickCallback: () => Promise<boolean>
) => {
  const existing = document.getElementById('ios-permission-button')
  if (existing) {
    existing.remove()
  }

  const btn = document.createElement('button')
  btn.id = 'ios-permission-button'
  btn.style.position = 'fixed'
  btn.style.top = '0'
  btn.style.left = '0'
  btn.style.width = '100vw'
  btn.style.height = '100vh'
  btn.style.zIndex = '99999'
  btn.style.background = 'transparent'
  btn.style.border = 'none'
  btn.style.padding = '0'
  btn.style.margin = '0'
  btn.style.opacity = '0'
  btn.style.cursor = 'pointer'
  btn.style.touchAction = 'manipulation'

  btn.addEventListener('click', async () => {
    gyroscopeActive = await onClickCallback()
    btn.remove()
  })

  document.body.appendChild(btn)
}

export {
  GlobalGyroscopeActive,
  addiOSPermissionOverlay,
}