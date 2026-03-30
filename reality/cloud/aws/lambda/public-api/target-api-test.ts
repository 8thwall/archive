// @attr(npm_rule = "@npm-public-api//:npm-public-api")
// @attr(externalize_npm = True)

import {describe, it, assert, afterEach, before, beforeEach} from '@nia/bzl/js/chai-js'

import {Sequelize} from 'sequelize'
import {v4 as uuidv4} from 'uuid'
import fs from 'fs'

import {makeRequestContext} from './test/common'
import * as s3 from './s3'
import * as models from './models'
import {initializeModels} from './models/init'
import {handleTargetGet, handleTargetDelete, handleTargetPatch} from './target'
import {Images} from './test/images'

const target1 = uuidv4()
const target2 = uuidv4()
const target3 = uuidv4()
const target4 = uuidv4()
const target5 = uuidv4()
const target6 = uuidv4()
const target7 = uuidv4()
const target8 = uuidv4()
const target9 = uuidv4()
const target10 = uuidv4()
const target11 = uuidv4()
const target12 = uuidv4()
const target13 = uuidv4()
const target14 = uuidv4()
const target15 = uuidv4()
const target16 = uuidv4()

const DEFAULT_IMAGE = Images.target

const assertValidCdnUrl = (url) => {
  if (typeof url !== 'string' || !url.startsWith('https://cdn.8thwall.com/image-target/')) {
    throw new Error(`Invalid CDN URL: ${url}`)
  }
}

const registerS3 = async (imagePath = DEFAULT_IMAGE) => {
  s3.register({
    putObject: async () => {},
    // @ts-ignore
    getObject: async () => ({
      $metadata: {},
      Body: {transformToByteArray: async () => fs.readFileSync(imagePath)},
      ContentType: 'image/jpeg',
    }),
  })
}

describe('Target GET', () => {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  })

  before(() => {
    models.register(initializeModels(sequelize))
  })
  beforeEach(async () => {
    await sequelize.sync()
    const {Account, App, ImageTarget} = models.use()

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

    await ImageTarget.bulkCreate([{
      uuid: target1,
      name: 'target1',
      AppUuid: 'app1',
      type: 'PLANAR',
      status: 'DRAFT',
      metadata: JSON.stringify({
        height: 640,
        isRotated: false,
        left: 0,
        originalHeight: 640,
        originalWidth: 480,
        top: 0,
        width: 480,
      }),
      originalImagePath: 'image-target/account1/random-uuid',
      imagePath: 'image-target/account1/random-uuid',
      luminanceImagePath: 'image-target/account1/random-uuid',
      thumbnailImagePath: 'image-target/account1/random-uuid',
      geometryTexturePath: 'image-target/account1/random-uuid',
    }])
  })
  afterEach(async () => {
    await sequelize.drop()
  })
  it('can get an image target', async () => {
    const request = {
      httpMethod: 'GET',
      pathParameters: {target: target1},
      ...makeRequestContext(),
    }

    const res = await handleTargetGet(request)

    assert.equal(res.statusCode, 200)

    const target = JSON.parse(res.body)

    assert.deepInclude(target, {
      uuid: target1,
      name: 'target1',
      appKey: 'app1',
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
      originalImageUrl: 'https://cdn.8thwall.com/image-target/account1/random-uuid',
      imageUrl: 'https://cdn.8thwall.com/image-target/account1/random-uuid',
      thumbnailImageUrl: 'https://cdn.8thwall.com/image-target/account1/random-uuid',
      geometryTextureUrl: 'https://cdn.8thwall.com/image-target/account1/random-uuid',
    })
  })
  it('returns 404 if target does not exist', async () => {
    const request = {
      httpMethod: 'GET',
      pathParameters: {target: target2},
      ...makeRequestContext(),
    }
    const res = await handleTargetGet(request)

    assert.equal(res.statusCode, 404)
  })
  it('returns 400 if target UUID is invalid', async () => {
    const request = {
      httpMethod: 'GET',
      pathParameters: {target: 'not-a-uuid'},
      ...makeRequestContext(),
    }
    const res = await handleTargetGet(request)

    assert.equal(res.statusCode, 400)
  })
})

const FLAT_METADATA = JSON.stringify({
  top: 0,
  left: 0,
  width: 480,
  height: 640,
  originalWidth: 1000,
  originalHeight: 1000,
})

const FLAT_STATIC_METADATA = JSON.stringify({
  top: 0,
  left: 0,
  width: 480,
  height: 640,
  originalWidth: 1000,
  originalHeight: 1000,
  staticOrientation: {
    rollAngle: 90,
    pitchAngle: 90,
  },
})

const CYLINDER_METADATA = JSON.stringify({
  top: 0,
  left: 0,
  width: 480,
  height: 640,
  originalWidth: 2000,
  originalHeight: 1000,
  cylinderCircumferenceTop: 100,
  cylinderCircumferenceBottom: 100,
  targetCircumferenceTop: 50,
  cylinderSideLength: 75,
  inputMode: 'BASIC',
  coniness: 0,
  arcAngle: 180,
})

const CONICAL_METADATA = JSON.stringify({
  top: 0,
  left: 0,
  width: 480,
  height: 640,
  originalWidth: 2000,
  originalHeight: 1000,
  isRotated: false,
  cylinderCircumferenceTop: 100,
  cylinderCircumferenceBottom: 50,
  targetCircumferenceTop: 50,
  cylinderSideLength: 25,
  topRadius: 2000,
  bottomRadius: 1000,
  arcAngle: 180,
  coniness: Math.log2(2000 / 1000),
  inputMode: 'BASIC',
})

const FEZ_METADATA = JSON.stringify({
  top: 0,
  left: 0,
  width: 480,
  height: 640,
  originalWidth: 1000,
  originalHeight: 2000,
  isRotated: true,
  cylinderCircumferenceTop: 100,
  cylinderCircumferenceBottom: 300,
  targetCircumferenceTop: 50,
  cylinderSideLength: 75,
  topRadius: -3000,
  bottomRadius: 1000,
  arcAngle: 180,
  coniness: -Math.log2(3000 / 1000),
  inputMode: 'BASIC',
})

