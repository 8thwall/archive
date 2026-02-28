// @attr(esnext = 1)
// @attr(target = "node")
// @attr(npm_rule = "@npm-html-app-packager//:npm-html-app-packager")
// @deps(//bzl/js:chai-js)

import {
  describe, it, assert, beforeEach, afterEach, sinon,
} from '@nia/bzl/js/chai-js'

import {
  unpackFont8Urls,
  sanitizePath,
  isAssetUrl,
  unpackGltfResponse,
  shouldUseXrEngine,
} from '@nia/reality/app/nae/packager/html-app-asset-utils'
import type {RawFontSetData} from '@nia/c8/ecs/src/shared/msdf-font-type'
import type {HtmlAppConfig} from '@nia/reality/shared/nae/nae-types'

describe('unpackFont8Urls', () => {
  let fetchStub: sinon.SinonStub
  let consoleWarnStub: sinon.SinonStub

  beforeEach(() => {
    fetchStub = sinon.stub(global, 'fetch')
    consoleWarnStub = sinon.stub(console, 'warn')
  })

  afterEach(() => {
    fetchStub.restore()
    consoleWarnStub.restore()
  })

  const createMockResponse = (
    data: RawFontSetData,
    status: number = 200,
    statusText: string = 'OK'
  ): Response => new Response(JSON.stringify(data), {
    status,
    statusText,
    headers: {
      'content-type': 'application/json',
    },
  })

  const createMockFontSetData = (
    fontFile?: string,
    pages: string[] = ['page0.png']
  ): RawFontSetData => ({
    fontFile,
    pages,
    chars: [
      {
        id: 65,
        index: 0,
        char: 'A',
        width: 20,
        height: 24,
        xoffset: 0,
        yoffset: 0,
        xadvance: 20,
        x: 0,
        y: 0,
        page: 0,
      },
    ],
    info: {
      face: 'TestFont',
      size: 24,
      bold: 0,
      italic: 0,
      charset: ['A'],
      unicode: 1,
      stretchH: 100,
      smooth: 1,
      aa: 1,
      padding: [0, 0, 0, 0],
      spacing: [0, 0],
      outline: 0,
    },
    common: {
      lineHeight: 24,
      base: 20,
      scaleW: 256,
      scaleH: 256,
      pages: 1,
      packed: 0,
      alphaChnl: 0,
      redChnl: 0,
      greenChnl: 0,
      blueChnl: 0,
    },
    distanceField: {
      fieldType: 'msdf',
      distanceRange: 4,
    },
    kernings: [],
  })

  it('should unpack URLs from font8 with fontFile and pages', async () => {
    const fontUrl = new URL('https://example.com/fonts/test-font.font8')
    const mockFontSetData = createMockFontSetData(
      'test-font.ttf',
      ['page0.png', 'page1.png']
    )

    fetchStub.resolves(createMockResponse(mockFontSetData))

    const result = await unpackFont8Urls(fontUrl)

    assert.deepEqual(result, [
      'https://example.com/fonts/test-font.font8',
      'https://example.com/fonts/test-font.ttf',
      'https://example.com/fonts/page0.png',
      'https://example.com/fonts/page1.png',
    ])

    assert.isTrue(fetchStub.calledOnceWith(fontUrl))
  })

  it('should handle empty pages array', async () => {
    const fontUrl = new URL('https://example.com/fonts/test-font.font8')
    const mockFontSetData = createMockFontSetData(
      'test-font.ttf',
      []  // Empty pages array
    )

    fetchStub.resolves(createMockResponse(mockFontSetData))

    const result = await unpackFont8Urls(fontUrl)

    assert.deepEqual(result, [
      'https://example.com/fonts/test-font.font8',
      'https://example.com/fonts/test-font.ttf',
    ])

    assert.isTrue(fetchStub.calledOnceWith(fontUrl))
  })

  it('should handle fetch failure and return original URL only', async () => {
    const fontUrl = new URL('https://example.com/fonts/missing-font.font8')

    fetchStub.rejects(new Error('Network error'))

    const result = await unpackFont8Urls(fontUrl)

    assert.deepEqual(result, [
      'https://example.com/fonts/missing-font.font8',
    ])

    assert.isTrue(fetchStub.calledOnceWith(fontUrl))
    assert.isTrue(consoleWarnStub.calledOnce)
    assert.include(
      consoleWarnStub.firstCall.args[0],
      'Failed to unpack .font8 URLs from: https://example.com/fonts/missing-font.font8'
    )
  })

  it('should handle invalid JSON response and return original URL only', async () => {
    const fontUrl = new URL('https://example.com/fonts/invalid-font.font8')

    // Mock response with invalid JSON
    const invalidResponse = new Response('invalid json', {
      status: 200,
      headers: {'content-type': 'application/json'},
    })
    fetchStub.resolves(invalidResponse)

    const result = await unpackFont8Urls(fontUrl)

    assert.deepEqual(result, [
      'https://example.com/fonts/invalid-font.font8',
    ])

    assert.isTrue(fetchStub.calledOnceWith(fontUrl))
    assert.isTrue(consoleWarnStub.calledOnce)
    assert.include(
      consoleWarnStub.firstCall.args[0],
      'Failed to unpack .font8 URLs from: https://example.com/fonts/invalid-font.font8'
    )
  })
})

