---
sidebar_label: getGLctxParameters()
---

# XR8.GlTextureRenderer.getGLctxParameters()

`XR8.GlTextureRenderer.getGLctxParameters(GLctx, textureUnit)`

## Descripción {#description}

Obtiene el conjunto actual de enlaces WebGL para que puedan ser restaurados más tarde.

## Parámetros {#parameters}

| Parámetro           | Tipo                                                                | Descripción                                                                                               |
| ------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| GLctx               | `WebGlRenderingContext` o `WebGl2RenderingContext`. | El `WebGLRenderingContext` o `WebGL2RenderingContext` del que obtener los enlaces.        |
| unidades de textura | `[]`                                                                | Las unidades de textura para las que preservar el estado, por ejemplo `[GLctx.TEXTURE0]`. |

## Devuelve {#returns}

Una estructura para pasar a [setGLctxParameters](setglctxparameters.md).

## Ejemplo {#example}

```javascript
const restoreParams = XR8.GlTextureRenderer.getGLctxParameters(GLctx, [GLctx.TEXTURE0])
// Altera los parámetros de contexto según sea necesario
...
XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)
// Los parámetros de contexto vuelven a su estado anterior
```