const LARGE_FLAT_METADATA = JSON.stringify({
  top: 0,
  left: 0,
  width: 480,
  height: 640,
  isRotated: false,
  originalWidth: 1369,
  originalHeight: 2048,
})

const LARGE_FLAT_STATIC_METADATA = JSON.stringify({
  top: 0,
  left: 0,
  width: 480,
  height: 640,
  isRotated: false,
  originalWidth: 1369,
  originalHeight: 2048,
  staticOrientation: {
    rollAngle: 90,
    pitchAngle: 90,
  },
})

const LARGE_CYLINDER_METADATA = JSON.stringify({
  top: 0,
  left: 0,
  width: 480,
  height: 640,
  isRotated: false,
  originalWidth: 1369,
  originalHeight: 2048,
  cylinderCircumferenceTop: 100,
  cylinderCircumferenceBottom: 100,
  targetCircumferenceTop: 50,
  cylinderSideLength: 75,
  inputMode: 'BASIC',
  coniness: 0,
  arcAngle: 180,
})

const LARGE_ROTATED_METADATA = JSON.stringify({
  top: 0,
  left: 0,
  width: 480,
  height: 640,
  isRotated: true,
  originalWidth: 1369,
  originalHeight: 2048,
  cylinderCircumferenceTop: 100,
  cylinderCircumferenceBottom: 100,
  targetCircumferenceTop: 50,
  cylinderSideLength: 75,
  inputMode: 'BASIC',
  coniness: 0,
  arcAngle: 180,
})

const IMAGE_CONICAL_METADATA = JSON.stringify({
  top: 0,
  left: 0,
  width: 480,
  height: 640,
  isRotated: false,
  originalWidth: 2048,
  originalHeight: 728,
  cylinderCircumferenceTop: 100,
  cylinderCircumferenceBottom: 46.67,
  targetCircumferenceTop: 50,
  cylinderSideLength: 17.77,
  inputMode: 'BASIC',
  coniness: 1.0995356735509143,
  arcAngle: 180,
  topRadius: 1500,
  bottomRadius: 700,
})

const IMAGE_CONICAL_ROTATED_METADATA = JSON.stringify({
  top: 0,
  left: 0,
  width: 480,
  height: 640,
  isRotated: true,
  originalWidth: 728,
  originalHeight: 2048,
  cylinderCircumferenceTop: 100,
  cylinderCircumferenceBottom: 46.67,
  targetCircumferenceTop: 50,
  cylinderSideLength: 17.77,
  inputMode: 'BASIC',
  coniness: 1.0995356735509143,
  arcAngle: 180,
  topRadius: 1500,
  bottomRadius: 700,
})

