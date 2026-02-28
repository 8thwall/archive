#!/usr/local/bin/node
//
// Usage:
// $ ./build-rc.js
//
// To automatically copy <meta> tag to your clipboard:
// $ ./build-rc.js | pbcopy
//
// Script to build an xrextras release candidate and upload a new version to s3; the built version
// will be added to the rc directory, which is gitignored. To promote an rc to a gm, copy the built
// file from your rc directory to the parent directory, removing the build timestamp suffix.
const fs = require('fs')
const {promisify} = require('util')
const exec = promisify(require('child_process').exec)

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
    src: `${workspacePath}/apps/client/public/web/xrextras`,
    cdn: `${workspacePath}/apps/client/public/web/cdn/xrextras`,
  }
}

const versionString = () => `0.0.0-${Date.now().toString(36)}`

const runBuildRc = async () => {
  const paths = execContext()
  const vs = versionString()
  const rcfilename = `xrextras-${vs}.js`

  console.warn(`Building ${rcfilename} in ${paths.src}`)
  process.chdir(paths.src)
  try {
    await exec('npm run build')
  } catch (e) {
    console.error('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<')
    console.error(e)
    console.error('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<')
    throw e
  }

  await exec(`mkdir -p ${paths.cdn}/rc`)
  await exec(`mv ${paths.src}/dist/xrextras.js ${paths.cdn}/rc/${rcfilename}`)

  const BUCKET = '8w-us-west-2-web'
  const KEY = `web/xrextras/${rcfilename}`

  console.warn(`Uploading to s3 bucket: '${BUCKET}' key: '${KEY}'`)
  await exec(`aws s3api put-object --bucket ${BUCKET} --key ${KEY} --body ${paths.cdn}/rc/${rcfilename} --cache-control public,max-age=0 --content-type application/javascript`)

  console.warn('Done. To test, use:')
  console.log(`<meta name="8thwall:package" content="@8thwall.xrextras:${vs}">`)
}

runBuildRc()
