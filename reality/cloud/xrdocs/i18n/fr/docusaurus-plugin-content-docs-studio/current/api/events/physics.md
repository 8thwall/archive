---
id: physics
sidebar_position: 6
---

# Événements de physique

## Evénements

### ÉVÉNEMENT_DÉBUT_COLLISION

Emis lorsque l'entité a commencé à entrer en collision avec une autre entité.

#### Propriétés

| Propriété | Type | Description                              |
| --------- | ---- | ---------------------------------------- |
| autres    | eid  | L'eid de l'entité qui entre en collision |

#### Exemple

```ts
world.events.addListener(component.eid, ecs.physics.COLLISION_START_EVENT, (event) => {
    console.log(event.data.other)
})
```

### ÉVÉNEMENT DE FIN DE COLLISION

Emis lorsque l'entité a cessé d'entrer en collision avec une autre entité.

#### Propriétés

| Propriété | Type | Description                              |
| --------- | ---- | ---------------------------------------- |
| autres    | eid  | L'eid de l'entité qui entre en collision |

#### Exemple

```ts
world.events.addListener(component.eid, ecs.physics.COLLISION_END_EVENT, (event) => {
    console.log(event.data.other)
})
```