describe('Target PATCH', () => {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  })

  before(() => {
    models.register(initializeModels(sequelize))
  })
  beforeEach(async () => {
    await sequelize.sync()
    const {Account, App, ImageTarget} = models.use()

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
    }, {
      uuid: 'app2',
      AccountUuid: 'account1',
      name: 'app2',
      appKey: 'app2',
      status: 'ENABLED',
    }])

    await ImageTarget.bulkCreate([{
      uuid: target1,
      name: 'target1',
      AppUuid: 'app1',
      status: 'DRAFT',
      type: 'PLANAR',
      metadata: FLAT_METADATA,
      userMetadata: null,
      userMetadataIsJson: true,
    }, {
      uuid: target2,
      name: 'targets2',
      AppUuid: 'app2',
      status: 'ENABLED',
      type: 'PLANAR',
      metadata: FLAT_METADATA,
      userMetadata: 'this is not json',
      userMetadataIsJson: false,
    }, {
      uuid: target3,
      name: 'target3',
      AppUuid: 'app2',
      type: 'PLANAR',
      status: 'ENABLED',
      metadata: FLAT_METADATA,
      userMetadata: null,
      userMetadataIsJson: true,
    }, {
      uuid: target4,
      name: 'target4',
      AppUuid: 'app2',
      type: 'PLANAR',
      status: 'ENABLED',
      metadata: FLAT_METADATA,
      userMetadata: null,
      userMetadataIsJson: true,
    }, {
      uuid: target5,
      name: 'target5',
      AppUuid: 'app2',
      type: 'PLANAR',
      status: 'ENABLED',
      metadata: FLAT_METADATA,
      userMetadata: null,
      userMetadataIsJson: true,
    }, {
      uuid: target6,
      name: 'target6',
      AppUuid: 'app2',
      type: 'PLANAR',
      status: 'ENABLED',
      metadata: FLAT_METADATA,
      userMetadata: null,
      userMetadataIsJson: true,
    }, {
      uuid: target7,
      name: 'target7',
      AppUuid: 'app2',
      type: 'CYLINDER',
      status: 'DRAFT',
      metadata: CYLINDER_METADATA,
      userMetadata: null,
      userMetadataIsJson: true,
    }, {
      uuid: target8,
      name: 'target8',
      AppUuid: 'app2',
      type: 'CONICAL',
      status: 'DRAFT',
      metadata: CONICAL_METADATA,
      userMetadata: null,
      userMetadataIsJson: true,
    }, {
      uuid: target9,
      name: 'target9',
      AppUuid: 'app2',
      type: 'CONICAL',
      status: 'DRAFT',
      metadata: FEZ_METADATA,
      userMetadata: null,
      userMetadataIsJson: true,
    }, {
      uuid: target10,
      name: 'target10',
      AppUuid: 'app2',
      type: 'PLANAR',
      status: 'DRAFT',
      metadata: LARGE_FLAT_METADATA,
      userMetadata: null,
      userMetadataIsJson: true,
      originalImagePath: 'image-target/account1/random-uuid',
      imagePath: 'image-target/account1/random-uuid',
      luminanceImagePath: 'image-target/account1/random-uuid',
      thumbnailImagePath: 'image-target/account1/random-uuid',
      geometryTexturePath: 'image-target/account1/random-uuid',
    }, {
      uuid: target11,
      name: 'target11',
      AppUuid: 'app2',
      type: 'CYLINDER',
      status: 'DRAFT',
      metadata: LARGE_CYLINDER_METADATA,
      userMetadata: null,
      userMetadataIsJson: true,
      originalImagePath: 'image-target/account1/random-uuid',
      imagePath: 'image-target/account1/random-uuid',
      luminanceImagePath: 'image-target/account1/random-uuid',
      thumbnailImagePath: 'image-target/account1/random-uuid',
      geometryTexturePath: 'image-target/account1/random-uuid',
    }, {
      uuid: target12,
      name: 'target12',
      AppUuid: 'app2',
      type: 'CONICAL',
      status: 'DRAFT',
      metadata: IMAGE_CONICAL_METADATA,
      userMetadata: null,
      userMetadataIsJson: true,
      originalImagePath: 'image-target/account1/random-uuid',
      imagePath: 'image-target/account1/random-uuid',
      luminanceImagePath: 'image-target/account1/random-uuid',
      thumbnailImagePath: 'image-target/account1/random-uuid',
      geometryTexturePath: 'image-target/account1/random-uuid',
    }, {
      uuid: target13,
      name: 'target13',
      AppUuid: 'app2',
      type: 'CONICAL',
      status: 'DRAFT',
      metadata: IMAGE_CONICAL_ROTATED_METADATA,
      userMetadata: null,
      userMetadataIsJson: true,
      originalImagePath: 'image-target/account1/random-uuid',
      imagePath: 'image-target/account1/random-uuid',
      luminanceImagePath: 'image-target/account1/random-uuid',
      thumbnailImagePath: 'image-target/account1/random-uuid',
      geometryTexturePath: 'image-target/account1/random-uuid',
    }, {
      uuid: target14,
      name: 'target14',
      AppUuid: 'app2',
      type: 'CYLINDER',
      status: 'DRAFT',
      metadata: LARGE_ROTATED_METADATA,
      userMetadata: null,
      userMetadataIsJson: true,
      originalImagePath: 'image-target/account1/random-uuid',
      imagePath: 'image-target/account1/random-uuid',
      luminanceImagePath: 'image-target/account1/random-uuid',
      thumbnailImagePath: 'image-target/account1/random-uuid',
      geometryTexturePath: 'image-target/account1/random-uuid',
    }, {
      uuid: target15,
      name: 'target15',
      AppUuid: 'app2',
      type: 'PLANAR',
      status: 'DRAFT',
      metadata: FLAT_STATIC_METADATA,
      userMetadata: null,
      userMetadataIsJson: true,
      originalImagePath: 'image-target/account1/random-uuid',
      imagePath: 'image-target/account1/random-uuid',
      luminanceImagePath: 'image-target/account1/random-uuid',
      thumbnailImagePath: 'image-target/account1/random-uuid',
      geometryTexturePath: 'image-target/account1/random-uuid',
    }, {
      uuid: target16,
      name: 'target16',
      AppUuid: 'app2',
      type: 'PLANAR',
      status: 'DRAFT',
      metadata: LARGE_FLAT_STATIC_METADATA,
      userMetadata: null,
      userMetadataIsJson: true,
      originalImagePath: 'image-target/account1/random-uuid',
      imagePath: 'image-target/account1/random-uuid',
      luminanceImagePath: 'image-target/account1/random-uuid',
      thumbnailImagePath: 'image-target/account1/random-uuid',
      geometryTexturePath: 'image-target/account1/random-uuid',
    }])
  })
  afterEach(async () => {
    await sequelize.drop()
  })
  it('updates an image target name', async () => {
    const request = {
      httpMethod: 'PATCH',
      pathParameters: {target: target1},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name: 'new name'}),
      ...makeRequestContext(),
    }

    const res = await handleTargetPatch(request)

    assert.equal(res.statusCode, 200)
    assert.equal('new name', JSON.parse(res.body).name)
  })
  it('rejects a name that is already used', async () => {
    const request = {
      httpMethod: 'PATCH',
      pathParameters: {target: target5},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name: 'target6'}),
      ...makeRequestContext(),
    }

    const res = await handleTargetPatch(request)

    assert.equal(res.statusCode, 400)
  })
  it('accepts setting it to the current name', async () => {
    const request = {
      httpMethod: 'PATCH',
      pathParameters: {target: target5},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name: 'target5'}),
      ...makeRequestContext(),
    }

    const res = await handleTargetPatch(request)

    assert.equal(res.statusCode, 200)
  })
  it('updates user metadata', async () => {
    const metadataString = JSON.stringify({my: 'metadata'})

    const request = {
      httpMethod: 'PATCH',
      pathParameters: {target: target1},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({metadata: metadataString}),
      ...makeRequestContext(),
    }

    const res = await handleTargetPatch(request)

    const targetResponse = JSON.parse(res.body)

    assert.equal(res.statusCode, 200)
    assert.equal(metadataString, targetResponse.metadata)
  })
  it('rejects invalid JSON metadata', async () => {
    const metadataString = '{"not valid'

    const request = {
      httpMethod: 'PATCH',
      pathParameters: {target: target1},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({metadata: metadataString}),
      ...makeRequestContext(),
    }

    const res = await handleTargetPatch(request)

    assert.equal(res.statusCode, 400)
  })
  it('permits non-JSON metadata if metadataIsJson is already false', async () => {
    const metadataString = '{"not valid'

    const request = {
      httpMethod: 'PATCH',
      pathParameters: {target: target2},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({metadata: metadataString}),
      ...makeRequestContext(),
    }

    const res = await handleTargetPatch(request)
    assert.equal(res.statusCode, 200)
  })
  it('permits non JSON metadata if metadataIsJson provided as false', async () => {
    const metadataString = '{"not valid'

    const request = {
      httpMethod: 'PATCH',
      pathParameters: {target: target1},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({metadata: metadataString, metadataIsJson: false}),
      ...makeRequestContext(),
    }

    const res = await handleTargetPatch(request)
    assert.equal(res.statusCode, 200)
  })
  it('can update loadAutomatically', async () => {
    const request = {
      httpMethod: 'PATCH',
      pathParameters: {target: target1},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({loadAutomatically: true}),
      ...makeRequestContext(),
    }

    const res = await handleTargetPatch(request)

    assert.equal(res.statusCode, 200)
    assert.equal(JSON.parse(res.body).loadAutomatically, true)
  })
  it('updates metadata correctly when changing cylinderCircumferenceTop for cylinder', async () => {
    const request = {
      httpMethod: 'PATCH',
      pathParameters: {target: target7},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({geometry: {cylinderCircumferenceTop: 200}}),
      ...makeRequestContext(),
    }

    const res = await handleTargetPatch(request)

    assert.equal(res.statusCode, 200)

    const targetResponse = JSON.parse(res.body)

    assert.include(targetResponse.geometry, {
      cylinderCircumferenceTop: 200,
      cylinderCircumferenceBottom: 200,
      arcAngle: 90,
      coniness: 0,
    })
  })
  it('updates metadata correctly when changing targetCircumferenceTop for cylinder', async () => {
    const request = {
      httpMethod: 'PATCH',
      pathParameters: {target: target7},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({geometry: {targetCircumferenceTop: 25}}),
      ...makeRequestContext(),
    }

    const res = await handleTargetPatch(request)

    assert.equal(res.statusCode, 200)

    const targetResponse = JSON.parse(res.body)

    assert.include(targetResponse.geometry, {
      targetCircumferenceTop: 25,
      cylinderSideLength: 12.5,
      arcAngle: 90,
      coniness: 0,
    })
  })
  it('updates metadata correctly when adding and changing unit for cylinder', async () => {
    const request = {
      httpMethod: 'PATCH',
      pathParameters: {target: target7},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({geometry: {unit: 'mm'}}),
      ...makeRequestContext(),
    }
    const res = await handleTargetPatch(request)
    assert.equal(res.statusCode, 200)

    const targetResponse = JSON.parse(res.body)
    assert.include(targetResponse.geometry, {
      targetCircumferenceTop: 50,
      cylinderSideLength: 25,
      arcAngle: 180,
      coniness: 0,
      unit: 'mm',
    })

    const request2 = {
      httpMethod: 'PATCH',
      pathParameters: {target: target7},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({geometry: {unit: 'in'}}),
      ...makeRequestContext(),
    }
    const res2 = await handleTargetPatch(request2)
    assert.equal(res2.statusCode, 200)

    const targetResponse2 = JSON.parse(res2.body)
    assert.include(targetResponse2.geometry, {
      unit: 'in',
    })
  })
  it('updates metadata correctly when changing cylinderCircumferenceTop for cone', async () => {
    const request = {
      httpMethod: 'PATCH',
      pathParameters: {target: target8},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({geometry: {cylinderCircumferenceTop: 150}}),
      ...makeRequestContext(),
    }

    const res = await handleTargetPatch(request)

    assert.equal(res.statusCode, 200)

    const targetResponse = JSON.parse(res.body)

    assert.include(targetResponse.geometry, {
      cylinderCircumferenceTop: 150,
      cylinderCircumferenceBottom: 75,
      arcAngle: 120,
    })
  })
  it('updates metadata correctly when changing targetCircumferenceTop for cone', async () => {
    const request = {
      httpMethod: 'PATCH',
      pathParameters: {target: target8},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({geometry: {targetCircumferenceTop: 75}}),
      ...makeRequestContext(),
    }

    const res = await handleTargetPatch(request)

    assert.equal(res.statusCode, 200)

    const targetResponse = JSON.parse(res.body)

    assert.include(targetResponse.geometry, {
      targetCircumferenceTop: 75,
      cylinderSideLength: 37.5,
      arcAngle: 270,
    })
  })
  it('updates metadata correctly when adding and changing unit for cone', async () => {
    const request = {
      httpMethod: 'PATCH',
      pathParameters: {target: target8},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({geometry: {unit: 'mm'}}),
      ...makeRequestContext(),
    }
    const res = await handleTargetPatch(request)
    assert.equal(res.statusCode, 200)

    const targetResponse = JSON.parse(res.body)
    assert.include(targetResponse.geometry, {
      targetCircumferenceTop: 50,
      cylinderSideLength: 25,
      arcAngle: 180,
      unit: 'mm',
    })

    const request2 = {
      httpMethod: 'PATCH',
      pathParameters: {target: target8},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({geometry: {unit: 'in'}}),
      ...makeRequestContext(),
    }
    const res2 = await handleTargetPatch(request2)
    assert.equal(res2.statusCode, 200)

    const targetResponse2 = JSON.parse(res2.body)
    assert.include(targetResponse2.geometry, {
      unit: 'in',
    })
  })
  it('updates metadata correctly when changing cylinderCircumferenceTop for fez', async () => {
    const request = {
      httpMethod: 'PATCH',
      pathParameters: {target: target9},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({geometry: {cylinderCircumferenceTop: 150}}),
      ...makeRequestContext(),
    }

    const res = await handleTargetPatch(request)

    assert.equal(res.statusCode, 200)

    const targetResponse = JSON.parse(res.body)

    assert.include(targetResponse.geometry, {
      cylinderCircumferenceTop: 150,
      cylinderCircumferenceBottom: 450,
      cylinderSideLength: 75,
      arcAngle: 120,
    })
  })
  it('updates metadata correctly when changing targetCircumferenceTop for fez', async () => {
    const request = {
      httpMethod: 'PATCH',
      pathParameters: {target: target9},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({geometry: {targetCircumferenceTop: 75}}),
      ...makeRequestContext(),
    }

    const res = await handleTargetPatch(request)

    assert.equal(res.statusCode, 200)

    const targetResponse = JSON.parse(res.body)

    assert.include(targetResponse.geometry, {
      targetCircumferenceTop: 75,
      cylinderSideLength: 75 * 1.5,
      arcAngle: 270,
    })
  })
  it('rejects invalid input with 400', async () => {
    const patchTarget = (uuid, body) => handleTargetPatch({
      httpMethod: 'PATCH',
      pathParameters: {target: uuid},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body),
      ...makeRequestContext(),
    })

    const shouldAllReject = [
      await patchTarget('', undefined),
      await patchTarget(target1, {loadAutomatically: 'not-valid'}),
      await patchTarget(target1, {metadataIsJson: 'not-valid'}),
      await patchTarget(target1, {metadata: {hi: 5}}),
      await patchTarget(target1, {type: 'CONICAL'}),
      await patchTarget(target1, {name: ''}),
      await patchTarget(target1, {unknownParameter: 'true'}),
      await patchTarget(target1, {unit: 'mm'}),
      await patchTarget(target1, {geometry: {cylinderCircumferenceTop: 40}}),
      await patchTarget(target1, {geometry: {cylinderCircumferenceBottom: 40}}),
      await patchTarget(target8, {geometry: 'not-valid'}),
      await patchTarget(target8, {geometry: null}),
      await patchTarget(target8, {geometry: {cylinderCircumferenceTop: '40'}}),
      await patchTarget(target8, {geometry: {cylinderCircumferenceBottom: 40}}),
      await patchTarget(target8, {geometry: {unit: 'meter'}}),
      await patchTarget(target8, {geometry: {unit: 40}}),
      await patchTarget(target8, {geometry: {unit: null}}),
      await patchTarget(target8, {geometry: {unit: false}}),
      await patchTarget(target8, {geometry: {unit: 0}}),
      await patchTarget(target1, {name: 'til~de'}),
      await patchTarget(target1, {name: 'char^'}),
      await patchTarget(target1, {name: 'char*'}),
      await patchTarget(target1, {name: 'char;'}),
      await patchTarget(target1, {name: 'char`'}),
      await patchTarget(target1, {name: 'char>'}),
      await patchTarget(target1, {name: 'char<'}),
      await patchTarget(target1, {
        metadata: JSON.stringify(Array.from({length: 2048}, () => 1)),
      }),
      await patchTarget('not-a-uuid', {name: 'valid-name'}),
      await patchTarget(target1, {geometry: {staticOrientation: 'not JSON'}}),
      await patchTarget(target1, {geometry: {staticOrientation: {rollAngle: 0}}}),
      await patchTarget(target1, {geometry: {staticOrientation: {pitchAngle: 0}}}),
      await patchTarget(target1, {geometry: {staticOrientation: {rollAngle: 361, pitchAngle: 0}}}),
      await patchTarget(target1, {geometry: {staticOrientation: {rollAngle: 0, pitchAngle: 361}}}),
      await patchTarget(target1, {
        geometry: {staticOrientation: {rollAngle: 0, pitchAngle: 0, extra: 'something'}},
      }),
    ]

    shouldAllReject.forEach((res) => {
      assert.equal(res.statusCode, 400)
    })
  })

  it('can read Content-Type case-insensitively', async () => {
    const request = {
      httpMethod: 'PATCH',
      pathParameters: {target: target1},
      headers: {'CoNtEnT-tYpE': 'application/json'},
      body: JSON.stringify({loadAutomatically: true}),
      ...makeRequestContext(),
    }

    const res = await handleTargetPatch(request)

    assert.equal(res.statusCode, 200)
  })
  it('updates metadata correctly when changing crop for flat', async () => {
    registerS3(Images.largeRotated)

    const request = {
      httpMethod: 'PATCH',
      pathParameters: {target: target10},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({geometry: {left: 10, top: 20}}),
      ...makeRequestContext(),
    }

    const res = await handleTargetPatch(request)
    assert.equal(res.statusCode, 200)

    const targetResponse = JSON.parse(res.body)
    assert.deepInclude(targetResponse, {
      name: 'target10',
      geometry: {
        left: 10,
        top: 20,
        width: 480,
        height: 640,
        originalWidth: 1369,
        originalHeight: 2048,
        isRotated: false,
      },
      metadata: null,
      metadataIsJson: true,
      loadAutomatically: false,
      status: 'AVAILABLE',
      type: 'PLANAR',
    })

    assertValidCdnUrl(targetResponse.originalImageUrl)
    assertValidCdnUrl(targetResponse.imageUrl)
    assertValidCdnUrl(targetResponse.thumbnailImageUrl)
    assertValidCdnUrl(targetResponse.geometryTextureUrl)
  })
  it('updates metadata correctly when changing crop for static flat', async () => {
    registerS3(Images.largeRotated)

    const request = {
      httpMethod: 'PATCH',
      pathParameters: {target: target16},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({geometry: {left: 10, top: 20}}),
      ...makeRequestContext(),
    }
    const res = await handleTargetPatch(request)
    assert.equal(res.statusCode, 200)
    const targetResponse = JSON.parse(res.body)
    assert.deepInclude(targetResponse, {
      name: 'target16',
      geometry: {
        left: 10,
        top: 20,
        width: 480,
        height: 640,
        originalWidth: 1369,
        originalHeight: 2048,
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
    assertValidCdnUrl(targetResponse.originalImageUrl)
    assertValidCdnUrl(targetResponse.imageUrl)
    assertValidCdnUrl(targetResponse.thumbnailImageUrl)
    assertValidCdnUrl(targetResponse.geometryTextureUrl)
  })
  it('updates metadata correctly when changing image to rotated', async () => {
    registerS3(Images.largeRotated)

    const request = {
      httpMethod: 'PATCH',
      pathParameters: {target: target10},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({geometry: {isRotated: true}}),
      ...makeRequestContext(),
    }

    const res = await handleTargetPatch(request)
    assert.equal(res.statusCode, 200)

    const targetResponse = JSON.parse(res.body)
    assert.deepInclude(targetResponse, {
      name: 'target10',
      geometry: {
        left: 0,
        top: 0,
        width: 480,
        height: 640,
        originalWidth: 2048,
        originalHeight: 1369,
        isRotated: true,
      },
      metadata: null,
      metadataIsJson: true,
      loadAutomatically: false,
      status: 'AVAILABLE',
      type: 'PLANAR',
    })

    assertValidCdnUrl(targetResponse.originalImageUrl)
    assertValidCdnUrl(targetResponse.imageUrl)
    assertValidCdnUrl(targetResponse.thumbnailImageUrl)
    assertValidCdnUrl(targetResponse.geometryTextureUrl)
  })
  it('updates metadata correctly when changing image to not rotated', async () => {
    registerS3(Images.largeRotated)

    const request = {
      httpMethod: 'PATCH',
      pathParameters: {target: target14},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({geometry: {isRotated: false}}),
      ...makeRequestContext(),
    }

    const res = await handleTargetPatch(request)
    assert.equal(res.statusCode, 200)

    const targetResponse = JSON.parse(res.body)
    assert.deepInclude(targetResponse, {
      name: 'target14',
      geometry: {
        left: 0,
        top: 0,
        width: 480,
        height: 640,
        originalWidth: 2048,
        originalHeight: 1369,
        isRotated: false,
        cylinderCircumferenceTop: 100,
        cylinderCircumferenceBottom: 100,
        targetCircumferenceTop: 50,
        cylinderSideLength: Math.round((50 / 2048) * 1369 * 100) / 100,
        coniness: 0,
        arcAngle: 360 * (50 / 100),
        inputMode: 'BASIC',
      },
      metadata: null,
      metadataIsJson: true,
      loadAutomatically: false,
      status: 'AVAILABLE',
      type: 'CYLINDER',
    })

    assertValidCdnUrl(targetResponse.originalImageUrl)
    assertValidCdnUrl(targetResponse.imageUrl)
    assertValidCdnUrl(targetResponse.thumbnailImageUrl)
    assertValidCdnUrl(targetResponse.geometryTextureUrl)
  })

  it('rejects invalid static, roll and pitch values for flat', async () => {
    const patchTarget = (uuid: string, body: Record<string, any>) => handleTargetPatch({
      httpMethod: 'PATCH',
      pathParameters: {target: uuid},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body),
      ...makeRequestContext(),
    })
    registerS3(Images.largeRotated)

    const shouldAllReject = [
      // rollAngle invalid types and out of range
      await patchTarget(target15, {geometry: {staticOrientation: {rollAngle: '0'}}}),
      await patchTarget(target15, {geometry: {staticOrientation: {rollAngle: null}}}),
      await patchTarget(target15, {geometry: {staticOrientation: {rollAngle: 361}}}),
      await patchTarget(target15, {geometry: {staticOrientation: {rollAngle: -1}}}),
      // pitchAngle invalid types and out of range
      await patchTarget(target15, {geometry: {staticOrientation: {pitchAngle: '0'}}}),
      await patchTarget(target15, {geometry: {staticOrientation: {pitchAngle: null}}}),
      await patchTarget(target15, {geometry: {staticOrientation: {pitchAngle: 361}}}),
      await patchTarget(target15, {geometry: {staticOrientation: {pitchAngle: -1}}}),
    ]
    shouldAllReject.forEach((res) => {
      assert.equal(res.statusCode, 400)
    })
  })

  it('rejects staticOrientation for non-flat targets', async () => {
    const patchTarget = (uuid: string, body: Record<string, any>) => handleTargetPatch({
      httpMethod: 'PATCH',
      pathParameters: {target: uuid},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body),
      ...makeRequestContext(),
    })
    registerS3(Images.largeRotated)
    const shouldAllReject = [
      await patchTarget(target11, {geometry: {staticOrientation: {rollAngle: 0, pitchAngle: 0}}}),
      await patchTarget(target12, {geometry: {staticOrientation: {rollAngle: 0, pitchAngle: 0}}}),
      await patchTarget(target13, {geometry: {staticOrientation: {rollAngle: 0, pitchAngle: 0}}}),
      await patchTarget(target14, {geometry: {staticOrientation: {rollAngle: 0, pitchAngle: 0}}}),
    ]
    shouldAllReject.forEach((res) => {
      assert.equal(res.statusCode, 400)
    })
  })

  it('updates metadata correctly when changing staticOrientation',
    async () => {
      registerS3(Images.largeRotated)
      const request = {
        httpMethod: 'PATCH',
        pathParameters: {target: target15},
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          geometry: {
            staticOrientation: {
              rollAngle: 90,
              pitchAngle: 90,
            },
          },
        }),
        ...makeRequestContext(),
      }
      const res = await handleTargetPatch(request)
      assert.equal(res.statusCode, 200)
      const targetResponse = JSON.parse(res.body)
      assert.deepInclude(targetResponse, {
        name: 'target15',
        geometry: {
          top: 0,
          left: 0,
          width: 480,
          height: 640,
          originalWidth: 1000,
          originalHeight: 1000,
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
      assertValidCdnUrl(targetResponse.originalImageUrl)
      assertValidCdnUrl(targetResponse.imageUrl)
      assertValidCdnUrl(targetResponse.thumbnailImageUrl)
      assertValidCdnUrl(targetResponse.geometryTextureUrl)
    })

  it('updates metadata correctly when changing crop and staticOrientation',
    async () => {
      registerS3(Images.largeRotated)

      const request = {
        httpMethod: 'PATCH',
        pathParameters: {target: target16},
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          geometry: {
            left: 10,
            top: 20,
            staticOrientation: {
              rollAngle: 90,
              pitchAngle: 90,
            },
          },
        }),
        ...makeRequestContext(),
      }

      const res = await handleTargetPatch(request)
      assert.equal(res.statusCode, 200)

      const targetResponse = JSON.parse(res.body)
      assert.deepInclude(targetResponse, {
        name: 'target16',
        geometry: {
          left: 10,
          top: 20,
          width: 480,
          height: 640,
          originalWidth: 1369,
          originalHeight: 2048,
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
      assertValidCdnUrl(targetResponse.originalImageUrl)
      assertValidCdnUrl(targetResponse.imageUrl)
      assertValidCdnUrl(targetResponse.thumbnailImageUrl)
      assertValidCdnUrl(targetResponse.geometryTextureUrl)
    })

  it('remove staticOrientation when the staticOrientation is empty', async () => {
    registerS3(Images.largeRotated)

    const request = {
      httpMethod: 'PATCH',
      pathParameters: {target: target15},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({geometry: {staticOrientation: {}}}),
      ...makeRequestContext(),
    }

    const res = await handleTargetPatch(request)
    assert.equal(res.statusCode, 200)

    const targetResponse = JSON.parse(res.body)
    assert.deepInclude(targetResponse, {
      name: 'target15',
      geometry: {
        top: 0,
        left: 0,
        width: 480,
        height: 640,
        originalWidth: 1000,
        originalHeight: 1000,
      },
      metadata: null,
      metadataIsJson: true,
      loadAutomatically: false,
      status: 'AVAILABLE',
      type: 'PLANAR',
    })
    assertValidCdnUrl(targetResponse.originalImageUrl)
    assertValidCdnUrl(targetResponse.imageUrl)
    assertValidCdnUrl(targetResponse.thumbnailImageUrl)
    assertValidCdnUrl(targetResponse.geometryTextureUrl)
  })
  it('updates metadata correctly when changing crop for cylinder', async () => {
    registerS3(Images.largeRotated)

    const request = {
      httpMethod: 'PATCH',
      pathParameters: {target: target11},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({geometry: {left: 10, top: 20, cylinderCircumferenceTop: 150}}),
      ...makeRequestContext(),
    }

    const res = await handleTargetPatch(request)
    assert.equal(res.statusCode, 200)

    const targetResponse = JSON.parse(res.body)
    assert.deepInclude(targetResponse, {
      name: 'target11',
      geometry: {
        left: 10,
        top: 20,
        width: 480,
        height: 640,
        originalWidth: 1369,
        originalHeight: 2048,
        isRotated: false,
        cylinderCircumferenceTop: 150,
        cylinderCircumferenceBottom: 150,
        targetCircumferenceTop: 50,
        cylinderSideLength: Math.round((50 / 1369) * 2048 * 150) / 150,
        coniness: 0,
        arcAngle: 120,
        inputMode: 'BASIC',
      },
      metadata: null,
      metadataIsJson: true,
      loadAutomatically: false,
      status: 'AVAILABLE',
      type: 'CYLINDER',
    })
    assertValidCdnUrl(targetResponse.originalImageUrl)
    assertValidCdnUrl(targetResponse.imageUrl)
    assertValidCdnUrl(targetResponse.thumbnailImageUrl)
    assertValidCdnUrl(targetResponse.geometryTextureUrl)
  })
  it('updates metadata correctly when changing radii and crop for conical', async () => {
    registerS3(Images.largeCone)

    const request = {
      httpMethod: 'PATCH',
      pathParameters: {target: target12},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        geometry: {top: 10, left: 10, width: 600, height: 800, topRadius: 1600, bottomRadius: 640},
      }),
      ...makeRequestContext(),
    }

    const postCropRes = await handleTargetPatch(request)
    assert.equal(postCropRes.statusCode, 200)

    const targetResponse = JSON.parse(postCropRes.body)
    assert.deepInclude(targetResponse, {
      name: 'target12',
      type: 'CONICAL',
      geometry: {
        top: 10,
        left: 10,
        width: 600,
        height: 800,
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

    assertValidCdnUrl(targetResponse.originalImageUrl)
    assertValidCdnUrl(targetResponse.imageUrl)
    assertValidCdnUrl(targetResponse.thumbnailImageUrl)
    assertValidCdnUrl(targetResponse.geometryTextureUrl)
  }).timeout(10000)
  it('updates metadata correctly when changing radii for conical with rotation', async () => {
    registerS3(Images.largeCone)

    const request = {
      httpMethod: 'PATCH',
      pathParameters: {target: target13},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({geometry: {topRadius: 1600, bottomRadius: 640}}),
      ...makeRequestContext(),
    }

    const res = await handleTargetPatch(request)
    assert.equal(res.statusCode, 200)

    const targetResponse = JSON.parse(res.body)
    assert.deepInclude(targetResponse, {
      name: 'target13',
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

    assertValidCdnUrl(targetResponse.originalImageUrl)
    assertValidCdnUrl(targetResponse.imageUrl)
    assertValidCdnUrl(targetResponse.thumbnailImageUrl)
    assertValidCdnUrl(targetResponse.geometryTextureUrl)
  }).timeout(10000)
  it('updates metadata correctly when changing crop and rotation for conical', async () => {
    registerS3(Images.largeCone)

    const request = {
      httpMethod: 'PATCH',
      pathParameters: {target: target12},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({geometry: {topRadius: 1600, bottomRadius: 640, isRotated: true}}),
      ...makeRequestContext(),
    }

    const res = await handleTargetPatch(request)
    assert.equal(res.statusCode, 200)

    const targetResponse = JSON.parse(res.body)
    assert.deepInclude(targetResponse, {
      name: 'target12',
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

    assertValidCdnUrl(targetResponse.originalImageUrl)
    assertValidCdnUrl(targetResponse.imageUrl)
    assertValidCdnUrl(targetResponse.thumbnailImageUrl)
    assertValidCdnUrl(targetResponse.geometryTextureUrl)
  }).timeout(10000)
  it('rejects invalid crop values for conical', async () => {
    const patchTarget = (uuid, body) => handleTargetPatch({
      httpMethod: 'PATCH',
      pathParameters: {target: uuid},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body),
      ...makeRequestContext(),
    })
    registerS3(Images.largeCone)

    const shouldAllReject = [
      await patchTarget(target12, {geometry: {top: 3000}}),
      await patchTarget(target12, {geometry: {left: 3000}}),
      await patchTarget(target12, {geometry: {width: 10}}),
      await patchTarget(target12, {geometry: {height: 1100}}),
      await patchTarget(target12, {geometry: {topRadius: '40'}}),
      await patchTarget(target12, {geometry: {bottomRadius: '40'}}),
      await patchTarget(target12, {geometry: {isRotated: null}}),
      await patchTarget(target12, {geometry: {isRotated: 0}}),
      await patchTarget(target12, {geometry: {isRotated: '40'}}),
    ]
    shouldAllReject.forEach((res) => {
      assert.equal(res.statusCode, 400)
    })
  }).timeout(10000)
  it('rejects invalid crop values for cylindrical', async () => {
    const patchTarget = (uuid, body) => handleTargetPatch({
      httpMethod: 'PATCH',
      pathParameters: {target: uuid},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body),
      ...makeRequestContext(),
    })
    registerS3(Images.largeRotated)

    const shouldAllReject = [
      await patchTarget(target11, {geometry: {topRadius: 40}}),
      await patchTarget(target11, {geometry: {bottomRadius: 40}}),
      await patchTarget(target11, {geometry: {top: 730, isRotated: true}}),
      await patchTarget(target14, {geometry: {top: 730, isRotated: false}}),
    ]
    shouldAllReject.forEach((res) => {
      assert.equal(res.statusCode, 400)
    })
  }).timeout(10000)
  it('rejects invalid crop values for flat', async () => {
    const patchTarget = (uuid, body) => handleTargetPatch({
      httpMethod: 'PATCH',
      pathParameters: {target: uuid},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body),
      ...makeRequestContext(),
    })
    registerS3(Images.largeRotated)

    const shouldAllReject = [
      await patchTarget(target10, {geometry: {topRadius: 40}}),
      await patchTarget(target10, {geometry: {bottomRadius: 40}}),
      await patchTarget(target10, {geometry: {top: '40'}}),
      await patchTarget(target10, {geometry: {left: '40'}}),
      await patchTarget(target10, {geometry: {width: '40'}}),
      await patchTarget(target10, {geometry: {height: '40'}}),
      await patchTarget(target10, {geometry: {top: 2000}}),
      await patchTarget(target10, {geometry: {left: 1000}}),
      await patchTarget(target10, {geometry: {height: 2100}}),
      await patchTarget(target10, {geometry: {width: 1100}}),
      await patchTarget(target10, {geometry: {top: 730, isRotated: true}}),
    ]
    shouldAllReject.forEach((res) => {
      assert.equal(res.statusCode, 400)
    })
  }).timeout(10000)
  it('updating units does not recrop image', async () => {
    const request = {
      httpMethod: 'PATCH',
      pathParameters: {target: target12},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        geometry: {unit: 'in'},
      }),
      ...makeRequestContext(),
    }

    const res = await handleTargetPatch(request)
    assert.equal(res.statusCode, 200)

    const targetResponse = JSON.parse(res.body)

    assert.equal(
      targetResponse.originalImageUrl, 'https://cdn.8thwall.com/image-target/account1/random-uuid'
    )
    assert.equal(
      targetResponse.imageUrl, 'https://cdn.8thwall.com/image-target/account1/random-uuid'
    )
    assert.equal(
      targetResponse.thumbnailImageUrl, 'https://cdn.8thwall.com/image-target/account1/random-uuid'
    )
    assert.equal(
      targetResponse.geometryTextureUrl, 'https://cdn.8thwall.com/image-target/account1/random-uuid'
    )
  })
})

describe('Target PATCH limit', () => {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  })
  const targets: string[] = []
  for (let i = 0; i < 33; i++) {
    targets.push(uuidv4())
  }

  before(() => {
    models.register(initializeModels(sequelize))
  })
  beforeEach(async () => {
    await sequelize.sync()
    const {Account, App, ImageTarget} = models.use()

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

    const imageTargets = [
      {
        uuid: targets[0],
        name: 'target0',
        AppUuid: 'app1',
        status: 'DRAFT',
        type: 'PLANAR',
        metadata: FLAT_METADATA,
        userMetadata: null,
        userMetadataIsJson: true,
      },
    ]
    for (let i = 1; i <= 32; i++) {
      imageTargets.push({
        uuid: targets[i],
        name: `target${i}`,
        AppUuid: 'app1',
        status: 'ENABLED',
        type: 'PLANAR',
        metadata: FLAT_METADATA,
        userMetadata: null,
        userMetadataIsJson: true,
      })
    }

    await ImageTarget.bulkCreate(imageTargets)
  })
  afterEach(async () => {
    await sequelize.drop()
  })
  it('rejects setting loadAutomatically true if too many are loadAutomatically', async () => {
    const request = {
      httpMethod: 'PATCH',
      pathParameters: {target: targets[0]},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({loadAutomatically: true}),
      ...makeRequestContext(),
    }

    const res = await handleTargetPatch(request)
    const {message} = JSON.parse(res.body)

    assert.equal(res.statusCode, 400)
    assert.equal(message, 'Invalid input: Cannot exceed 32 loadAutomatically targets.')
  })
  it('ignores limit if loadAutomatically is already true', async () => {
    const request = {
      httpMethod: 'PATCH',
      pathParameters: {target: targets[32]},
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({loadAutomatically: true}),
      ...makeRequestContext(),
    }

    const res = await handleTargetPatch(request)

    assert.equal(res.statusCode, 200)
  })
})

