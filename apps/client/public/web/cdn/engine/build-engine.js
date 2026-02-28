#!/usr/local/bin/node
//
// Usage:
// $ ./build-engine.js
//
// To automatically copy engine cdn location to your clipboard:
// $ ./build-engine.js | pbcopy
//
// Important: We set the file name based off of your username and hostname and override the file
// on each build. Edit versionString() if you'd like to keep multiple versions.
//
// Script to build engine and upload to s3; the built version
// will be added to the rc directory, which is gitignored. You can then set this engine as the
// "Custom Engine Location" and get a token for it. Useful for testing in WKWebView's.
// Delete your build once you are finished using it.
const fs = require('fs')
const {promisify} = require('util')
const exec = promisify(require('child_process').exec)
const os = require('os')

/* eslint-disable no-console */

// Utility to find the bazel workspace root as a parent of the current directory by recursive
// search.
const findWorkspace = (dirname) => {
  if (!dirname) {
    throw new Error('Couldn\'t find WORKSPACE root.')
  }
  const contents = fs.readdirSync(dirname)
  if (contents.find(v => v === 'WORKSPACE')) {
    return dirname
  }
  const path = dirname.split('/')
  const parent = path.slice(0, path.length - 1).join('/')
  return findWorkspace(parent)
}

const execContext = () => {
  const scriptPath = __dirname
  const execPath = process.cwd()
  const workspacePath = findWorkspace(scriptPath)

  return {
    exec: execPath,
    script: scriptPath,
    workspace: workspacePath,
    src: `${workspacePath}/reality/app/xr/js`,
    cdn: `${workspacePath}/apps/client/public/web/cdn/engine`,
  }
}

const hashCode = (s) => {
  let h
  for (let i = 0; i < s.length; i++) {
    // eslint-disable-next-line no-bitwise
    h = Math.imul(31, h) + s.charCodeAt(i) | 0
  }
  return h
}

const versionString = () => `0.0.0-${hashCode(os.userInfo().username + os.hostname())}`

const runBuildRc = async () => {
  const paths = execContext()
  const vs = versionString()
  const rcfilename = `xr-${vs}.js`

  console.warn(`Building ${rcfilename}`)
  process.chdir(paths.src)
  try {
    await exec('npm run build-release')
  } catch (e) {
    console.error('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<')
    console.error(e)
    console.error('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<')
    throw e
  }

  await exec(`mkdir -p ${paths.cdn}/rc`)
  await exec(`mv -f ${paths.workspace}/bazel-bin/reality/app/xr/js/xr.js ${paths.cdn}/rc/${rcfilename}`)

  const BUCKET = '8w-us-west-2-web'
  const KEY = `web/test/engine/${rcfilename}`

  console.warn(`Uploading to s3 bucket: '${BUCKET}' key: '${KEY}'`)
  await exec(`aws s3api put-object --bucket ${BUCKET} --key ${KEY} --body ${paths.cdn}/rc/${rcfilename} --cache-control public,max-age=0 --content-type application/javascript`)

  console.warn('Done. To test, use:')
  console.log(`https://cdn.8thwall.com/web/test/engine/${rcfilename}`)
}

runBuildRc()
