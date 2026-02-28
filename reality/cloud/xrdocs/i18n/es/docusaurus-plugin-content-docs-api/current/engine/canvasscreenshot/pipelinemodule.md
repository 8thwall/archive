---
sidebar_label: pipelineModule()
---

# XR8.CanvasScreenshot.pipelineModule()

`XR8.CanvasScreenshot.pipelineModule()`

## Descripción {#description}

Crea un módulo de canalización de cámara que, cuando se instala, recibe llamadas de retorno cuando la cámara se ha iniciado y cuando el tamaño del lienzo ha cambiado.

## Parámetros {#parameters}

Ninguno

## Devuelve {#returns}

Un módulo de canalización CanvasScreenshot que puede añadirse mediante [XR8.addCameraPipelineModule()](/api/engine/xr8/addcamerapipelinemodule).

## Ejemplo {#example}

```javascript
XR8.addCameraPipelineModule(XR8.CanvasScreenshot.pipelineModule())
```
