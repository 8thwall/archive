---
sidebar_label: setGLctxParameters()
---

# XR8.GlTextureRenderer.setGLctxParameters()

`XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)`

## Descripción {#description}

Restaura las vinculaciones WebGL que se guardaron con [`XR8.GlTextureRenderer.getGLctxParameters()`](getglctxparameters.md).

## Parámetros {#parameters}

| Parámetro     | Tipo                                                                                                | Descripción                                                                                            |
| ------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| GLctx         | `WebGlRenderingContext` o `WebGl2RenderingContext`.                                 | El `WebGLRenderingContext` o `WebGL2RenderingContext` en el que restaurar los enlaces. |
| restoreParams | La salida de [`XR8.GlTextureRenderer.getGLctxParameters()`](getglctxparameters.md). |                                                                                                        |

## Devuelve {#returns}

Ninguno

## Ejemplo {#example}

```javascript
const restoreParams = XR8.GlTextureRenderer.getGLctxParameters(GLctx, [GLctx.TEXTURE0])
// Altera los parámetros de contexto según sea necesario
...
XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)
// Los parámetros de contexto vuelven a su estado anterior
```
