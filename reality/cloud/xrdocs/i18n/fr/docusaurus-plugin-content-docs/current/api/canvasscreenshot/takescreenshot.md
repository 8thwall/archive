---
sidebar_label: takeScreenshot()
---

# XR8.CanvasScreenshot.takeScreenshot()

`XR8.CanvasScreenshot.takeScreenshot({ onProcessFrame })`

## Description {#description}

Renvoie une promesse qui, une fois résolue, fournit un tampon contenant l'image compressée JPEG. En cas de rejet, un message d'erreur est fourni.

## Paramètres {#parameters}

| Paramètres                  | Description                                                                                     |
| --------------------------- | ----------------------------------------------------------------------------------------------- |
| onProcessFrame [Facultatif] | Rappel où vous pouvez implémenter des dessins supplémentaires sur la capture d'écran 2d canvas. |

## Retours {#returns}

Une promesse.

## Exemple {#example}

```javascript
XR8.addCameraPipelineModule(XR8.canvasScreenshot().cameraPipelineModule())
XR8.canvasScreenshot().takeScreenshot().then(
  data => {
    // myImage est un élément HTML 
    const image = document.getElementById('myImage')
    image.src = 'data:image/jpeg;base64,' + data
  },
  error => {
    console.log(error)
    // Gérer les erreurs de capture d'écran.
  })
})
```
