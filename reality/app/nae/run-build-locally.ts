// @rule(js_cli)
// @attr(esnext = 1)
// @attr(target = "node")
// @package(npm-ecr)
// @attr[](data = "//reality/app/nae:nae-builder-archive-untar")
// @attr[](data = "//reality/app/nae/nae-build-request-data")

// To run either 1. pass an absolute path to a JSON config file, 2. the name of the config in
// reality/app/nae/nae-build-request-data, or 3. no argument.
// eslint-disable-next-line max-len
// 1. bazel run //reality/app/nae:run-build-locally -- --config=/Users/paris/repo/code8/reality/app/nae/nae-build-request-data/putt-putt-paradise-ios-prod.json
// 2. bazel run //reality/app/nae:run-build-locally -- --config=putt-putt-paradise-ios-prod
// 3. bazel run //reality/app/nae:run-build-locally

import fs from 'fs'
import path from 'path'

import {v4 as uuidv4} from 'uuid'

import {checkArgs} from '@nia/c8/cli/args'
import {streamSpawn} from '@nia/c8/cli/proc'

const RUNFILES_DIR = process.env.RUNFILES_DIR!

const DEFAULT_CONFIG = 'catch-the-stack-ios-prod'

const verifyValue = (arg: string | undefined, argName: string, defaultValue?: string): string => {
  if (!arg) {
    if (defaultValue) {
      return defaultValue
    }
    throw new Error(`Missing ${argName} value.`)
  }
  return arg
}

const parseArgs = async (): Promise<{configPath: string}> => {
  const {'config': configFlag} = checkArgs({
    optionalFlags: ['config'],
  })

  let configPath = ''
  if (configFlag && path.isAbsolute(configFlag as string)) {
    configPath = configFlag as string
  } else {
    configPath = path.join(
      RUNFILES_DIR,
      `_main/reality/app/nae/nae-build-request-data/${configFlag || DEFAULT_CONFIG}.json`
    )
  }
  // eslint-disable-next-line no-console
  console.log(`[run-build-locally] Using configPath: ${configPath}`)
  if (!fs.existsSync(configPath)) {
    throw new Error(`Config file not found: ${configPath}`)
  }

  return {configPath}
}

const main = async () => {
  let requestJson: any = {}
  try {
    const {configPath} = await parseArgs()
    const raw = fs.readFileSync(configPath, 'utf-8')
    requestJson = JSON.parse(raw)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[run-build-locally] Failed to read or parse config file', error)
    return
  }

  const NODE_PATH = path.join(
    RUNFILES_DIR,
    '_main/bzl/node/node'
  )
  const BUILD_JS_PATH = path.join(
    RUNFILES_DIR,
    '_main/reality/app/nae/nae-builder-archive-untar/reality/app/nae/build.js'
  )

  if (!fs.existsSync(NODE_PATH)) {
    throw new Error(`Node binary not found at ${NODE_PATH}`)
  }
  if (!fs.existsSync(BUILD_JS_PATH)) {
    throw new Error(`build.js not found at ${BUILD_JS_PATH}`)
  }

  requestJson.buildRequestTimestampMs = Date.now()
  requestJson.requestUuid = uuidv4()

  const NAE_REQUEST = JSON.stringify(requestJson)

  // Child env, scoped like `export`
  const childEnv = {
    ...process.env,

    // These env vars are required for the container to run properly. See reality/app/nae/build.ts
    RUNFILES_DIR: path.join(
      RUNFILES_DIR, '_main/reality/app/nae/nae-builder-archive-untar/reality/app/nae/runfiles/'
    ),
    NAE_BUILD_OUTPUT_BUCKET: '8w-us-west-2-nae-builds-qa',
    // eslint-disable-next-line max-len
    BUILD_NOTIFICATION_TOPIC: 'arn:aws:sns:us-west-2:<REMOVED_BEFORE_OPEN_SOURCING>:studio-build-notifications',
    // eslint-disable-next-line max-len
    CREDIT_NOTIFICATION_TOPIC: 'arn:aws:sns:us-west-2:<REMOVED_BEFORE_OPEN_SOURCING>:credit-notifications-qa',
    SECRET_NAMESPACE: 'Prod',
    DDB_APP_SIGNING_TABLE_NAME: 'nae-lambda-builder-upload-key-table-qa',
    DDB_HISTORICAL_BUILDS_TABLE_NAME: 'nae-lambda-builder-historical-build-table-qa',
    DDB_APPLE_SIGNING_FILES_TABLE_NAME: 'nae-lambda-builder-apple-signing-files-table-qa',
    DDB_APPLE_CERTIFICATES_FILES_TABLE_NAME: 'nae-lambda-builder-apple-certificate-files-table-qa',

    // These three are set outside of this script - set them in your environment before running.
    AWS_REGION: verifyValue(process.env.AWS_REGION, 'aws-region', 'us-west-2'),
    AWS_ACCESS_KEY_ID: verifyValue(process.env.AWS_ACCESS_KEY_ID, 'aws-access-key'),
    AWS_SECRET_ACCESS_KEY: verifyValue(process.env.AWS_SECRET_ACCESS_KEY, 'aws-secret-access-key'),

    // This is intended to be used for local testing
    NAE_RUN_LOCALLY: 'true',

    // Optional: Set these environment variables to configure test signing files.
    // Can use prefilled signing files (default), override with local files, or fetch from the DDB
    // table.
    PREFILL_SIGNING_FILES: 'true',
    PREFILLED_SIGNING_TYPE: requestJson.apple?.signingType || 'development',
    PREFILLED_TEAM_IDENTIFIER: '<REMOVED_BEFORE_OPEN_SOURCING>',
    // NAE_LOCAL_APPLE_P12_PATH: "/path/to/your/certificate.p12"
    // NAE_LOCAL_APPLE_P12_PASSWORD: "your_p12_password"
    // NAE_LOCAL_APPLE_PROVISIONING_PROFILE_PATH: "/path/to/your/profile.mobileprovision"

    // Optional: To test the Assets car API, first run:
    // eslint-disable-next-line max-len
    // - bazel build //reality/cloud/aws/cdk/nae-assets-car-api/src/api:index && node bazel-bin/reality/cloud/aws/cdk/nae-assets-car-api/src/api/index.js
    // Then comment this back in:
    // NAE_ASSETS_CAR_API_HOST: "127.0.0.1"
  }

  await streamSpawn(
    NODE_PATH,
    [BUILD_JS_PATH, `--naeBuilderRequest=${NAE_REQUEST}`],
    false,
    {cwd: RUNFILES_DIR, env: childEnv, stdio: 'inherit'}
  )
}

main()
