// ThreejsModelManager decodes data from the splat file and makes it available to three.js

// We are copying this from c8/pixels/render/shaders
import splatVert from './shaders/vert.txt'
import splatFrag from './shaders/frag.txt'
import {Model} from './dist/model-min'
import * as THREE from './dist/threemodulemin.js'

// We have two implemented strategies for instance data. In the first strategy (SORT_TEXTURE: false)
// the splat data is uploaded in a fixed texture as a material attached to the object. When we
// resort, we push an instance variable which is sorted ids. Thus the data per instance is 1 int.
// In the second strategy (SORT_TEXTURE: ture), the entire block of splat data is used as instance
// data (20 integers per instance).  The total amount of data pushed to the GPU on each resort is
// 20x in this case, but it is also nicely collated per instance so that we don't have to do random
// access texture fetches from the splat texture.
const SORT_TEXTURE = false

const deserializeSplatTexture = (data) => {
  const splatData = new Uint32Array(data.buffer, 4)
  const [numPoints] = splatData
  const sortedIds = splatData.subarray(1, 1 + numPoints)
  if (sortedIds.length !== numPoints) {
    throw new Error('Not enough ids data')
  }
  const textureHeaderStart = 1 + numPoints
  const texture = {
    rows: splatData[textureHeaderStart],
    cols: splatData[textureHeaderStart + 1],
    rowElements: splatData[textureHeaderStart + 2],
  }
  const textureData = splatData.subarray(textureHeaderStart + 3,
    textureHeaderStart + 3 + texture.rows * texture.rowElements)
  if (textureData.length !== texture.rows * texture.rowElements) {
    throw new Error('Not enough texture data')
  }

  // TODO: Get stride from deserialization.
  const interleavedAttributeData = textureData.subarray(0, numPoints * 20)

  return {
    kind: 'splatTexture',
    numPoints,
    sortedIds,
    texture,
    textureData,
    interleavedAttributeData,
  }
}

const deserialize = (data) => {
  const modelType = new Uint32Array(data.buffer, 0, 1)
  if (modelType[0] === 4) {
    return deserializeSplatTexture(data)
  }
  throw new Error('Unsupported model format')
}

