import * as ecs from '@8thwall/ecs'
import {TerrainHeightMap, TerrainManager} from './terrain'

class GrassGenerator {
  constructor({
    planeTextureSize,
    planeSize,
    bladeCount,
    bladeWidth,
    bladeHeight,
    bladeHeightVariation,
    scene,
    grassTexture,
    heightMap,
  }) {
    this.planeTextureSize = planeTextureSize
    this.planeSize = planeSize
    this.bladeCount = bladeCount
    this.bladeWidth = bladeWidth
    this.bladeHeight = bladeHeight
    this.bladeHeightVariation = bladeHeightVariation
    /**
     * @type {TerrainHeightMap} heightMap
     */
    this.heightMap = heightMap
    this.scene = scene
    this.grassMaterial = new GrassMaterial()
    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load(
      grassTexture,
      (texture) => {},
      undefined,
      (err) => {}
    )
    this.grassMaterial.map = texture

    this.mesh = null
  }

  convertRange(val, oldMin, oldMax, newMin, newMax) {
    const newValue =
      ((val - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin
    const range = newMax - newMin
    return ((((newValue - newMin) % range) + range) % range) + newMin
  }

  generateBlade(center, vArrOffset, uv) {
    const MID_WIDTH = this.bladeWidth * 0.5
    const TIP_OFFSET = 0.1
    const height = this.bladeHeight + Math.random() * this.bladeHeightVariation

    const yaw = Math.random() * Math.PI * 2
    const yawUnitVec = new THREE.Vector3(Math.sin(yaw), 0, -Math.cos(yaw))
    const tipBend = Math.random() * Math.PI * 2
    const tipBendUnitVec = new THREE.Vector3(
      Math.sin(tipBend),
      0,
      -Math.cos(tipBend)
    )

    // Find the Bottom Left, Bottom Right, Top Left, Top right, Top Center vertex positions
    const bl = new THREE.Vector3().addVectors(
      center,
      new THREE.Vector3()
        .copy(yawUnitVec)
        .multiplyScalar((this.bladeWidth / 2) * 1)
    )
    const br = new THREE.Vector3().addVectors(
      center,
      new THREE.Vector3()
        .copy(yawUnitVec)
        .multiplyScalar((this.bladeWidth / 2) * -1)
    )
    const tl = new THREE.Vector3().addVectors(
      center,
      new THREE.Vector3().copy(yawUnitVec).multiplyScalar((MID_WIDTH / 2) * 1)
    )
    const tr = new THREE.Vector3().addVectors(
      center,
      new THREE.Vector3().copy(yawUnitVec).multiplyScalar((MID_WIDTH / 2) * -1)
    )
    const tc = new THREE.Vector3().addVectors(
      center,
      new THREE.Vector3().copy(tipBendUnitVec).multiplyScalar(TIP_OFFSET)
    )

    tl.y += height / 2
    tr.y += height / 2
    tc.y += height

    // Vertex Colors
    const black = [0, 0, 0]
    const gray = [0.5, 0.5, 0.5]
    const white = [1.0, 1.0, 1.0]

    const verts = [
      {pos: bl.toArray(), uv, color: black},
      {pos: br.toArray(), uv, color: black},
      {pos: tr.toArray(), uv, color: gray},
      {pos: tl.toArray(), uv, color: gray},
      {pos: tc.toArray(), uv, color: white},
    ]

    const indices = [
      vArrOffset,
      vArrOffset + 1,
      vArrOffset + 2,
      vArrOffset + 2,
      vArrOffset + 4,
      vArrOffset + 3,
      vArrOffset + 3,
      vArrOffset,
      vArrOffset + 2,
    ]

    return {verts, indices}
  }

  generateFieldWithHeightMap() {
    const positions = []
    const uvs = []
    const indices = []
    const colors = []

    let count = 0
    for (
      let x = this.heightMap.minX;
      x <= this.heightMap.maxX;
      x += this.bladeWidth
    ) {
      for (
        let z = this.heightMap.minZ;
        z <= this.heightMap.maxZ;
        z += this.bladeWidth
      ) {
        const VERTEX_COUNT = 5

        const pos = new THREE.Vector3(x, 0, z)
        const height = this.heightMap.getPoint(x, z)
        if (height === null || height <= 0.01) continue

        const uv = [
          this.convertRange(
            pos.x,
            this.heightMap.minX,
            this.heightMap.maxX,
            0,
            1
          ),
          this.convertRange(
            pos.z,
            this.heightMap.minZ,
            this.heightMap.maxZ,
            0,
            1
          ),
        ]

        const blade = this.generateBlade(pos, count * VERTEX_COUNT, uv)
        blade.verts.forEach((vert) => {
          positions.push(vert.pos[0], vert.pos[1] + height, vert.pos[2])
          uvs.push(...vert.uv)
          colors.push(...vert.color)
        })
        blade.indices.forEach(indice => indices.push(indice))
        count++
      }
    }

    const geom = new THREE.BufferGeometry()
    geom.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(positions), 3)
    )
    geom.setAttribute(
      'uv',
      new THREE.BufferAttribute(new Float32Array(uvs), 2)
    )
    geom.setAttribute(
      'color',
      new THREE.BufferAttribute(new Float32Array(colors), 3)
    )
    geom.setIndex(indices)
    geom.computeVertexNormals()

    const mesh = new THREE.Mesh(geom, this.grassMaterial)
    mesh.receiveShadow = true
    this.mesh = mesh
    return mesh
  }

