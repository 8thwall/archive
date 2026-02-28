---
sidebar_label: setGLctxParameter()
---

# XR8.GlTextureRenderer.setGLctxParameter()

`XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)`

## Beschreibung {#description}

Stellt die WebGL-Bindungen wieder her, die mit [`XR8.GlTextureRenderer.getGLctxParameters()`](getglctxparameters.md) gespeichert wurden.

## Parameter {#parameters}

| Parameter     | Typ                                                                                    | Beschreibung                                                                                   |
| ------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| GLctx         | `WebGlRenderingContext` oder `WebGl2RenderingContext`                                  | Der `WebGLRenderingContext` oder `WebGL2RenderingContext` zur Wiederherstellung der Bindungen. |
| restoreParams | Die Ausgabe von [`XR8.GlTextureRenderer.getGLctxParameters()`](getglctxparameters.md). |                                                                                                |

## Returns {#returns}

Keine

## Beispiel {#example}

```javascript
const restoreParams = XR8.GlTextureRenderer.getGLctxParameters(GLctx, [GLctx.TEXTURE0])
// Ändern Sie die Kontextparameter nach Bedarf
...
XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)
// Die Kontextparameter werden in ihrem vorherigen Zustand wiederhergestellt
```
