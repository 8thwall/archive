---
sidebar_label: takeScreenshot()
---

# XR8.CanvasScreenshot.takeScreenshot()

`XR8.CanvasScreenshot.takeScreenshot({ onProcessFrame })`

## Beschreibung {#description}

Gibt ein Versprechen zurück, das, wenn es aufgelöst wird, einen Puffer mit dem JPEG-komprimierten Bild bereitstellt. Bei Ablehnung wird eine Fehlermeldung angezeigt.

## Parameter {#parameters}

| Parameter                 | Beschreibung                                                                                             |
| ------------------------- | -------------------------------------------------------------------------------------------------------- |
| onProcessFrame [Optional] | Callback, mit dem Sie zusätzliche Zeichnungen auf der 2d-Leinwand des Screenshots implementieren können. |

## Returns {#returns}

Ein Versprechen.

## Beispiel {#example}

```javascript
XR8.addCameraPipelineModule(XR8.canvasScreenshot().cameraPipelineModule())
XR8.canvasScreenshot().takeScreenshot().then(
  data => {
    // myImage ist ein  HTML Element
    const image = document.getElementById('myImage')
    image.src = 'data:image/jpeg;base64,' + data
  },
  error => {
    console.log(error)
    // Behandeln Sie Screenshot-Fehler.
  })
})
```
