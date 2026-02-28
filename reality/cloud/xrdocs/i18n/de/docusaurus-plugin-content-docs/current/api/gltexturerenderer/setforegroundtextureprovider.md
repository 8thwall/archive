---
sidebar_label: setForegroundTextureProvider()
---

# XR8.GlTextureRenderer.setForegroundTextureProvider()

`XR8.GlTextureRenderer.setForegroundTextureProvider(({ frameStartResult, processGpuResult, processCpuResult }) => {} )`

## Beschreibung {#description}

Legt einen Anbieter fest, der eine Liste von Vordergrundtexturen zum Zeichnen übergibt. Dies sollte eine Funktion sein, die die gleichen Eingaben erhält wie [`cameraPipelineModule.onUpdate`](/api/camerapipelinemodule/onupdate).

## Parameter {#parameters}

`setForegroundTextureProvider()` nimmt eine **Funktion** mit den folgenden Parametern entgegen:

| Parameter        | Typ      | Beschreibung                                                                                                                      |
| ---------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| frameStartResult | `Objekt` | Die Daten, die zu Beginn eines Frames bereitgestellt wurden.                                                                      |
| processGpuResult | `Objekt` | Daten, die von allen installierten Modulen während [`onProcessGpu`](/api/camerapipelinemodule/onprocessgpu) zurückgegeben werden. |
| processCpuResult | `Objekt` | Daten, die von allen installierten Modulen während [`onProcessCpu`](/api/camerapipelinemodule/onprocesscpu) zurückgegeben werden. |

Die Funktion sollte ein Array von Objekten zurückgeben, die jeweils die folgenden Eigenschaften enthalten:

| Eigentum                              | Typ                                                                             | Standard    | Beschreibung                                                                                                                                        |
| ------------------------------------- | ------------------------------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| foregroundTexture                     | [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) |             | Die zu zeichnende Textur des Vordergrunds.                                                                                                          |
| foregroundMaskTexture                 | [`WebGLTextur`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture)  |             | Eine Alphamaske, die für die foregroundTexture verwendet wird. Der `r` Kanal der `foregroundMaskTexture` wird für die Alpha-Überblendung verwendet. |
| foregroundTextureFlipY [Optional]     | `false`                                                                         | `Boolesche` | Ob die `foregroundTexture` gespiegelt werden soll.                                                                                                  |
| foregroundMaskTextureFlipY [Optional] | `false`                                                                         | `Boolesche` | Ob die `foregroundMaskTexture` gespiegelt werden soll.                                                                                              |

Die Vordergrundtexturen werden über der Textur gezeichnet, die durch den Aufruf von [`XR8.GlTextureRenderer.setTextureProvider()`](filltextureviewport.md) bereitgestellt wird. Die Texturen des Vordergrunds werden in der Reihenfolge des zurückgegebenen Arrays gezeichnet.

## Returns {#returns}

Keine

## Beispiel {#example}

```javascript
XR8.GlTextureRenderer.setForegroundTextureProvider(
  ({processGpuResult}) => {
    // Verarbeiten Sie etwas.
    return [{
      foregroundTexture,
      foregroundMaskTexture,
      foregroundTextureFlipY,
      foregroundMaskTextureFlipY
    }]
  })
```
