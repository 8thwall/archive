---
id: face
sidebar_position: 1
---

# Gesichtseffekte Ereignisse

## Typen {#types}

### TransformObject {#TransformObject}

| Eigentum        | Typ            | Beschreibung                                                                                                         |
| --------------- | -------------- | -------------------------------------------------------------------------------------------------------------------- |
| Position        | {x, y, z}      | Die 3d-Position der gefundenen Fläche.                                                               |
| Rotation        | `{w, x, y, z}` | Die lokale 3D-Orientierung der gefundenen Fläche.                                                    |
| Skala           | Nummer         | Ein Skalierungsfaktor, der auf Objekte angewendet werden soll, die mit dieser Fläche verbunden sind. |
| skalierteBreite | Nummer         | Ungefähre Breite des Kopfes in der Szene, multipliziert mit dem Maßstab.                             |
| scaledHeight    | Nummer         | Ungefähre Höhe des Kopfes in der Szene, multipliziert mit dem Maßstab.                               |
| scaledDepth     | Nummer         | Ungefähre Tiefe des Kopfes in der Szene bei Multiplikation mit dem Maßstab.                          |

## Veranstaltungen

### facefound {#facefound}

Dieses Ereignis wird von Face Effects ausgelöst, wenn ein Gesicht zum ersten Mal gefunden wird.

#### Eigenschaften

| Eigentum         | Typ                                             | Beschreibung                                                                                                                                                                                                                                      |
| ---------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id               | Nummer                                          | Eine numerische Kennung für die gefundene Fläche                                                                                                                                                                                                  |
| umwandeln        | [Transformationsobjekt](#TransformObject)       | Transformationsinformationen der gefundenen Fläche.                                                                                                                                                                               |
| Scheitelpunkte   | `[{x, y, z}]`                                   | Position der Gesichtspunkte, relativ zur Transformation.                                                                                                                                                                          |
| Normalen         | `[{x, y, z}]`                                   | Normale Richtung der Scheitelpunkte, relativ zur Transformation.                                                                                                                                                                  |
| attachmentPoints | { Name, Position: {x,y,z} }\\` | Siehe [`XR8.FaceController.AttachmentPoints`](https://www.8thwall.com/docs/api/facecontroller/attachmentpoints/) für die Liste der verfügbaren Befestigungspunkte. Die "Position" ist relativ zur Transformation. |
| uvsInCameraFrame | `[{u, v}]`                                      | Die Liste der uv-Positionen im Kamerabild, die den zurückgegebenen Scheitelpunkten entsprechen.                                                                                                                                   |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.facefound', (e) => {
    console.log(e)
})
```

### faceloading {#faceloading}

Dieses Ereignis wird von Face Effects ausgegeben, wenn der Ladevorgang für zusätzliche Face AR-Ressourcen beginnt.

#### Eigenschaften

| Eigentum           | Typ           | Beschreibung                                                                                                                                        |
| ------------------ | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| maxDetections      | Nummer        | Die maximale Anzahl von Flächen, die gleichzeitig verarbeitet werden können.                                                        |
| pointsPerDetection | Nummer        | Anzahl der Scheitelpunkte, die pro Fläche extrahiert werden.                                                                        |
| Indizes            | `[{a, b, c}]` | Indizes in das Scheitelpunkt-Array, die die Dreiecke des angeforderten Netzes bilden, wie mit meshGeometry auf configure angegeben. |
| uvs                | `[{u, v}]`    | uv-Positionen in eine Texturkarte, die den zurückgegebenen Scheitelpunkten entspricht.                                              |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.faceloading', (e) => {
    console.log(e)
})
```

### Gesichtsverlust {#facelost}

Dieses Ereignis wird von Face Effects ausgelöst, wenn ein Gesicht nicht mehr verfolgt wird.

#### Eigenschaften

| Eigentum | Typ    | Beschreibung                                                       |
| -------- | ------ | ------------------------------------------------------------------ |
| id       | Nummer | Eine numerische Kennung für das verlorene Gesicht. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.facelost', (e) => {
    console.log(e)
})
```

### Facescanning {#facescanning}

Dieses Ereignis wird von Face Effects ausgelöst, wenn alle Face-AR-Ressourcen geladen wurden und das Scannen begonnen hat.

#### Eigenschaften