describe('Target DELETE', () => {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  })

  before(() => {
    models.register(initializeModels(sequelize))
  })
  beforeEach(async () => {
    await sequelize.sync()
    const {Account, App, ImageTarget} = models.use()

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

    await ImageTarget.bulkCreate([{
      uuid: target1,
      name: 'target1',
      AppUuid: 'app1',
      status: 'DRAFT',
    }])
  })
  afterEach(async () => {
    await sequelize.drop()
  })
  it('can delete an image target', async () => {
    const {ImageTarget} = models.use()

    const request = {
      httpMethod: 'DELETE',
      pathParameters: {target: target1},
      ...makeRequestContext(),
    }

    const res = await handleTargetDelete(request)

    assert.equal(res.statusCode, 204)

    const target = await ImageTarget.findOne({where: {name: 'target1'}})

    assert.isNull(target)
  })
  it('returns 404 if target does not exist', async () => {
    const request = {
      httpMethod: 'DELETE',
      pathParameters: {target: target2},
      ...makeRequestContext(),
    }
    const res = await handleTargetDelete(request)

    assert.equal(res.statusCode, 404)
  })
  it('returns 400 if target UUID is invalid', async () => {
    const request = {
      httpMethod: 'DELETE',
      pathParameters: {target: 'not-a-uuid'},
      ...makeRequestContext(),
    }
    const res = await handleTargetDelete(request)

    assert.equal(res.statusCode, 400)
  })
})
