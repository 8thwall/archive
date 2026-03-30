// @attr(npm_rule = "@npm-public-api//:npm-public-api")
// @attr(externalize_npm = True)
// @attr[](node_opts = "--enable-source-maps")
// @attr(size = "medium")

import {describe, it, assert, afterEach, before, beforeEach} from '@nia/bzl/js/chai-js'

import {Sequelize} from 'sequelize'
import FormData from 'form-data'
import fs from 'fs'
import path from 'path'

import {makeRequestContext, makeQueryParameters} from './test/common'
import {handleTargetsListGet, handleTargetsListPost} from './app-targets'
import * as s3 from './s3'
import * as models from './models'
import {initializeModels} from './models/init'
import {Images} from './test/images'

const withRequestContext = request => ({...request, ...makeRequestContext()})

const assertValidCdnUrl = (url) => {
  if (typeof url !== 'string' || !url.startsWith('https://cdn.8thwall.com/image-target/')) {
    throw new Error(`Invalid CDN URL: ${url}`)
  }
}

const generateForm = (params, imagePath) => {
  const form = new FormData()

  if (imagePath) {
    form.append('image', fs.readFileSync(imagePath), {
      contentType: 'image/jpeg',
      filename: path.basename(imagePath),
    })
  }

  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined) {
      form.append(key, String(params[key]))
    }
  })

  return form
}

const DEFAULT_IMAGE = Images.target

const postTargetToHandler = (appKey: string, formFields = {}, imagePath = DEFAULT_IMAGE) => {
  const form = generateForm({
    'geometry.top': 0,
    'geometry.left': 0,
    'geometry.width': 480,
    'geometry.height': 640,
    'name': 'test-target',
    ...formFields,
  }, imagePath)

  return handleTargetsListPost({
    pathParameters: {
      app: appKey,
    },
    headers: form.getHeaders(),
    body: form.getBuffer().toString('base64'),
    isBase64Encoded: true,
    ...makeRequestContext(),
  })
}

