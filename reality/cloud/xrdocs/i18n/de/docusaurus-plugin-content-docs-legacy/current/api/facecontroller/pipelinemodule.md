---
sidebar_position: 2
sidebar_label: pipelineModule()
---

# XR8.FaceController.pipelineModule()

XR8.FaceController.pipelineModule()\\`

## Beschreibung {#description}

Erstellt ein Kamera-Pipeline-Modul, das, wenn es installiert ist, Rückrufe empfängt, wenn die Kamera gestartet wurde, Ereignisse zur Kameraprozessierung und andere Zustandsänderungen. Diese werden verwendet, um die Position der Kamera zu berechnen.

## Parameter {#parameters}

Keine

## Rückgabe {#returns}

Rückgabewert ist ein Objekt, das für [`onUpdate`](/legacy/api/camerapipelinemodule/onupdate) als zur Verfügung gestellt wird:

`processCpuResult.facecontroller: { rotation, position, intrinsics, cameraFeedTexture }`

| Eigentum          | Typ                                                                          | Beschreibung                                                                                                                                            |
| ----------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rotation          | `{w, x, y, z}`                                                               | Die Ausrichtung (Quaternion) der Kamera in der Szene.                                                                |
| Position          | {x, y, z}                                                                    | Die Position der Kamera in der Szene.                                                                                                   |
| Intrinsics        | `[Zahl]`                                                                     | Eine 16-dimensionale spaltengroße 4x4-Projektionsmatrix, die der Szenekamera das gleiche Sichtfeld wie dem gerenderten Kamerabild gibt. |
| cameraFeedTexture | [WebGLTextur](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | Die Textur, die die Kamerafeed-Daten enthält.                                                                                           |

## Versendete Ereignisse {#dispatched-events}

**Faceloading**: Wird ausgelöst, wenn der Ladevorgang für zusätzliche Face-AR-Ressourcen beginnt.

`faceloading.detail : {maxDetections, pointsPerDetection, indices, uvs}`

| Eigentum           | Typ           | Beschreibung                                                                                                                                                                                          |
| ------------------ | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| maxDetections      | Nummer        | Die maximale Anzahl von Flächen, die gleichzeitig verarbeitet werden können.                                                                                                          |
| pointsPerDetection | Nummer        | Anzahl der Scheitelpunkte, die pro Fläche extrahiert werden.                                                                                                                          |
| Indizes            | `[{a, b, c}]` | Die Liste der Indizes im Scheitelpunkt-Array, die die Dreiecke des angeforderten Netzes bilden, wie mit `meshGeometry` in [`XR8.FaceController.configure()`](configure.md) angegeben. |
| uvs                | `[{u, v}]`    | Die Liste der UV-Positionen in einer Texturkarte, die den zurückgegebenen Scheitelpunkten entspricht.                                                                                 |

**Gesichtsabtastung**: Wird ausgelöst, wenn alle Gesichts-AR-Ressourcen geladen sind und das Scannen begonnen hat.

Gesichter scannen.detail : {maxDetections, pointsPerDetection, indices, uvs}\\`

| Eigentum           | Typ           | Beschreibung                                                                                                                                                                                          |
| ------------------ | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| maxDetections      | Nummer        | Die maximale Anzahl von Flächen, die gleichzeitig verarbeitet werden können.                                                                                                          |
| pointsPerDetection | Nummer        | Anzahl der Scheitelpunkte, die pro Fläche extrahiert werden.                                                                                                                          |
| Indizes            | `[{a, b, c}]` | Die Liste der Indizes im Scheitelpunkt-Array, die die Dreiecke des angeforderten Netzes bilden, wie mit `meshGeometry` in [`XR8.FaceController.configure()`](configure.md) angegeben. |
| uvs                | `[{u, v}]`    | Die Liste der UV-Positionen in einer Texturkarte, die den zurückgegebenen Scheitelpunkten entspricht.                                                                                 |

**Gesicht gefunden**: Wird ausgelöst, wenn ein Gesicht zum ersten Mal gefunden wird.

`facefound.detail : {id, transform, vertices, normals, attachmentPoints}`

