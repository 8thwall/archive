---
sidebar_label: setTextureProvider()
---

# XR8.GlTextureRenderer.setTextureProvider()

`XR8.GlTextureRenderer.setTextureProvider(({ frameStartResult, processGpuResult, processCpuResult }) => {} )`

## Beschreibung {#description}

Legt einen Anbieter fest, der die zu zeichnende Textur übergibt. Dies sollte eine Funktion sein, die die gleichen Eingaben erhält wie [`cameraPipelineModule.onUpdate`](/api/camerapipelinemodule/onupdate).

## Parameter {#parameters}

`setTextureProvider()` nimmt eine Funktion **** mit den folgenden Parametern entgegen:

| Parameter        | Typ      | Beschreibung                                                                                                                      |
| ---------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| frameStartResult | `Objekt` | Die Daten, die zu Beginn eines Frames bereitgestellt wurden.                                                                      |
| processGpuResult | `Objekt` | Daten, die von allen installierten Modulen während [`onProcessGpu`](/api/camerapipelinemodule/onprocessgpu) zurückgegeben werden. |
| processCpuResult | `Objekt` | Daten, die von allen installierten Modulen während [`onProcessCpu`](/api/camerapipelinemodule/onprocesscpu) zurückgegeben werden. |

Die Funktion sollte eine [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) zum Zeichnen zurückgeben.

## Returns {#returns}

Keine

## Beispiel {#example}

```javascript
XR8.GlTextureRenderer.setTextureProvider(
  ({processGpuResult}) => {
    return processGpuResult.camerapixelarray ? processGpuResult.camerapixelarray.srcTex : null
  })
```