describe('sanitizePath', () => {
  it('should decode URI components and sanitize special characters', () => {
    const input = 'hello%20world/test%2Bfile.txt'
    const result = sanitizePath(input)
    assert.equal(result, 'hello_world/test_file.txt')
  })

  it('should preserve allowed characters', () => {
    const input = 'valid-file_name.123/subfolder'
    const result = sanitizePath(input)
    assert.equal(result, 'valid-file_name.123/subfolder')
  })

  it('should replace special characters with underscores', () => {
    const input = 'file@name#with$special^and&more!.txt'
    const result = sanitizePath(input)
    assert.equal(result, 'file_name_with_special_and_more_.txt')
  })

  it('should handle Unicode characters', () => {
    const input = 'café/naïve-文件.txt'
    const result = sanitizePath(input)
    assert.equal(result, 'caf_/na_ve-__.txt')
  })

  it('should handle empty string', () => {
    const input = ''
    const result = sanitizePath(input)
    assert.equal(result, '')
  })

  it('should handle spaces and other whitespace characters', () => {
    const input = 'file name\twith\nwhitespace.txt'
    const result = sanitizePath(input)
    assert.equal(result, 'file_name_with_whitespace.txt')
  })

  it('should handle malformed URI components gracefully', () => {
    const input = 'file%invalidURI.txt'
    const result = sanitizePath(input)
    assert.equal(result, 'file_invalidURI.txt')
  })
})

describe('shouldUseXrEngine', () => {
  const createHtmlAppConfig = (overrides: Partial<any> = {}): HtmlAppConfig => {
    const base: HtmlAppConfig = {
      projectUrl: 'https://exampleWorkspace.8thwall.app/exampleApp/',
      shell: 'ios' as const,
      appInfo: {
        workspace: 'test',
        appName: 'TestApp',
        naeBuildMode: 'static' as const,
        bundleIdentifier: 'com.test.app',
        versionName: '1.0.0',
        appDisplayName: 'Test App',
        screenOrientation: 'portrait' as const,
        statusBarVisible: true,
        resourceDir: '/test',
        refHead: 'production' as const,
      },
    }

    const result = {...base, ...overrides}
    if (overrides.appInfo) {
      result.appInfo = {...base.appInfo, ...overrides.appInfo}
    }

    return result
  }

  it('should return true when camera permission request status is REQUESTED', () => {
    const appConfig = createHtmlAppConfig({
      appInfo: {
        permissions: {
          camera: {
            requestStatus: 'REQUESTED',
            usageDescription: 'Camera access',
          },
        },
      },
    })

    const result = shouldUseXrEngine(appConfig)
    assert.isTrue(result)
  })

  it('should return false when camera permission request status is NOT_REQUESTED', () => {
    const appConfig = createHtmlAppConfig({
      appInfo: {
        permissions: {
          camera: {
            requestStatus: 'NOT_REQUESTED',
          },
        },
      },
    })

    const result = shouldUseXrEngine(appConfig)
    assert.isFalse(result)
  })

  it('should return false when appInfo is undefined', () => {
    const appConfig = createHtmlAppConfig({
      appInfo: undefined,
    })

    const result = shouldUseXrEngine(appConfig)
    assert.isFalse(result)
  })

  it('should return false when permissions is undefined', () => {
    const appConfig = createHtmlAppConfig({
      appInfo: {
        permissions: undefined,
      },
    })

    const result = shouldUseXrEngine(appConfig)
    assert.isFalse(result)
  })

  it('should work with other permissions present', () => {
    const appConfig = createHtmlAppConfig({
      appInfo: {
        permissions: {
          camera: {
            requestStatus: 'REQUESTED',
            usageDescription: 'Camera access',
          },
          location: {
            requestStatus: 'NOT_REQUESTED',
            usageDescription: 'Location access',
          },
        },
      },
    })

    const result = shouldUseXrEngine(appConfig)
    assert.isTrue(result)
  })
})

