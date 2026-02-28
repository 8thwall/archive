# screenshotrequest

`scene.emit('screenshotrequest')`

## Descripción {#description}

Emite una petición al motor para que capture una captura de pantalla del lienzo AFrame. El motor emitirá un evento [`screenshotready`](/api/aframeevents/screenshotready) con la imagen comprimida en JPEG o [`screenshoterror`](/api/aframeevents/screenshoterror) si se ha producido un error.

## Parámetros {#parameters}

Ninguno

## Ejemplo {#example}

```javascript
const scene = this.el.sceneEl
const photoButton = document.getElementById('photoButton')

// Emite screenshotrequest cuando el usuario pulse
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
