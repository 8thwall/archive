---
id: physics
sidebar_position: 6
---

# Physikalische Ereignisse

## Ereignisse

### KOLLISION_START_EREIGNIS

Wird ausgesendet, wenn das Objekt mit einem anderen Objekt zu kollidieren begonnen hat.

#### Eigenschaften

| Eigenschaft | Typ | Beschreibung                       |
| ----------- | --- | ---------------------------------- |
| andere      | eid | Die eid der kollidierenden Einheit |

#### Beispiel

```ts
world.events.addListener(component.eid, ecs.physics.COLLISION_START_EVENT, (event) => {
    console.log(event.data.other)
})
```

### KOLLISION_ENDE_EREIGNIS

Wird ausgesendet, wenn das Objekt nicht mehr mit einem anderen Objekt kollidiert.

#### Eigenschaften

| Eigenschaft | Typ | Beschreibung                       |
| ----------- | --- | ---------------------------------- |
| andere      | eid | Die eid der kollidierenden Einheit |

#### Beispiel

```ts
world.events.addListener(component.eid, ecs.physics.COLLISION_END_EVENT, (event) => {
    console.log(event.data.other)
})
```
