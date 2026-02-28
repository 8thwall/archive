# erreur d'écran

## Description {#description}

Cet événement est émis en réponse à la demande de capture d'écran [``](/api/aframeeventlisenters/screenshotrequest) qui aboutit à une erreur.

## Exemple {#example}

```javascript
let scene = this.el.sceneEl
scene.addEventListener('screenshoterror', (event) => {
  console.log(event.detail)
  // Gérer l'erreur de capture d'écran.
})
```
