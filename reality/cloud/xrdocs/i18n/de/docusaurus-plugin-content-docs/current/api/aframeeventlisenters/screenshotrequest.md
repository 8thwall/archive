# screenshotrequest

`scene.emit('screenshotrequest')`

## Beschreibung {#description}

Sendet eine Anfrage an die Engine, um einen Screenshot des AFrame-Canvas aufzunehmen. Die Engine gibt ein Ereignis [`screenshotready`](/api/aframeevents/screenshotready) mit dem JPEG-komprimierten Bild oder [`screenshoterror`](/api/aframeevents/screenshoterror) aus, wenn ein Fehler aufgetreten ist.

## Parameter {#parameters}

Keine

## Beispiel {#example}

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
