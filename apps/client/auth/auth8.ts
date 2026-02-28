/* eslint-disable no-console */
// Command line tool for fetching creds from xrhome and storing them in the user's home directory.
// This script:
//   * Opens 8thwall.com/auth in google chrome in a nav-less standalone window.
//   * The page posts the jwt back to this server at http://localhost:3000/auth
//   * The page in google chrome closes itself.
//   * This server parses the response and writes the jwt to the user's filesystem.
//   * The server refocuses iterm2.
//   * The server returns success to the page in google chrome.
//   * The page in google chrome closes itself.

import * as bodyParser from 'body-parser'
import express from 'express'
import * as fs from 'fs'
import * as os from 'os'
import * as process from 'process'
import {promisify} from 'util'
import * as child_process from 'child_process'  // eslint-disable-line camelcase

import {checkArgs} from '../../../c8/cli/args'

const exec = promisify(child_process.exec)

const app = express()
const port = 3000

const HELP = `auth8:
  Usage: auth8 [--help] [--dataRealm=(prod|dev|local)]
`

const SERVER_FOR_DATA_REALM = {
  local: 'https://console.8thwallcom.test:3001',
  dev: 'https://console-dev.8thwall.com',
  prod: 'https://www.8thwall.com',
}

const DEFAULT_DATA_REALM = 'prod'

let currentFocus_: string | null = null

const getCurrentFocus = async () => {
  // OSX implementation:
  const appArn = (await exec('lsappinfo front')).stdout.trim()
  return (await exec(
    `lsappinfo info -only bundlepath ${appArn} | sed "s/\\"LSBundlePath\\"=\\"\\(.*\\)\\"/\\1/"`
  )).stdout.trim()
}

const restoreFocus = async (target) => {
  // OSX implementation:
  await exec(`open -a "${target}"`)  // refocus the terminal.
}

// Write the received credentials to ~/.auth8/credentials
const writeAuth = (auth) => {
  const authDir = `${os.homedir()}/.auth8`
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir)
  }
  const authPath = `${authDir}/credentials`
  const authFile = fs.openSync(authPath, 'w')
  fs.writeSync(authFile, `${auth.credentials}\n`)
  fs.closeSync(authFile)
  console.log(`Refreshed 8th Wall credentials for '${auth.email}'.`)
}

app.use(bodyParser.urlencoded({extended: true}))

// Receive the jwt from the browser window and write it to disk. Return success to the browser and
// refocus the terminal.
app.post('/auth', async (req: express.Request, res: express.Response) => {
  let returnCode = 0
  if (!(req.body.auth8 && req.body.auth8.credentials)) {
    console.error('Invalid authorization', req.body)
    res.sendStatus(400)
    returnCode = 1
  } else {
    writeAuth(req.body.auth8)
    res.sendStatus(200)
  }
  await restoreFocus(currentFocus_)  // refocus the terminal.
  process.exit(returnCode)
})

app.listen(port)

const run = async () => {
  const {dataRealm = DEFAULT_DATA_REALM} = checkArgs({
    optionalFlags: ['dataRealm'],
    optionsForFlag: {
      dataRealm: ['local', 'dev', 'prod'],
    },
    minOrdered: 0,
    maxOrdered: 0,
    help: HELP,
  }) as any

  currentFocus_ = await getCurrentFocus()

  const url = `${SERVER_FOR_DATA_REALM[dataRealm]}/auth`
  // Open the locally hosted outer page with Google Chrome.
  await exec(
    `/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --app=${url}`
  )
}

run()
