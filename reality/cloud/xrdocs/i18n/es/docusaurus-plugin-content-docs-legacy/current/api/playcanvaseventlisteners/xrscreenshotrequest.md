# xr:solicitud de captura de pantalla

`this.app.fire('xr:screenshotrequest')`

## Parámetros {#parameters}

Ninguno

## Descripción {#description}

Emite una petición al motor para capturar una pantalla del lienzo PlayCanvas. El motor emitirá
un evento [`xr:screenshotready`](/legacy/api/playcanvasevents/xrscreenshotready) con la imagen comprimida en JPEG o
[`xr:screenshoterror`](/legacy/api/playcanvasevents/xrscreenshoterror) si se ha producido un error.

## Ejemplo {#example}

```javascript
this.app.on('xr:screenshotready', (event) => {
  // screenshotPreview es un elemento HTML <img>
  const image = document.getElementById('screenshotPreview')
  image.src = 'data:image/jpeg;base64,' + event.detail
}, this)

this.app.on('xr:screenshoterror', (detail) => {
  console.log(detail)
  // Maneja el error de captura de pantalla.
}, this)

this.app.fire('xr:screenshotrequest')
```
