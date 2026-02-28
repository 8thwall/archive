# solicitud de captura de pantalla

`scene.emit('screenshotrequest')`

## Descripción {#description}

Emite una petición al motor para capturar una pantalla del lienzo AFrame. El motor emitirá un evento
[`screenshotready`](/legacy/api/aframeevents/screenshotready) con la imagen comprimida en JPEG o
[`screenshoterror`](/legacy/api/aframeevents/screenshoterror) si se ha producido un error.

## Parámetros {#parameters}

Ninguno

## Ejemplo {#example}

```javascript
const scene = this.el.sceneEl
const photoButton = document.getElementById('photoButton')

// Emit screenshotrequest when user taps
photoButton.addEventListener('click', () => {
  image.src = ""
  scene.emit('screenshotrequest')
})

scene.addEventListener('screenshotready', event => {
  image.src = 'data:image/jpeg;base64,' + event.detail
})

scene.addEventListener('screenshoterror', event => {
  console.log("error")
})
```
