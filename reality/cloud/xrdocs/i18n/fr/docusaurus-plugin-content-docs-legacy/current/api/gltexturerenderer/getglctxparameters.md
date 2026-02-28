---
sidebar_label: getGLctxParameters()
---

# XR8.GlTextureRenderer.getGLctxParameters()

`XR8.GlTextureRenderer.getGLctxParameters(GLctx, textureUnit)`

## Description {#description}

Récupère l'ensemble actuel des liaisons WebGL afin de pouvoir les restaurer ultérieurement.

## Paramètres {#parameters}

| Paramètres        | Type                                                                 | Description                                                                                          |
| ----------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| GLctx             | `WebGlRenderingContext` ou `WebGl2RenderingContext`. | Le `WebGLRenderingContext` ou le `WebGL2RenderingContext` pour obtenir les liaisons. |
| unités de texture | `[]`                                                                 | Les unités de texture pour lesquelles l'état doit être préservé, par exemple `[GLctx.TEXTURE0]`      |

## Retourne {#returns}

Une structure à passer à [setGLctxParameters](setglctxparameters.md).

## Exemple {#example}

```javascript
const restoreParams = XR8.GlTextureRenderer.getGLctxParameters(GLctx, [GLctx.TEXTURE0])
// Modifier les paramètres de contexte si nécessaire
...
XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)
// Les paramètres de contexte sont restaurés dans leur état précédent.
```
