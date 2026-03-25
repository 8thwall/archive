import * as ecs from '@8thwall/ecs'

/**
 * deepCopyEntity
 * Clones an entity and it's heirarchy.
 * Then patches up any Eid references so that relative references are corrected.
 * This can be used to treat an entity graph like a prefab to create more instances
 */
const deepCopyEntity = (world: ecs.World, sourceRootEntity: ecs.Eid): ecs.Eid => {
  // gather up every known attribute (component) into an array
  const allAttributeNames = ecs.listAttributes()
  const allAttributes = allAttributeNames.map(attribName => ecs.getAttribute(attribName))

  // store a map of original entities to new, so we can fix up parent references
  // and patch any local Eid references within the components
  const entityToCloned = new Map<ecs.Eid, ecs.Eid>()

  // first do a pass creating all the cloned entities with the heirarchy
  const createEntities = (entityToClone: ecs.Eid, originalParent: ecs.Eid) => {
    const newEntity = world.createEntity()
    entityToCloned.set(entityToClone, newEntity)
    if (originalParent) {
      world.setParent(newEntity, entityToCloned.get(originalParent))
    }
    const iter = world.getChildren(entityToClone)
    let iterResult = iter.next()

    while (!iterResult.done) {
      createEntities(iterResult.value, entityToClone)
      iterResult = iter.next()
    }
    iter.return(0)
  }

  createEntities(sourceRootEntity, null)

  // now iterate each clone and each known component to copy schema data over
  // also search the component types in orderedSchema to find which ones are
  // Eid references and rebind those to cloned substitutes
  entityToCloned.forEach((destEntity, sourceEntity) => {
    allAttributes.forEach((component) => {
      if (component && component.has(world, sourceEntity)) {
        //  --- Note: if you get an error `Invalid method for ecs.Disabled`, it's because
        //            the disabled component does not implement the `get` method. Our
        //            workaround for now is to not use the built-in disable. If you really
        //            need it before it gets fixed in 8w, we can do a special check for if
        //            the component is `Disabled` here.
        const properties = component.get(world, sourceEntity)
        const modifiedProperties = {...properties}
        // look for eid properties
        component.orderedSchema.forEach((value) => {
          if (value[1] === ecs.eid) {
            // we have an entity reference we may need to patch. Check if it's a reference
            // to an entity that is being cloned
            const eidReference = properties[value[0]]
            if (entityToCloned.has(eidReference)) {
              modifiedProperties[value[0]] = entityToCloned.get(eidReference)
            }
          }
        })
        component.set(world, destEntity, modifiedProperties)
      }
    })
  })

  return entityToCloned.get(sourceRootEntity)
}

const instantiatePrefab = (
  world: ecs.World, prefab: ecs.Eid,
  parent: ecs.Eid = BigInt(0),
  position: ecs.math.Vec3Source = ecs.math.vec3.zero(),
  rotation: ecs.math.QuatSource = ecs.math.quat.zero(),
  scale: ecs.math.Vec3Source = ecs.math.vec3.one()
): ecs.Eid => {
  const newEntity = deepCopyEntity(world, prefab)
  world.setParent(newEntity, parent)
  ecs.Position.set(world, newEntity, position)
  ecs.Quaternion.set(world, newEntity, rotation)
  ecs.Scale.set(world, newEntity, scale)
  ecs.Hidden.remove(world, newEntity)
  return newEntity
}

export {deepCopyEntity, instantiatePrefab}
