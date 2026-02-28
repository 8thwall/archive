// @rule(js_cli)
// @attr(esnext = 1)
// @attr(npm_rule = "@npm-html-app-packager//:npm-html-app-packager")
// @attr(target = "node")
// @attr(visibility = ["//visibility:public"])

// Set up:
// Make sure your device or emulator is connected and running, if you wish to test directly
//
// To run:
// - bazel run //apps/client/nae:run-packager -- --config=path/to/config.json

/* eslint-disable no-console */
import fs from 'fs'
import os from 'os'
import path from 'path'
import https from 'https'
import type {IncomingMessage} from 'http'

import {checkArgs} from '@nia/c8/cli/args'
import {streamExec, streamSpawn} from '@nia/c8/cli/proc'

import type {HtmlAppConfig, HtmlShell} from '@nia/reality/shared/nae/nae-types'

type BazelBuildTarget = {
  target: string
  output: string
  config?: string[]
}

type PackagerArgs = {
  // Note: Paths are relative to the REPO_ROOT, aka. ~/repo/code8
  // The path to the HTML app config file, which contains the app configuration.
  // This file should be in the format expected by the HTML app packager.
  // Example: apps/client/nae/dragondash/config-prod.json
  config: string
  // The output path where the packaged app will be saved.
  // Make sure the file extension matches the platform, e.g. .apk for Android, .ipa for iOS.
  // Example: bazel-bin/apps/client/nae/dragondash.apk
  out: string
  // If true, the packager will enable the Node.js inspector.
  // This is useful for debugging performance issues in the app.
  // The inspector will be available at the default port (9229).
  // See: Where the node thread is created in android-shell/android/android-shell-main.cc
  inspect: boolean
  // If true, the packager will clear the cache related to the run-packager script.
  clearCache: boolean
}

const REPO_ROOT = process.env.REPO_ROOT || `${os.homedir()}/repo/code8`
const LOG_PREFIX = ''

const PACKAGER_BUILD_TARGET: BazelBuildTarget = {
  target: '//reality/app/nae/packager:packager',
  output: 'bazel-bin/reality/app/nae/packager/packager',
}

// NOTE(lreyna): This is for running on OSX
const HOST_PLATFORM = process.platform
const DEFAULT_CACHE_PATH = (HOST_PLATFORM === 'darwin')
  ? path.join(os.homedir(), 'Library', 'Caches', 'code8', 'run-packager')
  : ''

const iosDeviceId = async () => {
  const deviceIdRegex = /(.+) \(([0-9]+\.[0-9]+(\.[0-9]+)?)\) \(([^)]+)\)/
  // If you get an error saying:
  // "xcrun: error: unable to find utility "xctrace", not a developer tool or in PATH"
  // then you need to install Xcode command line tools:
  //   - xcode-select --install
  // If that doesn't work, you can try running:
  //   - sudo xcode-select -s /Applications/Xcode.app/Contents/Developer

  try {
    const result = await streamSpawn('xcrun', ['xctrace', 'list', 'devices'], true)

    if (!result || !result.stdout) {
      throw new Error('No output from xcrun')
    }
    const deviceList = result.stdout
      .split('\n')
      .filter(line => deviceIdRegex.test(line) && !line.includes('Simulators'))
    const deviceId = deviceList.length > 0 ? deviceList[0].match(deviceIdRegex)?.[4] : undefined
    return deviceId || ''
  } catch (error) {
    console.error('Error getting iOS device ID:', error)
    return ''
  }
}

const getPathWithoutExtension = (filePath: string): string => path.join(
  path.dirname(filePath),
  path.basename(filePath, path.extname(filePath))
)

const validatePath = (p: string) => (path.isAbsolute(p) ? p : path.join(REPO_ROOT, p))

const defaultAppExtension = (shellType: HtmlShell) => {
  switch (shellType) {
    case 'android':
    case 'quest':
      return 'apk'
    case 'ios':
      return 'ipa'
    case 'osx':
      return 'app'
    case 'html':
      return 'zip'
    default:
      throw new Error(`Unsupported shell type: ${shellType}`)
  }
}

const parseArgs = async (): Promise<PackagerArgs> => {
  const {config, out, inspect, 'clear-cache': clearCache} = checkArgs({
    requiredFlags: ['config'],
    optionalFlags: ['out', 'inspect', 'clear-cache'],
  })

  // NOTE(lreyna): Since this script is run from the bazel sandbox, we need to ensure
  // that the paths are absolute or relative to the REPO_ROOT.
  const validatedConfig = validatePath(config as string)
  const validatedOut = out ? validatePath(out as string) : ''

  ;[validatedConfig].forEach((p) => {
    if (!fs.existsSync(p)) {
      throw new Error(
        `File does not exist: ${p} - Make sure paths are absolute or relative to ${REPO_ROOT}`
      )
    }
  })

  return {
    config: validatedConfig,
    out: validatedOut,
    inspect: !!inspect,
    clearCache: !!clearCache,
  }
}

