---
id: face
sidebar_position: 2
---

# Face Events

## Ereignisse

### facefound

Dieses Ereignis wird von Face Effects ausgelöst, wenn ein Gesicht zum ersten Mal gefunden wird.

#### Eigenschaften

| Eigenschaft      | Typ                                           | Beschreibung                                                                                                                                                                                                                                       |
| ---------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID               | Nummer                                        | Eine numerische Kennung für die gefundene Fläche                                                                                                                                                                                                   |
| transform        | [`TransformObject`](#TransformObject)         | Transformieren Sie die Informationen der gefundenen Fläche.                                                                                                                                                                        |
| vertices         | `[{x, y, z}]`                                 | Position der Gesichtspunkte, relativ zur Transformation.                                                                                                                                                                           |
| normals          | `[{x, y, z}]`                                 | Normale Richtung der Scheitelpunkte, relativ zur Transformation.                                                                                                                                                                   |
| attachmentPoints | { Name, Position: {x,y,z} }\` | Siehe [`XR8.FaceController.AttachmentPoints`](https://www.8thwall.com/docs/api/facecontroller/attachmentpoints/) für eine Liste der verfügbaren Befestigungspunkte. Die "Position" ist relativ zur Transformation. |
| uvsInCameraFrame | `[{u, v}]`                                    | Die Liste der uv-Positionen im Kamerabild, die den zurückgegebenen Scheitelpunkten entsprechen.                                                                                                                                    |

##### TransformObject {#TransformObject}

| Eigenschaft  | Typ            | Beschreibung                                                                                                         |
| ------------ | -------------- | -------------------------------------------------------------------------------------------------------------------- |
| position     | {x, y, z}      | Die 3d-Position der gefundenen Fläche.                                                               |
| rotation     | `{w, x, y, z}` | Die lokale 3d-Ausrichtung der georteten Fläche.                                                      |
| scale        | Nummer         | Ein Skalierungsfaktor, der auf Objekte angewendet werden soll, die mit dieser Fläche verbunden sind. |
| scaledWidth  | Nummer         | Ungefähre Breite des Kopfes in der Szene, multipliziert mit dem Maßstab.                             |
| scaledHeight | Nummer         | Ungefähre Höhe des Kopfes in der Szene, multipliziert mit dem Maßstab.                               |
| scaledDepth  | Nummer         | Ungefähre Tiefe des Kopfes in der Szene, multipliziert mit dem Maßstab.                              |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.facefound', (e) => {
    console.log(e)
})
```

### faceloading

Dieses Ereignis wird von Face Effects ausgegeben, wenn der Ladevorgang für zusätzliche Face AR-Ressourcen beginnt.

#### Eigenschaften

| Eigenschaft        | Typ           | Beschreibung                                                                                                                                             |
| ------------------ | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| maxDetections      | Nummer        | Die maximale Anzahl von Gesichtern, die gleichzeitig verarbeitet werden können.                                                          |
| pointsPerDetection | Nummer        | Anzahl der Scheitelpunkte, die pro Fläche extrahiert werden.                                                                             |
| indices            | `[{a, b, c}]` | Indizes in dem Array mit den Eckpunkten, die die Dreiecke des angeforderten Netzes bilden, wie mit meshGeometry bei configure angegeben. |
| uvs                | `[{u, v}]`    | uv-Positionen in eine Texturkarte, die den zurückgegebenen Scheitelpunkten entspricht.                                                   |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.faceloading', (e) => {
    console.log(e)
})
```

### Gesichtsverlust

Dieses Ereignis wird von Face Effects ausgelöst, wenn ein Gesicht nicht mehr verfolgt wird.

#### Eigenschaften

| Eigenschaft | Typ    | Beschreibung                                                |
| ----------- | ------ | ----------------------------------------------------------- |
| ID          | Nummer | Eine numerische ID des verlorenen Gesichts. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.facelost', (e) => {
    console.log(e)
})
```

### Facescanning

Dieses Ereignis wird von Face Effects ausgelöst, wenn alle Face AR-Ressourcen geladen wurden und das Scannen begonnen hat.

#### Eigenschaften

