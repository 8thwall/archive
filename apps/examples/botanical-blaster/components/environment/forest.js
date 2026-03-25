import * as ecs from '@8thwall/ecs'
import {LCGSeededRandomNumberGenerator} from './random'
import {TerrainManager} from './terrain'
let cleanUp = () => {}

const Forest = ecs.registerComponent({
  name: 'Forest',
  schema: {
    radiusStart: ecs.f64,
    radiusEnd: ecs.f64,
    treeSeed: ecs.f64,
    rockSeed: ecs.f64,
    // @asset
    tree1: ecs.string,
    tree1Amount: ecs.ui8,
    // @asset
    tree2: ecs.string,
    tree2Amount: ecs.ui8,
    // @asset
    tree3: ecs.string,
    tree3Amount: ecs.ui8,
    // @asset
    tree4: ecs.string,
    tree4Amount: ecs.ui8,
    // @asset
    tree5: ecs.string,
    tree5Amount: ecs.ui8,
    // @asset
    tree6: ecs.string,
    tree6Amount: ecs.ui8,
    // @asset
    tree7: ecs.string,
    tree7Amount: ecs.ui8,
    // @asset
    tree8: ecs.string,
    tree8Amount: ecs.ui8,

    // @asset
    rock1: ecs.string,
    rock1Amount: ecs.ui8,
    // @asset
    rock2: ecs.string,
    rock2Amount: ecs.ui8,
    // @asset
    rock3: ecs.string,
    rock3Amount: ecs.ui8,
    // @asset
    rock4: ecs.string,
    rock4Amount: ecs.ui8,
    // @asset
    rock5: ecs.string,
    rock5Amount: ecs.ui8,
    // @asset
    rock6: ecs.string,
    rock6Amount: ecs.ui8,
    // @asset
    rock7: ecs.string,
    rock7Amount: ecs.ui8,
    // @asset
    rock8: ecs.string,
    rock8Amount: ecs.ui8,
  },
  schemaDefaults: {
    treeSeed: 39984347539,
    rockSeed: 1000112212,
    radiusStart: 20,
    radiusEnd: 50,
    tree1Amount: 10,
    tree2Amount: 10,
    tree3Amount: 10,
    tree4Amount: 10,
    tree5Amount: 10,
    tree6Amount: 10,
    tree7Amount: 10,
    tree8Amount: 10,
    rock1Amount: 10,
    rock2Amount: 10,
    rock3Amount: 10,
    rock4Amount: 10,
    rock5Amount: 10,
    rock6Amount: 10,
    rock7Amount: 10,
    rock8Amount: 10,
  },
  add: (world, component) => {
    const {scene} = world

    const {tree1, tree2, tree3, tree4, tree5, tree6, tree7, tree8} =
      component.schema
    const treeFiles = [tree1, tree2, tree3, tree4, tree5, tree6, tree7, tree8]
    const {
      tree1Amount,
      tree2Amount,
      tree3Amount,
      tree4Amount,
      tree5Amount,
      tree6Amount,
      tree7Amount,
      tree8Amount,
    } = component.schema
    const treeAmounts = [
      tree1Amount,
      tree2Amount,
      tree3Amount,
      tree4Amount,
      tree5Amount,
      tree6Amount,
      tree7Amount,
      tree8Amount,
    ]

    const {rock1, rock2, rock3, rock4, rock5, rock6, rock7, rock8} =
      component.schema
    const rockFiles = [rock1, rock2, rock3, rock4, rock5, rock6, rock7, rock8]
    const {
      rock1Amount,
      rock2Amount,
      rock3Amount,
      rock4Amount,
      rock5Amount,
      rock6Amount,
      rock7Amount,
      rock8Amount,
    } = component.schema
    const rockAmounts = [
      rock1Amount,
      rock2Amount,
      rock3Amount,
      rock4Amount,
      rock5Amount,
      rock6Amount,
      rock7Amount,
      rock8Amount,
    ]

    // @ts-ignore
    const loader = new THREE.GLTFLoader()

    const setProperties = (object) => {
      object.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true
          node.receiveShadow = true
          console.log('GOT FORESTS OBJECT')
          console.log(node.material.type)
          console.log(node.material)

          if (node.material?.roughness !== undefined) {
            node.material.roughness = 1
            node.material.metalness = 0
            // node.material.normalMap = null;
            node.material.metalnessMap = null
            node.material.roughnessMap = null
          }
        }
      })
    }

    const getTerrainHeight = (x, z) => (TerrainManager.heightMap
      ? TerrainManager.heightMap.getPoint(x, z)
      : 0)

    TerrainManager.addEventListener(
      TerrainManager.events.TerrainHeightMapLoaded,
      () => {
        const treeRandom = new LCGSeededRandomNumberGenerator(
          component.schema.treeSeed
        )
        const rockRandom = new LCGSeededRandomNumberGenerator(
          component.schema.rockSeed
        )
        const {radiusStart, radiusEnd} = component.schema
        const instances = []

        const getRandomDirection = (random, radiusStart, radiusEnd) => {
          const angle = random.rand() * 2 * Math.PI
          const radius = Math.sqrt(
            radiusStart * radiusStart +
              random.rand() *
                (radiusEnd * radiusEnd - radiusStart * radiusStart)
          )
          const x = Math.cos(angle) * radius
          const z = Math.sin(angle) * radius
          return [x, z]
        }

        const createInstancedMeshes = (gltf, count) => {
          const model = gltf.scene
          setProperties(model)
          const instancedMeshes = []

          model.traverse((child) => {
            if (child.isMesh) {
              const instancedMesh = new THREE.InstancedMesh(
                child.geometry,
                child.material,
                count
              )
              instancedMesh.castShadow = true
              instancedMesh.receiveShadow = true

              child.updateWorldMatrix(true, false)
              child.geometry.computeBoundingBox()
              instancedMeshes.push({
                instancedMesh,
                worldMatrix: child.matrixWorld.clone(),
              })
            }
          })

          return instancedMeshes
        }

        treeFiles.forEach((treeFile, index) => {
          loader.load(treeFile, (gltf) => {
            const instancedMeshes = createInstancedMeshes(
              gltf,
              treeAmounts[index]
            )
            for (let i = 0; i < treeAmounts[index]; i++) {
              const [x, z] = getRandomDirection(
                treeRandom,
                radiusStart,
                radiusEnd
              )
              const y = getTerrainHeight(x, z)

              instancedMeshes.forEach(({instancedMesh, worldMatrix}) => {
                const matrix = new THREE.Matrix4().copy(worldMatrix)
                matrix.elements[12] += x
                matrix.elements[13] += y
                matrix.elements[14] += z
                instancedMesh.setMatrixAt(i, matrix)
              })
            }

            instancedMeshes.forEach(({instancedMesh}) => {
              scene.add(instancedMesh)
              instances.push(instancedMesh)
            })
          })
        })

        rockFiles.forEach((rockFile, index) => {
          loader.load(rockFile, (gltf) => {
            const instancedMeshes = createInstancedMeshes(
              gltf,
              rockAmounts[index]
            )
            for (let i = 0; i < rockAmounts[index]; i++) {
              const [x, z] = getRandomDirection(
                rockRandom,
                radiusStart,
                radiusEnd
              )
              const y = getTerrainHeight(x, z)

              instancedMeshes.forEach(({instancedMesh, worldMatrix}) => {
                const matrix = new THREE.Matrix4().copy(worldMatrix)
                matrix.elements[12] += x
                matrix.elements[13] += y
                matrix.elements[14] += z
                instancedMesh.setMatrixAt(i, matrix)
              })
            }

            instancedMeshes.forEach(({instancedMesh}) => {
              scene.add(instancedMesh)
              instances.push(instancedMesh)
            })
          })
        })

        cleanUp = () => {
          for (const instance of instances) {
            scene.remove(instance)
          }
        }
      }
    )
  },
  remove: (world, component) => {
    cleanUp()
  },
})

export {Forest}
