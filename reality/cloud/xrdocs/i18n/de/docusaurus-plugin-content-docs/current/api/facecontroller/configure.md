---
sidebar_position: 1
sidebar_label: configure()
---

# XR8.FaceController.configure()

`XR8.FaceController.configure({ nearClip, farClip, meshGeometry, coordinates })`

## Beschreibung {#description}

Legt fest, welche Verarbeitung von FaceController durchgeführt wird.

## Parameter {#parameters}

| Parameter                | Typ           | Standard                                 | Beschreibung                                                                                                                                                                                                                 |
| ------------------------ | ------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nearClip [Optional]      | `Nummer`      | `0.01`                                   | Die Entfernung der nahen Clipebene von der Kamera, d.h. die kürzeste Entfernung zur Kamera, in der Szenenobjekte sichtbar sind.                                                                                              |
| farClip [Optional]       | `Nummer`      | `1000`                                   | Die Entfernung der fernen Clipebene von der Kamera, d.h. die weiteste Entfernung zur Kamera, in der Szenenobjekte sichtbar sind.                                                                                             |
| meshGeometry [Optional]  | `Array`       | `[XR8.FaceController.MeshGeometry.FACE]` | Steuert, welche Teile der Kopfgeometrie sichtbar sind. Optionen: `[XR8.FaceController.MeshGeometry.FACE, XR8.FaceController.MeshGeometry.EYES, XR8.FaceController.MeshGeometry.IRIS, XR8.FaceController.MeshGeometry.MOUTH]` |
| maxDetections [Optional] | `Nummer`      | `1`                                      | Die maximale Anzahl der zu erkennenden Gesichter. Sie haben die Wahl zwischen 1, 2 und 3.                                                                                                                                    |
| enableEars [Optional]    | `Boolesche`   | `false`                                  | Wenn „true“, wird die Ohrenerkennung gleichzeitig mit den Gesichtseffekten ausgeführt und die Ohranbringungspunkte werden zurückgegeben.                                                                                     |
| uvType [Optional]        | `String`      | `[XR8.FaceController.UvType.STANDARD]`   | Legt fest, welche Uvs im Facescanning- und Faceloading-Ereignis zurückgegeben werden. Die Optionen sind: `[XR8.FaceController.UvType.STANDARD, XR8.FaceController.UvType.PROJECTED]`                                         |
| Koordinaten [Optional]   | `Koordinaten` |                                          | Die Kamerakonfiguration.                                                                                                                                                                                                     |

Das Objekt `Koordinaten` hat die folgenden Eigenschaften:

| Parameter                  | Typ                                             | Standard                                                             | Beschreibung                                              |
| -------------------------- | ----------------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------- |
| Ursprung [Optional]        | `{position: {x, y, z}, Rotation: {w, x, y, z}}` | `{position: {x: 0, y: 0, z: 0}, Rotation: {w: 1, x: 0, y: 0, z: 0}}` | Die Position und Drehung der Kamera.                      |
| skala [Optional]           | `Nummer`                                        | `1`                                                                  | Maßstab der Szene.                                        |
| Achsen [Optional]          | `String`                                        | `'RIGHT_HANDED'`                                                     | Kann entweder `'LEFT_HANDED'` oder `'RIGHT_HANDED'` sein. |
| mirroredDisplay [Optional] | `Boolesch`                                      | `Falsch`                                                             | Wenn wahr, spiegeln Sie in der Ausgabe links und rechts.  |

**WICHTIG:** [`XR8.FaceController`](./facecontroller.md) kann nicht gleichzeitig mit [`XR8.XrController`](../xrcontroller/xrcontroller.md) verwendet werden.

## Returns {#returns}

Keine

## Beispiel {#example}

```javascript
  XR8.FaceController.configure({
    meshGeometry: [XR8.FaceController.MeshGeometry.FACE],
    coordinates: {
      mirroredDisplay: true,
      axes: 'LEFT_HANDED',
    },
  })
```
