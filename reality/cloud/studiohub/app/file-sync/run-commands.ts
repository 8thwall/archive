import {app} from 'electron'
import {ChildProcess, fork} from 'child_process'
import path from 'path'
import log from 'electron-log'

const WEBPACK_DEV_SERVER_CLI = 'webpack-dev-server/bin/webpack-dev-server.js'
const LOCAL_SSL_PROXY_CLI = 'local-ssl-proxy/build/main.js'
const BUILD_CONFIG = '@8thwall/build/lib/webpack-local.js'
const NPM_CLI_PATH = app.isPackaged
  ? path.resolve(process.resourcesPath, 'app.asar.unpacked', 'node_modules/npm/bin/npm-cli.js')
  : path.resolve(process.cwd(), 'node_modules/npm/bin/npm-cli.js')

const runInstallCommand = async (
  savePath: string, packagePath: string
): Promise<void> => new Promise((resolve, reject) => {
  const child = fork(
    NPM_CLI_PATH,
    ['install', packagePath],
    {cwd: savePath, stdio: 'pipe', env: {ELECTRON_RUN_AS_NODE: '1'}, detached: true}
  )

  const timeout = setTimeout(() => {
    log.error('npm install timed out, killing process')
    child.kill('SIGTERM')
    reject(new Error('npm install timed out'))
  }, 60000)

  let stderr = ''

  child.stderr?.on('data', (d) => {
    const out = d.toString()
    stderr += out
  })

  child.on('exit', (code, signal) => {
    clearTimeout(timeout)
    if (code === 0) {
      resolve()
    } else {
      const msg = `npm install failed (exit ${code}, signal ${signal})\nstderr:\n${stderr}`
      log.error(msg)
      reject(new Error(msg))
    }
  })

  child.on('error', (err) => {
    clearTimeout(timeout)
    log.error('npm install process error:', err)
    if (stderr) {
      log.error('npm install stderr:', stderr)
    }
    reject(err)
  })
})

// Run a https proxy that proxy all traffic to https://localhost:{proxySrcPort} to
// http://localhost:{proxyDestPort}
// This uses https://www.npmjs.com/package/http-proxy under the hood.
// TODO(dat): Switch to calling http-proxy directly instead of spawning a child process?
//            Perhaps the best option is to provide reverse proxy, ala ngrok, so our users can
//            connect remotely from anywhere.
const runProxyCommand = (
  projectPath: string,
  proxySrcPort: number = 9001,
  proxyDestPort: number = 9002
): ChildProcess => {
  const localSslProxyCliPath = path.resolve(projectPath, 'node_modules', LOCAL_SSL_PROXY_CLI)

  const child = fork(
    localSslProxyCliPath,
    ['--source', proxySrcPort.toString(), '--target', proxyDestPort.toString()],
    {stdio: 'pipe', env: {ELECTRON_RUN_AS_NODE: '1'}, detached: false}
  )

  let stderr = ''

  child.stderr?.on('data', (d) => {
    const out = d.toString()
    stderr += out
  })

  child.on('exit', (code, signal) => {
    if (signal === 'SIGTERM' || signal === 'SIGKILL') {
      return
    }
    if (code !== 0) {
      const msg = `ssl proxy failed (exit ${code}, signal ${signal})\nstderr:\n${stderr}`
      log.error(msg)
    }
  })

  child.on('error', (err) => {
    log.error('ssl proxy process error:', err)
    if (stderr) {
      log.error('ssl proxy stderr:', stderr)
    }
    throw err
  })

  return child
}

const runBuildCommand = (savePath: string, port: number): ChildProcess => {
  const nodeModules = path.resolve(savePath, 'node_modules')
  const buildConfigPath = path.resolve(nodeModules, BUILD_CONFIG)
  const webpackDevServerCliPath = path.resolve(nodeModules, WEBPACK_DEV_SERVER_CLI)

  const child = fork(
    webpackDevServerCliPath,
    ['-c', buildConfigPath, '--port', port.toString()],
    {cwd: savePath, stdio: 'pipe', env: {ELECTRON_RUN_AS_NODE: '1'}, detached: false}
  )

  let stderr = ''

  child.stderr?.on('data', (d) => {
    const out = d.toString()
    stderr += out
  })

  child.on('exit', (code, signal) => {
    if (signal === 'SIGTERM' || signal === 'SIGKILL') {
      return
    }
    if (code !== 0) {
      const msg = `webpack failed (exit ${code}, signal ${signal})\nstderr:\n${stderr}`
      log.error(msg)
    }
  })

  child.on('error', (err) => {
    log.error('webpack process error:', err)
    if (stderr) {
      log.error('webpack stderr:', stderr)
    }
    throw err
  })

  return child
}

export {
  runBuildCommand,
  runProxyCommand,
  runInstallCommand,
}
