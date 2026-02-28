---
sidebar_position: 2
sidebar_label: pipelineModule()
---

# XR8.FaceController.pipelineModule()

`XR8.FaceController.pipelineModule()`

## Beschreibung {#description}

Erstellt ein Kamera-Pipelinemodul, das nach der Installierung Rückrufe empfängt, wenn die Kamera gestartet wurde, Ereignisse der Kameraprozessierung und andere Statusänderungen. Diese werden verwendet, um die Position der Kamera zu berechnen.

## Parameter {#parameters}

Keine

## Returns {#returns}

Return-Wert ist ein Objekt, das [`onUpdate`](/api/camerapipelinemodule/onupdate) als zur Verfügung gestellt wird:

`processCpuResult.facecontroller: { rotation, position, intrinsics, cameraFeedTexture }`

| Eigentum          | Typ                                                                            | Beschreibung                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| rotation          | `{w, x, y, z}`                                                                 | Die Ausrichtung (Quaternion) der Kamera in der Szene.                                                                              |
| position          | `{x, y, z}`                                                                    | Die Position der Kamera in der Szene.                                                                                              |
| intrinsisch       | `[Nummer]`                                                                     | Eine 16-dimensionale 4x4-Spalten-Projektionsmatrix, die der Szenekamera das gleiche Sichtfeld wie dem gerenderten Kamerabild gibt. |
| cameraFeedTexture | [`WebGLTextur`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | Die Textur, die die Kamerafeed-Daten enthält.                                                                                      |

## Versendete Ereignisse {#dispatched-events}

**faceloading**: Wird ausgelöst, wenn der Ladevorgang für zusätzliche Gesichtseffekt-AR-Ressourcen beginnt.

`faceloading.detail : {maxDetections, pointsPerDetection, indices, uvs}`

| Eigentum           | Typ           | Beschreibung                                                                                                                                                                          |
| ------------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| maxDetections      | `Nummer`      | Die maximale Anzahl von Gesichtern, die gleichzeitig verarbeitet werden können.                                                                                                       |
| pointsPerDetection | `Nummer`      | Anzahl der Scheitelpunkte, die pro Fläche extrahiert werden.                                                                                                                          |
| indices            | `[{a, b, c}]` | Die Liste der Indizes im Scheitelpunkt-Array, die die Dreiecke des angeforderten Netzes bilden, wie mit `meshGeometry` in [`XR8.FaceController.configure()`](configure.md) angegeben. |
| uvs                | `[{u, v}]`    | Die Liste der UV-Positionen in einer Textur-Map, die den zurückgegebenen Scheitelpunkten entspricht.                                                                                  |

**facescanning**: Wird ausgelöst, wenn alle Gesichtseffekt-AR-Ressourcen geladen wurden und das Scannen begonnen hat.

`facescanning.detail : {maxDetections, pointsPerDetection, indices, uvs}`

| Eigentum           | Typ           | Beschreibung                                                                                                                                                                          |
| ------------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| maxDetections      | `Nummer`      | Die maximale Anzahl von Gesichtern, die gleichzeitig verarbeitet werden können.                                                                                                       |
| pointsPerDetection | `Nummer`      | Anzahl der Scheitelpunkte, die pro Fläche extrahiert werden.                                                                                                                          |
| indices            | `[{a, b, c}]` | Die Liste der Indizes im Scheitelpunkt-Array, die die Dreiecke des angeforderten Netzes bilden, wie mit `meshGeometry` in [`XR8.FaceController.configure()`](configure.md) angegeben. |
| uvs                | `[{u, v}]`    | Die Liste der UV-Positionen in einer Textur-Map, die den zurückgegebenen Scheitelpunkten entspricht.                                                                                  |

**facefound**: Wird ausgelöst, wenn ein Gesicht zum ersten Mal gefunden wird.

`facefound.detail : {id, transform, vertices, normals, attachmentPoints}`

| Eigentum         | Typ                                                                   | Beschreibung                                                                                                                                                         |
| ---------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id               | `Nummer`                                                              | Eine numerische ID der gefundenen Fläche.                                                                                                                            |
| transform        | `{position, rotation, scale, scaledWidth, scaledHeight, scaledDepth}` | Transformieren Sie die Informationen der gefundenen Fläche.                                                                                                          |
| vertices         | `[{x, y, z}]`                                                         | Position der Gesichtspunkte, relativ zur Transformation.                                                                                                             |
| normals          | `[{x, y, z}]`                                                         | Normale Richtung der Scheitelpunkte, relativ zur Transformation.                                                                                                     |
| attachmentPoints | `{{>_head.html}}`                                                     | Siehe [`XR8.FaceController.AttachmentPoints`](attachmentpoints.md) für eine Liste der verfügbaren Befestigungspunkte. `die Position` ist relativ zur Transformation. |
| uvsInCameraFrame | `[{x, y, z}]`                                                         | Die Liste der uv-Positionen im Kamerabild, die den zurückgegebenen Scheitelpunkten entsprechen.                                                                      |

`transform` ist ein Objekt mit den folgenden Eigenschaften:

| Eigentum     | Typ            | Beschreibung                                                                                         |
| ------------ | -------------- | ---------------------------------------------------------------------------------------------------- |
| position     | `{x, y, z}`    | Die 3d-Position der gefundenen Fläche.                                                               |
| rotation     | `{w, x, y, z}` | Die lokale 3d-Ausrichtung der georteten Fläche.                                                      |
| scale        | `Nummer`       | Ein Skalierungsfaktor, der auf Objekte angewendet werden soll, die mit dieser Fläche verbunden sind. |
| scaledWidth  | `Nummer`       | Ungefähre Breite des Kopfes in der Szene, multipliziert mit dem Maßstab.                             |
| scaledHeight | `Nummer`       | Ungefähre Höhe des Kopfes in der Szene, multipliziert mit dem Maßstab.                               |
| scaledDepth  | `Nummer`       | Ungefähre Tiefe des Kopfes in der Szene, multipliziert mit dem Maßstab.                              |

**faceupdated**: Wird ausgelöst, wenn ein Gesicht nachträglich gefunden wird.

`faceupdated.detail : {id, transform, vertices, normals, attachmentPoints}`

| Eigentum         | Typ                                                                   | Beschreibung                                                                                                                                                         |
| ---------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id               | `Nummer`                                                              | Eine numerische ID der gefundenen Fläche.                                                                                                                            |
| transform        | `{position, rotation, scale, scaledWidth, scaledHeight, scaledDepth}` | Transformieren Sie die Informationen der gefundenen Fläche.                                                                                                          |
| vertices         | `[{x, y, z}]`                                                         | Position der Gesichtspunkte, relativ zur Transformation.                                                                                                             |
| normals          | `[{x, y, z}]`                                                         | Normale Richtung der Scheitelpunkte, relativ zur Transformation.                                                                                                     |
| attachmentPoints | `{{>_head.html}}`                                                     | Siehe [`XR8.FaceController.AttachmentPoints`](attachmentpoints.md) für eine Liste der verfügbaren Befestigungspunkte. `die Position` ist relativ zur Transformation. |
| uvsInCameraFrame | `[{u, v}]`                                                            | Die Liste der uv-Positionen im Kamerabild, die den zurückgegebenen Scheitelpunkten entsprechen.                                                                      |

`transform` ist ein Objekt mit den folgenden Eigenschaften:

| Eigentum     | Typ            | Beschreibung                                                                                         |
| ------------ | -------------- | ---------------------------------------------------------------------------------------------------- |
| position     | `{x, y, z}`    | Die 3d-Position der gefundenen Fläche.                                                               |
| rotation     | `{w, x, y, z}` | Die lokale 3d-Ausrichtung der georteten Fläche.                                                      |
| scale        | `Nummer`       | Ein Skalierungsfaktor, der auf Objekte angewendet werden soll, die mit dieser Fläche verbunden sind. |
| scaledWidth  | `Nummer`       | Ungefähre Breite des Kopfes in der Szene, multipliziert mit dem Maßstab.                             |
| scaledHeight | `Nummer`       | Ungefähre Höhe des Kopfes in der Szene, multipliziert mit dem Maßstab.                               |
| scaledDepth  | `Nummer`       | Ungefähre Tiefe des Kopfes in der Szene, multipliziert mit dem Maßstab.                              |

**facelost**: Wird ausgelöst, wenn ein Gesicht nicht mehr verfolgt wird.

`facelost.detail : { id }`

| Eigentum | Typ      | Beschreibung                              |
| -------- | -------- | ----------------------------------------- |
| id       | `Nummer` | Eine numerische ID der gefundenen Fläche. |

**mundgeöffnet**: Wird ausgelöst, wenn sich der Mund eines verfolgten Gesichts öffnet.

`mouthopened.detail : { id }`

| Eigentum | Typ      | Beschreibung                              |
| -------- | -------- | ----------------------------------------- |
| id       | `Nummer` | Eine numerische ID der gefundenen Fläche. |

**mund geschlossen**: Wird ausgelöst, wenn sich der Mund eines verfolgten Gesichts schließt.

`mouthclosed.detail : { id }`

| Eigentum | Typ      | Beschreibung                              |
| -------- | -------- | ----------------------------------------- |
| id       | `Nummer` | Eine numerische ID der gefundenen Fläche. |

**lefteyeopened**: Wird ausgelöst, wenn sich das linke Auge eines verfolgten Gesichts öffnet.

`lefteyeopened.detail : { id }`

| Eigentum | Typ      | Beschreibung                              |
| -------- | -------- | ----------------------------------------- |
| id       | `Nummer` | Eine numerische ID der gefundenen Fläche. |

**lefteyeclosed**: Wird ausgelöst, wenn sich das linke Auge eines verfolgten Gesichts schließt.

`lefteyeclosed.detail : { id }`

| Eigentum | Typ      | Beschreibung                              |
| -------- | -------- | ----------------------------------------- |
| id       | `Nummer` | Eine numerische ID der gefundenen Fläche. |

**righteyeopened**: Wird ausgelöst, wenn sich das rechte Auge eines verfolgten Gesichts öffnet.

`righteyeopened.detail : { id }`

| Eigentum | Typ      | Beschreibung                              |
| -------- | -------- | ----------------------------------------- |
| id       | `Nummer` | Eine numerische ID der gefundenen Fläche. |

**righteyeclosed**: Wird ausgelöst, wenn sich das rechte Auge eines verfolgten Gesichts schließt.

`righteyeclosed.detail : { id }`

| Eigentum | Typ      | Beschreibung                              |
| -------- | -------- | ----------------------------------------- |
| id       | `Nummer` | Eine numerische ID der gefundenen Fläche. |

**lefteyebrowraised**: Wird ausgelöst, wenn die linke Augenbraue eines verfolgten Gesichts aus der Ausgangsposition, als das Gesicht gefunden wurde, angehoben wird.

`lefteyebrowraised.detail : { id }`

| Eigentum | Typ      | Beschreibung                              |
| -------- | -------- | ----------------------------------------- |
| id       | `Nummer` | Eine numerische ID der gefundenen Fläche. |

**lefteyebrowlowered**: Wird ausgelöst, wenn die linke Augenbraue eines verfolgten Gesichts in ihre ursprüngliche Position gesenkt wird, als das Gesicht gefunden wurde.

`lefteyebrowlowered.detail : { id }`

| Eigentum | Typ      | Beschreibung                              |
| -------- | -------- | ----------------------------------------- |
| id       | `Nummer` | Eine numerische ID der gefundenen Fläche. |

**righteyebrowraised**: Wird ausgelöst, wenn die rechte Augenbraue eines verfolgten Gesichts aus der Position, in der das Gesicht gefunden wurde, angehoben wird.

`righteyebrowraised.detail : { id }`

| Eigentum | Typ      | Beschreibung                              |
| -------- | -------- | ----------------------------------------- |
| id       | `Nummer` | Eine numerische ID der gefundenen Fläche. |

**rechteAugenbrauegesenkt**: Wird ausgelöst, wenn die rechte Augenbraue eines verfolgten Gesichts in ihre ursprüngliche Position gesenkt wird, als das Gesicht gefunden wurde.

`righteyebrowlowered.detail : { id }`

| Eigentum | Typ      | Beschreibung                              |
| -------- | -------- | ----------------------------------------- |
| id       | `Nummer` | Eine numerische ID der gefundenen Fläche. |

**lefteyewinked**: Wird ausgelöst, wenn sich das linke Auge eines verfolgten Gesichts innerhalb von 750 ms schließt und öffnet, während das rechte Auge offen bleibt.

`lefteyewinked.detail : { id }`

| Eigentum | Typ      | Beschreibung                              |
| -------- | -------- | ----------------------------------------- |
| id       | `Nummer` | Eine numerische ID der gefundenen Fläche. |

**righteyewinked**: Wird ausgelöst, wenn sich das rechte Auge eines verfolgten Gesichts innerhalb von 750 ms schließt und öffnet, während das linke Auge offen bleibt.

`righteyewinked.detail : { id }`

| Eigentum | Typ      | Beschreibung                              |
| -------- | -------- | ----------------------------------------- |
| id       | `Nummer` | Eine numerische ID der gefundenen Fläche. |

**blinzeln**: Wird ausgelöst, wenn die Augen eines verfolgten Gesichts blinzeln.

`blinzelte.detail : { id }`

| Eigentum | Typ      | Beschreibung                              |
| -------- | -------- | ----------------------------------------- |
| id       | `Nummer` | Eine numerische ID der gefundenen Fläche. |

**pupillendistanz**: Wird ausgelöst, wenn der Abstand in Millimetern zwischen den Mittelpunkten der einzelnen Pupillen eines verfolgten Gesichts zum ersten Mal erkannt wird.

`interpupillarydistance.detail : {id, interpupillaryDistance}`

| Eigentum               | Typ      | Beschreibung                                                                         |
| ---------------------- | -------- | ------------------------------------------------------------------------------------ |
| id                     | `Nummer` | Eine numerische ID der gefundenen Fläche.                                            |
| interpupillaryDistance | `Nummer` | Ungefährer Abstand in Millimetern zwischen den Mittelpunkten der einzelnen Pupillen. |

Wenn `enableEars:true` (Ohrenerkennung) gleichzeitig mit den Gesichtseffekten läuft, werden folgende Ereignisse ausgelöst:

**earfound**: Wird ausgelöst, wenn ein Ohr zum ersten Mal gefunden wird.

`earfound.detail : {id, ear}`

| Eigenschaft | Typ      | Beschreibung                                                          |
| ----------- | -------- | --------------------------------------------------------------------- |
| ID          | `Nummer` | Eine numerische Kennung für die Fläche, an der das Ohr befestigt ist. |
| Ohr         | `String` | Kann entweder `links` oder `rechts`sein.                              |

**earpointfound**: Wird ausgelöst, wenn ein Ohranbringungspunkt zum ersten Mal gefunden wird.

`earpointfound.detail : {id, point}`

| Eigenschaft | Typ      | Beschreibung                                                                                          |
| ----------- | -------- | ----------------------------------------------------------------------------------------------------- |
| ID          | `Nummer` | Eine numerische Kennung für die Fläche, an der die Ohranbringungspunkte angebracht sind.              |
| Punkt       | `String` | Kann entweder `leftHelix`, `leftCanal`, `leftLobe`, `rightHelix`, `rightCanal`, oder `rightLobe`sein. |

**earlost**: Wird ausgelöst, wenn ein Ohr nicht mehr geortet wird.

`earlost.detail : {id, ear}`

| Eigenschaft | Typ      | Beschreibung                                                          |
| ----------- | -------- | --------------------------------------------------------------------- |
| ID          | `Nummer` | Eine numerische Kennung für die Fläche, an der das Ohr befestigt ist. |
| Ohr         | `String` | Kann entweder `links` oder `rechts`sein.                              |

**earpointlost**: Wird ausgelöst, wenn ein Ohranbringungspunkt nicht mehr verfolgt wird.

`earpointlost.detail : {id, point}`

| Eigenschaft | Typ      | Beschreibung                                                                                          |
| ----------- | -------- | ----------------------------------------------------------------------------------------------------- |
| ID          | `Nummer` | Eine numerische Kennung für die Fläche, an der die Ohranbringungspunkte angebracht sind.              |
| Punkt       | `String` | Kann entweder `leftHelix`, `leftCanal`, `leftLobe`, `rightHelix`, `rightCanal`, oder `rightLobe`sein. |

## Beispiel - Hinzufügen eines Pipeline-Moduls {#example---adding-pipeline-module}

```javascript
XR8.addCameraPipelineModule(XR8.FaceController.pipelineModule())
```
