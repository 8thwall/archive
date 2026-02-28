---
sidebar_position: 1
---

# xr:screenshotready

## Beschreibung {#description}

Dieses Ereignis wird als Reaktion auf die erfolgreiche Beendigung des Ereignisses [`xr:screenshotrequest`](/api/playcanvaseventlisteners/xrscreenshotrequest) ausgegeben. Das JPEG-komprimierte Bild der PlayCanvas-Leinwand wird zur Verfügung gestellt.

## Beispiel {#example}

```javascript
this.app.on('xr:screenshotready', (event) => {
  // screenshotPreview ist ein  HTML Element
  const image = document.getElementById('screenshotPreview')
  image.src = 'data:image/jpeg;base64,' + event.detail
}, this)
```
