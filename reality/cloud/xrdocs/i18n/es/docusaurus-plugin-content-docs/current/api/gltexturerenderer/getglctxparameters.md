---
sidebar_label: getGLctxParameters()
---

# XR8.GlTextureRenderer.getGLctxParameters()

`XR8.GlTextureRenderer.getGLctxParameters(GLctx, textureUnit)`

## Descripción {#description}

Obtiene el conjunto actual de enlaces WebGL para poder restaurarlos más tarde.

## Parámetros {#parameters}

| Parámetro    | Tipo                                               | Descripción                                                                              |
| ------------ | -------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| GLctx        | `WebGlRenderingContext` o `WebGl2RenderingContext` | El `WebGLRenderingContext` o `WebGL2RenderingContext` del que obtener los enlaces.       |
| textureunits | `[]`                                               | Las unidades de textura para las que preservar el estado, por ejemplo `[GLctx.TEXTURE0]` |

## Vuelta {#returns}

Una estructura para pasar a [setGLctxParameters](setglctxparameters.md).

## Ejemplo {#example}

```javascript
const restoreParams = XR8.GlTextureRenderer.getGLctxParameters(GLctx, [GLctx.TEXTURE0])
// Altera los parámetros del contexto según necesites
...
XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)
// Los parámetros del contexto vuelven a su estado anterior
```
