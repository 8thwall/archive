# xr:screenshotrequest

`this.app.fire('xr:screenshotrequest')`

## Parameter {#parameters}

Keine

## Beschreibung {#description}

Sendet eine Anfrage an die Engine, um einen Screenshot der PlayCanvas-Leinwand zu erstellen. Die Engine sendet
ein [`xr:screenshotready`](/legacy/api/playcanvasevents/xrscreenshotready) Ereignis mit dem JPEG komprimierten Bild oder
[`xr:screenshoterror`](/legacy/api/playcanvasevents/xrscreenshoterror) wenn ein Fehler aufgetreten ist.

## Beispiel {#example}

```javascript
this.app.on('xr:screenshotready', (event) => {
  // screenshotPreview ist ein <img> HTML-Element
  const image = document.getElementById('screenshotPreview')
  image.src = 'data:image/jpeg;base64,' + event.detail
}, this)

this.app.on('xr:screenshoterror', (detail) => {
  console.log(detail)
  // Bildschirmfoto-Fehler behandeln.
}, this)

this.app.fire('xr:screenshotrequest')
```
