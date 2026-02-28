---
sidebar_label: setGLctxParameter()
---

# XR8.GlTextureRenderer.setGLctxParameters()

`XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)`

## Beschreibung {#description}

Stellt die WebGL-Bindungen wieder her, die mit [`XR8.GlTextureRenderer.getGLctxParameters()`](getglctxparameters.md) gespeichert wurden.

## Parameter {#parameters}

| Parameter     | Typ                                                                                                    | Beschreibung                                                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| GLctx         | WebGlRenderingContext" oder "WebGl2RenderingContext".                                  | Der `WebGLRenderingContext` oder `WebGL2RenderingContext`, auf dem Bindungen wiederhergestellt werden sollen. |
| restoreParams | Die Ausgabe von [`XR8.GlTextureRenderer.getGLctxParameters()`](getglctxparameters.md). |                                                                                                                               |

## Rückgabe {#returns}

Keine

## Beispiel {#example}

```javascript
const restoreParams = XR8.GlTextureRenderer.getGLctxParameters(GLctx, [GLctx.TEXTURE0])
// Kontextparameter nach Bedarf ändern
...
XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)
// Kontextparameter werden auf ihren vorherigen Zustand zurückgesetzt
```