const clearCache = (cachePath: string) => {
  if (fs.existsSync(cachePath)) {
    fs.rmSync(cachePath, {recursive: true, force: true})
    console.log(`Cache cleared at: ${cachePath}`)
  } else {
    console.log(`No cache found at: ${cachePath}`)
  }
}

const queryDefaultBazelStringFlag = async (target: string): Promise<string> => {
  const cachePath = path.join(DEFAULT_CACHE_PATH, target.replace(/[@/:]/g, '_'))

  const bazelQueryArgs = [
    'query',
    target,
    '--output=build',
  ]

  let queryResult: { stdout: string; stderr: string } | void
  try {
    if (HOST_PLATFORM === 'darwin' && fs.existsSync(cachePath)) {
      console.log(`Using cached Bazel query result from: ${cachePath}`)
      queryResult = {
        stdout: fs.readFileSync(cachePath, 'utf-8'),
        stderr: '',
      }
    } else {
      console.log(`Running Bazel query: bazel ${bazelQueryArgs.join(' ')}`)
      queryResult = await streamSpawn('bazel', bazelQueryArgs, true, {
        cwd: REPO_ROOT,
      })
      if (!queryResult || !queryResult.stdout) {
        throw new Error('Empty output from Bazel query command')
      }

      fs.mkdirSync(path.dirname(cachePath), {recursive: true})
      fs.writeFileSync(cachePath, queryResult.stdout)
      console.log(`Bazel query result cached at: ${cachePath}`)
    }
  } catch (error) {
    console.error('Error querying:', error)
    process.exit(1)
  }

  // Extract the build_setting_default value from the output
  const match = queryResult.stdout.match(/build_setting_default = "(.*)",/)
  const defaultSetting = match ? match[1] : undefined

  if (!defaultSetting) {
    throw new Error('Could not extract build_setting_default from Bazel output')
  }

  return defaultSetting
}

const defaultOutputPath = (configPath: string, appConfig: HtmlAppConfig): string => {
  const configDirPath = path.relative(REPO_ROOT, path.dirname(configPath))
  const appName = appConfig.appInfo?.appName || 'app'
  const appExtension = defaultAppExtension(appConfig.shell)
  return path.join(REPO_ROOT, 'bazel-bin', configDirPath, `${appName}.${appExtension}`)
}

const waitForServer = (url: string, timeoutMs = 10000, intervalMs = 200): Promise<void> => {
  const start = Date.now()
  return new Promise<void>((resolve, reject) => {
    const timer = setInterval(() => {
      const req = https.get(url, {rejectUnauthorized: false}, (res: IncomingMessage) => {
        if (res.statusCode && res.statusCode < 500) {
          clearInterval(timer)
          resolve()
          req.destroy()
        } else {
          res.resume()
        }
      })
      req.on('error', () => {
        if (Date.now() - start > timeoutMs) {
          clearInterval(timer)
          reject(new Error('Server did not start in time'))
        }
      })
    }, intervalMs)
  })
}

const findIndexHtml = (dir: string): string | null => {
  try {
    const files = fs.readdirSync(dir, {withFileTypes: true})
    const indexFile = files.find(file => file.isFile() && file.name.toLowerCase() === 'index.html')
    if (indexFile) {
      return path.join(dir, indexFile.name)
    }

    for (const file of files) {
      if (file.isDirectory()) {
        const indexHtmlPath = findIndexHtml(path.join(dir, file.name))
        if (indexHtmlPath) {
          return indexHtmlPath
        }
      }
    }
  } catch (error) {
    console.error(`Error searching directory ${dir}:`, error)
  }

  return null
}