| Eigentum         | Typ                                                                   | Beschreibung                                                                                                                                                                                        |
| ---------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id               | Nummer                                                                | Eine numerische Kennung für die gefundene Fläche.                                                                                                                                   |
| umwandeln        | `{position, rotation, scale, scaledWidth, scaledHeight, scaledDepth}` | Transformationsinformationen der gefundenen Fläche.                                                                                                                                 |
| Scheitelpunkte   | `[{x, y, z}]`                                                         | Position der Gesichtspunkte, relativ zur Transformation.                                                                                                                            |
| Normalen         | `[{x, y, z}]`                                                         | Normale Richtung der Scheitelpunkte, relativ zur Transformation.                                                                                                                    |
| attachmentPoints | `{name, position: {x,y,z}}`                                           | Siehe [`XR8.FaceController.AttachmentPoints`](attachmentpoints.md) für die Liste der verfügbaren Befestigungspunkte. Die "Position" ist relativ zur Transformation. |
| uvsInCameraFrame | `[{u, v}]`                                                            | Die Liste der uv-Positionen im Kamerabild, die den zurückgegebenen Scheitelpunkten entsprechen.                                                                                     |

transform" ist ein Objekt mit den folgenden Eigenschaften:

| Eigentum        | Typ            | Beschreibung                                                                                                         |
| --------------- | -------------- | -------------------------------------------------------------------------------------------------------------------- |
| Position        | {x, y, z}      | Die 3d-Position der gefundenen Fläche.                                                               |
| Rotation        | `{w, x, y, z}` | Die lokale 3D-Orientierung der gefundenen Fläche.                                                    |
| Skala           | Nummer         | Ein Skalierungsfaktor, der auf Objekte angewendet werden soll, die mit dieser Fläche verbunden sind. |
| skalierteBreite | Nummer         | Ungefähre Breite des Kopfes in der Szene, multipliziert mit dem Maßstab.                             |
| scaledHeight    | Nummer         | Ungefähre Höhe des Kopfes in der Szene, multipliziert mit dem Maßstab.                               |
| scaledDepth     | Nummer         | Ungefähre Tiefe des Kopfes in der Szene bei Multiplikation mit dem Maßstab.                          |

**faceupdated**: Wird ausgelöst, wenn ein Gesicht nachträglich gefunden wird.

`faceupdated.detail : {id, transform, vertices, normals, attachmentPoints}`

| Eigentum         | Typ                                                                   | Beschreibung                                                                                                                                                                                        |
| ---------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id               | Nummer                                                                | Eine numerische Kennung für die gefundene Fläche.                                                                                                                                   |
| umwandeln        | `{position, rotation, scale, scaledWidth, scaledHeight, scaledDepth}` | Transformationsinformationen der gefundenen Fläche.                                                                                                                                 |
| Scheitelpunkte   | `[{x, y, z}]`                                                         | Position der Gesichtspunkte, relativ zur Transformation.                                                                                                                            |
| Normalen         | `[{x, y, z}]`                                                         | Normale Richtung der Scheitelpunkte, relativ zur Transformation.                                                                                                                    |
| attachmentPoints | `{name, position: {x,y,z}}`                                           | Siehe [`XR8.FaceController.AttachmentPoints`](attachmentpoints.md) für die Liste der verfügbaren Befestigungspunkte. Die "Position" ist relativ zur Transformation. |
| uvsInCameraFrame | `[{u, v}]`                                                            | Die Liste der uv-Positionen im Kamerabild, die den zurückgegebenen Scheitelpunkten entsprechen.                                                                                     |

transform" ist ein Objekt mit den folgenden Eigenschaften:

| Eigentum        | Typ            | Beschreibung                                                                                                         |
| --------------- | -------------- | -------------------------------------------------------------------------------------------------------------------- |
| Position        | {x, y, z}      | Die 3d-Position der gefundenen Fläche.                                                               |
| Rotation        | `{w, x, y, z}` | Die lokale 3D-Orientierung der gefundenen Fläche.                                                    |
| Skala           | Nummer         | Ein Skalierungsfaktor, der auf Objekte angewendet werden soll, die mit dieser Fläche verbunden sind. |
| skalierteBreite | Nummer         | Ungefähre Breite des Kopfes in der Szene, multipliziert mit dem Maßstab.                             |
| scaledHeight    | Nummer         | Ungefähre Höhe des Kopfes in der Szene, multipliziert mit dem Maßstab.                               |
| scaledDepth     | Nummer         | Ungefähre Tiefe des Kopfes in der Szene bei Multiplikation mit dem Maßstab.                          |

**Gesichtsverlust**: Wird ausgelöst, wenn ein Gesicht nicht mehr verfolgt wird.

