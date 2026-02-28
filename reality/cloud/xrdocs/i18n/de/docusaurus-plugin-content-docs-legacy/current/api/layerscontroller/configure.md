---
sidebar_label: konfigurieren()
---

# XR8.LayersController.configure()

`XR8.LayersController.configure({ nearClip, farClip, coordinates, layers })`

## Beschreibung {#description}

Konfiguriert die von `LayersController` durchgeführte Verarbeitung.

## Parameter {#parameters}

| Parameter                                                                    | Typ                             | Standard | Beschreibung                                                                                                                                                                                                                                                                      |
| ---------------------------------------------------------------------------- | ------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nearClip [Optional]      | Nummer                          | `0.01`   | Die Entfernung der nahen Clipebene von der Kamera, d. h. die kürzeste Entfernung zur Kamera, in der Szenenobjekte sichtbar sind.                                                                                                  |
| farClip [Optional]       | Nummer                          | `1000`   | Die Entfernung der fernen Clipebene von der Kamera, d. h. die weiteste Entfernung zur Kamera, in der Szenenobjekte sichtbar sind.                                                                                                 |
| Koordinaten [fakultativ] | `Koordinaten`                   |          | Die Konfiguration der Kamera.                                                                                                                                                                                                                                     |
| Schichten [Optional]     | `Record<String, LayerOptions?>` | `{}`     | Semantische Schichten zu erkennen. Der Schlüssel ist der Name der Ebene. Um eine Ebene zu entfernen, übergeben Sie `null` anstelle von `LayerOptions`. Der einzige unterstützte Ebenenname ist zur Zeit "Himmel". |

Das Objekt "Coordinates" hat die folgenden Eigenschaften:

| Parameter                                                                      | Typ                                             | Standard                                                             | Beschreibung                                                                     |
| ------------------------------------------------------------------------------ | ----------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Herkunft [Optional]        | `{Position: {x, y, z}, Rotation: {w, x, y, z}}` | `{Position: {x: 0, y: 2, z: 0}, Rotation: {w: 1, x: 0, y: 0, z: 0}}` | Die Position und Drehung der Kamera.                             |
| Skala [fakultativ]         | Nummer                                          | `2`                                                                  | Maßstab der Szene.                                               |
| Achsen [Optional]          | `String`                                        | 'RECHTSHÄNDER'                                                       | Kann entweder `'LEFT_HANDED'` oder `'RIGHT_HANDED'` sein.        |
| mirroredDisplay [Optional] | `Boolean`                                       | false                                                                | Wenn true, wird in der Ausgabe nach links und rechts gespiegelt. |

Das Objekt "LayerOptions" hat die folgenden Eigenschaften:

| Parameter                                                                      | Typ       | Standard | Beschreibung                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------ | --------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| invertLayerMask [Optional] | `Boolean` | false    | Bei "true" wird der Inhalt, den Sie in Ihrer Szene platzieren, in den Bereichen außerhalb des Himmels sichtbar sein. Wenn "False", werden die Inhalte, die Sie in Ihrer Szene platzieren, in den Himmelsbereichen sichtbar sein. Zum Zurücksetzen auf den Standardwert übergeben Sie `null`. |
| edgeSmoothness [Optional]  | Nummer    | `0`      | Menge, um die Ränder der Schicht zu glätten. Gültige Werte liegen zwischen [0-1]. Zum Zurücksetzen auf den Standardwert übergeben Sie `null`.                                                                                            |

**WICHTIG:** [`XR8.LayersController`](./layerscontroller.md) kann nicht gleichzeitig mit [`XR8.FaceController`](../facecontroller/facecontroller.md) verwendet werden.

## Rückgabe {#returns}

Keine

## Beispiel {#example}

```javascript
XR8.LayersController.configure({layers: {sky: {invertLayerMask: true, edgeSmoothness: 0.8}}})
```
