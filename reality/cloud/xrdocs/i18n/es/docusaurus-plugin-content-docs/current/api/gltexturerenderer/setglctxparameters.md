---
sidebar_label: setGLctxParameters()
---

# XR8.GlTextureRenderer.setGLctxParameters()

`XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)`

## Descripción {#description}

Restaura las vinculaciones WebGL que se guardaron con [`XR8.GlTextureRenderer.getGLctxParameters()`](getglctxparameters.md).

## Parámetros {#parameters}

| Parámetro     | Tipo                                                                                | Descripción                                                                               |
| ------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| GLctx         | `WebGlRenderingContext` o `WebGl2RenderingContext`                                  | El `WebGLRenderingContext` o `WebGL2RenderingContext` sobre el que restaurar los enlaces. |
| restoreParams | La salida de [`XR8.GlTextureRenderer.getGLctxParameters()`](getglctxparameters.md). |                                                                                           |

## Vuelta {#returns}

Ninguno

## Ejemplo {#example}

```javascript
const restoreParams = XR8.GlTextureRenderer.getGLctxParameters(GLctx, [GLctx.TEXTURE0])
// Altera los parámetros del contexto según necesites
...
XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)
// Los parámetros del contexto vuelven a su estado anterior
```
