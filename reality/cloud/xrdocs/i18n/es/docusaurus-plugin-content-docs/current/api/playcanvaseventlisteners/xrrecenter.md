# xr:recenter

`this.app.fire('xr:recenter')`

## Descripción {#description}

Vuelve a dirigir el canal de la cámara a su origen. Si se proporciona un nuevo origen como argumento, el origen de la cámara se restablecerá a ese, y luego se recentrará.

## Parámetros {#parameters}

| Parámetro         | Tipo           | Descripción                                                                                |
| ----------------- | -------------- | ------------------------------------------------------------------------------------------ |
| origin [Opcional] | `{x, y, z}`    | La ubicación del nuevo origen.                                                             |
| facing [Opcional] | `{w, x, y, z}` | Un cuaternión que representa la dirección a la que debe orientarse la cámara en el origen. |

## Ejemplo {#example}

```javascript
/*jshint esversion: 6, asi: true, laxbreak: true*/

// taprecenter.js: Define un script a PlayCanvas que vuelve a centrar la escena AR cuando se
// toca la pantalla.

var taprecenter = pc.createScript('taprecenter')

// Lanza un evento 'recenter' para mover la cámara de vuelta a su ubicación inicial en la escena.
taprecenter.prototype.initialize = function() {
  this.app.touch.on(pc.EVENT_TOUCHSTART,
    (event) => { if (event.touches.length !== 1) { return } this.app.fire('xr:recenter')})
}
```
