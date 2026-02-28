---
sidebar_label: configure()
---

# XR8.LayersController.configure()

`XR8.LayersController.configure({ nearClip, farClip, coordinates, layers })`

## Beschreibung {#description}

Konfiguriert die Verarbeitung, die von `LayersController` durchgeführt wird.

## Parameter {#parameters}

| Parameter              | Typ           | Standard | Beschreibung                                                                                                                                                                                                      |
| ---------------------- | ------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nearClip [Optional]    | `Nummer`      | `0.01`   | Die Entfernung der nahen Clipebene von der Kamera, d.h. die kürzeste Entfernung zur Kamera, in der Szenenobjekte sichtbar sind.                                                                                   |
| farClip [Optional]     | `Nummer`      | `1000`   | Die Entfernung der fernen Clipebene von der Kamera, d.h. die weiteste Entfernung zur Kamera, in der Szenenobjekte sichtbar sind.                                                                                  |
| koordinaten [Optional] | `Koordinaten` |          | Die Kamerakonfiguration.                                                                                                                                                                                          |
| ebenen [Optional]      | `Datensatz`   | `{}`     | Zu erkennende semantische Schichten. Der Schlüssel ist der Name der Ebene. Um eine Ebene zu entfernen, übergeben Sie `null` anstelle von `LayerOptions`. Der einzige derzeit unterstützte Ebenenname ist `'sky'`. |

Das Objekt `Koordinaten` hat die folgenden Eigenschaften:

| Parameter                  | Typ                                             | Standard                                                             | Beschreibung                                              |
| -------------------------- | ----------------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------- |
| Ursprung [Optional]        | `{position: {x, y, z}, Rotation: {w, x, y, z}}` | `{position: {x: 0, y: 2, z: 0}, Rotation: {w: 1, x: 0, y: 0, z: 0}}` | Die Position und Drehung der Kamera.                      |
| Skala [Optional]           | `Nummer`                                        | `2`                                                                  | Maßstab der Szene.                                        |
| Achsen [Optional]          | `String`                                        | `'RIGHT_HANDED'`                                                     | Kann entweder `'LEFT_HANDED'` oder `'RIGHT_HANDED'` sein. |
| mirroredDisplay [Optional] | `Boolesche`                                     | `false`                                                              | Wenn wahr, spiegeln Sie in der Ausgabe links und rechts.  |

Das Objekt `LayerOptions` hat die folgenden Eigenschaften:

| Parameter                  | Typ         | Standard | Beschreibung                                                                                                                                                                                                                                                                                          |
| -------------------------- | ----------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| invertLayerMask [Optional] | `Boolesche` | `false`  | Wenn Sie `true` wählen, werden Inhalte, die Sie in Ihrer Szene platzieren, in Bereichen außerhalb des Himmels sichtbar sein. Wenn Falsch</code>, werden die Inhalte, die Sie in Ihrer Szene platzieren, in den Himmelsbereichen sichtbar. Zum Zurücksetzen auf den Standardwert übergeben Sie `null`. |
| edgeSmoothness [Optional]  | `Nummer`    | `0`      | Menge, um die Ränder der Ebene zu glätten. Gültige Werte liegen zwischen [0-1]. Zum Zurücksetzen auf den Standardwert übergeben Sie `null`.                                                                                                                                                           |

**WICHTIG:** [`XR8.LayersController`](./layerscontroller.md) kann nicht gleichzeitig mit [`XR8.FaceController`](../facecontroller/facecontroller.md) verwendet werden.

## Returns {#returns}

Keine

## Beispiel {#example}

```javascript
XR8.LayersController.configure({layers: {sky: {invertLayerMask: true, edgeSmoothness: 0.8}}})
```
