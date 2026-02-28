const isMobileDevice = () => {
  const userAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)
  const narrowScreen = window.innerWidth <= 768
  
  return userAgent || (hasTouch && narrowScreen)
}

export {
  isMobileDevice,
}