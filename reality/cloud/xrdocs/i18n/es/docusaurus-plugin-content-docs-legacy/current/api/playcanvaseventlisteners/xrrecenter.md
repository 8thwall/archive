# xr:recentrar

`this.app.fire('xr:recenter')`

## Descripción {#description}

Vuelve a enviar la señal de la cámara a su origen. Si se proporciona un nuevo origen como argumento, el origen de la cámara se restablecerá a ese, y luego se recentrará.

## Parámetros {#parameters}

| Parámetro                                                               | Tipo           | Descripción                                                                                                 |
| ----------------------------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------- |
| origen [Opcional]   | `{x, y, z}`    | La ubicación del nuevo origen.                                                              |
| frente a [Opcional] | `{w, x, y, z}` | Un cuaternión que representa la dirección en la que debe orientarse la cámara en el origen. |

## Ejemplo {#example}

```javascript
/*jshint esversion: 6, asi: true, laxbreak: true*/

// taprecenter.js: Define un script playcanvas que re-centra la escena AR cuando la pantalla es
// tocada.

var taprecenter = pc.createScript('taprecenter')

// Dispara un evento 'recenter' para mover la cámara de vuelta a su localización inicial en la escena.
taprecenter.prototype.initialize = function() {
  this.app.touch.on(pc.EVENT_TOUCHSTART,
    (event) => { if (event.touches.length !== 1) { return } this.app.fire('xr:recenter')})
}
```