  dispose() {
    this.scene.remove(this.mesh)
  }
}

class GrassMaterial extends THREE.MeshStandardMaterial {
  constructor(props) {
    super({
      side: THREE.DoubleSide,
      ...props,
    })

    this._uniforms = {
      iTime: {
        value: 0,
      },
    }

    this.customProgramCacheKey = () => crypto.randomUUID()

    this.onBeforeCompile = (shader, renderer) => {
      shader.uniforms.iTime = this._uniforms.iTime
      shader.defines.USE_UV = ''
      shader.defines.USE_COLOR = ''

      shader.vertexShader = shader.vertexShader.replace(
        'void main() {',
        /* glsl */ `
        uniform float iTime;
        void main() {`
      )
      shader.vertexShader = shader.vertexShader.replace(
        '#include <morphtarget_vertex>',
        /* glsl */ `#include <morphtarget_vertex>
        float waveSize = 10.0f;
        float tipDistance = 0.3f;
        float centerDistance = 0.1f;
        if (color.x > 0.6f) {
            transformed.x += sin((iTime) + (uv.x * waveSize)) * tipDistance;
        }else if (color.x > 0.0f) {
            transformed.x += sin((iTime) + (uv.x * waveSize)) * centerDistance;
        }
        `
      )
    }
  }

  get time() {
    return this._uniforms.iTime.value
  }

  set time(value) {
    this._uniforms.iTime.value = value
  }
}

let cleanUp = () => {}
/**
 * @type {GrassGenerator} grassInstance
 */
let grassInstance = null

const TerrainGrass = ecs.registerComponent({
  name: 'TerrainGrass',
  schema: {
    // @asset
    grassTexture: ecs.string,
    planeTextureSize: ecs.f32,
    planeSize: ecs.f32,
    bladeCount: ecs.f32,
    bladeWidth: ecs.f32,
    bladeHeight: ecs.f32,
    bladeHeightVariation: ecs.f32,
  },
  schemaDefaults: {
    planeTextureSize: 20,
    planeSize: 50,
    bladeCount: 100_000,
    bladeWidth: 0.2,
    bladeHeight: 0.4,
    bladeHeightVariation: 0.1,
  },
  add: (world, component) => {
    const {
      planeTextureSize,
      planeSize,
      bladeCount,
      bladeWidth,
      bladeHeight,
      bladeHeightVariation,
      grassTexture,
    } = component.schema

    const terrainSet = () => {
      const grassGenerator = new GrassGenerator({
        scene: world.scene,
        grassTexture,
        planeTextureSize,
        planeSize,
        bladeCount,
        bladeWidth,
        bladeHeight,
        bladeHeightVariation,
        heightMap: TerrainManager.heightMap,
      })

      grassInstance = grassGenerator
      grassGenerator.generateFieldWithHeightMap()

      const entityObject = world.three.entityToObject.get(component.eid)

      entityObject.add(grassGenerator.mesh)

      cleanUp = () => {
        world.scene.remove(grassInstance.mesh)
        grassInstance = null
      }
    }

    TerrainManager.addEventListener(
      TerrainManager.events.TerrainHeightMapLoaded,
      terrainSet
    )
  },
  remove: (world, component) => {
    cleanUp()
  },
  tick: () => {
    if (!grassInstance) return
    grassInstance.grassMaterial.time += 0.01
  },
})

export {TerrainGrass as GrassFeild}
