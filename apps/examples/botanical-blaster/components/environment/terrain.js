import * as ecs from '@8thwall/ecs'

export class TerrainHeightMap {
  constructor(mesh, renderer, renderTargetSize = 1024) {
    this.mesh = mesh.clone(true)
    this.renderer = renderer
    this.renderTargetSize = renderTargetSize

    // Calculate the bounds of the mesh
    mesh.geometry.computeBoundingBox()
    const {boundingBox} = mesh.geometry
    this.minX = boundingBox.min.x
    this.maxX = boundingBox.max.x
    this.minZ = boundingBox.min.z
    this.maxZ = boundingBox.max.z
    this.minY = boundingBox.min.y
    this.maxY = boundingBox.max.y
    this.width = this.maxX - this.minX
    this.depth = this.maxZ - this.minZ
    this.heightRange = this.maxY - this.minY

    // Create an orthographic camera
    const orthoSizeX = this.width / 2
    const orthoSizeZ = this.depth / 2
    this.camera = new THREE.OrthographicCamera(
      -orthoSizeX,
      orthoSizeX,
      orthoSizeZ,
      -orthoSizeZ,
      1,
      1000
    )
    this.camera.position.set(
      (this.minX + this.maxX) / 2,
      100,
      (this.minZ + this.maxZ) / 2
    )
    this.camera.lookAt(
      (this.minX + this.maxX) / 2,
      0,
      (this.minZ + this.maxZ) / 2
    )

    // Create a render target with float texture
    this.renderTarget = new THREE.WebGLRenderTarget(
      this.renderTargetSize,
      this.renderTargetSize,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
      }
    )

    // Create a scene and add the mesh
    this.scene = new THREE.Scene()
    this.scene.add(this.mesh)

    // Create the custom shader material
    this.createShaderMaterial()

    // Render the height map
    this.renderHeightMap()

    // Extract height data from the render target
    this.extractHeightData()
  }

  createShaderMaterial() {
    const vertexShader = `
      varying float vHeight;
      void main() {
        vHeight = position.y;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      varying float vHeight;
      void main() {
    //    float normalizedHeight = (vHeight - ${this.minY}) / ${this.heightRange};
        gl_FragColor = vec4(vHeight, vHeight, vHeight, 1.0);
      }
    `

    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
    })

    this.mesh.material = shaderMaterial
  }

  renderHeightMap() {
    this.renderer.setRenderTarget(this.renderTarget)
    this.renderer.render(this.scene, this.camera)
    this.renderer.setRenderTarget(null)
  }

  extractHeightData() {
    const pixelBuffer = new Float32Array(
      this.renderTargetSize * this.renderTargetSize * 4
    )
    this.renderer.readRenderTargetPixels(
      this.renderTarget,
      0,
      0,
      this.renderTargetSize,
      this.renderTargetSize,
      pixelBuffer
    )

    this.heightMap = []
    for (let y = 0; y < this.renderTargetSize; y++) {
      const row = []
      for (let x = 0; x < this.renderTargetSize; x++) {
        const index = ((this.renderTargetSize - y - 1) * this.renderTargetSize + x) * 4
        //   const height = pixelBuffer[index] * this.heightRange + this.minY;
        const height = pixelBuffer[index]
        row.push(height)
      }
      this.heightMap.push(row)
    }
  }

  getPoint(x, z) {
    // Map world coordinates to height map indices
    const xIndex = Math.floor(
      ((x - this.minX) / this.width) * this.renderTargetSize
    )
    const zIndex = Math.floor(
      ((z - this.minZ) / this.depth) * this.renderTargetSize
    )

    if (
      xIndex >= 0 &&
      xIndex < this.renderTargetSize &&
      zIndex >= 0 &&
      zIndex < this.renderTargetSize
    ) {
      return this.heightMap[zIndex][xIndex]
    }
    return null
  }

  visualizeTerrainWithSpheres(scene) {
    const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16)
    const sphereMaterial = new THREE.MeshBasicMaterial({color: 0xff0000})

    for (let x = this.minX; x <= this.maxX; x += 1) {
      for (let z = this.minZ; z <= this.maxZ; z += 1) {
        const height = this.getPoint(x, z)
        if (height !== null) {
          const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
          sphere.position.set(x, height, z)
          scene.add(sphere)
        }
      }
    }
  }
}

export const TerrainManagerEvents = Object.freeze({
  TerrainHeightMapLoaded: 'terrain-height-mapLoaded',
})

class TerrainManagerClass extends EventTarget {
  constructor() {
    super()
    /**
     * @type {TerrainManagerEvents} events
     */
    this.events = TerrainManagerEvents

    /**
     * @type {TerrainHeightMap} heightMap
     */
    this.heightMap = null
  }

  /**
   * @param {TerrainHeightMap} heightMap
   */
  setTerrain(heightMap) {
    this.heightMap = heightMap
    this.dispatchEvent(new CustomEvent(this.events.TerrainHeightMapLoaded))
  }
}

export const TerrainManager = new TerrainManagerClass()

const TerrainComponent = ecs.registerComponent({
  name: 'Terrain',
  schema: {
    terrianObjectName: ecs.string,
  },
  add: (world, component) => {
    const {terrianObjectName} = component.schema

    /**
     *
     * @type {import("three").Object3D} entityObject
     */
    const entityObject = world.three.entityToObject.get(component.eid)

    /**
     * @type {import("three").Mesh} entityObject
     */
    let terrainObject = null

    const {scene} = world

    let attempts = 0
    const inte = setInterval(() => {
      entityObject.traverse((object) => {
        if (terrainObject || !(object instanceof THREE.Mesh)) return
        if (object.name == terrianObjectName) {
          terrainObject = object
        }
      })

      if (!terrainObject) {
        attempts++
        if (attempts > 200) {
          clearInterval(inte)
          throw new Error('Could not find terrain object')
        }
        return
      }
      TerrainManager.setTerrain(
        new TerrainHeightMap(terrainObject, world.three.renderer)
      )

      clearInterval(inte)
    }, 250)
  },
  remove: (world, component) => {},
})

export {TerrainComponent}
