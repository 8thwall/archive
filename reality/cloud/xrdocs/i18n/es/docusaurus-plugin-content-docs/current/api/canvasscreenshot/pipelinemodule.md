---
sidebar_label: pipelineModule()
---

# XR8.CanvasScreenshot.pipelineModule()

`XR8.CanvasScreenshot.pipelineModule()`

## Descripción {#description}

Crea un módulo de canalización de cámara que, cuando se instala, recibe llamadas de retorno sobre cuándo se ha iniciado la cámara y cuándo ha cambiado el tamaño del lienzo.

## Parámetros {#parameters}

Ninguno

## Vuelta {#returns}

Un módulo de canalización CanvasScreenshot que puede añadirse mediante [XR8.addCameraPipelineModule()](/api/xr8/addcamerapipelinemodule).

## Ejemplo {#example}

```javascript
XR8.addCameraPipelineModule(XR8.CanvasScreenshot.pipelineModule())
```
