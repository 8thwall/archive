const getSafeAreaInsets = () => {
  const div = document.createElement('div')
  div.style.cssText = `
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    pointer-events: none;
    z-index: -1;
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  `
  document.body.appendChild(div)
  const style = getComputedStyle(div)
  const insets = {
    top: parseFloat(style.paddingTop) || 0,
    bottom: parseFloat(style.paddingBottom) || 0,
    left: parseFloat(style.paddingLeft) || 0,
    right: parseFloat(style.paddingRight) || 0,
  }
  document.body.removeChild(div)
  return insets
}

export {
  getSafeAreaInsets,
}