| Eigenschaft        | Typ           | Beschreibung                                                                                                                                             |
| ------------------ | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| maxDetections      | Nummer        | Die maximale Anzahl von Gesichtern, die gleichzeitig verarbeitet werden können.                                                          |
| pointsPerDetection | Nummer        | Anzahl der Scheitelpunkte, die pro Fläche extrahiert werden.                                                                             |
| indices            | `[{a, b, c}]` | Indizes in dem Array mit den Eckpunkten, die die Dreiecke des angeforderten Netzes bilden, wie mit meshGeometry bei configure angegeben. |
| uvs                | `[{u, v}]`    | uv-Positionen in eine Texturkarte, die den zurückgegebenen Scheitelpunkten entspricht.                                                   |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.facescanning', (e) => {
    console.log(e)
})
```

### faceupdated

Dieses Ereignis wird von Face Effects ausgegeben, wenn anschließend Gesichter gefunden werden.

#### Eigenschaften

| Eigenschaft      | Typ                                           | Beschreibung                                                                                                                                                                                                                                       |
| ---------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID               | Nummer                                        | Eine numerische Kennung für die gefundene Fläche                                                                                                                                                                                                   |
| transform        | [`TransformObject`](#TransformObject)         | Transformieren Sie die Informationen der gefundenen Fläche.                                                                                                                                                                        |
| vertices         | `[{x, y, z}]`                                 | Position der Gesichtspunkte, relativ zur Transformation.                                                                                                                                                                           |
| normals          | `[{x, y, z}]`                                 | Normale Richtung der Scheitelpunkte, relativ zur Transformation.                                                                                                                                                                   |
| attachmentPoints | { Name, Position: {x,y,z} }\` | Siehe [`XR8.FaceController.AttachmentPoints`](https://www.8thwall.com/docs/api/facecontroller/attachmentpoints/) für eine Liste der verfügbaren Befestigungspunkte. Die "Position" ist relativ zur Transformation. |
| uvsInCameraFrame | `[{u, v}]`                                    | Die Liste der uv-Positionen im Kamerabild, die den zurückgegebenen Scheitelpunkten entsprechen.                                                                                                                                    |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.faceupdated', (e) => {
    console.log(e)
})
```

### blinzelte

Dieses Ereignis wird von Face Effects ausgelöst, wenn die Augen eines verfolgten Gesichts blinzeln.

#### Eigenschaften

| Eigenschaft | Typ    | Beschreibung                                     |
| ----------- | ------ | ------------------------------------------------ |
| ID          | Nummer | Eine numerische Kennung für die gefundene Fläche |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.blinked', (e) => {
    console.log(e)
})
```

### Interpupillarer Abstand

Dieses Ereignis wird von Face Effects ausgegeben, wenn der Abstand in Millimetern zwischen den Mittelpunkten der einzelnen Pupillen eines verfolgten Gesichts zum ersten Mal erkannt wird.

#### Eigenschaften

| Eigenschaft            | Typ    | Beschreibung                                                                                         |
| ---------------------- | ------ | ---------------------------------------------------------------------------------------------------- |
| ID                     | Nummer | Eine numerische ID der gefundenen Fläche.                                            |
| interpupillaryDistance | Nummer | Ungefährer Abstand in Millimetern zwischen den Mittelpunkten der einzelnen Pupillen. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.interpupillarydistance', (e) => {
    console.log(e)
})
```

### lefteyebrowlowered

Dieses Ereignis wird von Face Effects ausgegeben, wenn der Abstand in Millimetern zwischen den Mittelpunkten der einzelnen Pupillen eines verfolgten Gesichts zum ersten Mal erkannt wird.

#### Eigenschaften

| Eigenschaft | Typ    | Beschreibung                                              |
| ----------- | ------ | --------------------------------------------------------- |
| ID          | Nummer | Eine numerische ID der gefundenen Fläche. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyebrowlowered', (e) => {
    console.log(e)
})
```

### lefteyebrowraised

Dieses Ereignis wird von Face Effects ausgelöst, wenn die linke Augenbraue eines verfolgten Gesichts aus ihrer ursprünglichen Position angehoben wird, als das Gesicht gefunden wurde.

#### Eigenschaften

| Eigenschaft | Typ    | Beschreibung                                              |
| ----------- | ------ | --------------------------------------------------------- |
| ID          | Nummer | Eine numerische ID der gefundenen Fläche. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyebrowraised', (e) => {
    console.log(e)
})
```

### linke Seite geschlossen

Dieses Ereignis wird von Face Effects ausgelöst, wenn sich das linke Auge eines verfolgten Gesichts schließt.

#### Eigenschaften

| Eigenschaft | Typ    | Beschreibung                                              |
| ----------- | ------ | --------------------------------------------------------- |
| ID          | Nummer | Eine numerische ID der gefundenen Fläche. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyeclosed', (e) => {
    console.log(e)
})
```

### lefteyeopened

Dieses Ereignis wird von Face Effects ausgelöst, wenn sich das linke Auge eines verfolgten Gesichts öffnet.

#### Eigenschaften

| Eigenschaft | Typ    | Beschreibung                                              |
| ----------- | ------ | --------------------------------------------------------- |
| ID          | Nummer | Eine numerische ID der gefundenen Fläche. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyeopened', (e) => {
    console.log(e)
})
```

### lefteyewinked

Dieses Ereignis wird von Face Effects ausgelöst, wenn sich das linke Auge eines verfolgten Gesichts innerhalb von 750 ms schließt und öffnet, während das rechte Auge geöffnet bleibt.

#### Eigenschaften

