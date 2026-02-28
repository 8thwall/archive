---
sidebar_position: 1
sidebar_label: configure()
---

# XR8.HandController.configure()

`XR8.HandController.configure({ nearClip, farClip, coordinates })`

## Beschreibung {#description}

Legt fest, welche Verarbeitung von HandController durchgeführt wird.

## Parameter {#parameters}

| Parameter                | Typ           | Standard | Beschreibung                                                                                                                                      |
| ------------------------ | ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| nearClip [Optional]      | `Nummer`      | `0.01`   | Die Entfernung der nahen Clipebene von der Kamera, d.h. die kürzeste Entfernung zur Kamera, in der Szenenobjekte sichtbar sind.                   |
| farClip [Optional]       | `Nummer`      | `1000`   | Die Entfernung der fernen Clipebene von der Kamera, d.h. die weiteste Entfernung zur Kamera, in der Szenenobjekte sichtbar sind.                  |
| maxDetections [Optional] | `Nummer`      | `1`      | Die maximale Anzahl der zu erkennenden Hände. Die einzige verfügbare Option ist 1.                                                                |
| enableWrists [Optional]  | `Boolesche`   | `false`  | Wenn "true", wird die Handgelenkserkennung gleichzeitig mit der Handverfolgung durchgeführt und die Handgelenksansatzpunkte werden zurückgegeben. |
| Koordinaten [Optional]   | `Koordinaten` |          | Die Kamerakonfiguration.                                                                                                                          |

Das Objekt `Koordinaten` hat die folgenden Eigenschaften:

| Parameter                  | Typ                                             | Standard                                                             | Beschreibung                                              |
| -------------------------- | ----------------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------- |
| Ursprung [Optional]        | `{position: {x, y, z}, Rotation: {w, x, y, z}}` | `{position: {x: 0, y: 0, z: 0}, Rotation: {w: 1, x: 0, y: 0, z: 0}}` | Die Position und Drehung der Kamera.                      |
| Skala [Optional]           | `Nummer`                                        | `1`                                                                  | Maßstab der Szene.                                        |
| Achsen [Optional]          | `String`                                        | `'RIGHT_HANDED'`                                                     | Kann entweder `'LEFT_HANDED'` oder `'RIGHT_HANDED'` sein. |
| mirroredDisplay [Optional] | `Boolesch`                                      | `Falsch`                                                             | Wenn wahr, spiegeln Sie in der Ausgabe links und rechts.  |

**WICHTIG:** [`XR8.HandController`](./handcontroller.md) kann nicht gleichzeitig mit [`XR8.XrController`](../xrcontroller/xrcontroller.md) verwendet werden.

## Returns {#returns}

Keine

## Beispiel {#example}

```javascript
  XR8.HandController.configure({
    Koordinaten: {mirroredDisplay: false},
  })
```
