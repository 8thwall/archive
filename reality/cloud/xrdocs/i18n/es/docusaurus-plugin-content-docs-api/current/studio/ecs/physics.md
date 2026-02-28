---
id: physics
---

# Física

## Descripción

Esta librería tiene métodos para aplicar la física y establecer Colisionadores en Entidades.

## Funciones

### aplicarFuerza

Puedes aplicar directamente fuerzas (lineales y angulares) a cualquier entidad con un colisionador de física.
Estas fuerzas se aplican en la siguiente actualización de la simulación física, que tiene lugar a intervalos regulares.
La función acepta un vector 3D para definir la dirección y la magnitud de la fuerza.

```ts
ecs.physics.applyForce(world, eid, forceX, forceY, forceZ) // -> void
```

### applyImpulse

Esta función se utiliza para aplicar una fuerza de impulso única a un colisionador físico, alterando su velocidad en función del vector de impulso dado.
Este método es útil para eventos que requieren una respuesta rápida, de una sola acción, como saltar, dar un puñetazo o un empujón repentino.

```ts
ecs.physics.applyImpulse(world, eid, impulseX, impulseY, impulseZ) // -> void
```

### applyTorque

Puedes aplicar directamente fuerzas (lineales y angulares) a cualquier entidad con un colisionador de física.
Estas fuerzas se aplican en la siguiente actualización de la simulación física, que tiene lugar a intervalos regulares.
La función acepta un vector 3D para definir la dirección y la magnitud de la fuerza.

```ts
ecs.physics.applyTorque(world, eid, torqueX, torqueY, torqueZ) // -> void
```

### getGravedadMundial

Esta es una simple función getter que devuelve la fuerza de gravedad actual aplicada a cada objeto de la escena.
El valor de retorno puede cambiar dependiendo del momento en que se ejecutó la función.

```ts
ecs.physics.getWorldGravity(world) // -> número
```

### registerConvexShape

Registra una forma convexa.

```ts
ecs.physics.registerConvexShape(world, vertices) // -> eid de la forma registrada
```

### getAngularVelocity

Obtiene la velocidad angular de una entidad.

```ts
ecs.physics.getAngularVelocity(world, eid) // -> {x: number, y: number, z: number}
```

### setAngularVelocity

Establece la velocidad angular de una entidad.

```ts
ecs.physics.setAngularVelocity(world, eid) // -> {x: number, y: number, z: number}
```

### getLinearVelocity

Obtiene la velocidad lineal de una entidad.

```ts
ecs.physics.getLinearVelocity(world, eid) // -> {x: number, y: number, z: number}
```

### setLinearVelocity

Establece la velocidad lineal de una entidad.

```ts
ecs.physics.setLinearVelocity(world, eid, velocityX, velocityY, velocityZ) // -> void
```

### getGravedadMundial

Consigue la gravedad mundial.

```ts
ecs.physics.getWorldGravity(mundo, gravedad) // -> número
```

### setGravedadMundial

Establece la gravedad del mundo.

```ts
ecs.physics.setWorldGravity(world, gravity) // -> void
```

### unregisterConvexShape

Anular el registro de una forma convexa.

```ts
ecs.physics.unregisterConvexShape(world, id) // -> void
```
