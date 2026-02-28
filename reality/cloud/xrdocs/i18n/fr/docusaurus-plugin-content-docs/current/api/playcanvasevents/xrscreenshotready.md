---
sidebar_position: 1
---

# xr:screenshotready

## Description {#description}

Cet événement est émis en réponse à l'événement [`xr:screenshotrequest`](/api/playcanvaseventlisteners/xrscreenshotrequest) qui s'est achevé avec succès. L'image compressée JPEG de la toile PlayCanvas sera fournie.

## Exemple {#example}

```javascript
this.app.on('xr:screenshotready', (event) => {
  // screenshotPreview est un élément HTML 
  const image = document.getElementById('screenshotPreview')
  image.src = 'data:image/jpeg;base64,' + event.detail
}, this)
```
