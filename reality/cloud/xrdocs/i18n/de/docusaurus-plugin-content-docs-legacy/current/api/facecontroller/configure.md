---
sidebar_position: 1
sidebar_label: konfigurieren()
---

# XR8.FaceController.configure()

XR8.FaceController.configure({ nearClip, farClip, meshGeometry, coordinates })\\`

## Beschreibung {#description}

Legt fest, welche Verarbeitung von FaceController durchgeführt wird.

## Parameter {#parameters}

| Parameter                                                                    | Typ             | Standard                                 | Beschreibung                                                                                                                                                                                                                                                 |
| ---------------------------------------------------------------------------- | --------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| nearClip [Optional]      | Nummer          | `0.01`                                   | Die Entfernung der nahen Clipebene von der Kamera, d. h. die kürzeste Entfernung zur Kamera, in der Szenenobjekte sichtbar sind.                                                                             |
| farClip [Optional]       | Nummer          | `1000`                                   | Die Entfernung der fernen Clipebene von der Kamera, d. h. die weiteste Entfernung zur Kamera, in der Szenenobjekte sichtbar sind.                                                                            |
| meshGeometry [Optional]  | `Array<String>` | `[XR8.FaceController.MeshGeometry.FACE]` | Steuert, welche Teile der Kopfgeometrie sichtbar sind. Optionen: `[XR8.FaceController.MeshGeometry.FACE, XR8.FaceController.MeshGeometry.EYES, XR8.FaceController.MeshGeometry.IRIS, XR8.FaceController.MeshGeometry.MOUTH]` |
| maxDetections [Optional] | Nummer          | `1`                                      | Die maximale Anzahl der zu erkennenden Gesichter. Die verfügbaren Optionen sind 1, 2 oder 3.                                                                                                                                 |
| enableEars [Optional]    | `Boolean`       | false                                    | Wenn "true", wird die Ohrenerkennung gleichzeitig mit den Gesichtseffekten ausgeführt und die Ohranlegepunkte werden zurückgegeben.                                                                                                          |
| uvType [Optional]        | `String`        | `[XR8.FaceController.UvType.STANDARD]`   | Gibt an, welche Uvs im Facescanning- und Faceloading-Ereignis zurückgegeben werden. Die Optionen sind: `[XR8.FaceController.UvType.STANDARD, XR8.FaceController.UvType.PROJECTED]`                                           |
| Koordinaten [fakultativ] | `Koordinaten`   |                                          | Die Konfiguration der Kamera.                                                                                                                                                                                                                |

Das Objekt "Coordinates" hat die folgenden Eigenschaften:

| Parameter                                                                      | Typ                                             | Standard                                                             | Beschreibung                                                                     |
| ------------------------------------------------------------------------------ | ----------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Herkunft [Optional]        | `{Position: {x, y, z}, Rotation: {w, x, y, z}}` | `{Position: {x: 0, y: 0, z: 0}, Rotation: {w: 1, x: 0, y: 0, z: 0}}` | Die Position und Drehung der Kamera.                             |
| Skala [fakultativ]         | Nummer                                          | `1`                                                                  | Maßstab der Szene.                                               |
| Achsen [Optional]          | `String`                                        | 'RECHTSHÄNDER'                                                       | Kann entweder `'LEFT_HANDED'` oder `'RIGHT_HANDED'` sein.        |
| mirroredDisplay [Optional] | `Boolean`                                       | Falsch                                                               | Wenn true, wird in der Ausgabe nach links und rechts gespiegelt. |

**WICHTIG:** [`XR8.FaceController`](./facecontroller.md) kann nicht gleichzeitig mit [`XR8.XrController`](../xrcontroller/xrcontroller.md) verwendet werden.

## Rückgabe {#returns}

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
