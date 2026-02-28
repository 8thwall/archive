---
id: camera
sidebar_position: 4
---

# Kamera-Ereignisse

## Ereignisse

### AKTIV_KAMERA_WECHSELN

Wird ausgesendet, wenn die aktive Kamera wechselt.

#### Eigenschaften

| Eigenschaft | Typ    | Beschreibung      |
| ----------- | ------ | ----------------- |
| camera      | Kamera | Die aktive Kamera |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, ecs.CameraEvents.ACTIVE_CAMERA_CHANGE, (camera) => {
    console.log(camera)
})
```

### ACTIVE_CAMERA_EID_CHANGE

Wird ausgesendet, wenn sich die aktive Kamera eid ändert.

#### Eigenschaften

| Eigenschaft | Typ    | Beschreibung      |
| ----------- | ------ | ----------------- |
| eid         | Kamera | Die aktive Kamera |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, ecs.CameraEvents.ACTIVE_CAMERA_EID_CHANGE, (eid) => {
    console.log(eid)
})
```

### XR_CAMERA_EDIT

Wird ausgegeben, wenn ein XR-Attribut an der aktiven Kamera geändert wird.

#### Beispiel

```ts
world.events.addListener(world.events.globalId, ecs.CameraEvents.XR_CAMERA_EDIT, () => {
    console.log('Es ist etwas passiert')
})
```
