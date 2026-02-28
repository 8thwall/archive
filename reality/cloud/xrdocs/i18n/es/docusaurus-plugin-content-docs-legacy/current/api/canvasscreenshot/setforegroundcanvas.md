---
sidebar_label: setForegroundCanvas()
---

# XR8.CanvasScreenshot.setForegroundCanvas()

`XR8.CanvasScreenshot.setForegroundCanvas(canvas)`

## Descripción {#description}

Establece un lienzo en primer plano que se mostrará encima del lienzo de la cámara. Debe tener las mismas dimensiones que el lienzo de la cámara.

Sólo es necesario si utiliza lienzos separados para la alimentación de la cámara y los objetos virtuales.

## Parámetros {#parameters}

| Parámetro | Descripción                                                            |
| --------- | ---------------------------------------------------------------------- |
| lona      | El lienzo que se utilizará como primer plano en la captura de pantalla |

## Devuelve {#returns}

Ninguno

## Ejemplo {#example}

```javascript
const myOtherCanvas = document.getElementById('canvas2')
XR8.CanvasScreenshot.setForegroundCanvas(myOtherCanvas)
```
