---
sidebar_label: setTextureProvider()
---

# XR8.GlTextureRenderer.setTextureProvider()

XR8.GlTextureRenderer.setTextureProvider(({ frameStartResult, processGpuResult, processCpuResult }) => {} )\`

## Descripción {#description}

Establece un proveedor que pasa la textura a dibujar. Debe ser una función que tome las mismas entradas que [`cameraPipelineModule.onUpdate`](/legacy/api/camerapipelinemodule/onupdate).

## Parámetros {#parameters}

`setTextureProvider()` toma una **función** con los siguientes parámetros:

| Parámetro        | Tipo   | Descripción                                                                                                                               |
| ---------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| frameStartResult | Objeto | Los datos que se proporcionaron al principio de un fotograma.                                                             |
| processGpuResult | Objeto | Datos devueltos por todos los módulos instalados durante [`onProcessGpu`](/legacy/api/camerapipelinemodule/onprocessgpu). |
| processCpuResult | Objeto | Datos devueltos por todos los módulos instalados durante [`onProcessCpu`](/legacy/api/camerapipelinemodule/onprocesscpu). |

La función debe devolver una [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) para dibujar.

## Devuelve {#returns}

Ninguno

## Ejemplo {#example}

```javascript
XR8.GlTextureRenderer.setTextureProvider(
  ({processGpuResult}) => {
    return processGpuResult.camerapixelarray ? processGpuResult.camerapixelarray.srcTex : null
})
```