const create = ({camera}) => {
  if (!THREE) {
    throw new Error('THREE not found')
  }

  let splat_
  let mesh_
  let points_
  let rayToPix_
  let splatMaterial_
  let geometry_

  // cb when we have loaded the model
  let onLoaded_ = (data) => {}

  const sortTexture = SORT_TEXTURE

  const camera_ = camera
  const modelRoot_ = new THREE.Group()

  const modelManager = Model.ModelManager.create()
  modelManager.configure({
    coordinateSpace: Model.ModelManager.CoordinateSystem.RUB,
    splatResortRadians: 0.18,  // 10 degrees
    sortTexture,
    preferTexture: true,
  })

  const dispose = () => {
    if (splat_) {
      splat_.removeFromParent()
      splat_.dispose()
      splat_ = null
    }
    if (mesh_) {
      mesh_.removeFromParent()
      mesh_.geometry.dispose()
      mesh_.material.dispose()
      mesh_ = null
    }
    if (points_) {
      points_.removeFromParent()
      points_.geometry.dispose()
      points_.material.dispose()
      points_ = null
    }
  }

  const loadSplat = (splat) => {
    // Make instanced buffer
    geometry_ = new THREE.InstancedBufferGeometry().copy(new THREE.PlaneGeometry(2, 2))

    if (sortTexture) {
      // Fake instance attributes, just use the first ID for all instances since these aren't
      // needed by the shader.
      const fakeIds = splat.sortedIds.subarray(0, 1)
      const indexAttribute = new THREE.InstancedInterleavedBuffer(fakeIds, 1, splat.numPoints)
      geometry_.setAttribute(
        'instanceId', new THREE.InterleavedBufferAttribute(indexAttribute, 1, 0)
      )
      // Fake texture, just use a 1x1 texture with zeros, since this isn't needed by the shader.
      const fakeTexture = new THREE.DataTexture(new Uint32Array(4), 1, 1)
      fakeTexture.internalFormat = 'RGBA32UI'
      fakeTexture.format = THREE.RGBAIntegerFormat
      fakeTexture.type = THREE.UnsignedIntType
      fakeTexture.needsUpdate = true

      // Real data for the sortTexture case.
      const instanceAttributes =
        new THREE.InstancedInterleavedBuffer(splat.interleavedAttributeData, 4, 1)
      instanceAttributes.stride = 20  // TODO: Get from deserialization.
      geometry_.setAttribute(
        'positionColor', new THREE.InterleavedBufferAttribute(instanceAttributes, 4, 0)
      )
      geometry_.setAttribute(
        'scaleRotation', new THREE.InterleavedBufferAttribute(instanceAttributes, 4, 4)
      )
      geometry_.setAttribute('shR', new THREE.InterleavedBufferAttribute(instanceAttributes, 4, 8))
      geometry_.setAttribute('shG', new THREE.InterleavedBufferAttribute(instanceAttributes, 4, 12))
      geometry_.setAttribute('shB', new THREE.InterleavedBufferAttribute(instanceAttributes, 4, 16))

      splatMaterial_ = new THREE.RawShaderMaterial({
        uniforms: {
          'splatDataTexture': {value: fakeTexture},
          'raysToPix': {value: rayToPix_},
          'maxInstanceIdForFragment': {value: 0},
          'sortTexture': {value: Number(sortTexture)},
        },
        glslVersion: THREE.GLSL3,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
        vertexShader: splatVert,
        fragmentShader: splatFrag,
      })
    } else {
      // Fake instance attributes, just use the twenty ints for all instances since these aren't
      // needed by the shader.
      const fakeAttributes = splat.interleavedAttributeData.subarray(0, 20)
      const instanceAttributes =
        new THREE.InstancedInterleavedBuffer(fakeAttributes, 4, splat.numPoints)
      instanceAttributes.stride = 20  // TODO: Get from deserialization.
      geometry_.setAttribute(
        'positionColor', new THREE.InterleavedBufferAttribute(instanceAttributes, 4, 0)
      )
      geometry_.setAttribute(
        'scaleRotation', new THREE.InterleavedBufferAttribute(instanceAttributes, 4, 4)
      )
      geometry_.setAttribute('shR', new THREE.InterleavedBufferAttribute(instanceAttributes, 4, 8))
      geometry_.setAttribute('shG', new THREE.InterleavedBufferAttribute(instanceAttributes, 4, 12))
      geometry_.setAttribute('shB', new THREE.InterleavedBufferAttribute(instanceAttributes, 4, 16))

      // Real data for the !sortTexture case.
      const indexAttribute = new THREE.InstancedInterleavedBuffer(splat.sortedIds, 1, 1)
      geometry_.setAttribute(
        'instanceId', new THREE.InterleavedBufferAttribute(indexAttribute, 1, 0)
      )

      const splatTexture =
         new THREE.DataTexture(splat.textureData, splat.texture.cols, splat.texture.rows)
      splatTexture.internalFormat = 'RGBA32UI'
      splatTexture.format = THREE.RGBAIntegerFormat
      splatTexture.type = THREE.UnsignedIntType
      splatTexture.needsUpdate = true

      splatMaterial_ = new THREE.RawShaderMaterial({
        uniforms: {
          'splatDataTexture': {value: splatTexture},
          'raysToPix': {value: rayToPix_},
          'maxInstanceIdForFragment': {value: 0},
          'sortTexture': {value: Number(sortTexture)},
        },
        glslVersion: THREE.GLSL3,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
        vertexShader: splatVert,
        fragmentShader: splatFrag,
      })
    }

    splat_ = new THREE.InstancedMesh(
      geometry_,
      splatMaterial_,
      splat.numPoints
    )

    modelRoot_.add(splat_)

    onLoaded_({numPoints: splat.numPoints})
  }

  const onloaded = ({data}) => {
    dispose()
    const model = deserialize(data)

    if (model.kind === 'splatTexture') {
      loadSplat(model)
      return
    }

    console.error('Unsupported model type', model.kind)  // eslint-disable-line no-console
  }

  const updateSplat = (splat) => {
    if (sortTexture) {
      const attributes = ['positionColor', 'scaleRotation', 'shR', 'shG', 'shB']
      attributes.forEach((attr) => {
        geometry_.attributes[attr].data.array = splat.interleavedAttributeData
        geometry_.attributes[attr].needsUpdate = true
      })
    } else {
      geometry_.attributes.instanceId.data.array = splat.sortedIds
      geometry_.attributes.instanceId.needsUpdate = true
    }
  }

  const onupdated = ({data}) => {
    const model = deserialize(data)

    if (model.kind === 'splatTexture') {
      updateSplat(model)
      return
    }

    // eslint-disable-next-line no-console
    console.error(`No updates expected for model of type '${model.kind}.`)
  }

  modelManager.onloaded(onloaded)
  modelManager.onupdated(onupdated)

  const setModelSrcs = (srcs) => {
    modelManager.loadModel(srcs)
  }

  const setRenderWidthPixels = (width) => {
    const invCam = camera_.projectionMatrixInverse
    const left = new THREE.Vector3(-1, 0, 0).applyMatrix4(invCam)
    const right = new THREE.Vector3(1, 0, 0).applyMatrix4(invCam)
    const raysLeft = left.x / -left.z
    const raysRight = right.x / -right.z
    rayToPix_ = width / (raysRight - raysLeft)
    if (splatMaterial_) {
      // Note that uniforms are refreshed on every frame, so updating the value of the uniform will
      // immediately update the value available to the GLSL code.
      splatMaterial_.uniforms.raysToPix.value = rayToPix_
    }
  }

  const tick = () => {
    // update the render state
    const camMat = camera_.matrixWorld
    const camPos = new THREE.Vector3()
    const camRot = new THREE.Quaternion()
    camMat.decompose(camPos, camRot, new THREE.Vector3())

    const modelMat = modelRoot_.matrixWorld
    const modelPos = new THREE.Vector3()
    const modelRot = new THREE.Quaternion()
    modelMat.decompose(modelPos, modelRot, new THREE.Vector3())

    // Pass threejs camera location to model manager
    modelManager.updateView({
      cameraPos: {
        x: camPos.x,
        y: camPos.y,
        z: camPos.z,
      },
      cameraRot: {
        x: camRot.x,
        y: camRot.y,
        z: camRot.z,
        w: camRot.w,
      },
      modelPos: {
        x: modelPos.x,
        y: modelPos.y,
        z: modelPos.z,
      },
      modelRot: {
        x: modelRot.x,
        y: modelRot.y,
        z: modelRot.z,
        w: modelRot.w,
      },
    })
  }

  // Callbacks when user change configs
  const numCounts = (ev) => {
    if (splat_) {
      splat_.count = ev.value
    }
  }

  const maxInstanceIdForFragment = (ev) => {
    if (splatMaterial_) {
      splatMaterial_.uniforms.maxInstanceIdForFragment = {value: ev.value}
      splatMaterial_.uniformsNeedUpdate = true
    }
  }

  const onChange = {
    numCounts,
    maxInstanceIdForFragment,
  }

  const setOnLoaded = (cb) => {
    onLoaded_ = cb
  }

  return {
    dispose,
    model: () => modelRoot_,
    setModelSrcs,
    setRenderWidthPixels,
    setOnLoaded,
    tick,
    onChange,
  }
}

const ThreejsModelManager = {
  create,
}

export {
  ThreejsModelManager,
}
