---
sidebar_position: 1
---

# xr:screenshotready

## Description {#description}

Cet événement est émis en réponse à l'événement [`xr:screenshotrequest`](/legacy/api/playcanvaseventlisteners/xrscreenshotrequest) qui s'est terminé avec succès. L'image compressée JPEG de la toile PlayCanvas sera fournie.

## Exemple {#example}

```javascript
this.app.on('xr:screenshotready', (event) => {
  // screenshotPreview est un élément HTML <img>
  const image = document.getElementById('screenshotPreview')
  image.src = 'data:image/jpeg;base64,' + event.detail
}, this)
```
