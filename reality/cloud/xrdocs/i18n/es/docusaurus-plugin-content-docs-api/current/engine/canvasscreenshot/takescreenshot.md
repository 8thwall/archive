---
sidebar_label: takeScreenshot()
---

# XR8.CanvasScreenshot.takeScreenshot()

`XR8.CanvasScreenshot.takeScreenshot({ onProcessFrame })`

## Descripción {#description}

Devuelve una promesa que, cuando se resuelve, proporciona un búfer que contiene la imagen comprimida JPEG. Si se rechaza, se proporciona un mensaje de error.

## Parámetros {#parameters}

| Parámetro                                                                     | Descripción                                                                                              |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| onProcessFrame [Opcional] | Callback donde se puede implementar dibujo adicional a la captura de pantalla 2d lienzo. |

## Devuelve {#returns}

Una promesa.

## Ejemplo {#example}

```javascript
XR8.addCameraPipelineModule(XR8.canvasScreenshot().cameraPipelineModule())
XR8.canvasScreenshot().takeScreenshot().then(
  data => {
    // myImage es un elemento HTML <img>
    const image = document.getElementById('myImage')
    image.src = 'data:image/jpeg;base64,' + data
  },
  error => {
    console.log(error)
    // Maneja el error de la captura de pantalla.
  })
})
```
