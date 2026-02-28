---
id: physics
sidebar_position: 6
---

# Physics Events

## Eventos

### COLLISION_START_EVENT

Emitted when the entity has started colliding with another entity.

#### Propiedades

| Propiedad | Tipo | Descripción                     |
| --------- | ---- | ------------------------------- |
| other     | eid  | The eid of the colliding entity |

#### Ejemplo

```ts
world.events.addListener(component.eid, ecs.physics.COLLISION_START_EVENT, (event) => {
    console.log(event.data.other)
})
```

### COLLISION_END_EVENT

Emitted when the entity has stopped colliding with another entity.

#### Propiedades

| Propiedad | Tipo | Descripción                     |
| --------- | ---- | ------------------------------- |
| other     | eid  | The eid of the colliding entity |

#### Ejemplo

```ts
world.events.addListener(component.eid, ecs.physics.COLLISION_END_EVENT, (event) => {
    console.log(event.data.other)
})
```
