---
sidebar_label: getGLctxParameters()
---

# XR8.GlTextureRenderer.getGLctxParameters()

`XR8.GlTextureRenderer.getGLctxParameters(GLctx, textureUnit)`

## Description {#description}

Récupère l'ensemble actuel des liaisons WebGL afin de pouvoir les restaurer ultérieurement.

## Paramètres {#parameters}

| Paramètres        | Type                                                | Description                                                                                     |
| ----------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| GLctx             | `WebGlRenderingContext` ou `WebGl2RenderingContext` | `WebGLRenderingContext` ou `WebGL2RenderingContext` pour obtenir des liaisons.                  |
| unités de texture | `[]`                                                | Les unités de texture pour lesquelles l'état doit être préservé, par exemple `[GLctx.TEXTURE0]` |

## Retours {#returns}

Une structure à transmettre à [setGLctxParameters](setglctxparameters.md).

## Exemple {#example}

```javascript
const restoreParams = XR8.GlTextureRenderer.getGLctxParameters(GLctx, [GLctx.TEXTURE0])
// Modifiez les paramètres de contexte si nécessaire
...
XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)
// Les paramètres contextuels sont restaurés dans leur état précédent
```
