---
sidebar_label: takeScreenshot()
---

# XR8.CanvasScreenshot.takeScreenshot()

`XR8.CanvasScreenshot.takeScreenshot({ onProcessFrame })`

## Description {#description}

Renvoie une promesse qui, une fois résolue, fournit un tampon contenant l'image compressée JPEG. En cas de rejet, un message d'erreur est fourni.

## Paramètres {#parameters}

| Paramètres                                                                      | Description                                                                                             |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| onProcessFrame [Facultatif] | Rappel permettant d'ajouter des dessins supplémentaires à la capture d'écran 2d canvas. |

## Retourne {#returns}

Une promesse.

## Exemple {#example}

```javascript
XR8.addCameraPipelineModule(XR8.canvasScreenshot().cameraPipelineModule())
XR8.canvasScreenshot().takeScreenshot().then(
  data => {
    // myImage est un élément HTML <img>
    const image = document.getElementById('myImage')
    image.src = 'data:image/jpeg;base64,' + data
  },
  error => {
    console.log(error)
    // Gérer l'erreur de capture d'écran.
  })
})
```
