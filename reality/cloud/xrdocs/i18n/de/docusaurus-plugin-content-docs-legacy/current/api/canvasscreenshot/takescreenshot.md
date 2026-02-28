---
sidebar_label: takeScreenshot()
---

# XR8.CanvasScreenshot.takeScreenshot()

`XR8.CanvasScreenshot.takeScreenshot({ onProcessFrame })`

## Beschreibung {#description}

Gibt ein Promise zurück, das, wenn es aufgelöst wird, einen Puffer mit dem JPEG-komprimierten Bild bereitstellt. Bei Ablehnung wird eine Fehlermeldung ausgegeben.

## Parameter {#parameters}

| Parameter                                                                     | Beschreibung                                                                                                        |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| onProcessFrame [Optional] | Callback, mit dem Sie zusätzliche Zeichnungen auf der 2D-Screenshot-Leinwand implementieren können. |

## Rückgabe {#returns}

Ein Versprechen.

## Beispiel {#example}

```javascript
XR8.addCameraPipelineModule(XR8.canvasScreenshot().cameraPipelineModule())
XR8.canvasScreenshot().takeScreenshot().then(
  data => {
    // myImage ist ein <img> HTML Element
    const image = document.getElementById('myImage')
    image.src = 'data:image/jpeg;base64,' + data
  },
  error => {
    console.log(error)
    // Bildschirmfoto-Fehler behandeln.
  })
})
```
