---
sidebar_label: hitTest()
---

# XR8.XrController.hitTest()

`XrController.hitTest(X, Y, includedTypes = [])`

## Beschreibung {#description}

Schätzen Sie die 3D-Position eines Punktes auf dem Kamerabild. X und Y werden als Zahlen zwischen 0 und 1 angegeben, wobei (0, 0) die obere linke Ecke und (1, 1) die untere rechte Ecke des Kamerafeeds ist, wie es in der Kamera gerendert wird, die durch [`XR8.XrController.updateCameraProjectionMatrix()`](updatecameraprojectionmatrix.md) angegeben wurde. Für einen einzelnen Treffertest können mehrere 3D-Positionsschätzungen zurückgegeben werden, abhängig von der Datenquelle, die zur Schätzung der Position verwendet wird. Die Datenquelle, die zur Schätzung der Position verwendet wurde, wird durch die `hitTest.type` angezeigt.

## Parameter {#parameters}

| Parameter     | Typ        | Beschreibung                                                                                         |
| ------------- | ---------- | ---------------------------------------------------------------------------------------------------- |
| X             | `Nummer`   | Wert zwischen 0 und 1, der die horizontale Position auf dem Kamerafeed von links nach rechts angibt. |
| Y             | `Nummer`   | Wert zwischen 0 und 1, der die vertikale Position auf dem Kamerabild von oben nach unten angibt.     |
| includedTypes | `[String]` | Liste, die `'FEATURE_POINT'` enthalten soll.                                                         |

## Returns {#returns}

Eine Reihe von geschätzten 3D-Positionen aus dem Treffertest:

`[{ type, position, rotation, distance }]`

| Parameter | Typ            | Beschreibung                                                                                  |
| --------- | -------------- | --------------------------------------------------------------------------------------------- |
| typ       | `String`       | Eine von `'FEATURE_POINT'`, `'ESTIMATED_SURFACE'`, `'DETECTED_SURFACE'`, oder `'UNSPECIFIED'` |
| position  | `{x, y, z}`    | Die geschätzte 3D-Position des abgefragten Punktes auf dem Kamerabild.                        |
| rotation  | `{x, y, z, w}` | Die geschätzte 3D-Drehung des abgefragten Punktes auf dem Kamerabild.                         |
| distance  | `Nummer`       | Die geschätzte Entfernung des abgefragten Punktes auf dem Kamerabild vom Gerät.               |

## Beispiel {#example}
```javascript
const hitTestHandler = (e) => {
  const x = e.touches[0].clientX / window.innerWidth
  const y = e.touches[0].clientY / window.innerHeight
  const hitTestResults = XR8.XrController.hitTest(x, y, ['FEATURE_POINT'])
}
```
