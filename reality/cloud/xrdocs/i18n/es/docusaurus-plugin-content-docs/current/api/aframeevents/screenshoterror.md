# screenshoterror

## Descripción {#description}

Este evento se emite en respuesta a la [`screenshotrequest`](/api/aframeeventlisenters/screenshotrequest) que provoca un error.

## Ejemplo {#example}

```javascript
let scene = this.el.sceneEl
scene.addEventListener('screenshoterror', (event) => {
  console.log(event.detail)
 // Gestiona el error de captura de pantalla.
})
```
