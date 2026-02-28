# Bildschirmfehlermeldung

## Beschreibung {#description}

Dieses Ereignis wird als Reaktion auf die [`Screenshotrequest`](/legacy/api/aframeeventlisenters/screenshotrequest) ausgegeben, die zu einem Fehler führt.

## Beispiel {#example}

```javascript
let scene = this.el.sceneEl
scene.addEventListener('screenshoterror', (event) => {
  console.log(event.detail)
  // Bildschirmfoto-Fehler behandeln.
})
```
