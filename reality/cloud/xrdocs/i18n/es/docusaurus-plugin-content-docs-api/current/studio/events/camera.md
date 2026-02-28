---
id: camera
---

# Eventos de cámara

## Eventos

### ACTIVE_CAMERA_CHANGE

Se emite cuando cambia la cámara activa.

#### Propiedades

| Propiedad | Tipo   | Descripción      |
| --------- | ------ | ---------------- |
| cámara    | Cámara | La cámara activa |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, ecs.CameraEvents.ACTIVE_CAMERA_CHANGE, (camera) => {
    console.log(camera)
})
```

### ACTIVE_CAMERA_EID_CHANGE

Se emite cuando cambia el eid de la cámara activa.

#### Propiedades

| Propiedad | Tipo   | Descripción      |
| --------- | ------ | ---------------- |
| eid       | Cámara | La cámara activa |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, ecs.CameraEvents.ACTIVE_CAMERA_EID_CHANGE, (eid) => {
    console.log(eid)
})
```

### XR_CAMERA_EDIT

Se emite cuando se cambia cualquier atributo XR en la cámara activa.

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, ecs.CameraEvents.XR_CAMERA_EDIT, () => {
    console.log('Ha pasado algo')
})
```
