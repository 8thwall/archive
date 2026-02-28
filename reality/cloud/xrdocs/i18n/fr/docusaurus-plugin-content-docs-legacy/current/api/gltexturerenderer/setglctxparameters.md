---
sidebar_label: setGLctxParameters()
---

# XR8.GlTextureRenderer.setGLctxParameters()

`XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)`

## Description {#description}

Restaure les bindings WebGL qui ont été sauvegardés avec [`XR8.GlTextureRenderer.getGLctxParameters()`](getglctxparameters.md).

## Paramètres {#parameters}

| Paramètres    | Type                                                                                                | Description                                                                                               |
| ------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| GLctx         | `WebGlRenderingContext` ou `WebGl2RenderingContext`.                                | Le `WebGLRenderingContext` ou `WebGL2RenderingContext` sur lequel restaurer les bindings. |
| restoreParams | La sortie de [`XR8.GlTextureRenderer.getGLctxParameters()`](getglctxparameters.md). |                                                                                                           |

## Retourne {#returns}

Aucun

## Exemple {#example}

```javascript
const restoreParams = XR8.GlTextureRenderer.getGLctxParameters(GLctx, [GLctx.TEXTURE0])
// Modifier les paramètres de contexte si nécessaire
...
XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)
// Les paramètres de contexte sont restaurés dans leur état précédent.
```
