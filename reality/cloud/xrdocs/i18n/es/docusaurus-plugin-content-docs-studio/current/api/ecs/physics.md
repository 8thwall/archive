---
id: physics
---

# physics

## Descripción

This library has methods for applying physics and setting Colliders on Entities.

## Funciones

### applyForce

You can directly apply forces (linear and angular) to any entity with a physics collider.
These forces are applied in the next physics simulation update, which takes place at regular intervals.
The function accepts a 3D vector to define the force direction and magnitude.

:::warning
This is dependent on the frequency of calls to requestAnimationFrame() or your devices refresh rate.
:::

```ts
ecs.physics.applyForce(world, eid, forceX, forceY, forceZ) // -> void
```

### applyImpulse

This function is used to apply a one-time instantaneous force to a physics collider, altering its velocity based on the given impulse vector.
This method is useful for events that require a quick, single action response, such as jumping, punching, or a sudden push.

```ts
ecs.physics.applyImpulse(world, eid, impulseX, impulseY, impulseZ) // -> void
```

### applyTorque

You can directly apply forces (linear and angular) to any entity with a physics collider.
These forces are applied in the next physics simulation update, which takes place at regular intervals.
The function accepts a 3D vector to define the force direction and magnitude.

:::warning
This is dependent on the frequency of calls to requestAnimationFrame() or your devices refresh rate.
:::

```ts
ecs.physics.applyTorque(world, eid, torqueX, torqueY, torqueZ) // -> void
```

### getWorldGravity

This is a simple getter function that returns the current force of gravity applied to every object in the scene.
The return value might change depending on the time the function was executed.

```ts
ecs.physics.getWorldGravity(world) // -> number
```

### registerConvexShape

Register a convex shape.

```ts
ecs.physics.registerConvexShape(world, vertices) // -> eid of the registered shape
```

### getLinearVelocity

Get the linear velocity of an entity.

```ts
ecs.physics.getLinearVelocity(world, eid) // -> number
```

### setLinearVelocity

Set the linear velocity of an entity.

```ts
ecs.physics.setLinearVelocity(world, eid, velocityX, velocityY, velocityZ) // -> void
```

### setWorldGravity

Set the world gravity.

```ts
ecs.physics.setWorldGravity(world, gravity) // -> void
```

### unregisterConvexShape

Unregister a convex shape.

```ts
ecs.physics.unregisterConvexShape(world, id) // -> void
```

## Eventos

### COLLISION_START_EVENT

Emitted when collision has begun with an entity.

```ts
ecs.physics.COLLISION_START_EVENT.data : { other }
```

#### Propiedades

| Propiedad | Tipo | Descripción                    |
| --------- | ---- | ------------------------------ |
| other     | eid  | The eid of the collided entity |

### COLLISION_END_EVENT

Emitted when collision has stopped with an entity.

```ts
ecs.physics.COLLISION_END_EVENT.data : { other }
```

#### Propiedades

| Propiedad | Tipo | Descripción                    |
| --------- | ---- | ------------------------------ |
| other     | eid  | The eid of the collided entity |
