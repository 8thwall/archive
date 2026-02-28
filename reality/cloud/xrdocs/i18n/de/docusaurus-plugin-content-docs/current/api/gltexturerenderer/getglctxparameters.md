---
sidebar_label: getGLctxParameter()
---

# XR8.GlTextureRenderer.getGLctxParameter()

`XR8.GlTextureRenderer.getGLctxParameter(GLctx, textureUnit)`

## Beschreibung {#description}

Ruft den aktuellen Satz von WebGL-Bindungen ab, so dass diese später wiederhergestellt werden können.

## Parameter {#parameters}

| Parameter    | Typ                                                   | Beschreibung                                                                                |
| ------------ | ----------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| GLctx        | `WebGlRenderingContext` oder `WebGl2RenderingContext` | Der `WebGLRenderingContext` oder `WebGL2RenderingContext` , von dem Sie Bindungen erhalten. |
| textureunits | `[]`                                                  | Die Textureinheiten, für die der Zustand erhalten werden soll, z.B. `[GLctx.TEXTURE0]`      |

## Returns {#returns}

Eine Struktur zur Übergabe an [setGLctxParameters](setglctxparameters.md).

## Beispiel {#example}

```javascript
const restoreParams = XR8.GlTextureRenderer.getGLctxParameters(GLctx, [GLctx.TEXTURE0])
// Ändern Sie die Kontextparameter nach Bedarf
...
XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)
// Die Kontextparameter werden in ihrem vorherigen Zustand wiederhergestellt
```
