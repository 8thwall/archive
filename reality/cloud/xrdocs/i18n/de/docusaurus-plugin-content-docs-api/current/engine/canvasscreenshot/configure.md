---
sidebar_label: konfigurieren()
---

# XR8.CanvasScreenshot.configure()

XR8.CanvasScreenshot.configure({ maxDimension, jpgCompression })\\`

## Beschreibung {#description}

Legt das erwartete Ergebnis von Canvas-Screenshots fest.

## Parameter {#parameters}

| Parameter                                                                                        | Standard | Beschreibung                                                                                                                                                                            |
| ------------------------------------------------------------------------------------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| maxDimension: [Optional]     | `1280`   | Der Wert der größten erwarteten Dimension.                                                                                                                              |
| jpgKomprimierung: [Optional] | `75`     | 1-100 Wert, der die Qualität der JPEG-Komprimierung angibt. 100 ist ein geringer bis gar kein Verlust, und 1 ist ein Bild von sehr schlechter Qualität. |

## Rückgabe {#returns}

Keine

## Beispiel {#example}

```javascript
XR8.CanvasScreenshot.configure({ maxDimension: 640, jpgCompression: 50 })
```
