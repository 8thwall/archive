function getScriptName() {
  const error = new Error()
  let source
  const lastStackFrameRegex = new RegExp(/.+\/(.*?):\d+(:\d+)*$/)
  const currentStackFrameRegex = new RegExp(/getScriptName \(.+\/(.*):\d+:\d+\)/)
  if ((source = lastStackFrameRegex.exec(error.stack.trim())) && source[1] != '') {
    return source[1]
  } else if ((source = currentStackFrameRegex.exec(error.stack.trim()))) {
    return source[1]
  } else if (error.fileName != undefined) {
    return error.fileName
  }
  return ''
}

const scriptName = getScriptName()
// assumes file name of dist_<commit>-<devSettings>_bundle.js

const getBuildType = () => {
  const isDevRegEx = new RegExp(/.*\.dev\.8thwall\.app/)
  if (isDevRegEx.exec(window.location.host)) return 'dev'
  const isStagingRegEx = new RegExp(/niantic\.staging\.8thwall\.app/)
  if (isStagingRegEx.exec(window.location.host)) return 'staging'
  const isProductionRegEx = new RegExp(/niantic\.8thwall\.app|www\.intothescaniverse\.com/)
  if (isProductionRegEx.exec(window.location.host)) return 'prod'
  return 'unknown'
}
const buildType = getBuildType()

const appVersion = '0.9.0'
// pull the first 7 characters of the commit ref as version
const appRevision = scriptName.substring(5, 12)

const Version = {
  appVersion,
  appRevision,
  buildType,
}
export {Version}
