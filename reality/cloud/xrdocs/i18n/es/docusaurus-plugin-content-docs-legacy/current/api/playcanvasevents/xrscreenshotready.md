---
sidebar_position: 1
---

# xr:screenshotready

## Descripción {#description}

Este evento se emite en respuesta al evento [`xr:screenshotrequest`](/legacy/api/playcanvaseventlisteners/xrscreenshotrequest) que se ha completado con éxito. Se proporcionará la imagen comprimida en JPEG del lienzo PlayCanvas.

## Ejemplo {#example}

```javascript
this.app.on('xr:screenshotready', (event) => {
  // screenshotPreview es un elemento HTML <img>
  const image = document.getElementById('screenshotPreview')
  image.src = 'data:image/jpeg;base64,' + event.detail
}, this)
```
