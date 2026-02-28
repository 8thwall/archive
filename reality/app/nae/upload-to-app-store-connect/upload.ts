// @rule(js_cli)
// @attr(esnext = 1)
// @attr(data = ["//bzl/itms-transporter"])
// @attr(npm_rule = "@npm-html-app-packager//:npm-html-app-packager")
// @attr(target = "node")
// @attr(visibility = ["//visibility:public"])

// To run:
// eslint-disable-next-line max-len
// - bazel run //reality/app/nae/upload-to-app-store-connect:upload -- --apiKey=$API_KEY --apiIssuer=$ISSUER_ID --asset=$ASSET_PATH

/* eslint-disable no-console */
import {existsSync} from 'fs'
import path from 'path'

import {checkArgs} from '@nia/c8/cli/args'
import {streamSpawn} from '@nia/c8/cli/proc'

const runfilePath = (filePath: string) => {
  if (!process.env.RUNFILES_DIR) {
    throw new Error('RUNFILES_DIR environment variable is not set')
  }
  return path.join(process.env.RUNFILES_DIR, filePath)
}

const main = async () => {
  const {apiKey, apiIssuer, asset} = checkArgs({
    requiredFlags: ['apiKey', 'apiIssuer', 'asset'],
  })

  const itmsTransporterPath = runfilePath(
    '_main/bzl/itms-transporter/itms-transporter/bin/iTMSTransporter'
  )
  if (!existsSync(itmsTransporterPath)) {
    console.error(`iTmsTransporter not found at ${itmsTransporterPath}`)
    return
  }

  streamSpawn(
    itmsTransporterPath, [
      '-m',
      'upload',
      '-assetFile',
      asset as string,
      '-apiKey',
      apiKey as string,
      '-apiIssuer',
      apiIssuer as string,
    ],
    false
  )
}

main()
