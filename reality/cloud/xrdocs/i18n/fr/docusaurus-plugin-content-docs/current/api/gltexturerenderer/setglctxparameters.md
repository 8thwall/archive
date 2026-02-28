---
sidebar_label: setGLctxParameters()
---

# XR8.GlTextureRenderer.setGLctxParameters()

`XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)`

## Description {#description}

Restaure les liaisons WebGL qui ont été sauvegardées avec [`XR8.GlTextureRenderer.getGLctxParameters()`](getglctxparameters.md).

## Paramètres {#parameters}

| Paramètres    | Type                                                                                | Description                                                                         |
| ------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| GLctx         | `WebGlRenderingContext` ou `WebGl2RenderingContext`                                 | Le `WebGLRenderingContext` ou `WebGL2RenderingContext` pour restaurer les liaisons. |
| restoreParams | La sortie de [`XR8.GlTextureRenderer.getGLctxParameters()`](getglctxparameters.md). |                                                                                     |

## Retours {#returns}

Aucun

## Exemple {#example}

```javascript
const restoreParams = XR8.GlTextureRenderer.getGLctxParameters(GLctx, [GLctx.TEXTURE0])
// Modifiez les paramètres de contexte si nécessaire
...
XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)
// Les paramètres contextuels sont restaurés dans leur état précédent
```
