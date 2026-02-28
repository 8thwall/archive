# xr:screenshotrequest

`this.app.fire('xr:screenshotrequest')`

## Parámetros {#parameters}

Ninguno

## Descripción {#description}

Emite una petición al motor para capturar una pantalla de PlayCanvas. El motor emitirá un evento [`xr:screenshotready`](/api/playcanvasevents/xrscreenshotready) con la imagen comprimida en JPEG o [`xr:screenshoterror`](/api/playcanvasevents/xrscreenshoterror) si se ha producido un error.

## Ejemplo {#example}

```javascript
this.app.on('xr:screenshotready', (event) => {
  // screenshotPreview is an <img> HTML element
  const image = document.getElementById('screenshotPreview')
  image.src = 'data:image/jpeg;base64,' + event.detail
}, this)

this.app.on('xr:screenshoterror', (detail) => {
  console.log(detail)
  // Maneja el error de captura de pantalla.
}, this)

this.app.fire('xr:screenshotrequest')
```
