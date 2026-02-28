# screenshotready

## Descripción {#description}

Este evento se emite en respuesta a que el evento [`screenshotrequest`](/api/aframeeventlisenters/screenshotrequest) se ha completado con éxito. Se proporcionará la imagen comprimida en JPEG del lienzo AFrame.

## Ejemplo {#example}

```javascript
let scene = this.el.sceneEl
scene.addEventListener('screenshotready', (event) => {
  // screenshotPreview is an <img> HTML element
  const image = document.getElementById('screenshotPreview')
  image.src = 'data:image/jpeg;base64,' + event.detail
})
```
