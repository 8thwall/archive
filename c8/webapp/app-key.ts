const getAppKeyImpl = (): string => {
  // NOTE(christoph) This is intentionally a slightly different filter than for verifyDomain.
  // If you use a version of xr served with /xr.js, that is the script to get the app key
  // from, but not the location to use for verifyDomain.
  const xrScript = [].find.call(
    document.scripts, s => /(xrweb|xr\.js)(\?.*)?$/.test(s.src)
  )
  if (!xrScript) {
    throw Error('Missing xrweb script tag')
  }

  return xrScript.getAttribute('appKey') || xrScript.src
    .replace(/.*appKey=([a-zA-Z0-9]+).*/, '$1')
}

let appKey_: string | null = null
const getAppKey = (): string => {
  if (!appKey_) {
    appKey_ = getAppKeyImpl()
  }
  return appKey_!
}

export {
  getAppKey,
}