`facelost.detail : { id }`

| Eigentum | Typ    | Beschreibung                                                      |
| -------- | ------ | ----------------------------------------------------------------- |
| id       | Nummer | Eine numerische Kennung für die gefundene Fläche. |

**Mund geöffnet**: Wird ausgelöst, wenn sich der Mund eines verfolgten Gesichts öffnet.

`mouthopened.detail : { id }`

| Eigentum | Typ    | Beschreibung                                                      |
| -------- | ------ | ----------------------------------------------------------------- |
| id       | Nummer | Eine numerische Kennung für die gefundene Fläche. |

**Mund geschlossen**: Wird ausgelöst, wenn sich der Mund eines verfolgten Gesichts schließt.

`mouthclosed.detail : { id }`

| Eigentum | Typ    | Beschreibung                                                      |
| -------- | ------ | ----------------------------------------------------------------- |
| id       | Nummer | Eine numerische Kennung für die gefundene Fläche. |

**lefteyeopened**: Wird ausgelöst, wenn sich das linke Auge eines verfolgten Gesichts öffnet.

`lefteyeopened.detail : { id }`

| Eigentum | Typ    | Beschreibung                                                      |
| -------- | ------ | ----------------------------------------------------------------- |
| id       | Nummer | Eine numerische Kennung für die gefundene Fläche. |

**lefteyeclosed**: Wird ausgelöst, wenn sich das linke Auge eines verfolgten Gesichts schließt.

`lefteyeclosed.detail : { id }`

| Eigentum | Typ    | Beschreibung                                                      |
| -------- | ------ | ----------------------------------------------------------------- |
| id       | Nummer | Eine numerische Kennung für die gefundene Fläche. |

**rechtesAugegeöffnet**: Wird ausgelöst, wenn sich das rechte Auge eines verfolgten Gesichts öffnet.

`righteyeopened.detail : { id }`

| Eigentum | Typ    | Beschreibung                                                      |
| -------- | ------ | ----------------------------------------------------------------- |
| id       | Nummer | Eine numerische Kennung für die gefundene Fläche. |

**Rechtes Auge geschlossen**: Wird ausgelöst, wenn sich das rechte Auge eines verfolgten Gesichts schließt.

`righteyeclosed.detail : { id }`

| Eigentum | Typ    | Beschreibung                                                      |
| -------- | ------ | ----------------------------------------------------------------- |
| id       | Nummer | Eine numerische Kennung für die gefundene Fläche. |

**lefteyebrowraised**: Wird ausgelöst, wenn die linke Augenbraue eines verfolgten Gesichts gegenüber der ursprünglichen Position beim Auffinden des Gesichts angehoben wird.

`lefteyebrowraised.detail : { id }`

| Eigentum | Typ    | Beschreibung                                                      |
| -------- | ------ | ----------------------------------------------------------------- |
| id       | Nummer | Eine numerische Kennung für die gefundene Fläche. |

**lefteyebrowlowered**: Wird ausgelöst, wenn die linke Augenbraue eines verfolgten Gesichts in ihre ursprüngliche Position gesenkt wird, als das Gesicht gefunden wurde.

`lefteyebrowlowered.detail : { id }`

| Eigentum | Typ    | Beschreibung                                                      |
| -------- | ------ | ----------------------------------------------------------------- |
| id       | Nummer | Eine numerische Kennung für die gefundene Fläche. |

**rechteAugenbraueangehoben**: Wird ausgelöst, wenn die rechte Augenbraue eines georteten Gesichts gegenüber der Position beim Auffinden des Gesichts angehoben wird.

`righteyebrowraised.detail : { id }`

| Eigentum | Typ    | Beschreibung                                                      |
| -------- | ------ | ----------------------------------------------------------------- |
| id       | Nummer | Eine numerische Kennung für die gefundene Fläche. |

**Rechte Augenbraue gesenkt**: Wird ausgelöst, wenn die rechte Augenbraue eines verfolgten Gesichts in ihre ursprüngliche Position gesenkt wird, als das Gesicht gefunden wurde.

`righteyebrowlowered.detail : { id }`

| Eigentum | Typ    | Beschreibung                                                      |
| -------- | ------ | ----------------------------------------------------------------- |
| id       | Nummer | Eine numerische Kennung für die gefundene Fläche. |

