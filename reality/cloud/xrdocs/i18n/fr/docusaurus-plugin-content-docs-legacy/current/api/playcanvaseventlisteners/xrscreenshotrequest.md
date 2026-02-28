# xr:demande de capture d'écran

`this.app.fire('xr:screenshotrequest')`

## Paramètres {#parameters}

Aucun

## Description {#description}

Emet une requête au moteur pour capturer une capture d'écran de la toile PlayCanvas. Le moteur émettra
un événement [`xr:screenshotready`](/legacy/api/playcanvasevents/xrscreenshotready) avec l'image compressée JPEG ou
[`xr:screenshoterror`](/legacy/api/playcanvasevents/xrscreenshoterror) si une erreur s'est produite.

## Exemple {#example}

```javascript
this.app.on('xr:screenshotready', (event) => {
  // screenshotPreview est un élément HTML <img>
  const image = document.getElementById('screenshotPreview')
  image.src = 'data:image/jpeg;base64,' + event.detail
}, this)

this.app.on('xr:screenshoterror', (detail) => {
  console.log(detail)
  // Gérer l'erreur de capture d'écran.
}, this)

this.app.fire('xr:screenshotrequest')
```
