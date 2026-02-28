# screenshotready

## Beschreibung {#description}

Dieses Ereignis wird als Reaktion auf die erfolgreiche Beendigung des Ereignisses [`screenshotrequest`](/api/aframeeventlisenters/screenshotrequest) ausgelöst. Das JPEG-komprimierte Bild der AFrame Leinwand wird zur Verfügung gestellt.

## Beispiel {#example}

```javascript
let scene = this.el.sceneEl
scene.addEventListener('screenshotready', (event) => {
  // screenshotPreview ist ein  HTML Element
  const image = document.getElementById('screenshotPreview')
  image.src = 'data:image/jpeg;base64,' + event.detail
})
```