describe('App /targets POST', () => {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  })

  before(() => {
    s3.register({
      putObject: async () => {},
      getObject: async () => ({$metadata: {}}),
    })

    models.register(initializeModels(sequelize))
  })
  beforeEach(async function declareBeforeEach() {
    this.timeout(10000)
    await sequelize.sync()
    const {App, Account} = models.use()

    await Account.bulkCreate([{
      uuid: 'account1',
      shortName: 'account1',
      status: 'ENABLED',
    }])

    await App.bulkCreate([{
      uuid: 'app1',
      AccountUuid: 'account1',
      name: 'app1',
      appKey: 'app1',
      status: 'ENABLED',
    }])
  })
  afterEach(async function declareAfterEach() {
    this.timeout(10000)
    await sequelize.drop()
  })
  it('accepts a flat upload', async () => {
    const res = await postTargetToHandler('app1')
    assert.equal(res.statusCode, 200, res.body)

    const newTarget = JSON.parse(res.body)
    assert.deepInclude(newTarget, {
      appKey: 'app1',
      name: 'test-target',
      geometry: {
        top: 0,
        left: 0,
        width: 480,
        height: 640,
        originalWidth: 480,
        originalHeight: 640,
        isRotated: false,
      },
      metadata: null,
      metadataIsJson: true,
      loadAutomatically: false,
      status: 'AVAILABLE',
      type: 'PLANAR',
    })

    assertValidCdnUrl(newTarget.originalImageUrl)
    assertValidCdnUrl(newTarget.imageUrl)
    assertValidCdnUrl(newTarget.thumbnailImageUrl)
    assertValidCdnUrl(newTarget.geometryTextureUrl)
  })
  it('accepts static target with roll and pitch angles for flat upload', async () => {
    const res = await postTargetToHandler('app1', {
      'geometry.staticOrientation': JSON.stringify({
        rollAngle: 90,
        pitchAngle: 90,
      }),
    })

    assert.equal(res.statusCode, 200)

    const newTarget = JSON.parse(res.body)
    assert.deepInclude(newTarget, {
      appKey: 'app1',
      name: 'test-target',
      geometry: {
        top: 0,
        left: 0,
        width: 480,
        height: 640,
        originalWidth: 480,
        originalHeight: 640,
        isRotated: false,
        staticOrientation: {
          rollAngle: 90,
          pitchAngle: 90,
        },
      },
      metadata: null,
      metadataIsJson: true,
      loadAutomatically: false,
      status: 'AVAILABLE',
      type: 'PLANAR',
    })

    assertValidCdnUrl(newTarget.originalImageUrl)
    assertValidCdnUrl(newTarget.imageUrl)
    assertValidCdnUrl(newTarget.thumbnailImageUrl)
    assertValidCdnUrl(newTarget.geometryTextureUrl)
  })
  it('accepts crop, isRotated, and large images', async () => {
    const res = await postTargetToHandler('app1', {
      'geometry.top': 0,
      'geometry.left': 0,
      'geometry.width': 960,
      'geometry.height': 1280,
      'isRotated': true,
    }, Images.largeRotated)

    assert.equal(res.statusCode, 200)

    const newTarget = JSON.parse(res.body)
    assert.deepInclude(newTarget, {
      geometry: {
        top: 0,
        left: 0,
        width: 960,
        height: 1280,
        originalWidth: 1369,
        originalHeight: 2048,
        isRotated: true,
      },
    })

    assertValidCdnUrl(newTarget.originalImageUrl)
    assertValidCdnUrl(newTarget.imageUrl)
    assertValidCdnUrl(newTarget.thumbnailImageUrl)
    assertValidCdnUrl(newTarget.geometryTextureUrl)

    assert.equal(newTarget.geometryTextureUrl, newTarget.originalImageUrl)
  })
  it('accepts a cylinder upload', async () => {
    const res = await postTargetToHandler('app1', {
      'type': 'CYLINDER',
    })

    assert.equal(res.statusCode, 200)

    const newTarget = JSON.parse(res.body)
    assert.deepInclude(newTarget, {
      appKey: 'app1',
      name: 'test-target',
      type: 'CYLINDER',
      geometry: {
        top: 0,
        left: 0,
        width: 480,
        height: 640,
        originalWidth: 480,
        originalHeight: 640,
        isRotated: false,
        cylinderCircumferenceTop: 100,
        cylinderCircumferenceBottom: 100,
        targetCircumferenceTop: 50,
        cylinderSideLength: Math.round(50 / 480 * 640 * 100) / 100,
        coniness: 0,
        arcAngle: 180,
        inputMode: 'BASIC',
      },
      metadata: null,
      metadataIsJson: true,
      loadAutomatically: false,
      status: 'AVAILABLE',
    })

    assertValidCdnUrl(newTarget.originalImageUrl)
    assertValidCdnUrl(newTarget.imageUrl)
    assertValidCdnUrl(newTarget.thumbnailImageUrl)
    assertValidCdnUrl(newTarget.geometryTextureUrl)

    assert.equal(newTarget.geometryTextureUrl, newTarget.originalImageUrl)
  })
  it('accepts a cylinder upload with rotation and crop', async () => {
    const res = await postTargetToHandler('app1', {
      'type': 'CYLINDER',
      'geometry.top': 0,
      'geometry.left': 0,
      'geometry.width': 960,
      'geometry.height': 1280,
      'geometry.isRotated': true,
    }, Images.largeRotated)

    assert.equal(res.statusCode, 200)

    const newTarget = JSON.parse(res.body)
    assert.deepInclude(newTarget, {
      appKey: 'app1',
      name: 'test-target',
      type: 'CYLINDER',
      geometry: {
        top: 0,
        left: 0,
        width: 960,
        height: 1280,
        originalWidth: 1369,
        originalHeight: 2048,
        isRotated: true,
        cylinderCircumferenceTop: 100,
        cylinderCircumferenceBottom: 100,
        targetCircumferenceTop: 50,
        cylinderSideLength: Math.round((50 / 2048) * 1369 * 100) / 100,
        coniness: 0,
        arcAngle: 180,
        inputMode: 'BASIC',
      },
      metadata: null,
      metadataIsJson: true,
      loadAutomatically: false,
      status: 'AVAILABLE',
    })

    assertValidCdnUrl(newTarget.originalImageUrl)
    assertValidCdnUrl(newTarget.imageUrl)
    assertValidCdnUrl(newTarget.thumbnailImageUrl)
    assertValidCdnUrl(newTarget.geometryTextureUrl)

    assert.equal(newTarget.geometryTextureUrl, newTarget.originalImageUrl)
  })
  it('accepts a conical upload', async () => {
    const res = await postTargetToHandler('app1', {
      'type': 'CONICAL',
      'geometry.topRadius': 1600,
      'geometry.bottomRadius': 640,
    }, Images.largeCone)

    assert.equal(res.statusCode, 200)

    const newTarget = JSON.parse(res.body)
    assert.deepInclude(newTarget, {
      appKey: 'app1',
      name: 'test-target',
      type: 'CONICAL',
      geometry: {
        top: 0,
        left: 0,
        width: 480,
        height: 640,
        originalWidth: 2048,
        originalHeight: 886,  // This is for the flattened geometryTexture
        isRotated: false,
        cylinderCircumferenceTop: 100,
        cylinderCircumferenceBottom: (100 * 640) / 1600,
        targetCircumferenceTop: 50,
        cylinderSideLength: Math.round((50 / (2048 / 886)) * 100) / 100,
        topRadius: 1600,
        bottomRadius: 640,
        arcAngle: 180,
        coniness: Math.log2(1600 / 640),
        inputMode: 'BASIC',
      },
      metadata: null,
      metadataIsJson: true,
      loadAutomatically: false,
      status: 'AVAILABLE',
    })

    assertValidCdnUrl(newTarget.originalImageUrl)
    assertValidCdnUrl(newTarget.imageUrl)
    assertValidCdnUrl(newTarget.thumbnailImageUrl)
    assertValidCdnUrl(newTarget.geometryTextureUrl)
  }).timeout(10000)

  it('accepts a conical upload with rotation', async () => {
    const res = await postTargetToHandler('app1', {
      'type': 'CONICAL',
      'geometry.topRadius': 1600,
      'geometry.bottomRadius': 640,
      'isRotated': true,
    }, Images.largeCone)

    assert.equal(res.statusCode, 200)

    const newTarget = JSON.parse(res.body)
    assert.deepInclude(newTarget, {
      appKey: 'app1',
      name: 'test-target',
      type: 'CONICAL',
      geometry: {
        top: 0,
        left: 0,
        width: 480,
        height: 640,
        originalWidth: 886,  // This is for the flattened geometryTexture
        originalHeight: 2048,
        isRotated: true,
        cylinderCircumferenceTop: 100,
        cylinderCircumferenceBottom: (100 * 640) / 1600,
        targetCircumferenceTop: 50,
        cylinderSideLength: Math.round((50 / (2048 / 886)) * 100) / 100,
        topRadius: 1600,
        bottomRadius: 640,
        arcAngle: 180,
        coniness: Math.log2(1600 / 640),
        inputMode: 'BASIC',
      },
      metadata: null,
      metadataIsJson: true,
      loadAutomatically: false,
      status: 'AVAILABLE',
    })

    assertValidCdnUrl(newTarget.originalImageUrl)
    assertValidCdnUrl(newTarget.imageUrl)
    assertValidCdnUrl(newTarget.thumbnailImageUrl)
    assertValidCdnUrl(newTarget.geometryTextureUrl)
  }).timeout(10000)

  it('accepts a conical fez upload with rotation', async () => {
    const res = await postTargetToHandler('app1', {
      'type': 'CONICAL',
      'geometry.topRadius': -1600,
      'geometry.bottomRadius': 640,
      'geometry.isRotated': true,
    }, Images.largeCone)

    assert.equal(res.statusCode, 200)

    const newTarget = JSON.parse(res.body)
    assert.deepInclude(newTarget, {
      appKey: 'app1',
      name: 'test-target',
      type: 'CONICAL',
      geometry: {
        top: 0,
        left: 0,
        width: 480,
        height: 640,
        originalWidth: 886,  // This is for the flattened geometryTexture
        originalHeight: 2048,
        isRotated: true,
        cylinderCircumferenceTop: 100,
        cylinderCircumferenceBottom: 100 * 1600 / 640,
        targetCircumferenceTop: 50,
        cylinderSideLength: Math.round(50 * (1600 / 640) / (2048 / 886) * 100) / 100,
        topRadius: -1600,
        bottomRadius: 640,
        arcAngle: 180,
        coniness: -Math.log2(1600 / 640),
        inputMode: 'BASIC',
      },
      metadata: null,
      metadataIsJson: true,
      loadAutomatically: false,
      status: 'AVAILABLE',
    })

    assertValidCdnUrl(newTarget.originalImageUrl)
    assertValidCdnUrl(newTarget.imageUrl)
    assertValidCdnUrl(newTarget.thumbnailImageUrl)
    assertValidCdnUrl(newTarget.geometryTextureUrl)
  }).timeout(10000)

  it('allows loadAutomatically for the first 32, then rejects', async () => {
    const promises: Promise<any>[] = []
    for (let i = 0; i < 32; i++) {
      promises.push(
        postTargetToHandler('app1', {name: `target${i}`, loadAutomatically: true})
      )
    }
    const successes = await Promise.all(promises)
    successes.forEach((res) => {
      assert.equal(res.statusCode, 200)
    })
    const finalRes = await postTargetToHandler('app1', {name: 'target32', loadAutomatically: true})
    const {message} = JSON.parse(finalRes.body)

    assert.equal(finalRes.statusCode, 400)
    assert.equal(message, 'Invalid input: Cannot exceed 32 loadAutomatically targets.')
  }).timeout(10000)
  it('allows metadata to be specified', async () => {
    const metadataString = JSON.stringify({my: 'metadata'})
    const res = await postTargetToHandler('app1', {metadata: metadataString})
    assert.equal(res.statusCode, 200)

    const newTarget = JSON.parse(res.body)

    assert.deepInclude(newTarget, {
      metadata: metadataString,
      metadataIsJson: true,
    })
  })
  it('rejects invalid input with 400', async () => {
    const shouldAllReject = [
      await postTargetToHandler(''),
      await postTargetToHandler('app1', {loadAutomatically: 'not-valid'}),
      await postTargetToHandler('app1', {metadataIsJson: 'not-valid'}),
      await postTargetToHandler('app1', {name: ''}),
      await postTargetToHandler('app1', {}, Images.wide),
      await postTargetToHandler('app1', {unknownParameter: 'true'}),
      await postTargetToHandler('app1', {metadata: 'not JSON'}),
      await postTargetToHandler('app1', {metadata: ''}),
      await postTargetToHandler('app1', {}, null),
      await postTargetToHandler('app1', {'geometry.left': 45.5}),
      await postTargetToHandler('app1', {'geometry.left': '45 and some more'}),
      await postTargetToHandler('app1', {'geometry.topRadius': '350'}),  // Not allowed for PLANAR
      await postTargetToHandler('app1', {'type': 'CYLINDER', 'geometry.topRadius': '350'}),
      await postTargetToHandler('app1', {'type': 'CONICAL'}),
      await postTargetToHandler('app1', {name: 'til~de'}),
      await postTargetToHandler('app1', {name: 'char^'}),
      await postTargetToHandler('app1', {name: 'char*'}),
      await postTargetToHandler('app1', {name: 'char;'}),
      await postTargetToHandler('app1', {name: 'char`'}),
      await postTargetToHandler('app1', {name: 'char>'}),
      await postTargetToHandler('app1', {name: 'char<'}),
      await postTargetToHandler('app1', {name: Array.from({length: 256}, () => 'c').join('')}),
      await postTargetToHandler('app1', {'geometry.left': -1}),
      await postTargetToHandler('app1', {'geometry.top': -1}),
      await postTargetToHandler('app1', {'geometry.width': 48}),
      await postTargetToHandler('app1', {'geometry.height': 64}),
      // Too big
      await postTargetToHandler('app1', {'geometry.width': 4800, 'geometry.height': 6400}),
      // Invalid aspect ratio
      await postTargetToHandler('app1', {'geometry.width': 640, 'geometry.height': 640},
        Images.largeCone),
      // This generates metadata: "[1,1,1,1,1,...]"
      await postTargetToHandler('app1', {
        metadata: JSON.stringify(Array.from({length: 2048}, () => 1)),
      }),
      // This crop would be valid for the original image, but after the image is flattened,
      // it has different dimensions.
      await postTargetToHandler('app1', {
        'type': 'CONICAL',
        'geometry.topRadius': 1600,
        'geometry.bottomRadius': 640,
        'geometry.width': 750,
        'geometry.height': 1000,
      }, Images.largeCone),
      // reject conical crop with staticOrientation
      await postTargetToHandler('app1', {
        'type': 'CONICAL',
        'geometry.topRadius': 1600,
        'geometry.bottomRadius': 640,
        'geometry.width': 750,
        'geometry.height': 1000,
        'geometry.staticOrientation': {
          rollAngle: 90,
          pitchAngle: 90,
        },
      }, Images.largeCone),
      // Invalid staticOrientation
      await postTargetToHandler('app1', {'geometry.staticOrientation': 'not JSON'}),
      await postTargetToHandler('app1', {'geometry.staticOrientation': {rollAngle: 0}}),
      await postTargetToHandler('app1', {
        'geometry.staticOrientation':
        {rollAngle: 370, pitchAngle: 0},
      }),
      await postTargetToHandler('app1', {'geometry.staticOrientation': {pitchAngle: 0}}),
      await postTargetToHandler('app1', {
        'geometry.staticOrientation':
        {rollAngle: 0, pitchAngle: 370},
      }),
      await postTargetToHandler('app1', {
        'geometry.staticOrientation': {rollAngle: 0, pitchAngle: 0, extra: 'something'},
      }),
    ]

    shouldAllReject.forEach((res) => {
      assert.equal(res.statusCode, 400)
    })
  }).timeout(10000)

  it('permits a valid conical crop when rotated', async () => {
    // This crop would be invalid if not isRotated, but rotating the flattened image before cropping
    // should permit.
    const res = await postTargetToHandler('app1', {
      'type': 'CONICAL',
      'geometry.topRadius': 1600,
      'geometry.bottomRadius': 640,
      'geometry.width': 750,
      'geometry.height': 1000,
      'isRotated': true,
    }, Images.largeCone)
    assert.equal(res.statusCode, 200)
  }).timeout(10000)

  it('permits a name with 255 characters', async () => {
    const name = Array.from({length: 255}, () => 'c').join('')
    const res = await postTargetToHandler('app1', {name})
    assert.equal(res.statusCode, 200)
  })
  it('permits a slightly inexact crop ratio', async () => {
    const width = 960
    const exactHeight = (width * 4) / 3
    const inexactHeight = exactHeight - 3
    const res = await postTargetToHandler('app1', {
      'geometry.width': width,
      'geometry.height': inexactHeight,
      'isRotated': true,
    }, Images.largeRotated)

    assert.equal(res.statusCode, 200)
  })
  it('permits non-json metadata if enabled with flag', async () => {
    const res = await postTargetToHandler('app1', {metadata: 'not JSON', metadataIsJson: false})
    assert.equal(res.statusCode, 200)
  })
  it('rejects nonexistent app with 404', async () => {
    const res = await postTargetToHandler('app2')
    assert.equal(res.statusCode, 404)
  })
  it('permits Content-Type header in upper case', async () => {
    const form = generateForm({
      'geometry.top': 0,
      'geometry.left': 0,
      'geometry.width': 480,
      'geometry.height': 640,
      'name': 'test-target',
    }, DEFAULT_IMAGE)

    const baseHeaders = form.getHeaders()
    const body = form.getBuffer().toString('base64')

    const uppercaseHeaders = {...baseHeaders, 'Content-Type': baseHeaders['content-type']}
    delete uppercaseHeaders['content-type']

    const res = await handleTargetsListPost({
      pathParameters: {
        app: 'app1',
      },
      headers: uppercaseHeaders,
      body,
      isBase64Encoded: true,
      ...makeRequestContext(),
    })
    assert.equal(res.statusCode, 200)
  })
  it('permits Content-Type header in mixed-up case', async () => {
    const form = generateForm({
      'geometry.top': 0,
      'geometry.left': 0,
      'geometry.width': 480,
      'geometry.height': 640,
      'name': 'test-target',
    }, DEFAULT_IMAGE)

    const baseHeaders = form.getHeaders()
    const body = form.getBuffer().toString('base64')

    const uppercaseHeaders = {...baseHeaders, 'CoNtEnT-tYpE': baseHeaders['content-type']}
    delete uppercaseHeaders['content-type']

    const res = await handleTargetsListPost({
      pathParameters: {
        app: 'app1',
      },
      headers: uppercaseHeaders,
      body,
      isBase64Encoded: true,
      ...makeRequestContext(),
    })
    assert.equal(res.statusCode, 200)
  })
})

