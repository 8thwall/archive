---
sidebar_position: 1
sidebar_label: konfigurieren()
---

# XR8.HandController.configure()

XR8.HandController.configure({ nearClip, farClip, coordinates })\\`

## Beschreibung {#description}

Legt fest, welche Verarbeitung von HandController durchgeführt wird.

## Parameter {#parameters}

| Parameter                                                                    | Typ           | Standard | Beschreibung                                                                                                                                                                      |
| ---------------------------------------------------------------------------- | ------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nearClip [Optional]      | Nummer        | `0.01`   | Die Entfernung der nahen Clipebene von der Kamera, d. h. die kürzeste Entfernung zur Kamera, in der Szenenobjekte sichtbar sind.  |
| farClip [Optional]       | Nummer        | `1000`   | Die Entfernung der fernen Clipebene von der Kamera, d. h. die weiteste Entfernung zur Kamera, in der Szenenobjekte sichtbar sind. |
| maxDetections [Optional] | Nummer        | `1`      | Die maximale Anzahl der zu erkennenden Hände. Die einzige verfügbare Option ist 1.                                                                |
| enableWrists [Optional]  | `Boolean`     | false    | Wenn "true", wird die Handgelenkserkennung gleichzeitig mit der Handverfolgung ausgeführt und die Handgelenksanhängepunkte werden zurückgegeben.                  |
| Koordinaten [fakultativ] | `Koordinaten` |          | Die Konfiguration der Kamera.                                                                                                                                     |

Das Objekt "Coordinates" hat die folgenden Eigenschaften:

| Parameter                                                                      | Typ                                             | Standard                                                             | Beschreibung                                                                     |
| ------------------------------------------------------------------------------ | ----------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Herkunft [Optional]        | `{Position: {x, y, z}, Rotation: {w, x, y, z}}` | `{Position: {x: 0, y: 0, z: 0}, Rotation: {w: 1, x: 0, y: 0, z: 0}}` | Die Position und Drehung der Kamera.                             |
| Skala [fakultativ]         | Nummer                                          | `1`                                                                  | Maßstab der Szene.                                               |
| Achsen [Optional]          | `String`                                        | 'RECHTSHÄNDER'                                                       | Kann entweder `'LEFT_HANDED'` oder `'RIGHT_HANDED'` sein.        |
| mirroredDisplay [Optional] | `Boolean`                                       | Falsch                                                               | Wenn true, wird in der Ausgabe nach links und rechts gespiegelt. |

**WICHTIG:** [`XR8.HandController`](./handcontroller.md) kann nicht gleichzeitig mit [`XR8.XrController`](../xrcontroller/xrcontroller.md) verwendet werden.

## Rückgabe {#returns}

Keine

## Beispiel {#example}

```javascript
  XR8.HandController.configure({
    coordinates: {mirroredDisplay: false},
})
```
