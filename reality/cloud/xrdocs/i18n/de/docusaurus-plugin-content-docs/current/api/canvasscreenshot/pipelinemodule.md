---
sidebar_label: pipelineModule()
---

# XR8.CanvasScreenshot.pipelineModule()

`XR8.CanvasScreenshot.pipelineModule()`

## Beschreibung {#description}

Erstellt ein Kamera-Pipeline-Modul, das, wenn es installiert ist, Rückrufe empfängt, wenn die Kamera gestartet wurde und wenn sich die Leinwandgröße geändert hat.

## Parameter {#parameters}

Keine

## Returns {#returns}

Ein CanvasScreenshot-Pipelinemodul, das über [XR8.addCameraPipelineModule()](/api/xr8/addcamerapipelinemodule) hinzugefügt werden kann.

## Beispiel {#example}

```javascript
XR8.addCameraPipelineModule(XR8.CanvasScreenshot.pipelineModule())
```