describe('isAssetUrl', () => {
  it('should return true for URLs with /assets/ path', () => {
    const url = 'https://example.com/assets/image.png'
    const result = isAssetUrl(url)
    assert.isTrue(result)
  })

  it('should return false for URLs without /assets/ path', () => {
    const url = 'https://example.com/public/image.png'
    const result = isAssetUrl(url)
    assert.isFalse(result)
  })

  it('should return false for URLs with assets in the domain but not in path', () => {
    const url = 'https://assets.example.com/image.png'
    const result = isAssetUrl(url)
    assert.isFalse(result)
  })

  it('should return false for URLs with assets in the filename but not in path', () => {
    const url = 'https://example.com/files/assets.zip'
    const result = isAssetUrl(url)
    assert.isFalse(result)
  })

  it('should be case sensitive for assets path', () => {
    const url = 'https://example.com/Assets/image.png'
    const result = isAssetUrl(url)
    assert.isFalse(result)
  })

  it('should handle URLs with port numbers', () => {
    const url = 'https://example.com:8080/assets/image.png'
    const result = isAssetUrl(url)
    assert.isTrue(result)
  })
})

describe('unpackGltfResponse', () => {
  let consoleWarnStub: sinon.SinonStub

  beforeEach(() => {
    consoleWarnStub = sinon.stub(console, 'warn')
  })

  afterEach(() => {
    consoleWarnStub.restore()
  })

  const createMockGltfResponse = (
    data: any,
    url: string = 'https://example.com/models/scene.gltf',
    status: number = 200,
    statusText: string = 'OK'
  ): Response => {
    const response = new Response(JSON.stringify(data), {
      status,
      statusText,
      headers: {
        'content-type': 'application/json',
      },
    })
    Object.defineProperty(response, 'url', {
      value: url,
      writable: false,
    })
    return response
  }

  it('should unpack URLs from GLTF with buffers and images', async () => {
    const mockGltfData = {
      buffers: [
        {uri: 'scene.bin', byteLength: 1024},
        {uri: 'animations.bin', byteLength: 512},
      ],
      images: [
        {uri: 'texture.png'},
        {uri: 'normal.jpg'},
      ],
    }

    const mockResponse = createMockGltfResponse(
      mockGltfData,
      'https://example.com/models/scene.gltf'
    )

    const result = await unpackGltfResponse(mockResponse)

    assert.deepEqual(result, [
      'https://example.com/models/scene.bin',
      'https://example.com/models/animations.bin',
      'https://example.com/models/texture.png',
      'https://example.com/models/normal.jpg',
    ])
  })

  it('should filter out data URIs', async () => {
    const mockGltfData = {
      buffers: [
        {uri: 'scene.bin', byteLength: 1024},
        {uri: 'data:application/octet-stream;base64,ABC123', byteLength: 256},
      ],
      images: [
        {uri: 'texture.png'},
        {uri: 'data:image/png;base64,iVBORw0KGgo='},
      ],
    }

    const mockResponse = createMockGltfResponse(
      mockGltfData,
      'https://example.com/models/mixed.gltf'
    )

    const result = await unpackGltfResponse(mockResponse)

    assert.deepEqual(result, [
      'https://example.com/models/scene.bin',
      'https://example.com/models/texture.png',
    ])
  })

  it('should handle extensions with URIs', async () => {
    const mockGltfData = {
      extensionsUsed: ['KHR_draco_mesh_compression'],
      extensions: {
        KHR_draco_mesh_compression: {
          bufferView: 0,
          attributes: {
            POSITION: 0,
          },
        },
        CUSTOM_extension: {
          uri: 'custom_data.bin',
          nested: {
            uri: 'nested_resource.json',
            data: {
              uri: 'deep_nested.bin',
            },
          },
        },
      },
    }

    const mockResponse = createMockGltfResponse(
      mockGltfData,
      'https://example.com/models/extended.gltf'
    )

    const result = await unpackGltfResponse(mockResponse)

    assert.deepEqual(result, [
      'https://example.com/models/custom_data.bin',
      'https://example.com/models/nested_resource.json',
      'https://example.com/models/deep_nested.bin',
    ])
  })

  it('should handle invalid JSON response and return empty array', async () => {
    const invalidResponse = new Response('invalid json', {
      status: 200,
      headers: {'content-type': 'application/json'},
    })
    Object.defineProperty(invalidResponse, 'url', {
      value: 'https://example.com/models/invalid.gltf',
      writable: false,
    })

    const result = await unpackGltfResponse(invalidResponse)

    assert.deepEqual(result, [])
    assert.isTrue(consoleWarnStub.calledOnce)
    assert.include(
      consoleWarnStub.firstCall.args[0],
      'Failed to unpack GLTF URLs from: https://example.com/models/invalid.gltf'
    )
  })
})