| Eigentum           | Typ           | Beschreibung                                                                                                                                        |
| ------------------ | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| maxDetections      | Nummer        | Die maximale Anzahl von Flächen, die gleichzeitig verarbeitet werden können.                                                        |
| pointsPerDetection | Nummer        | Anzahl der Scheitelpunkte, die pro Fläche extrahiert werden.                                                                        |
| Indizes            | `[{a, b, c}]` | Indizes in das Scheitelpunkt-Array, die die Dreiecke des angeforderten Netzes bilden, wie mit meshGeometry auf configure angegeben. |
| uvs                | `[{u, v}]`    | uv-Positionen in eine Texturkarte, die den zurückgegebenen Scheitelpunkten entspricht.                                              |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.facescanning', (e) => {
    console.log(e)
})
```

### faceupdated {#faceupdated}

Dieses Ereignis wird von Face Effects ausgegeben, wenn anschließend Gesichter gefunden werden.

#### Eigenschaften

| Eigentum         | Typ                                             | Beschreibung                                                                                                                                                                                                                                      |
| ---------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id               | Nummer                                          | Eine numerische Kennung für die gefundene Fläche                                                                                                                                                                                                  |
| umwandeln        | [Transformationsobjekt](#TransformObject)       | Transformationsinformationen der gefundenen Fläche.                                                                                                                                                                               |
| Scheitelpunkte   | `[{x, y, z}]`                                   | Position der Gesichtspunkte, relativ zur Transformation.                                                                                                                                                                          |
| Normalen         | `[{x, y, z}]`                                   | Normale Richtung der Scheitelpunkte, relativ zur Transformation.                                                                                                                                                                  |
| attachmentPoints | { Name, Position: {x,y,z} }\\` | Siehe [`XR8.FaceController.AttachmentPoints`](https://www.8thwall.com/docs/api/facecontroller/attachmentpoints/) für die Liste der verfügbaren Befestigungspunkte. Die "Position" ist relativ zur Transformation. |
| uvsInCameraFrame | `[{u, v}]`                                      | Die Liste der uv-Positionen im Kamerabild, die den zurückgegebenen Scheitelpunkten entsprechen.                                                                                                                                   |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.faceupdated', (e) => {
    console.log(e)
})
```

### blinzelte {#blinked}

Dieses Ereignis wird von Face Effects ausgelöst, wenn die Augen eines verfolgten Gesichts blinzeln.

#### Eigenschaften

| Eigentum | Typ    | Beschreibung                                     |
| -------- | ------ | ------------------------------------------------ |
| id       | Nummer | Eine numerische Kennung für die gefundene Fläche |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.blinked', (e) => {
    console.log(e)
})
```

### Interpupillarer Abstand {#interpupillarydistance}

Dieses Ereignis wird von Face Effects ausgelöst, wenn der Abstand in Millimetern zwischen den Mittelpunkten der einzelnen Pupillen eines verfolgten Gesichts zum ersten Mal erkannt wird.

#### Eigenschaften

| Eigentum              | Typ    | Beschreibung                                                                                         |
| --------------------- | ------ | ---------------------------------------------------------------------------------------------------- |
| id                    | Nummer | Eine numerische Kennung für die gefundene Fläche.                                    |
| interpupillareDistanz | Nummer | Ungefährer Abstand in Millimetern zwischen den Mittelpunkten der einzelnen Pupillen. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.interpupillarydistance', (e) => {
    console.log(e)
})
```

### lefteyebrowlowered {#lefteyebrowlowered}

Dieses Ereignis wird von Face Effects ausgelöst, wenn der Abstand in Millimetern zwischen den Mittelpunkten der einzelnen Pupillen eines verfolgten Gesichts zum ersten Mal erkannt wird.

#### Eigenschaften

| Eigentum | Typ    | Beschreibung                                                      |
| -------- | ------ | ----------------------------------------------------------------- |
| id       | Nummer | Eine numerische Kennung für die gefundene Fläche. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyebrowlowered', (e) => {
    console.log(e)
})
```

### lefteyebrowraised {#lefteyebrowraised}

Dieses Ereignis wird von Face Effects ausgelöst, wenn die linke Augenbraue eines verfolgten Gesichts aus ihrer ursprünglichen Position angehoben wird, als das Gesicht gefunden wurde.

#### Eigenschaften

| Eigentum | Typ    | Beschreibung                                                      |
| -------- | ------ | ----------------------------------------------------------------- |
| id       | Nummer | Eine numerische Kennung für die gefundene Fläche. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyebrowraised', (e) => {
    console.log(e)
})
```

### linke Seite geschlossen {#lefteyeclosed}

Dieses Ereignis wird von Face Effects ausgelöst, wenn sich das linke Auge eines verfolgten Gesichts schließt.

#### Eigenschaften

| Eigentum | Typ    | Beschreibung                                                      |
| -------- | ------ | ----------------------------------------------------------------- |
| id       | Nummer | Eine numerische Kennung für die gefundene Fläche. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyeclosed', (e) => {
    console.log(e)
})
```

### lefteyeopened {#lefteyeopened}

Dieses Ereignis wird von Face Effects ausgelöst, wenn sich das linke Auge eines verfolgten Gesichts öffnet.

#### Eigenschaften

| Eigentum | Typ    | Beschreibung                                                      |
| -------- | ------ | ----------------------------------------------------------------- |
| id       | Nummer | Eine numerische Kennung für die gefundene Fläche. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyeopened', (e) => {
    console.log(e)
})
```

### lefteyewinked {#lefteyewinked}

Dieses Ereignis wird von Face Effects ausgelöst, wenn sich das linke Auge eines verfolgten Gesichts innerhalb von 750 ms schließt und öffnet, während das rechte Auge geöffnet bleibt.

#### Eigenschaften

| Eigentum | Typ    | Beschreibung                                                      |
| -------- | ------ | ----------------------------------------------------------------- |
| id       | Nummer | Eine numerische Kennung für die gefundene Fläche. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyewinked', (e) => {
    console.log(e)
})
```

