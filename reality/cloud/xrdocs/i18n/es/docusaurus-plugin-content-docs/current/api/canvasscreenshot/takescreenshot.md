---
sidebar_label: takeScreenshot()
---

# XR8.CanvasScreenshot.takeScreenshot()

`XR8.CanvasScreenshot.takeScreenshot({ onProcessFrame })`

## Descripción {#description}

Devuelve una Promesa que, cuando se resuelve, proporciona un búfer que contiene la imagen comprimida JPEG. Si se rechaza, se proporciona un mensaje de error.

## Parámetros {#parameters}

| Parámetro                 | Descripción                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------- |
| onProcessFrame [Opcional] | Llamada de retorno donde puedes implementar un dibujo adicional al lienzo 2d de la captura de pantalla. |

## Vuelta {#returns}

Una promesa.

## Ejemplo {#example}

```javascript
XR8.addCameraPipelineModule(XR8.canvasScreenshot().cameraPipelineModule())
XR8.canvasScreenshot().takeScreenshot().then(
  data => {
    // myImage es un elemento <img> HTML
    const image = document.getElementById('myImage')
    image.src = 'data:image/jpeg;base64,' + data
  },
  error => {
    console.log(error)
    // Maneja el error de la captura de pantalla.
  })
})
```