describe('App /targets GET', () => {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  })

  const generateImageTarget = (AppUuid, uuid) => ({
    uuid,
    name: uuid,
    AppUuid,
    status: 'ENABLED',
    type: 'PLANAR',
    updatedAt: '1996-01-17',
    createdAt: '1706-01-17',
    metadata: JSON.stringify({
      topRadius: 200,
      bottomRadius: 1000,
      top: 0,
      left: 0,
      width: 50,
      height: 100,
      originalHeight: 200,
      originalWidth: 300,
      isRotated: true,
      arcAngle: 90,
      coniness: 2,
      inputMode: 'BASIC',
    }),
  })

  before(() => {
    models.register(initializeModels(sequelize))
    process.env.PUBLIC_API_CONTINUATION_TOKEN_SIGNING = 'test signing'
  })
  beforeEach(async function declareBeforeEach() {
    this.timeout(10000)
    await sequelize.sync()
    const {App, Account, ImageTarget, ApiKey} = models.use()

    await Account.bulkCreate([{
      uuid: 'account1',
      shortName: 'account1',
      status: 'ENABLED',
    }])

    await ApiKey.bulkCreate([{
      uuid: 'key',
      secretKey: 'test-api-key',
      status: 'ENABLED',
      name: 'test-api-key',
      AccountUuid: 'account1',
      fullAccountAccess: true,
    }])

    await App.bulkCreate([{
      uuid: 'app1',
      AccountUuid: 'account1',
      name: 'app1',
      appKey: 'app1',
      status: 'ENABLED',
    }, {
      uuid: 'app2',
      AccountUuid: 'account1',
      name: 'app2',
      appKey: 'app2',
      status: 'ENABLED',
    }, {
      uuid: 'app3',
      AccountUuid: 'account1',
      name: 'app3',
      appKey: 'app3',
      status: 'ENABLED',
    }, {
      uuid: 'app4',
      AccountUuid: 'account1',
      name: 'app4',
      appKey: 'app4',
      status: 'ENABLED',
    }, {
      uuid: 'lots-of-targets',
      AccountUuid: 'account1',
      name: 'lots-of-targets',
      appKey: 'lots-of-targets',
      status: 'ENABLED',
    }, {
      uuid: 'even-more-targets',
      AccountUuid: 'account1',
      name: 'even-more-targets',
      appKey: 'even-more-targets',
      status: 'ENABLED',
    }])

    await ImageTarget.bulkCreate([{
      uuid: 'target1',
      name: 'target1',
      AppUuid: 'app1',
      status: 'DRAFT',
      type: 'PLANAR',
      metadata: '{"top": 1}',
      userMetadata: null,
      userMetadataIsJson: true,
    }, {
      uuid: 'target2',
      name: 'target2',
      AppUuid: 'app2',
      status: 'ENABLED',
      type: 'PLANAR',
      metadata: '{"top": 2}',
      userMetadata: 'this is not json',
      userMetadataIsJson: false,
    }, {
      uuid: 'target3',
      name: 'target3',
      AppUuid: 'app2',
      type: 'CONICAL',
      status: 'TAKEN_DOWN',
      metadata: JSON.stringify({
        topRadius: 200,
        bottomRadius: 1000,
        top: 0,
        left: 0,
        width: 50,
        height: 100,
        originalHeight: 200,
        originalWidth: 300,
        isRotated: true,
        arcAngle: 90,
        coniness: 2,
        inputMode: 'BASIC',
      }),
      userMetadata: null,
      userMetadataIsJson: true,
    }, {
      uuid: 'target4',
      name: 'target4',
      AppUuid: 'app4',
      status: 'DRAFT',
      type: 'PLANAR',
      metadata: JSON.stringify({
        staticOrientation: {
          rollAngle: 90,
          pitchAngle: 90,
        },
      }),
      userMetadata: null,
      userMetadataIsJson: true,
    },
    ...Array.from({length: 9}, (_, i) => generateImageTarget('lots-of-targets', `t${i}`)),
    ...Array.from({length: 55}, (_, i) => generateImageTarget('even-more-targets', `e${i}`)),
    ])
  })
  afterEach(async function declareAfterEach() {
    this.timeout(10000)
    await sequelize.drop()
  })
  it('returns image data', async () => {
    const res = await handleTargetsListGet(withRequestContext({pathParameters: {app: 'app1'}}))

    assert.equal(res.statusCode, 200)
    const resObject = JSON.parse(res.body)

    assert.equal(resObject.targets.length, 1)

    assert.deepNestedInclude(resObject.targets[0], {
      uuid: 'target1',
      name: 'target1',
      appKey: 'app1',
      status: 'AVAILABLE',
      loadAutomatically: false,
      type: 'PLANAR',
      geometry: {top: 1},
      metadata: null,
      metadataIsJson: true,
    })
  })
  it('returns static image data', async () => {
    const res = await handleTargetsListGet(withRequestContext({pathParameters: {app: 'app4'}}))
    assert.equal(res.statusCode, 200)
    const resObject = JSON.parse(res.body)
    assert.equal(resObject.targets.length, 1)
    assert.deepNestedInclude(resObject.targets[0], {
      uuid: 'target4',
      name: 'target4',
      appKey: 'app4',
      status: 'AVAILABLE',
      loadAutomatically: false,
      type: 'PLANAR',
      geometry: {
        staticOrientation: {
          rollAngle: 90,
          pitchAngle: 90,
        },
      },
      metadata: null,
      metadataIsJson: true,
    })
  })
  it('handles status and conical geometry correctly', async () => {
    const res = await handleTargetsListGet(withRequestContext({pathParameters: {app: 'app2'}}))

    assert.equal(res.statusCode, 200)
    const resObject = JSON.parse(res.body)

    assert.equal(resObject.targets.length, 2)

    const expectedTarget2 = {
      uuid: 'target2',
      name: 'target2',
      appKey: 'app2',
      status: 'AVAILABLE',
      loadAutomatically: true,
      type: 'PLANAR',
      geometry: {top: 2},
      metadata: 'this is not json',
      metadataIsJson: false,
    }

    const expectedTarget3 = {
      uuid: 'target3',
      name: 'target3',
      appKey: 'app2',
      type: 'CONICAL',
      status: 'TAKEN_DOWN',
      loadAutomatically: false,
      geometry: {
        topRadius: 200,
        bottomRadius: 1000,
        top: 0,
        left: 0,
        width: 50,
        height: 100,
        originalHeight: 200,
        originalWidth: 300,
        isRotated: true,
        arcAngle: 90,
        coniness: 2,
        inputMode: 'BASIC',
      },
      metadata: null,
      metadataIsJson: true,
    }

    if (resObject.targets[0].name === 'target2') {
      assert.deepNestedInclude(resObject.targets[0], expectedTarget2)
      assert.deepNestedInclude(resObject.targets[1], expectedTarget3)
    } else {
      assert.deepNestedInclude(resObject.targets[0], expectedTarget3)
      assert.deepNestedInclude(resObject.targets[1], expectedTarget2)
    }
  })

  it('returns an empty array for an app with no targets', async () => {
    const res = await handleTargetsListGet(withRequestContext({pathParameters: {app: 'app3'}}))
    assert.equal(res.statusCode, 200)
    const resObject = JSON.parse(res.body)
    assert.deepNestedInclude(resObject, {targets: []})
  })
  it('rejects nonexistent app with 404', async () => {
    const res = await handleTargetsListGet(withRequestContext({pathParameters: {app: 'app0'}}))
    assert.equal(res.statusCode, 404)
  })
  it('paginates a list of 2 image targets (asc)', async () => {
    const res = await handleTargetsListGet(withRequestContext({
      pathParameters: {app: 'app2'},
      ...makeQueryParameters({
        by: ['created'],
        dir: ['asc'],
        limit: ['1'],
      }),
    }))
    assert.equal(res.statusCode, 200)
    const resObject = JSON.parse(res.body)
    assert.hasAllKeys(resObject, ['targets', 'continuationToken'])
    assert.equal(resObject.targets.length, 1)

    const res2 = await handleTargetsListGet(withRequestContext({
      pathParameters: {app: 'app2'},
      ...makeQueryParameters({
        continuation: [resObject.continuationToken],
      }),
    }))
    assert.equal(res2.statusCode, 200)
    const resObject2 = JSON.parse(res2.body)
    assert.hasAllKeys(resObject2, ['targets'])
    assert.equal(resObject2.targets.length, 1)

    assert.notDeepEqual(resObject.targets, resObject2.targets)
  })
  it('paginates a list of 2 image targets (desc)', async () => {
    // desc
    const res = await handleTargetsListGet(withRequestContext({
      pathParameters: {app: 'app2'},
      ...makeQueryParameters({
        by: ['created'],
        dir: ['desc'],
        limit: ['1'],
      }),
    }))
    assert.equal(res.statusCode, 200)
    const resObject = JSON.parse(res.body)
    assert.hasAllKeys(resObject, ['targets', 'continuationToken'])
    assert.equal(resObject.targets.length, 1)

    const res2 = await handleTargetsListGet(withRequestContext({
      pathParameters: {app: 'app2'},
      ...makeQueryParameters({
        continuation: [resObject.continuationToken],
      }),
    }))
    assert.equal(res2.statusCode, 200)
    const resObject2 = JSON.parse(res2.body)
    assert.hasAllKeys(resObject2, ['targets'])
    assert.equal(resObject2.targets.length, 1)
  })
  it('404 on unprivileged request', async () => {
    const res = await handleTargetsListGet({
      pathParameters: {app: 'lots-of-targets'},
      ...makeRequestContext(false, {apiKey: 'bad-api-key'}),
      ...makeQueryParameters({
        by: ['created'],
        dir: ['asc'],
        limit: ['8'],
      }),
    })
    assert.equal(res.statusCode, 404)
  })
  it('paginates many targets (authenticated)', async () => {
    const res = await handleTargetsListGet({
      pathParameters: {app: 'lots-of-targets'},
      ...makeRequestContext(false, {apiKey: 'test-api-key'}),
      ...makeQueryParameters({
        by: ['created'],
        dir: ['asc'],
        limit: ['8'],
      }),
    })
    assert.equal(res.statusCode, 200)
    const resObject = JSON.parse(res.body)
    assert.hasAllKeys(resObject, ['targets', 'continuationToken'])
    assert.equal(resObject.targets.length, 8)

    const res2 = await handleTargetsListGet(withRequestContext({
      pathParameters: {app: 'lots-of-targets'},
      ...makeQueryParameters({
        continuation: [resObject.continuationToken],
      }),
    }))
    assert.equal(res2.statusCode, 200)
    const resObject2 = JSON.parse(res2.body)
    assert.hasAllKeys(resObject2, ['targets'])
    assert.equal(resObject2.targets.length, 1)

    assert.notDeepEqual(resObject.targets, resObject2.targets)
  })
  it('allows privileged requests to fetch all targets', async () => {
    const res = await handleTargetsListGet({
      pathParameters: {app: 'even-more-targets'},
      ...makeRequestContext(true),
    })
    assert.equal(res.statusCode, 200)
    const resObject = JSON.parse(res.body)
    assert.equal(resObject.targets.length, 55)
  })
  it('defaults unprivileged requests to 50 targets', async () => {
    const res = await handleTargetsListGet({
      pathParameters: {app: 'even-more-targets'},
      ...makeRequestContext(false, {apiKey: 'test-api-key'}),
    })
    assert.equal(res.statusCode, 200)
    const resObject = JSON.parse(res.body)
    assert.equal(resObject.targets.length, 50)
  })
})
