import ecs from '../helpers/runtime'

function cloneComponents(entityToClone, newEntity, world) {
  const components = [
    'Position', 'Quaternion', 'Scale', 'Shadow', 'BoxGeometry', 'Material', 'ScaleAnimation',
    'PositionAnimation', 'RotateAnimation', 'CustomPropertyAnimation', 'CustomVec3Animation',
    'FollowAnimation', 'LookAtAnimation', 'GltfModel', 'Collider', 'ParticleEmitter', 'Ui',
    'Audio',
  ]

  // TH - TODO - this isn't cloning custom components, e.g. Projectile, currently
  components.forEach((component) => {
    try {
      if (ecs[component] && ecs[component].has(world, entityToClone)) {
        const properties = ecs[component].get(world, entityToClone)
        ecs[component].set(world, newEntity, {...properties})
      }
    } catch (error) {
      console.error(`Error with component ${component}:`, error)
    }
  })
}

function setComponent(entityName, componentName, properties, world) {
  ecs[componentName].set(world, entityName, properties)
}

export {cloneComponents, setComponent}