| Eigenschaft | Typ    | Beschreibung                                              |
| ----------- | ------ | --------------------------------------------------------- |
| ID          | Nummer | Eine numerische ID der gefundenen Fläche. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyewinked', (e) => {
    console.log(e)
})
```

### mundtot gemacht

Dieses Ereignis wird von Face Effects ausgelöst, wenn sich der Mund eines verfolgten Gesichts schließt.

#### Eigenschaften

| Eigenschaft | Typ    | Beschreibung                                              |
| ----------- | ------ | --------------------------------------------------------- |
| ID          | Nummer | Eine numerische ID der gefundenen Fläche. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.mouthclosed', (e) => {
    console.log(e)
})
```

### mundgeöffnet

Dieses Ereignis wird von Face Effects ausgelöst, wenn sich der Mund eines verfolgten Gesichts öffnet.

#### Eigenschaften

| Eigenschaft | Typ    | Beschreibung                                              |
| ----------- | ------ | --------------------------------------------------------- |
| ID          | Nummer | Eine numerische ID der gefundenen Fläche. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.mouthopened', (e) => {
    console.log(e)
})
```

### rechtswirksam bevollmächtigt

Dieses Ereignis wird von Face Effects ausgelöst, wenn die rechte Augenbraue eines verfolgten Gesichts in ihre ursprüngliche Position gesenkt wird, als das Gesicht gefunden wurde.

#### Eigenschaften

| Eigenschaft | Typ    | Beschreibung                                              |
| ----------- | ------ | --------------------------------------------------------- |
| ID          | Nummer | Eine numerische ID der gefundenen Fläche. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyebrowlowered', (e) => {
    console.log(e)
})
```

### rightteyebrowraised

Dieses Ereignis wird von Face Effects ausgelöst, wenn die rechte Augenbraue eines verfolgten Gesichts aus ihrer ursprünglichen Position angehoben wird, als das Gesicht gefunden wurde.

#### Eigenschaften

| Eigenschaft | Typ    | Beschreibung                                              |
| ----------- | ------ | --------------------------------------------------------- |
| ID          | Nummer | Eine numerische ID der gefundenen Fläche. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyebrowraised', (e) => {
    console.log(e)
})
```

### rechtswirksam geschlossen

Dieses Ereignis wird von Face Effects ausgelöst, wenn sich das rechte Auge eines verfolgten Gesichts schließt.

#### Eigenschaften

| Eigenschaft | Typ    | Beschreibung                                              |
| ----------- | ------ | --------------------------------------------------------- |
| ID          | Nummer | Eine numerische ID der gefundenen Fläche. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyeclosed', (e) => {
    console.log(e)
})
```

### rechtgeöffnet

Dieses Ereignis wird von Face Effects ausgelöst, wenn sich das rechte Auge eines verfolgten Gesichts öffnet.

#### Eigenschaften

| Eigenschaft | Typ    | Beschreibung                                              |
| ----------- | ------ | --------------------------------------------------------- |
| ID          | Nummer | Eine numerische ID der gefundenen Fläche. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyeopened', (e) => {
    console.log(e)
})
```

### rechtwinklig

Dieses Ereignis wird von Face Effects ausgelöst, wenn sich das rechte Auge eines verfolgten Gesichts innerhalb von 750 ms schließt und öffnet, während das linke Auge geöffnet bleibt.

#### Eigenschaften

| Eigenschaft | Typ    | Beschreibung                                              |
| ----------- | ------ | --------------------------------------------------------- |
| ID          | Nummer | Eine numerische ID der gefundenen Fläche. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyewinked', (e) => {
    console.log(e)
})
```

### Ohrpunkt gefunden

Dieses Ereignis wird von Face Effects ausgelöst, wenn ein Ohrpunkt gefunden wird.

#### Eigenschaften

| Eigenschaft | Typ      | Beschreibung                                                                                                                                                                         |
| ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ID          | Nummer   | Eine numerische Kennung für die gefundene Fläche                                                                                                                                     |
| Punkt       | `String` | Name des Ohrpunkts. Eine der folgenden Angaben: "linkes Läppchen", "linker Kanal", "linke Helix", "rechtes Läppchen", "rechter Kanal", "rechte Helix |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.earpointfound', (e) => {
    console.log(e)
})
```

### earpointlost

Dieses Ereignis wird von Face Effects ausgelöst, wenn ein Ohrpunkt verloren geht.

#### Eigenschaften

| Eigenschaft | Typ      | Beschreibung                                                                                                                                                                         |
| ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ID          | Nummer   | Eine numerische Kennung für die gefundene Fläche                                                                                                                                     |
| Punkt       | `String` | Name des Ohrpunkts. Eine der folgenden Angaben: "linkes Läppchen", "linker Kanal", "linke Helix", "rechtes Läppchen", "rechter Kanal", "rechte Helix |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.earpointfound', (e) => {
    console.log(e)
})
```
