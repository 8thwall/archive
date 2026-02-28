# capture d'écran

## Description {#description}

Cet événement est émis en réponse à l'événement [`screenshotrequest`](/api/aframeeventlisenters/screenshotrequest) qui s'est terminé avec succès. L'image compressée JPEG du support AFrame sera fournie.

## Exemple {#example}

```javascript
let scene = this.el.sceneEl
scene.addEventListener('screenshotready', (event) => {
  // screenshotPreview est un élément HTML 
  const image = document.getElementById('screenshotPreview')
  image.src = 'data:image/jpeg;base64,' + event.detail
})
```
