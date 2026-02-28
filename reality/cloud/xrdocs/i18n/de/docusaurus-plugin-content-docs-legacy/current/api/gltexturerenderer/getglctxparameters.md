---
sidebar_label: getGLctxParameter()
---

# XR8.GlTextureRenderer.getGLctxParameters()

`XR8.GlTextureRenderer.getGLctxParameters(GLctx, textureUnit)`

## Beschreibung {#description}

Ruft den aktuellen Satz von WebGL-Bindungen ab, so dass sie später wiederhergestellt werden können.

## Parameter {#parameters}

| Parameter    | Typ                                                                   | Beschreibung                                                                                                                                |
| ------------ | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| GLctx        | WebGlRenderingContext" oder "WebGl2RenderingContext". | Der `WebGLRenderingContext` oder `WebGL2RenderingContext`, von dem Bindungen abgerufen werden sollen.                       |
| textureunits | `[]`                                                                  | Die Textureinheiten, für die der Zustand beibehalten werden soll, z. B. `[GLctx.TEXTURE0]`. |

## Rückgabe {#returns}

Eine Struktur zur Übergabe an [setGLctxParameters](setglctxparameters.md).

## Beispiel {#example}

```javascript
const restoreParams = XR8.GlTextureRenderer.getGLctxParameters(GLctx, [GLctx.TEXTURE0])
// Kontextparameter nach Bedarf ändern
...
XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)
// Kontextparameter werden auf ihren vorherigen Zustand zurückgesetzt
```
