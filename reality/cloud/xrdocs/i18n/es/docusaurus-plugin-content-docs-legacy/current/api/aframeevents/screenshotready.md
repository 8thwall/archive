# screenshotready

## Descripción {#description}

Este evento se emite en respuesta al evento [`screenshotrequest`](/legacy/api/aframeeventlisenters/screenshotrequest) que se ha completado con éxito. Se proporcionará la imagen comprimida en JPEG del lienzo AFrame.

## Ejemplo {#example}

```javascript
let scene = this.el.sceneEl
scene.addEventListener('screenshotready', (event) => {
  // screenshotPreview es un elemento HTML <img>
  const image = document.getElementById('screenshotPreview')
  image.src = 'data:image/jpeg;base64,' + event.detail
})
```
