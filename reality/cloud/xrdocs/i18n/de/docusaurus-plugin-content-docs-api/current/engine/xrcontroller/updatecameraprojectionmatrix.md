---
sidebar_label: updateCameraProjectionMatrix()
---

# XR8.XrController.updateCameraProjectionMatrix()

`XR8.XrController.updateCameraProjectionMatrix({ cam, origin, facing })`

## Beschreibung {#description}

Setzen Sie die Anzeigegeometrie der Szene und die Startposition der Kamera in der Szene zurück. Die Anzeigegeometrie wird benötigt, um die Position von Objekten in der virtuellen Szene ordnungsgemäß mit der entsprechenden Position im Kamerabild zu überlagern. Die Startposition gibt an, wo die Kamera zu Beginn einer Sitzung platziert und ausgerichtet wird.

## Parameter (alle fakultativ) {#parameters-all-optional}

| Keine                                                                      | Typ                                                              | Standard                                                                                                    | Beschreibung                                                                               |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| cam [Optional]         | `{pixelRectWidth, pixelRectHeight, nearClipPlane, farClipPlane}` | {nearClipPlane: 0.01, farClipPlane: 1000.0} | Die Konfiguration der Kamera.                                              |
| Herkunft [Optional]    | {x, y, z}                                                        | {x: 0, y: 2, z: 0}                                          | Die Ausgangsposition der Kamera in der Szene.                              |
| Verkleidung [Optional] | `{w, x, y, z}`                                                   | `{w: 1, x: 0, y: 0, z: 0}`                                                                                  | Die Startrichtung (Quaternion) der Kamera in der Szene. |

cam" hat die folgenden Parameter:

| Parameter       | Art      | Beschreibung                                                                                 |
| --------------- | -------- | -------------------------------------------------------------------------------------------- |
| pixelRectWidth  | `Nummer` | Die Breite der Leinwand, auf der das Kamerabild angezeigt wird.              |
| pixelRectHeight | `Nummer` | Die Höhe der Leinwand, auf der das Kamerabild angezeigt wird.                |
| nearClipPlane   | `Nummer` | Die geringste Entfernung zur Kamera, in der Objekte der Szene sichtbar sind. |
| farClipPlane    | `Nummer` | Die weiteste Entfernung zur Kamera, in der Objekte der Szene sichtbar sind.  |

## Rückgabe {#returns}

Keine

## Beispiel {#example}

```javascript
XR8.XrController.updateCameraProjectionMatrix({
  origin: { x: 1, y: 4, z: 0 },
  facing: { w: 0.9856, x: 0, y: 0.169, z: 0 }
})
```
