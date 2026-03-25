import ecs from '../helpers/runtime'
const {THREE} = (window as any)

const hiderMaterial = new THREE.MeshStandardMaterial()

// Register the component with the ECS system
const OccluderMesh = ecs.registerComponent({
  name: 'occluder-mesh',
  schema: {
  },
  data: {
    initialised: ecs.boolean,
  },

  add: (world, component) => {
    const {eid, data, schema} = component
    data.initialised = false
    hiderMaterial.colorWrite = false
  },

  tick: (world, component) => {
    const {eid} = component
    const {data} = component

    // TH - TODO - It seems that the mesh can take a while to load
    // and I haven't figured out how to listen for it yet so we just
    // apply the material every frame
    //if (!data.initialised) {
      const object = world.three.entityToObject.get(eid)
      object.material = hiderMaterial
      data.initialised = true
    //}
  },
})

export {OccluderMesh}
