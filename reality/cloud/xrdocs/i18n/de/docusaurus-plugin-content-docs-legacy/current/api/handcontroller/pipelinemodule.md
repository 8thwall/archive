---
sidebar_position: 2
sidebar_label: pipelineModule()
---

# XR8.HandController.pipelineModule()

`XR8.HandController.pipelineModule()`

## Beschreibung {#description}

Erstellt ein Kamera-Pipeline-Modul, das, wenn es installiert ist, Rückrufe empfängt, wenn die Kamera gestartet wurde, Ereignisse zur Kameraprozessierung und andere Zustandsänderungen. Diese werden verwendet, um die Position der Kamera zu berechnen.

## Parameter {#parameters}

Keine

## Rückgabe {#returns}

Rückgabewert ist ein Objekt, das für [`onUpdate`](/legacy/api/camerapipelinemodule/onupdate) als zur Verfügung gestellt wird:

`processCpuResult.handcontroller: { rotation, position, intrinsics, cameraFeedTexture }`

| Eigentum          | Typ                                                                          | Beschreibung                                                                                                                                            |
| ----------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rotation          | `{w, x, y, z}`                                                               | Die Ausrichtung (Quaternion) der Kamera in der Szene.                                                                |
| Position          | {x, y, z}                                                                    | Die Position der Kamera in der Szene.                                                                                                   |
| Intrinsics        | `[Zahl]`                                                                     | Eine 16-dimensionale spaltengroße 4x4-Projektionsmatrix, die der Szenekamera das gleiche Sichtfeld wie dem gerenderten Kamerabild gibt. |
| cameraFeedTexture | [WebGLTextur](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | Die Textur, die die Kamerafeed-Daten enthält.                                                                                           |

## Versendete Ereignisse {#dispatched-events}

**Handladen**: Wird ausgelöst, wenn der Ladevorgang für zusätzliche AR-Ressourcen von Hand beginnt.

`handloading.detail : {maxDetections, pointsPerDetection, rightIndices, leftIndices}`

| Eigentum           | Typ           | Beschreibung                                                                                |
| ------------------ | ------------- | ------------------------------------------------------------------------------------------- |
| maxDetections      | Nummer        | Die maximale Anzahl von Händen, die gleichzeitig bearbeitet werden können.  |
| pointsPerDetection | Nummer        | Anzahl der Scheitelpunkte, die pro Hand extrahiert werden.                  |
| rightIndices       | `[{a, b, c}]` | Indizes in das Scheitelpunkt-Array, das die Dreiecke des Handnetzes bildet. |
| leftIndices        | `[{a, b, c}]` | Indizes in das Scheitelpunkt-Array, das die Dreiecke des Handnetzes bildet. |

**Handscanning**: Wird ausgelöst, wenn alle Hand-AR-Ressourcen geladen wurden und das Scannen begonnen hat.

`handscanning.detail : {maxDetections, pointsPerDetection, rightIndices, leftIndices}`

| Eigentum           | Typ           | Beschreibung                                                                                |
| ------------------ | ------------- | ------------------------------------------------------------------------------------------- |
| maxDetections      | Nummer        | Die maximale Anzahl von Händen, die gleichzeitig bearbeitet werden können.  |
| pointsPerDetection | Nummer        | Anzahl der Scheitelpunkte, die pro Hand extrahiert werden.                  |
| rightIndices       | `[{a, b, c}]` | Indizes in das Scheitelpunkt-Array, das die Dreiecke des Handnetzes bildet. |
| leftIndices        | `[{a, b, c}]` | Indizes in das Scheitelpunkt-Array, das die Dreiecke des Handnetzes bildet. |

**Hand gefunden**: Wird ausgelöst, wenn eine Hand zum ersten Mal gefunden wird.

`handfound.detail : {id, transform, vertices, normals, attachmentPoints}`

| Eigentum         | Typ                         | Beschreibung                                                                                                                                                                                                                  |
| ---------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id               | Nummer                      | Eine numerische ID der gefundenen Hand.                                                                                                                                                                       |
| umwandeln        | {position, rotation, scale} | Transformieren Sie die Informationen der gefundenen Hand.                                                                                                                                                     |
| Scheitelpunkte   | `[{x, y, z}]`               | Position der Handpunkte, relativ zur Transformation.                                                                                                                                                          |
| Normalen         | `[{x, y, z}]`               | Normale Richtung der Scheitelpunkte, relativ zur Transformation.                                                                                                                                              |
| handKind         | Nummer                      | Eine numerische Darstellung der Händigkeit der gefundenen Hand. Gültige Werte sind 0 (nicht spezifiziert), 1 (links) und 2 (rechts). |
| attachmentPoints | `{name, position: {x,y,z}}` | Siehe [`XR8.HandController.AttachmentPoints`](attachmentpoints.md) für die Liste der verfügbaren Befestigungspunkte. Die "Position" ist relativ zur Transformation.                           |

transform" ist ein Objekt mit den folgenden Eigenschaften:

| Eigentum | Typ            | Beschreibung                                                                                                      |
| -------- | -------------- | ----------------------------------------------------------------------------------------------------------------- |
| Position | {x, y, z}      | Die 3d-Position der befindlichen Hand.                                                            |
| Rotation | `{w, x, y, z}` | Die lokale 3D-Orientierung der lokalisierten Hand.                                                |
| Skala    | Nummer         | Ein Skalierungsfaktor, der auf Objekte angewendet werden soll, die an dieser Hand befestigt sind. |

AttachmentPoints" ist ein Objekt mit den folgenden Eigenschaften:

| Eigentum    | Typ            | Beschreibung                                                                                                                                                                           |
| ----------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name        | `String`       | Der Name des Befestigungspunktes. Siehe [`XR8.HandController.AttachmentPoints`](attachmentpoints.md) für die Liste der verfügbaren Befestigungspunkte. |
| Position    | {x, y, z}      | Die 3d-Position des Befestigungspunktes an der befindlichen Hand.                                                                                                      |
| Rotation    | `{w, x, y, z}` | Die Rotationsquaternion, die den positiven Y-Vektor zum Bone-Vektor des Befestigungspunkts dreht.                                                                      |
| innerPoint  | {x, y, z}      | Der innere Punkt eines Befestigungspunktes. (z.B. Handflächenseite)                                                 |
| outerPoint  | {x, y, z}      | Der äußere Punkt eines Befestigungspunktes. (z. B. Handrücken)                                                      |
| Radius      | Nummer         | Der Radius der Fingerbefestigungspunkte.                                                                                                                               |
| minorRadius | Nummer         | Der kürzeste Radius von der Handoberfläche bis zum Befestigungspunkt am Handgelenk.                                                                                    |
| majorRadius | Nummer         | Der längste Radius von der Handoberfläche bis zum Befestigungspunkt am Handgelenk.                                                                                     |

**handupdated**: Wird ausgelöst, wenn eine Hand nachträglich gefunden wird.

`handupdated.detail : {id, transform, vertices, normals, attachmentPoints}`

| Eigentum         | Typ                         | Beschreibung                                                                                                                                                                                                                  |
| ---------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id               | Nummer                      | Eine numerische ID der gefundenen Hand.                                                                                                                                                                       |
| umwandeln        | {position, rotation, scale} | Transformieren Sie die Informationen der gefundenen Hand.                                                                                                                                                     |
| Scheitelpunkte   | `[{x, y, z}]`               | Position der Handpunkte, relativ zur Transformation.                                                                                                                                                          |
| Normalen         | `[{x, y, z}]`               | Normale Richtung der Scheitelpunkte, relativ zur Transformation.                                                                                                                                              |
| handKind         | Nummer                      | Eine numerische Darstellung der Händigkeit der gefundenen Hand. Gültige Werte sind 0 (nicht spezifiziert), 1 (links) und 2 (rechts). |
| attachmentPoints | `{name, position: {x,y,z}}` | Siehe [`XR8.HandController.AttachmentPoints`](attachmentpoints.md) für die Liste der verfügbaren Befestigungspunkte. Die "Position" ist relativ zur Transformation.                           |

transform" ist ein Objekt mit den folgenden Eigenschaften:

| Eigentum | Typ            | Beschreibung                                                                                                      |
| -------- | -------------- | ----------------------------------------------------------------------------------------------------------------- |
| Position | {x, y, z}      | Die 3d-Position der befindlichen Hand.                                                            |
| Rotation | `{w, x, y, z}` | Die lokale 3D-Orientierung der lokalisierten Hand.                                                |
| Skala    | Nummer         | Ein Skalierungsfaktor, der auf Objekte angewendet werden soll, die an dieser Hand befestigt sind. |

**Verlorene Hand**: Wird ausgelöst, wenn eine Hand nicht mehr geortet wird.

`handlost.detail : { id }`

| Eigentum | Typ    | Beschreibung                                            |
| -------- | ------ | ------------------------------------------------------- |
| id       | Nummer | Eine numerische ID der gefundenen Hand. |

## Beispiel - Hinzufügen eines Pipeline-Moduls {#example---adding-pipeline-module}

```javascript
XR8.addCameraPipelineModule(XR8.HandController.pipelineModule())
```
