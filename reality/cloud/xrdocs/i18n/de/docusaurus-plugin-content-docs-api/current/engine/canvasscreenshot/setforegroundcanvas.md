---
sidebar_label: setForegroundCanvas()
---

# XR8.CanvasScreenshot.setForegroundCanvas()

XR8.CanvasScreenshot.setForegroundCanvas(canvas)\\`

## Beschreibung {#description}

Legt eine Vordergrundleinwand fest, die über der Kameraleinwand angezeigt wird. Diese muss die gleichen Abmessungen haben wie die Leinwand der Kamera.

Nur erforderlich, wenn Sie getrennte Leinwände für die Kameraübertragung und die virtuellen Objekte verwenden.

## Parameter {#parameters}

| Parameter | Beschreibung                                                              |
| --------- | ------------------------------------------------------------------------- |
| Leinwand  | Die Leinwand, die im Bildschirmfoto als Vordergrund verwendet werden soll |

## Rückgabe {#returns}

Keine

## Beispiel {#example}

```javascript
const myOtherCanvas = document.getElementById('canvas2')
XR8.CanvasScreenshot.setForegroundCanvas(myOtherCanvas)
```
