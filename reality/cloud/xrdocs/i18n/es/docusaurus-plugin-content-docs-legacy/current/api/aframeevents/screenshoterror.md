# error de pantalla

## Descripción {#description}

Este evento se emite en respuesta a la [`screenshotrequest`](/legacy/api/aframeeventlisenters/screenshotrequest) que resulta en un error.

## Ejemplo {#example}

```javascript
let scene = this.el.sceneEl
scene.addEventListener('screenshoterror', (event) => {
  console.log(event.detail)
  // Manejar el error de captura de pantalla.
})
```
