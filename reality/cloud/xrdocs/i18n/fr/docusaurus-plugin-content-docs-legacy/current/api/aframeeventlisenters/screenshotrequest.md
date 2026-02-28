# demande de capture d'écran

`scene.emit('screenshotrequest')`

## Description {#description}

Emet une requête au moteur pour capturer une capture d'écran de la toile AFrame. Le moteur émettra un événement
[`screenshotready`](/legacy/api/aframeevents/screenshotready) avec l'image compressée JPEG ou
[`screenshoterror`](/legacy/api/aframeevents/screenshoterror) si une erreur s'est produite.

## Paramètres {#parameters}

Aucun

## Exemple {#example}

```javascript
const scene = this.el.sceneEl
const photoButton = document.getElementById('photoButton')

// Émettre une demande de capture d'écran lorsque l'utilisateur appuie sur
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
