// @attr(esnext = 1)
// @attr(target = "node")
// @attr(npm_rule = "@npm-html-app-packager//:npm-html-app-packager")
// @deps(//bzl/js:chai-js)

import {promises as fs} from 'fs'
import path from 'path'

import {
  describe, it, assert, beforeEach, afterEach, sinon,
} from '@nia/bzl/js/chai-js'

import {
  createOnAssetDownloadedLocalCallback,
} from '@nia/reality/app/nae/packager/html-app-asset-handler'
import type {HtmlAppConfig} from '@nia/reality/shared/nae/nae-types'

describe('createOnAssetDownloadedLocalCallback', () => {
  let tempDir: string
  let mockAppConfig: HtmlAppConfig
  let consoleLogStub: sinon.SinonStub
  let consoleErrorStub: sinon.SinonStub

  beforeEach(async () => {
    const {TEST_TMPDIR} = process.env
    if (!TEST_TMPDIR) {
      throw new Error('TEST_TMPDIR environment variable is not set')
    }
    tempDir = path.join(TEST_TMPDIR, 'asset-handler-test-')

    mockAppConfig = {
      projectUrl: 'https://studiobeta.8thwall.app/test-project/',
      shell: 'ios',
      appInfo: {
        workspace: 'main',
        appName: 'test-project',
        refHead: 'master',
        naeBuildMode: 'static',
        bundleIdentifier: 'com.test.app',
        versionCode: 1,
        versionName: '1.0.0',
        appDisplayName: 'Test Application',
        screenOrientation: 'auto',
        statusBarVisible: true,
        resourceDir: '/test/resources',
      },
    } as HtmlAppConfig

    // Stub console methods to avoid noise in test output
    consoleLogStub = sinon.stub(console, 'log')
    consoleErrorStub = sinon.stub(console, 'error')
  })

  afterEach(async () => {
    await fs.rm(tempDir, {recursive: true, force: true})

    consoleLogStub.restore()
    consoleErrorStub.restore()
  })

  const createMockResponse = (
    body: string | ArrayBuffer,
    url: string,
    contentType: string = 'text/plain',
    status: number = 200,
    statusText: string = 'OK'
  ): Response => {
    const response = new Response(body, {
      status,
      statusText,
      headers: {
        'content-type': contentType,
      },
    })

    // The undici response object will not assign a url property by default
    Object.defineProperty(response, 'url', {
      value: url,
      writable: false,
    })
    return response
  }

  const makeModuleExportStringForApp = (
    appName: string, assetBaseName: string
  ) => `function(e,t){e.exports="/${appName}/assets/${assetBaseName}"};`

  it('should handle HTML content and modify URLs with custom prefix', async () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.8thwall.com/script.js"></script>
          <link href="https://example.com/style.css" rel="stylesheet">
        </head>
        <body>
          <img src="https://images.example.com/photo.jpg" />
        </body>
      </html>
    `

    const response = createMockResponse(htmlContent, mockAppConfig.projectUrl, 'text/html')
    const callback = createOnAssetDownloadedLocalCallback(
      mockAppConfig,
      tempDir,
      'the8thwall://custom/'
    )

    await callback({response, requestUrl: mockAppConfig.projectUrl})

    const expectedPath = path.join(tempDir, 'index.html')
    const writtenContent = await fs.readFile(expectedPath, 'utf8')

    assert.include(writtenContent, 'the8thwall://custom/script.js')
    assert.include(writtenContent, 'the8thwall://custom/style.css')
    assert.include(writtenContent, 'the8thwall://custom/photo.jpg')

    assert.isTrue(consoleLogStub.calledOnce)
    assert.include(consoleLogStub.firstCall.args[0], 'Wrote asset to')
  })

  it('should handle HTML content and ignore false positives', async () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.8thwall.com/script.js"></script>
          <link href="https://example.com/style.css" rel="stylesheet">
          <script>app8("", "/test/", "dist.js")</script>
        </head>
        <body>
          <img src="https://images.example.com/photo.jpg" />
          <div>
            Check out my project at https://example.com/project
            or visit https://another-site.com for more info.
          </div>
        </body>
      </html>
    `

    const response = createMockResponse(htmlContent, mockAppConfig.projectUrl, 'text/html')
    const callback = createOnAssetDownloadedLocalCallback(
      mockAppConfig,
      tempDir,
      'the8thwall://custom/'
    )

    await callback({response, requestUrl: mockAppConfig.projectUrl})

    const expectedPath = path.join(tempDir, 'index.html')
    const writtenContent = await fs.readFile(expectedPath, 'utf8')

    assert.include(writtenContent, 'the8thwall://custom/script.js')
    assert.include(writtenContent, 'the8thwall://custom/style.css')
    assert.include(writtenContent, 'the8thwall://custom/photo.jpg')
    assert.include(writtenContent, 'app8("", "the8thwall://custom/test/", "dist.js")')
    assert.include(writtenContent, 'https://example.com/project')
    assert.include(writtenContent, 'https://another-site.com')

    assert.isTrue(consoleLogStub.calledOnce)
    assert.include(consoleLogStub.firstCall.args[0], 'Wrote asset to')
  })

  it('should exclude dev8.js script from index.html', async () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.8thwall.com/dev.js"></script>
          <script src="https://cdn.8thwall.com/dev8.js"></script>
        </head>
        <body>
          <img src="https://images.example.com/photo.jpg" />
        </body>
      </html>
    `

    const response = createMockResponse(htmlContent, mockAppConfig.projectUrl, 'text/html')
    const callback = createOnAssetDownloadedLocalCallback(
      mockAppConfig,
      tempDir,
      'the8thwall://custom/'
    )

    await callback({response, requestUrl: mockAppConfig.projectUrl})

    const expectedPath = path.join(tempDir, 'index.html')
    const writtenContent = await fs.readFile(expectedPath, 'utf8')

    assert.include(writtenContent, 'the8thwall://custom/dev.js')
    assert.notInclude(writtenContent, 'dev8.js')

    assert.isTrue(consoleLogStub.calledOnce)
    assert.include(consoleLogStub.firstCall.args[0], 'Wrote asset to')
  })

  it('should handle JavaScript content and replace specific xr URLs', async () => {
    const jsContent = `
      fetch('https://cdn.8thwall.com/api/data');
      const url = "https://other.com/resource";
      // Comment with https://cdn.8thwall.com/
      const xrUrl = 'fetch(\`https://\${Og()}/v/\${A}/\${B}\${g}\`)';
    `

    const EXAMPLE_XR_URL = new URL('https://cdn.8thwall.com/xr-simd.js')
    const response = createMockResponse(jsContent, EXAMPLE_XR_URL.href, 'application/javascript')
    const callback = createOnAssetDownloadedLocalCallback(
      mockAppConfig,
      tempDir,
      'the8thwall://custom/'
    )

    await callback({response, requestUrl: EXAMPLE_XR_URL.href})

    const expectedPath = path.join(tempDir, EXAMPLE_XR_URL.pathname)
    const writtenContent = await fs.readFile(expectedPath, 'utf8')

    assert.include(writtenContent, 'the8thwall://custom/api/data')
    assert.include(writtenContent, 'https://other.com/resource')  // Should not be replaced
    assert.include(writtenContent, 'the8thwall://custom/v/')  // /v/ endpoint replacement
  })

  it('should handle text/javascript content type', async () => {
    const jsContent = 'console.log("https://cdn.8thwall.com/test.js");'

    const EXAMPLE_URL = new URL('https://example.com/script.js')
    const response = createMockResponse(jsContent, EXAMPLE_URL.href, 'text/javascript')
    const callback = createOnAssetDownloadedLocalCallback(
      mockAppConfig,
      tempDir,
      'the8thwall://custom/'
    )

    await callback({response, requestUrl: EXAMPLE_URL.href})

    const expectedPath = path.join(tempDir, EXAMPLE_URL.pathname)
    const writtenContent = await fs.readFile(expectedPath, 'utf8')

    assert.include(writtenContent, 'the8thwall://custom/test.js')
  })

  it('should rewrite assetManifest URLs with urlPrefix in bundle.js', async () => {
    const bundleJs = 'window.__ASSET__ = {"assets":{"foo.js":"/foo.js","bar.png":"/bar.png"}};'
    const assetManifest = {assets: {'foo.js': '/foo.js', 'bar.png': '/bar.png'}}
    const bundleUrl = new URL('https://example.com/dist_123-abc_bundle.js')
    const response = createMockResponse(bundleJs, bundleUrl.href, 'application/javascript')

    const callback = createOnAssetDownloadedLocalCallback(
      mockAppConfig,
      tempDir,
      'the8thwall://custom/'
    )

    await callback({response, requestUrl: bundleUrl.href, assetManifest})

    const expectedPath = path.join(tempDir, bundleUrl.pathname)
    const writtenContent = await fs.readFile(expectedPath, 'utf8')

    // The manifest string should be replaced with urlPrefix
    assert.include(writtenContent, 'the8thwall://custom/foo.js')
    assert.include(writtenContent, 'the8thwall://custom/bar.png')

    assert.notInclude(writtenContent, '"/foo.js"')
    assert.notInclude(writtenContent, '"/bar.png"')
  })

  it('should NOT rewrite assetManifest URLs if match fails', async () => {
    const bundleJs = 'window.__ASSET__ = {"assets":{"foo.js":"/foo.js","bar.png":"/bar.png"}};'

    // NOTE: The assetManifest has a different set of assets than the bundleJs string
    const assetManifest = {assets: {'foo.js': '/foo.js', 'bar.jpeg': '/bar.jpeg'}}
    const bundleUrl = new URL('https://example.com/dist_123-abc_bundle.js')
    const response = createMockResponse(bundleJs, bundleUrl.href, 'application/javascript')

    const callback = createOnAssetDownloadedLocalCallback(
      mockAppConfig,
      tempDir,
      'the8thwall://custom/'
    )

    await callback({response, requestUrl: bundleUrl.href, assetManifest})

    const expectedPath = path.join(tempDir, bundleUrl.pathname)
    const writtenContent = await fs.readFile(expectedPath, 'utf8')

    assert.notInclude(writtenContent, 'the8thwall://custom/foo.js')
    assert.notInclude(writtenContent, 'the8thwall://custom/bar.png')

    assert.equal(writtenContent, bundleJs)
  })

  it('should make paths created from `require` exports relative', async () => {
    const assetBaseName = 'CloudRumble-frngafmi71.png'
    const bundleJs = makeModuleExportStringForApp(
      mockAppConfig.appInfo!.appName, assetBaseName
    )
    const bundleUrl = new URL('https://example.com/dist_123-abc_bundle.js')
    const response = createMockResponse(bundleJs, bundleUrl.href, 'application/javascript')

    const callback = createOnAssetDownloadedLocalCallback(
      mockAppConfig,
      tempDir,
      'the8thwall://custom/'
    )

    await callback({response, requestUrl: bundleUrl.href})

    const expectedPath = path.join(tempDir, bundleUrl.pathname)
    const writtenContent = await fs.readFile(expectedPath, 'utf8')

    assert.include(writtenContent, `the8thwall://custom/assets/${assetBaseName}`)
  })

  it('should not update paths from `require` exports relative if wrong app name', async () => {
    const assetBaseName = 'SomeImage-frngafmi71.png'
    const bundleJs = makeModuleExportStringForApp(
      'wrong-app-name', assetBaseName
    )
    const bundleUrl = new URL('https://example.com/dist_123-abc_bundle.js')
    const response = createMockResponse(bundleJs, bundleUrl.href, 'application/javascript')

    const callback = createOnAssetDownloadedLocalCallback(
      mockAppConfig,
      tempDir,
      'the8thwall://custom/'
    )

    await callback({response, requestUrl: bundleUrl.href})

    const expectedPath = path.join(tempDir, bundleUrl.pathname)
    const writtenContent = await fs.readFile(expectedPath, 'utf8')

    assert.notInclude(writtenContent, `the8thwall://custom/assets/${assetBaseName}`)

    assert.equal(writtenContent, bundleJs)
  })

  it('should replace static asset urls from modules', async () => {
    const assetBaseName = 'SomeImage-frngafmi71.png'
    const nonStatic8thwallUrl = 'https://other.cdn.com/assets/OtherImage.png'
    const moduleJs =
      `function(e,t){e.exports="https://static.8thwall.app/assets/${assetBaseName}"};
       function(e,t){e.exports="${nonStatic8thwallUrl}"};`

    const moduleUrl = new URL('https://8w.8thwall.app/modules/v1/module-id/branch/master/module.js')
    const response = createMockResponse(moduleJs, moduleUrl.href, 'application/javascript')

    const callback = createOnAssetDownloadedLocalCallback(
      mockAppConfig,
      tempDir,
      'the8thwall://custom/'
    )

    await callback({response, requestUrl: moduleUrl.href})

    const expectedPath = path.join(tempDir, moduleUrl.pathname)
    const writtenContent = await fs.readFile(expectedPath, 'utf8')

    assert.include(writtenContent, `the8thwall://custom/assets/${assetBaseName}`)
    assert.include(writtenContent, nonStatic8thwallUrl)
  })

  it('should handle binary content without modification', async () => {
    const binaryData = new ArrayBuffer(16)
    const view = new Uint8Array(binaryData)
    for (let i = 0; i < view.length; i++) {
      view[i] = i
    }

    const EXAMPLE_IMAGE_URL = new URL('https://example.com/image.png')
    const response = createMockResponse(binaryData, EXAMPLE_IMAGE_URL.href, 'image/png')
    const callback = createOnAssetDownloadedLocalCallback(
      mockAppConfig,
      tempDir,
      'the8thwall://custom/'
    )

    await callback({response, requestUrl: EXAMPLE_IMAGE_URL.href})

    const expectedPath = path.join(tempDir, EXAMPLE_IMAGE_URL.pathname)
    const writtenBuffer = await fs.readFile(expectedPath)

    assert.equal(writtenBuffer.length, 16)
    for (let i = 0; i < writtenBuffer.length; i++) {
      assert.equal(writtenBuffer[i], i)
    }
  })

  it('should create directories recursively when needed', async () => {
    const textContent = 'test content'

    const EXAMPLE_URL = new URL('https://example.com/deep/nested/path/file.txt')
    const response = createMockResponse(textContent, EXAMPLE_URL.href, 'text/plain')
    const callback = createOnAssetDownloadedLocalCallback(
      mockAppConfig,
      tempDir,
      'the8thwall://custom/'
    )

    await callback({response, requestUrl: EXAMPLE_URL.href})

    const expectedPath = path.join(tempDir, EXAMPLE_URL.pathname)
    const writtenContent = await fs.readFile(expectedPath, 'utf8')

    assert.equal(writtenContent, textContent)
  })

  it('should handle response with non-OK status', async () => {
    const HTML_URL = new URL('https://example.com/missing.html')
    const response = createMockResponse('Not Found', HTML_URL.href, 'text/html', 404, 'Not Found')
    const callback = createOnAssetDownloadedLocalCallback(
      mockAppConfig,
      tempDir,
      'the8thwall://custom/'
    )

    await callback({response, requestUrl: HTML_URL.href})

    assert.isTrue(consoleErrorStub.calledOnce)
    assert.include(consoleErrorStub.firstCall.args[0], 'Failed to write asset')
    assert.include(consoleErrorStub.firstCall.args[1].message, 'HTTP 404: Not Found')
  })

  it('should handle generic HTML without extension correctly', async () => {
    const htmlContent = '<html><body>Test</body></html>'

    const subDirectoryName = path.join('some', 'path')
    const EXAMPLE_URL = new URL(`https://example.com/${subDirectoryName}/`)
    const response = createMockResponse(htmlContent, EXAMPLE_URL.href, 'text/html')
    const callback = createOnAssetDownloadedLocalCallback(
      mockAppConfig,
      tempDir,
      'the8thwall://custom/'
    )

    await callback({response, requestUrl: EXAMPLE_URL.href})

    const expectedPath = path.join(tempDir, subDirectoryName, 'index.html')
    const writtenContent = await fs.readFile(expectedPath, 'utf8')

    assert.equal(writtenContent, htmlContent)
  })

  it('should handle HTML with .html extension correctly', async () => {
    const htmlContent = '<html><body>Named HTML</body></html>'

    const EXAMPLE_URL = new URL('https://example.com/page.html')
    const response = createMockResponse(htmlContent, EXAMPLE_URL.href, 'text/html')
    const callback = createOnAssetDownloadedLocalCallback(
      mockAppConfig,
      tempDir,
      'the8thwall://custom/'
    )

    await callback({response, requestUrl: EXAMPLE_URL.href})

    const expectedPath = path.join(tempDir, EXAMPLE_URL.pathname)
    const writtenContent = await fs.readFile(expectedPath, 'utf8')

    assert.equal(writtenContent, htmlContent)
  })

  it('should handle missing content-type header', async () => {
    const content = 'no content type'

    const EXAMPLE_URL = new URL('https://example.com/unknown')
    const response = createMockResponse(content, EXAMPLE_URL.href, '')

    const callback = createOnAssetDownloadedLocalCallback(
      mockAppConfig,
      tempDir,
      'the8thwall://custom/'
    )

    await callback({response, requestUrl: EXAMPLE_URL.href})

    const expectedPath = path.join(tempDir, EXAMPLE_URL.pathname)
    const writtenBuffer = await fs.readFile(expectedPath)

    assert.equal(writtenBuffer.toString(), content)
  })

  it('should handle JavaScript URL replacement without leading https', async () => {
    const jsContent = `
      const normalUrl = "https://other-cdn.com/file.js";
      fetch("//cdn.8thwall.com/api");  // This should be replaced with https: prefix
      const templateUrl = \`https://\${domain()}/v/\${version}/file\`;
    `

    const EXAMPLE_URL = new URL('https://cdn.8thwall.com/xr-test.js')
    const response = createMockResponse(jsContent, EXAMPLE_URL.href, 'application/javascript')
    const callback = createOnAssetDownloadedLocalCallback(
      mockAppConfig,
      tempDir,
      'the8thwall://custom/'
    )

    await callback({response, requestUrl: EXAMPLE_URL.href})

    const expectedPath = path.join(tempDir, EXAMPLE_URL.pathname)
    const writtenContent = await fs.readFile(expectedPath, 'utf8')

    // Normal URL should not be changed
    assert.include(writtenContent, 'https://other-cdn.com/file.js')
    // Protocol-relative URL should get https: prefix and then be replaced
    assert.include(writtenContent, 'the8thwall://custom/api')
    // Template URL with variables should be replaced
    assert.include(writtenContent, 'the8thwall://custom/v/')
  })

  it('should handle app config without appInfo', async () => {
    const configWithoutAppInfo = {
      projectUrl: 'https://example.com/project',
      shell: 'ios',
    } as HtmlAppConfig

    const htmlContent = '<html><body>Test</body></html>'
    const EXAMPLE_URL = new URL('https://example.com/')
    const response = createMockResponse(htmlContent, EXAMPLE_URL.href, 'text/html')

    const callback = createOnAssetDownloadedLocalCallback(
      configWithoutAppInfo,
      tempDir,
      'the8thwall://custom/'
    )

    try {
      await callback({response, requestUrl: EXAMPLE_URL.href})
      assert.fail('Callback should throw an error due to missing appInfo')
    } catch (e) {
      assert.instanceOf(e, Error)
    }
  })

  it('should NOT add data-xrweb-defer when camera permission IS requested', async () => {
    const configWithCameraPermission = {
      ...mockAppConfig,
      appInfo: {
        ...mockAppConfig.appInfo!,
        permissions: {
          camera: {
            requestStatus: 'REQUESTED' as const,
            usageDescription: 'Camera access required for AR',
          },
        },
      },
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <script data-xrweb-src="https://apps.8thwall.com/xrweb?appKey=TEST123"></script>
          <script src="https://cdn.8thwall.com/regular.js"></script>
        </head>
        <body>
          <div data-xrweb-src="https://another.cdn.com/resource.js"></div>
        </body>
      </html>
    `

    const response = createMockResponse(htmlContent, mockAppConfig.projectUrl, 'text/html')
    const callback = createOnAssetDownloadedLocalCallback(
      configWithCameraPermission,
      tempDir,
      'the8thwall://custom/'
    )

    await callback({response, requestUrl: mockAppConfig.projectUrl})

    const expectedPath = path.join(tempDir, 'index.html')
    const writtenContent = await fs.readFile(expectedPath, 'utf8')

    assert.notInclude(writtenContent, 'data-xrweb-defer')

    assert.include(writtenContent, 'the8thwall://custom/xrweb?appKey=TEST123')
    assert.include(writtenContent, 'the8thwall://custom/resource.js')
    assert.include(writtenContent, 'the8thwall://custom/regular.js')
  })

  it('should add data-xrweb-defer when camera permission is NOT requested', async () => {
    const configWithoutCameraPermission = {
      ...mockAppConfig,
      appInfo: {
        ...mockAppConfig.appInfo!,
        permissions: {
          camera: {
            requestStatus: 'NOT_REQUESTED' as const,
            usageDescription: '',
          },
        },
      },
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <script data-xrweb-src="https://apps.8thwall.com/xrweb?appKey=TEST123"></script>
          <script src="https://cdn.8thwall.com/regular.js"></script>
        </head>
        <body>
          <div data-xrweb-src="https://another.cdn.com/resource.js"></div>
        </body>
      </html>
    `

    const response = createMockResponse(htmlContent, mockAppConfig.projectUrl, 'text/html')
    const callback = createOnAssetDownloadedLocalCallback(
      configWithoutCameraPermission,
      tempDir,
      'the8thwall://custom/'
    )

    await callback({response, requestUrl: mockAppConfig.projectUrl})

    const expectedPath = path.join(tempDir, 'index.html')
    const writtenContent = await fs.readFile(expectedPath, 'utf8')

    assert.include(writtenContent, 'data-xrweb-defer="true"')

    assert.include(writtenContent, 'the8thwall://custom/xrweb?appKey=TEST123')
    assert.include(writtenContent, 'the8thwall://custom/resource.js')
    assert.include(writtenContent, 'the8thwall://custom/regular.js')
  })
})
