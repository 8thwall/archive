// @rule(js_test)
// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)
// @attr(tags = ["manual"])

// @attr[](data = "@webgl-conformance//:webgl-conformance-test-files")

import * as fs from 'fs'
import * as path from 'path'

import vm from 'vm'

import {
  describe,
  it,
  beforeEach,
  afterEach,
  assert,
} from '@nia/bzl/js/chai-js'
import {
  createDom,
  type Dom,
  type ErrorEvent,
} from '@nia/c8/dom/dom'

function findHtmlFiles(dir: string, fileList: string[] = []) {
  const indexPath = path.join(dir, '00_test_list.txt')

  const lines = fs.readFileSync(indexPath, 'utf8').split('\n')
  // Read lines from the index file, skipping comments with pound sign.
  lines.forEach((line) => {
    // Trim whitespace and remove comments, (both # and //)
    const trimmed = line.trim().replace(/#.*/, '').replace(/^\/\/.*/, '')
    if (trimmed === '') {
      // Skip empty lines.
      return
    }
    // The filename is the last entry in the line.
    const fileName = trimmed.split(' ').at(-1)!

    if (path.basename(fileName) === '00_test_list.txt') {
      findHtmlFiles(path.join(dir, path.dirname(fileName)), fileList)
    } else {
      fileList.push(path.join(dir, fileName))
    }
  })
  return fileList
}

type FrameRequestCallback = (time: number) => void

const requestAnimationFrame = (
  callback: FrameRequestCallback
): number => +setTimeout(() => { callback(performance.now()) }, 0)

const cancelAnimationFrame = (handle: number): void => {
  clearTimeout(handle)
}

const verbose: boolean = !!process.env.VERBOSE

// Default to WebGL 2.
const webGlVersion = parseInt(process.env.WEBGL || '2', 10)

// Individual test timeout.
const testTimeout = parseInt(process.env.WEBGL_TEST_TIMEOUT || '2000', 10)

const expectedFailuresEnv = process.env.EXPECTED_FAILURES || ''
const expectedFailures = new Set(
  expectedFailuresEnv
    .split(',')
    .map(f => f.trim())
    .filter(f => f.length > 0)
)

const skips = new Set(
  (process.env.SKIPS || '')
    .split(',')
    .map(f => f.trim())
    .filter(f => f.length > 0)
)

describe(process.env.TEST_SET || 'webgl-conformance-tests', function runSuite() {
  this.timeout(testTimeout)
  let testFinished: (path: string) => void
  let testFinishedPromise: Promise<void>
  let uncaughtExceptionHandler: (e: Error, origin: string) => void
  let unhandledRejectionHandler: (e: Error, promise: Promise<any>) => void
  let setupConformanceTests: () => void
  let windowContext: vm.Context | null = null
  let isTestFinished = false
  let dom: Dom

  beforeEach(function testSetup() {
    this.timeout(testTimeout)
    isTestFinished = false
    testFinishedPromise = new Promise<void>((resolve, reject) => {
      uncaughtExceptionHandler = (e: Error) => {
        isTestFinished = true
        reject(e)
      }

      unhandledRejectionHandler = (e: Error) => {
        isTestFinished = true
        reject(e)
      }

      setupConformanceTests = () => {
        if (windowContext === null) {
          throw new Error('windowContext is null')
        }

        const win = vm.runInContext('window', windowContext)

        if (verbose) {
          // Enable verbose logging in addition to the console output.
          vm.runInContext('enableJSTestPreVerboseLogging()', windowContext)
        } else {
          // Silence console output.
          vm.runInContext(`
            window.console = {
              log: () => {},
              error: () => {},
              warn: () => {},
            }
            window`, windowContext)
        }

        // Set the webgl version to the requested version. (2 or 1).
        vm.runInContext(
          `WebGLTestUtils.setDefault3DContextVersion(${webGlVersion})`, windowContext
        )

        // Reject the test finished promise if an error is reported to the window.
        win.addEventListener('error', (ev: ErrorEvent) => {
          isTestFinished = true
          reject(ev.error)
        })
      }

      testFinished = () => {
        isTestFinished = true
        resolve()
      }
    })

    // Mocha is installing a default uncaughtException handler, that we need to remove.
    while (process.listeners('uncaughtException').length > 0) {
      const mochaHandler = process.listeners('uncaughtException').pop()!
      process.off('uncaughtException', mochaHandler)
    }

    // Trap uncaught exceptions and unhandled rejections to prevent the parent
    // context to exit if a compliance test has either.
    process.on('uncaughtException', uncaughtExceptionHandler)
    process.on('unhandledRejection', unhandledRejectionHandler)
  })

  afterEach(async function testSetup() {
    this.timeout(testTimeout)
    process.off('uncaughtException', uncaughtExceptionHandler)
    process.off('unhandledRejection', unhandledRejectionHandler)
    await dom.dispose()
  })

  const maxErrors: number = parseInt(process.env.MAX_ERRORS || '5', 10)

  const baseDir = `${process.env.TEST_SRCDIR}`
  const conformanceTestDir = '/_main/external/webgl-conformance/sdk/tests'

  const testSet = process.env.TEST_SET || ''
  const testFilter = new RegExp(process.env.TEST_FILTER || '.*')
  const allFiles = findHtmlFiles(`${baseDir}${conformanceTestDir}`).map(
    f => f.slice(baseDir.length + conformanceTestDir.length + 1)
  )

  const fileList = allFiles.filter(f => f.startsWith(testSet) && f.match(testFilter))
  const nameList = fileList.map(f => path.basename(f, '.html'))
  for (const expectedFail of [...expectedFailures]) {
    assert.include(nameList, expectedFail,
      'expected_failures should only reference actual test names')
  }

  for (const skip of [...skips]) {
    assert.include(nameList, skip,
      'skips should only reference actual test names')
    assert.notInclude(expectedFailures, skip, 'skips should not overlap with expected_failures')
  }

  assert.isNotEmpty(fileList, `No test files found with filter ${testFilter}`)

  for (const file of fileList) {
    const testName = path.basename(file, '.html')
    const isExpectedFailure = expectedFailures.has(testName)

    if (skips.has(testName)) {
      // eslint-disable-next-line no-continue
      continue
    }

    let suffix = ''
    if (isExpectedFailure) {
      suffix = ' (expected failure)'
    }

    it(`${testName}${suffix}`, async () => {  // eslint-disable-line no-loop-func
      const TEST_URL = `file://${baseDir}${conformanceTestDir}/${file}`

      let testsFailed = 0

      const errorMessages: string[] = []

      const testResults: (path: string, success: any, msg: string, skipped: boolean) => void = (
        _path, success, msg
      ) => {
        if (!success) {
          testsFailed++
          if (errorMessages.length < maxErrors) {
            errorMessages.push(`        FAIL ${msg}`)
          }
        }
      }

      const testRunner = {
        dumpAsText: () => {},
        notifyDone: () => {},
        waitUntilDone: setupConformanceTests,
      }

      const requestAnimationFrameIfNotDone = (callback: FrameRequestCallback): number => {
        if (isTestFinished) {
          // Ensure tests can no longer enqueue new animation frames after the test has finished.
          // This happens in conformance/extensions/khr-parallel-shader-compile.html.
          return 0
        } else {
          return requestAnimationFrame(callback)
        }
      }

      dom = await createDom({
        width: 640,
        height: 480,
        url: TEST_URL,
        context: {
          requestAnimationFrame: requestAnimationFrameIfNotDone,
          cancelAnimationFrame,
          testRunner,
          webglTestHarness: {
            notifyFinished: testFinished!,
            reportResults: testResults,
          },
        },
        onContextCreated: (context: vm.Context) => {
          windowContext = context
        },
      })

      // Wait for the test to finish. If there is an unhandled rejection, uncaught exception, or
      // error reported to the DOM window, this promise will be rejected, the test failed, and the
      // error reported.
      try {
        await testFinishedPromise
      } catch (e) {
        testsFailed++
        if (verbose) {
          // Duplicate the an exception to the console for easier debugging with
          // --test_output=streamed.
          console.log(e)  // eslint-disable-line no-console
        }

        if (!isExpectedFailure) {
          throw e
        }
      }

      if (testsFailed > 0) {
        if (errorMessages.length >= maxErrors) {
          errorMessages.push(`        ... and ${testsFailed - maxErrors} more`)
        }
        const errorMessage = `${testsFailed} test cases failed\n\n${errorMessages.join('\n')}\n`

        if (!isExpectedFailure) {
          throw new Error(errorMessage)
        }

        // eslint-disable-next-line no-console
        console.warn(`\n\nTest ${testName} failed as expected:\n${errorMessage}`)
      } else if (isExpectedFailure) {
        throw new Error(`\n\nTest ${testName} passed. Remove it from expected_failures.`)
      }
    })
  }
})
