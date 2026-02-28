---
id: camera
---

# Événements de la caméra

## Evénements

### CHANGEMENT_DE_CAMÉRA_ACTIVE

Émise lorsque la caméra active change.

#### Propriétés

| Propriété | Type           | Description      |
| --------- | -------------- | ---------------- |
| caméra    | Appareil photo | La caméra active |

#### Exemple

```ts
world.events.addListener(world.events.globalId, ecs.CameraEvents.ACTIVE_CAMERA_CHANGE, (camera) => {
    console.log(camera)
})
```

### ACTIVE_CAMERA_EID_CHANGE

Emis lorsque l'eid de la caméra active change.

#### Propriétés

| Propriété | Type           | Description      |
| --------- | -------------- | ---------------- |
| eid       | Appareil photo | La caméra active |

#### Exemple

```ts
world.events.addListener(world.events.globalId, ecs.CameraEvents.ACTIVE_CAMERA_EID_CHANGE, (eid) => {
    console.log(eid)
})
```

### XR_CAMERA_EDIT

Émise lorsqu'un attribut XR est modifié sur la caméra active.

#### Exemple

```ts
world.events.addListener(world.events.globalId, ecs.CameraEvents.XR_CAMERA_EDIT, () => {
    console.log('Something happened')
})
```
