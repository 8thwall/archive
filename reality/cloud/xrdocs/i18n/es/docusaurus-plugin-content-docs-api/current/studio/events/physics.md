---
id: physics
---

# Eventos de Física

## Eventos

### EVENTO_INICIO_COLISIÓN

Se emite cuando la entidad ha empezado a colisionar con otra entidad.

#### Propiedades

| Propiedad | Tipo | Descripción                        |
| --------- | ---- | ---------------------------------- |
| otros     | eid  | El eid de la entidad que colisiona |

#### Ejemplo

```ts
world.events.addListener(component.eid, ecs.physics.COLLISION_START_EVENT, (event) => {
    console.log(event.data.other)
})
```

### EVENTO_FINAL_COLISIÓN

Se emite cuando la entidad ha dejado de colisionar con otra entidad.

#### Propiedades

| Propiedad | Tipo | Descripción                        |
| --------- | ---- | ---------------------------------- |
| otros     | eid  | El eid de la entidad que colisiona |

#### Ejemplo

```ts
world.events.addListener(component.eid, ecs.physics.COLLISION_END_EVENT, (event) => {
    console.log(event.data.other)
})
```
