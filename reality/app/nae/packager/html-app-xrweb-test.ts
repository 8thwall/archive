// @rule(js_test)
// @attr(esnext = 1)
// @attr(target = "node")
// @deps(//bzl/js:chai-js)

import {sinon, beforeEach, afterEach, describe, it, assert} from '@nia/bzl/js/chai-js'
import {collectXrwebAssets} from '@nia/reality/app/nae/packager/html-app-xrweb'

describe('collectXrwebAssets', () => {
  let fetchStub: sinon.SinonStub

  beforeEach(() => {
    fetchStub = sinon.stub(globalThis, 'fetch')
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should throw error for invalid XR Web URL', async () => {
    const invalidUrl = 'https://example.com/invalid'
    const appUrl = 'https://app.example.com'

    try {
      await collectXrwebAssets(invalidUrl, appUrl)
      assert.fail('Expected function to throw an error')
    } catch (error) {
      const errorMessage = (error as Error).message
      assert.include(errorMessage, 'collectXrwebAssets called with invalid XR Web URL')
      assert.include(errorMessage, invalidUrl)
    }
  })

  it('should throw error when appKey is missing from URL', async () => {
    const urlWithoutAppKey = 'https://apps.8thwall.com/xrweb'
    const appUrl = 'https://app.example.com'

    try {
      await collectXrwebAssets(urlWithoutAppKey, appUrl)
      assert.fail('Expected function to throw an error')
    } catch (error) {
      const errorMessage = (error as Error).message
      assert.include(errorMessage, 'collectXrwebAssets called without appKey')
      assert.include(errorMessage, urlWithoutAppKey)
    }
  })

  it('should fetch session token with correct parameters', async () => {
    const appKey = 'test-app-key-123'
    const xrWebUrl = `https://apps.8thwall.com/xrweb?appKey=${appKey}`
    const appUrl = 'https://app.example.com'
    const sessionToken = 'test-session-token'

    fetchStub.onFirstCall().resolves({
      json: () => Promise.resolve({xrSessionToken: sessionToken}),
    })

    const mockXrWebScript = `
        window._XR8 = {
          channel: 'test',
          version: '1.0.0',
          devMode: false,
          sampleRatio: 1,
          shortLink: 'test.link',
          coverImageUrl: 'test-cover.jpg',
          smallCoverImageUrl: 'test-small.jpg',
          mediumCoverImageUrl: 'test-medium.jpg',
          largeCoverImageUrl: 'test-large.jpg',
          chunkMap: {
            'chunk1.js': 'https://example.com/chunk1.js',
            'chunk2.js': 'https://example.com/chunk2.js'
          }
        };
      `

    fetchStub.onSecondCall().resolves({
      text: () => Promise.resolve(mockXrWebScript),
      clone: () => ({
        text: () => Promise.resolve(mockXrWebScript),
      }),
    })

    await collectXrwebAssets(xrWebUrl, appUrl)

    const sessionTokenCall = fetchStub.getCall(0)
    const sessionTokenUrl = sessionTokenCall.args[0]
    const sessionTokenOptions = sessionTokenCall.args[1]

    assert.include(sessionTokenUrl.toString(), 'session-token')
    assert.include(sessionTokenUrl.toString(), `appKey=${appKey}`)
    assert.equal(sessionTokenOptions.headers.Origin, 'https://app.example.com')
  })

  it('should throw error when session token is missing', async () => {
    const appKey = 'test-app-key-123'
    const xrWebUrl = `https://apps.8thwall.com/xrweb?appKey=${appKey}`
    const appUrl = 'https://app.example.com'

    fetchStub.onFirstCall().resolves({
      json: () => Promise.resolve({}),
    })

    try {
      await collectXrwebAssets(xrWebUrl, appUrl)
      assert.fail('Expected function to throw an error')
    } catch (error) {
      const errorMessage = (error as Error).message
      assert.include(errorMessage, 'Failed to retrieve session token for appKey')
      assert.include(errorMessage, appKey)
    }
  })

  it('should successfully collect assets and return expected data', async () => {
    const appKey = 'test-app-key-123'
    const xrWebUrl = `https://apps.8thwall.com/xrweb?appKey=${appKey}`
    const appUrl = 'https://app.example.com'
    const sessionToken = 'test-session-token'

    fetchStub.onFirstCall().resolves({
      json: () => Promise.resolve({xrSessionToken: sessionToken}),
    })

    const mockXrWebScript = `
        window._XR8 = {
          channel: 'stable',
          version: '2.1.0',
          devMode: true,
          sampleRatio: 0.5,
          shortLink: 'short.link',
          coverImageUrl: 'cover.jpg',
          smallCoverImageUrl: 'small-cover.jpg',
          mediumCoverImageUrl: 'medium-cover.jpg',
          largeCoverImageUrl: 'large-cover.jpg',
          chunkMap: {
            'main.js': 'https://example.com/main.js',
            'vendor.js': 'https://example.com/vendor.js',
            'runtime.js': 'https://example.com/runtime.js'
          }
        };
      `

    const mockResponse = {
      text: () => Promise.resolve(mockXrWebScript),
      clone: () => mockResponse,
    }

    fetchStub.onSecondCall().resolves(mockResponse)

    const numberOfFetches = 2
    const numberOfChunks = 3
    for (let i = 0; i < numberOfChunks; i++) {
      fetchStub.onCall(numberOfFetches + i).resolves({
        text: () => Promise.resolve('console.log("Hello, Script!")'),
        clone: () => {},
        ok: true,
      })
    }

    const result = await collectXrwebAssets(xrWebUrl, appUrl)

    assert.property(result, 'xrWebResponse')
    assert.property(result, 'xrWebScriptData')
    assert.property(result, 'xrWebResourceUrls')

    assert.isArray(result.xrWebScriptData)
    const urls = result.xrWebScriptData.map(item => item.url)
    assert.includeMembers(urls, [
      'https://example.com/main.js',
      'https://example.com/vendor.js',
      'https://example.com/runtime.js',
    ])
    assert.equal(result.xrWebScriptData.length, numberOfChunks)

    assert.isArray(result.xrWebResourceUrls)
    assert.equal(result.xrWebResourceUrls.length, 0)
  })

  it('should successfully collect assets and resources and return expected data', async () => {
    const appKey = 'test-app-key-123'
    const xrWebUrl = `https://apps.8thwall.com/xrweb?appKey=${appKey}`
    const appUrl = 'https://app.example.com'
    const sessionToken = 'test-session-token'

    fetchStub.onFirstCall().resolves({
      json: () => Promise.resolve({xrSessionToken: sessionToken}),
    })

    const mockXrWebScript = `
        window._XR8 = {
          channel: 'stable',
          version: '2.1.0',
          devMode: true,
          sampleRatio: 0.5,
          shortLink: 'short.link',
          coverImageUrl: 'cover.jpg',
          smallCoverImageUrl: 'small-cover.jpg',
          mediumCoverImageUrl: 'medium-cover.jpg',
          largeCoverImageUrl: 'large-cover.jpg',
          chunkMap: {
            'main.js': 'https://example.com/main.js',
            'vendor.js': 'https://example.com/vendor.js',
            'face.js': 'https://example.com/face.js',
            'runtime.js': 'https://example.com/runtime.js'
          }
        };
      `

    const mockResponse = {
      text: () => Promise.resolve(mockXrWebScript),
      clone: () => mockResponse,
    }

    fetchStub.onSecondCall().resolves(mockResponse)

    const numberOfFetches = 2
    const numberOfChunks = 4
    for (let i = 0; i < numberOfChunks; i++) {
      fetchStub.onCall(numberOfFetches + i).resolves({
        text: () => Promise.resolve(`
          console.log("Hello, Script!")
          let resource = "https://cdn.8thwall.com/xrweb/model-${i}.en"
          let anotherResource = "//cdn.8thwall.com/xrweb/mesh-${i}.glb"
          // Do work with resources
        `),
        clone: () => {},
        ok: true,
      })
    }

    const result = await collectXrwebAssets(xrWebUrl, appUrl)

    assert.property(result, 'xrWebResponse')
    assert.property(result, 'xrWebScriptData')
    assert.property(result, 'xrWebResourceUrls')

    assert.isArray(result.xrWebScriptData)
    const urls = result.xrWebScriptData.map(item => item.url)
    assert.includeMembers(urls, [
      'https://example.com/main.js',
      'https://example.com/vendor.js',
      'https://example.com/face.js',
      'https://example.com/runtime.js',
    ])
    assert.equal(result.xrWebScriptData.length, numberOfChunks)

    assert.isArray(result.xrWebResourceUrls)
    assert.include(result.xrWebResourceUrls, 'https://cdn.8thwall.com/xrweb/model-0.en')
    assert.include(result.xrWebResourceUrls, 'https://cdn.8thwall.com/xrweb/model-1.en')
    assert.include(result.xrWebResourceUrls, 'https://cdn.8thwall.com/xrweb/model-2.en')
    assert.include(result.xrWebResourceUrls, 'https://cdn.8thwall.com/xrweb/model-3.en')
    assert.include(result.xrWebResourceUrls, 'https://cdn.8thwall.com/xrweb/mesh-0.glb')
    assert.include(result.xrWebResourceUrls, 'https://cdn.8thwall.com/xrweb/mesh-1.glb')
    assert.include(result.xrWebResourceUrls, 'https://cdn.8thwall.com/xrweb/mesh-2.glb')
    assert.include(result.xrWebResourceUrls, 'https://cdn.8thwall.com/xrweb/mesh-3.glb')
    assert.equal(result.xrWebResourceUrls.length, 8)
  })

  it('should properly set up vm context with required globals', async () => {
    const appKey = 'test-app-key-123'
    const xrWebUrl = `https://apps.8thwall.com/xrweb?appKey=${appKey}`
    const appUrl = 'https://app.example.com'

    fetchStub.onFirstCall().resolves({
      json: () => Promise.resolve({xrSessionToken: 'token'}),
    })

    const mockXrWebScript = `
        if (typeof window === 'undefined') throw new Error('window not defined');
        if (typeof document === 'undefined') throw new Error('document not defined');
        if (typeof navigator === 'undefined') throw new Error('navigator not defined');
        if (window !== self) throw new Error('window !== self');
        if (window !== globalThis) throw new Error('window !== globalThis');

        window._XR8 = {
          channel: 'test',
          version: '1.0.0',
          devMode: false,
          sampleRatio: 1,
          shortLink: '',
          coverImageUrl: '',
          smallCoverImageUrl: '',
          mediumCoverImageUrl: '',
          largeCoverImageUrl: '',
          chunkMap: {}
        };
      `

    fetchStub.onSecondCall().resolves({
      text: () => Promise.resolve(mockXrWebScript),
      clone: () => ({
        text: () => Promise.resolve(mockXrWebScript),
      }),
    })

    // Since there are no scripts in the chunkMap, there won't be consecutive fetches for resources
    const result = await collectXrwebAssets(xrWebUrl, appUrl)

    assert.property(result, 'xrWebResponse')
    assert.property(result, 'xrWebScriptData')
    assert.property(result, 'xrWebResourceUrls')

    assert.isArray(result.xrWebScriptData)
    assert.equal(result.xrWebScriptData.length, 0)

    assert.isArray(result.xrWebResourceUrls)
    assert.equal(result.xrWebResourceUrls.length, 0)
  })

  it('should handle missing _XR8 object', async () => {
    const appKey = 'test-app-key-123'
    const xrWebUrl = `https://apps.8thwall.com/xrweb?appKey=${appKey}`
    const appUrl = 'https://app.example.com'

    fetchStub.onFirstCall().resolves({
      json: () => Promise.resolve({xrSessionToken: 'token'}),
    })

    const scriptWithoutXR8 = 'console.log("This script does not set up _XR8");'

    fetchStub.onSecondCall().resolves({
      text: () => Promise.resolve(scriptWithoutXR8),
      clone: () => ({
        text: () => Promise.resolve(scriptWithoutXR8),
      }),
    })

    try {
      await collectXrwebAssets(xrWebUrl, appUrl)
      assert.fail('Expected function to throw an error due to missing _XR8')
    } catch (error) {
      // Should throw an error when trying to access undefined _XR8 object
      assert.isTrue(error instanceof Error)
    }
  })
})
