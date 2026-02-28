---
id: camera
sidebar_position: 4
---

# Camera Events

## Eventos

### ACTIVE_CAMERA_CHANGE

Emitted when the active camera changes.

#### Propiedades

| Propiedad | Tipo   | Descripción       |
| --------- | ------ | ----------------- |
| camera    | Cámara | The active camera |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, ecs.CameraEvents.ACTIVE_CAMERA_CHANGE, (camera) => {
    console.log(camera)
})
```

### ACTIVE_CAMERA_EID_CHANGE

Emitted when the active camera eid changes.

#### Propiedades

| Propiedad | Tipo   | Descripción       |
| --------- | ------ | ----------------- |
| eid       | Cámara | The active camera |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, ecs.CameraEvents.ACTIVE_CAMERA_EID_CHANGE, (eid) => {
    console.log(eid)
})
```

### XR_CAMERA_EDIT

Emitted when any XR attribute is changed on the active camera.

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, ecs.CameraEvents.XR_CAMERA_EDIT, () => {
    console.log('Something happened')
})
```
