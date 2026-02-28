---
sidebar_position: 1
---

# xr:screenshotready

## Descripción {#description}

Este evento se emite en respuesta a que el evento [`xr:screenshotrequest`](/api/playcanvaseventlisteners/xrscreenshotrequest) se ha completado con éxito. Se proporcionará la imagen comprimida en JPEG del lienzo de PlayCanvas.

## Ejemplo {#example}

```javascript
this.app.on('xr:screenshotready', (event) => {
 // screenshotPreview es un elemento <img> HTML
  const image = document.getElementById('screenshotPreview')
  image.src = 'data:image/jpeg;base64,' + event.detail
}, this)
```
