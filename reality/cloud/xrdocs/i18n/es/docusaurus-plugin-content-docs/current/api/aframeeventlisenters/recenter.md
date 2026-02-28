# recentrar

`scene.emit('recenter', {origin, facing})`

## Descripción {#description}

Vuelve a dirigir el canal de la cámara a su origen. Si se proporciona un nuevo origen como argumento, el origen de la cámara se restablecerá a ese, y luego se recentrará.

Si no se proporcionan el origen y la orientación, la cámara se restablece al origen especificado previamente mediante una llamada a `recentrar` o la última llamada a `XR8.XrController.updateCameraProjectionMatrix()` al utilizar `xrweb` o `XR8.FaceController.configure({coordinates: {origin, scale, axes}})` / `XR8.LayersController.configure({coordinates: {origin, scale, axes}})` al utilizar `xrface` o `xrlayers`.

**IMPORTANTE:** Con A-Frame, `updateCameraProjectionMatrix()` y/o `configure()` se llama inicialmente basándose en la posición inicial de la cámara en la escena.

## Parámetros {#parameters}

| Parámetro                        | Descripción                                                                                |
| -------------------------------- | ------------------------------------------------------------------------------------------ |
| origen: {x, y, z} [Opcional]     | La ubicación del nuevo origen.                                                             |
| de cara: {w, x, y, z} [Opcional] | Un cuaternión que representa la dirección a la que debe orientarse la cámara en el origen. |

## Ejemplo - Vuelve a centrar la escena {#example}

```javascript
let scene = this.el.sceneEl
scene.emit('recenter')
```

## Ejemplo - Recentrar la escena y actualiza el origen {#example---update-origin}

```javascript
let scene = this.el.sceneEl
scene.emit('recenter', {
  origin: {x: 1, y: 4, z: 0},
  facing: {w: 0.9856, x:0, y:0.169, z:0}
})
```