const main = async () => {
  const args = await parseArgs()

  if (args.clearCache && HOST_PLATFORM === 'darwin') {
    clearCache(DEFAULT_CACHE_PATH)
  }

  const rawConfigData = fs.readFileSync(args.config, 'utf-8')
  const appConfig: HtmlAppConfig = JSON.parse(rawConfigData)

  const outputPath = args.out ? args.out : defaultOutputPath(args.config, appConfig)

  const shellType = appConfig.shell
  const bundleId = appConfig.appInfo?.bundleIdentifier

  if (shellType === 'android' || shellType === 'quest') {
    // TODO(lreyna): Remove this once it's safe to assume all Android configs use bundleIdentifier.
    const packageName = appConfig.appInfo?.bundleIdentifier!
    const activityName = 'android.app.NativeActivity'

    const versionCode = appConfig.appInfo?.versionCode || 1
    const versionName = appConfig.appInfo?.versionName || '1.0.0'

    // TODO(lreyna): Support specifying a ADB serial, in case there are multiple devices connected.

    // TODO(lreyna): Support specifying keystore information, to test app signing.

    const packagerArgs = [
      `--config=${args.config}`,
      `--out=${outputPath}`,
      `--appInfo.versionCode=${versionCode}`,
      `--appInfo.versionName=${versionName}`,
    ]

    const inspectFlag = args.inspect ? '--define=NAE_INSPECTOR=true' : ''

    let cmd = `bazel run ${PACKAGER_BUILD_TARGET.target} ${inspectFlag} -- `
    cmd = cmd.concat(packagerArgs.join(' '))

    await streamExec(cmd, LOG_PREFIX, {
      cwd: REPO_ROOT,
      stdio: 'inherit',
    })

    process.on('SIGINT', () => {
      try {
        streamExec(`adb shell am force-stop ${packageName}`)
      } catch (e) {
        console.error(`Failed to stop app ${packageName} on SIGINT:`, e)
      }
      process.exit(1)
    })

    // TODO(lreyna): Create a Typescript wrapper for 'adb' commands to be used here
    await streamExec('adb logcat -c')
    await streamExec(`adb install -d -r ${outputPath}`)
    await streamExec(`adb shell am start -n "${packageName}/${activityName}"`)

    let pid: string = ''
    const timeoutSeconds = 5
    const startTimeSeconds = Date.now() / 1000

    console.log(`Waiting for process ID of ${packageName}...`)
    while (pid === '') {
      const nowSeconds = Date.now() / 1000
      if (nowSeconds - startTimeSeconds >= timeoutSeconds) {
        console.error(`Timed out waiting for process ID of ${packageName}.`)
        process.exit(1)
      }

      let result: { stdout: string; stderr: string } | void
      try {
        // eslint-disable-next-line no-await-in-loop
        result = await streamSpawn(
          'adb', ['shell', 'pidof', packageName], true
        )
        const stdout = result && 'stdout' in result ? result.stdout : ''
        pid = stdout.trim()
      } catch (e) {
        // If the command fails, we assume the app is not running yet.
        // The timeout will handle the case where the app never starts.
      }
    }

    console.log(`Process ID of ${packageName} is ${pid}.`)
    await streamExec(`adb logcat -v color --pid=${pid} *:I`)
  } else if (shellType === 'ios') {
    const appleProvisioningProfileQueryTarget = '@apple-developer-team//:wildcard-development'
    const appleCertificateTarget = '@apple-developer-team//:personal-certificate'

    const appleCertificatePath = await queryDefaultBazelStringFlag(appleCertificateTarget)

    const provisioningProfilePath =
      await queryDefaultBazelStringFlag(appleProvisioningProfileQueryTarget)
    if (!fs.existsSync(provisioningProfilePath)) {
      throw new Error(
        `Provisioning Profile does not exist: ${provisioningProfilePath} - ` +
        'Make sure the path is correct and the file exists.'
      )
    }

    console.log(`Using Apple certificate at: ${appleCertificatePath}`)
    console.log(`Using provisioning profile at: ${provisioningProfilePath}`)

    const packagerArgs = [
      'run',
      PACKAGER_BUILD_TARGET.target,
      args.inspect ? '--define=NAE_INSPECTOR=true' : '',
      '--',
      `--config=${args.config}`,
      `--out=${outputPath}`,
      `--apple.provisioningProfile=${provisioningProfilePath}`,
      `--apple.certificate=${appleCertificatePath}`,
    ]

    await streamSpawn('bazel', packagerArgs, false, {
      cwd: REPO_ROOT,
      stdio: 'inherit',
    })

    const deviceId = await iosDeviceId()
    if (!deviceId) {
      console.error('No iOS device found. Please connect a device or run an iOS simulator.')
      process.exit(1)
    }
    console.log(`Using iOS device ID: ${deviceId}`)

    // Install the app on the connected iOS device.
    await streamExec(`xcrun devicectl device install app --device ${deviceId} ${outputPath}`,
      LOG_PREFIX, {
        cwd: REPO_ROOT,
        stdio: 'inherit',
      })

    try {
      await streamExec(
        `xcrun devicectl device process launch --console --device ${deviceId} ${bundleId}`,
        LOG_PREFIX, {
          cwd: REPO_ROOT,
          stdio: 'inherit',
        }
      )
    } catch {
      // Need to catch when the user kills the app process
    }
  } else if (shellType === 'osx') {
    const appleProvisioningProfileQueryTarget = '@apple-developer-team//:wildcard-development'
    const appleCertificateTarget = '@apple-developer-team//:personal-certificate'

    const appleCertificatePath = await queryDefaultBazelStringFlag(appleCertificateTarget)

    const provisioningProfilePath =
      await queryDefaultBazelStringFlag(appleProvisioningProfileQueryTarget)
    if (!fs.existsSync(provisioningProfilePath)) {
      throw new Error(
        `Provisioning Profile does not exist: ${provisioningProfilePath} - ` +
        'Make sure the path is correct and the file exists.'
      )
    }

    console.log(`Using Apple certificate at: ${appleCertificatePath}`)
    console.log(`Using provisioning profile at: ${provisioningProfilePath}`)

    const packagerArgs = [
      'run',
      PACKAGER_BUILD_TARGET.target,
      args.inspect ? '--define=NAE_INSPECTOR=true' : '',
      '--',
      `--config=${args.config}`,
      `--out=${outputPath}`,
      `--apple.provisioningProfile=${provisioningProfilePath}`,
      `--apple.certificate=${appleCertificatePath}`,
    ]

    await streamSpawn('bazel', packagerArgs, false, {
      cwd: REPO_ROOT,
      stdio: 'inherit',
    })

    const macosDir = path.join(outputPath, 'Contents', 'MacOS')
    const files = fs.readdirSync(macosDir)
    if (files.length === 0) {
      throw new Error(`No executable found in ${macosDir}`)
    }
    const appExecutable = path.join(macosDir, files[0])

    // We need to set the RUNFILES_DIR environment variable so the app can find its resources.
    // Otherwise, it will try to find them in `apps/client/nae/run-packager.runfiles`
    const runfilesDir = path.join(outputPath, 'Contents', 'Resources', 'runfiles')
    await streamSpawn(appExecutable, [], false, {
      cwd: REPO_ROOT,
      env: {
        ...process.env,
        RUNFILES_DIR: runfilesDir,
      },
      stdio: 'inherit',
    })
  } else if (shellType === 'html') {
    const packagerArgs = [
      'run',
      PACKAGER_BUILD_TARGET.target,
      '--',
      `--config=${args.config}`,
      `--out=${outputPath}`,
    ]

    await streamSpawn('bazel', packagerArgs, false, {
      cwd: REPO_ROOT,
      stdio: 'inherit',
    })

    await streamExec(`rm -rf ${getPathWithoutExtension(outputPath)}`)

    // Create a directory with the same name as the zip (without extension)
    const extractDir = getPathWithoutExtension(outputPath)
    fs.mkdirSync(extractDir, {recursive: true})

    // Extract zip contents into the created directory
    await streamExec(`unzip ${path.basename(outputPath)} -d ${path.basename(extractDir)}`,
      LOG_PREFIX,
      {
        cwd: path.dirname(outputPath),
        stdio: ['inherit', 'ignore', 'ignore'],
      })

    const HTTP_FILE_SERVER_TARGET: BazelBuildTarget = {
      target: '//bzl/httpfileserver/impl:http-file-server',
      output: 'bazel-bin/bzl/httpfileserver/impl/http-file-server',
    }

    const USE_HTTPS = true
    const DEFAULT_PORT = 8888

    let cmd = `bazel run ${HTTP_FILE_SERVER_TARGET.target} -- `
    const httpFileServerArgs = [
      `--https=${USE_HTTPS}`,
      `--port=${DEFAULT_PORT}`,
      getPathWithoutExtension(outputPath),
    ]

    cmd = cmd.concat(httpFileServerArgs.join(' '))

    // Start the HTTP file server in the background (non-blocking)
    streamExec(cmd, LOG_PREFIX, {
      cwd: REPO_ROOT,
      stdio: 'inherit',
    })

    // Wait for the server to be ready before continuing
    const schema = USE_HTTPS ? 'https' : 'http'
    const serverUrl = `${schema}://localhost:${DEFAULT_PORT}/`
    try {
      await waitForServer(serverUrl)
    } catch (e) {
      console.error('Timed out waiting for server:', e)
      return
    }

    const indexHtmlPath = findIndexHtml(extractDir)
    if (!indexHtmlPath) {
      console.warn('Warning: No index.html file found in the extracted directory.')
      console.warn(`You can browse the files at: ${serverUrl}`)
      return
    }
    const relativePath = path.relative(extractDir, indexHtmlPath)
    const url = `${serverUrl}${relativePath}`
    console.log(`Opening browser to: ${url}`)
    try {
      if (HOST_PLATFORM === 'darwin') {
        streamExec(`open ${url}`)
      } else {
        throw new Error('Opening browser is only supported on macOS at this time.')
      }
    } catch (error) {
      console.error('Failed to open browser:', error)
      console.log(`Please manually open: ${url}`)
    }
  } else {
    throw new Error(`Unsupported shell type: ${shellType}.`)
  }
}

main()
