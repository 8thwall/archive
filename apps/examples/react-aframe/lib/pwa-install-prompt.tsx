declare let React: any
declare let window: any
declare let XRExtras: any
const onload = () => {
  XRExtras.PwaInstaller.setDisplayAllowed(true)
  return () => {
    XRExtras.PwaInstaller.setDisplayAllowed(false)
  }
}
const PwaInstallPrompt = () => {
  React.useEffect(() => {
    window.XR8 && window.XRExtras ? onload() : window.addEventListener('xrandextrasloaded', onload)
  }, [])
  // Install prompt displayed by XRExtras.
  return null
}
export {
  PwaInstallPrompt,
}