**lefteyewinked**: Wird ausgelöst, wenn sich das linke Auge eines verfolgten Gesichts innerhalb von 750 ms schließt und öffnet, während das rechte Auge offen bleibt.

`lefteyewinked.detail : { id }`

| Eigentum | Typ    | Beschreibung                                                      |
| -------- | ------ | ----------------------------------------------------------------- |
| id       | Nummer | Eine numerische Kennung für die gefundene Fläche. |

**Rechtsgeblinzelt**: Wird ausgelöst, wenn sich das rechte Auge eines verfolgten Gesichts innerhalb von 750 ms schließt und öffnet, während das linke Auge offen bleibt.

`righteyewinked.detail : { id }`

| Eigentum | Typ    | Beschreibung                                                      |
| -------- | ------ | ----------------------------------------------------------------- |
| id       | Nummer | Eine numerische Kennung für die gefundene Fläche. |

**geblinzelt**: Wird ausgelöst, wenn die Augen eines verfolgten Gesichts blinzeln.

`blinked.detail : { id }`

| Eigentum | Typ    | Beschreibung                                                      |
| -------- | ------ | ----------------------------------------------------------------- |
| id       | Nummer | Eine numerische Kennung für die gefundene Fläche. |

**Pupillendistanz**: Wird ausgelöst, wenn der Abstand in Millimetern zwischen den Mittelpunkten der einzelnen Pupillen eines verfolgten Gesichts zum ersten Mal erkannt wird.

`interpupillarydistance.detail : {id, interpupillaryDistance}`

| Eigentum              | Typ    | Beschreibung                                                                                         |
| --------------------- | ------ | ---------------------------------------------------------------------------------------------------- |
| id                    | Nummer | Eine numerische Kennung für die gefundene Fläche.                                    |
| interpupillareDistanz | Nummer | Ungefährer Abstand in Millimetern zwischen den Mittelpunkten der einzelnen Pupillen. |

Wenn `enableEars:true` läuft die Ohrenerkennung gleichzeitig mit den Gesichtseffekten und löst die folgenden Ereignisse aus:

**Ohr gefunden**: Wird ausgelöst, wenn ein Ohr zum ersten Mal gefunden wird.

`earfound.detail : {id, ear}`

| Eigentum | Typ      | Beschreibung                                                                          |
| -------- | -------- | ------------------------------------------------------------------------------------- |
| id       | Nummer   | Eine numerische Kennung für die Fläche, an der das Ohr befestigt ist. |
| Ohr      | `String` | Kann entweder "links" oder "rechts" sein.                             |

**earpointfound**: Wird ausgelöst, wenn ein Ohranlegepunkt zum ersten Mal gefunden wird.

`earpointfound.detail : {id, point}`

| Eigentum | Typ      | Beschreibung                                                                                                          |
| -------- | -------- | --------------------------------------------------------------------------------------------------------------------- |
| id       | Nummer   | Eine numerische Kennung für die Fläche, an der die Ohranlegepunkte angebracht sind.                   |
| Punkt    | `String` | Kann entweder `leftHelix`, `leftCanal`, `leftLobe`, `rightHelix`, `rightCanal` oder `rightLobe` sein. |

**Verloren**: Wird ausgelöst, wenn ein Ohr nicht mehr geortet wird.

`earlost.detail : {id, ear}`

| Eigentum | Typ      | Beschreibung                                                                          |
| -------- | -------- | ------------------------------------------------------------------------------------- |
| id       | Nummer   | Eine numerische Kennung für die Fläche, an der das Ohr befestigt ist. |
| Ohr      | `String` | Kann entweder "links" oder "rechts" sein.                             |

**Ohrpunktverloren**: Wird ausgelöst, wenn ein Ohranlegepunkt nicht mehr verfolgt wird.

`earpointlost.detail : {id, point}`

| Eigentum | Typ      | Beschreibung                                                                                                          |
| -------- | -------- | --------------------------------------------------------------------------------------------------------------------- |
| id       | Nummer   | Eine numerische Kennung für die Fläche, an der die Ohranlegepunkte angebracht sind.                   |
| Punkt    | `String` | Kann entweder `leftHelix`, `leftCanal`, `leftLobe`, `rightHelix`, `rightCanal` oder `rightLobe` sein. |

## Beispiel - Hinzufügen eines Pipeline-Moduls {#example---adding-pipeline-module}

```javascript
XR8.addCameraPipelineModule(XR8.FaceController.pipelineModule())
```