### mundtot gemacht {#mouthclosed}

Dieses Ereignis wird von Face Effects ausgelöst, wenn sich der Mund eines verfolgten Gesichts schließt.

#### Eigenschaften

| Eigentum | Typ    | Beschreibung                                                      |
| -------- | ------ | ----------------------------------------------------------------- |
| id       | Nummer | Eine numerische Kennung für die gefundene Fläche. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.mouthclosed', (e) => {
    console.log(e)
})
```

### mit offenem Mund {#mouthopened}

Dieses Ereignis wird von Face Effects ausgelöst, wenn sich der Mund eines verfolgten Gesichts öffnet.

#### Eigenschaften

| Eigentum | Typ    | Beschreibung                                                      |
| -------- | ------ | ----------------------------------------------------------------- |
| id       | Nummer | Eine numerische Kennung für die gefundene Fläche. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.mouthopened', (e) => {
    console.log(e)
})
```

### rechtswirksam bevollmächtigt {#righteyebrowlowered}

Dieses Ereignis wird von Face Effects ausgelöst, wenn die rechte Augenbraue eines verfolgten Gesichts in ihre ursprüngliche Position gesenkt wird, als das Gesicht gefunden wurde.

#### Eigenschaften

| Eigentum | Typ    | Beschreibung                                                      |
| -------- | ------ | ----------------------------------------------------------------- |
| id       | Nummer | Eine numerische Kennung für die gefundene Fläche. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyebrowlowered', (e) => {
    console.log(e)
})
```

### rightteyebrowraised {#righteyebrowraised}

Dieses Ereignis wird von Face Effects ausgelöst, wenn die rechte Augenbraue eines verfolgten Gesichts aus ihrer ursprünglichen Position angehoben wird, als das Gesicht gefunden wurde.

#### Eigenschaften

| Eigentum | Typ    | Beschreibung                                                      |
| -------- | ------ | ----------------------------------------------------------------- |
| id       | Nummer | Eine numerische Kennung für die gefundene Fläche. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyebrowraised', (e) => {
    console.log(e)
})
```

### rechtswirksam geschlossen {#righteyeclosed}

Dieses Ereignis wird von Face Effects ausgelöst, wenn sich das rechte Auge eines verfolgten Gesichts schließt.

#### Eigenschaften

| Eigentum | Typ    | Beschreibung                                                      |
| -------- | ------ | ----------------------------------------------------------------- |
| id       | Nummer | Eine numerische Kennung für die gefundene Fläche. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyeclosed', (e) => {
    console.log(e)
})
```

### rechtgeöffnet {#righteyeopened}

Dieses Ereignis wird von Face Effects ausgelöst, wenn sich das rechte Auge eines verfolgten Gesichts öffnet.

#### Eigenschaften

| Eigentum | Typ    | Beschreibung                                                      |
| -------- | ------ | ----------------------------------------------------------------- |
| id       | Nummer | Eine numerische Kennung für die gefundene Fläche. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyeopened', (e) => {
    console.log(e)
})
```

### rechtwinklig {#righteyewinked}

Dieses Ereignis wird von Face Effects ausgelöst, wenn sich das rechte Auge eines verfolgten Gesichts innerhalb von 750 ms schließt und öffnet, während das linke Auge geöffnet bleibt.

#### Eigenschaften

| Eigentum | Typ    | Beschreibung                                                      |
| -------- | ------ | ----------------------------------------------------------------- |
| id       | Nummer | Eine numerische Kennung für die gefundene Fläche. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyewinked', (e) => {
    console.log(e)
})
```

### Ohrpunkt gefunden {#earpointfound}

Dieses Ereignis wird von Face Effects ausgelöst, wenn ein Ohrpunkt gefunden wird.

#### Eigenschaften

| Eigentum | Typ      | Beschreibung                                                                                                                                                                         |
| -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| id       | Nummer   | Eine numerische Kennung für die gefundene Fläche                                                                                                                                     |
| Punkt    | `String` | Name des Ohrpunkts. Eine der folgenden Angaben: "linkes Läppchen", "linker Kanal", "linke Helix", "rechtes Läppchen", "rechter Kanal", "rechte Helix |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.earpointfound', (e) => {
    console.log(e)
})
```

### earpointlost {#earpointlost}

Dieses Ereignis wird von Face Effects ausgelöst, wenn ein Ohrpunkt verloren geht.

#### Eigenschaften

| Eigentum | Typ      | Beschreibung                                                                                                                                                                         |
| -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| id       | Nummer   | Eine numerische Kennung für die gefundene Fläche                                                                                                                                     |
| Punkt    | `String` | Name des Ohrpunkts. Eine der folgenden Angaben: "linkes Läppchen", "linker Kanal", "linke Helix", "rechtes Läppchen", "rechter Kanal", "rechte Helix |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'facecontroller.earpointlost', (e) => {
    console.log(e)
})
```
