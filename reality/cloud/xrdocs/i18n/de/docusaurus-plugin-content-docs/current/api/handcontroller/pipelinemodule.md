---
sidebar_position: 2
sidebar_label: pipelineModule()
---

# XR8.HandController.pipelineModule()

`XR8.HandController.pipelineModule()`

## Beschreibung {#description}

Erstellt ein Kamera-Pipelinemodul, das nach der Installierung Rückrufe empfängt, wenn die Kamera gestartet wurde, Ereignisse der Kameraprozessierung und andere Statusänderungen. Diese werden verwendet, um die Position der Kamera zu berechnen.

## Parameter {#parameters}

Keine

## Returns {#returns}

Return-Wert ist ein Objekt, das [`onUpdate`](/api/camerapipelinemodule/onupdate) als zur Verfügung gestellt wird:

`processCpuResult.handcontroller: { rotation, position, intrinsics, cameraFeedTexture }`

| Eigentum          | Typ                                                                            | Beschreibung                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| rotation          | `{w, x, y, z}`                                                                 | Die Ausrichtung (Quaternion) der Kamera in der Szene.                                                                              |
| position          | `{x, y, z}`                                                                    | Die Position der Kamera in der Szene.                                                                                              |
| intrinsisch       | `[Nummer]`                                                                     | Eine 16-dimensionale 4x4-Spalten-Projektionsmatrix, die der Szenekamera das gleiche Sichtfeld wie dem gerenderten Kamerabild gibt. |
| cameraFeedTexture | [`WebGLTextur`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | Die Textur, die die Kamerafeed-Daten enthält.                                                                                      |

## Versendete Ereignisse {#dispatched-events}

**handloading**: Wird ausgelöst, wenn der Ladevorgang für zusätzliche Hand-AR-Ressourcen beginnt.

`handloading.detail : {maxDetections, pointsPerDetection, rightIndices, leftIndices}`

| Eigentum           | Typ           | Beschreibung                                                               |
| ------------------ | ------------- | -------------------------------------------------------------------------- |
| maxDetections      | `Nummer`      | Die maximale Anzahl von Händen, die gleichzeitig bearbeitet werden können. |
| pointsPerDetection | `Nummer`      | Anzahl der Scheitelpunkte, die pro Hand extrahiert werden.                 |
| rightIndices       | `[{a, b, c}]` | Indiziert das Scheitelpunkt-Array, das die Dreiecke des Handnetzes bildet. |
| leftIndices        | `[{a, b, c}]` | Indiziert das Scheitelpunkt-Array, das die Dreiecke des Handnetzes bildet. |

**handscan**: Wird ausgelöst, wenn alle Hand-AR-Ressourcen geladen wurden und das Scannen begonnen hat.

`handscanning.detail : {maxDetections, pointsPerDetection, rightIndices, leftIndices}`

| Eigentum           | Typ           | Beschreibung                                                               |
| ------------------ | ------------- | -------------------------------------------------------------------------- |
| maxDetections      | `Nummer`      | Die maximale Anzahl von Händen, die gleichzeitig bearbeitet werden können. |
| pointsPerDetection | `Nummer`      | Anzahl der Scheitelpunkte, die pro Hand extrahiert werden.                 |
| rightIndices       | `[{a, b, c}]` | Indiziert das Scheitelpunkt-Array, das die Dreiecke des Handnetzes bildet. |
| leftIndices        | `[{a, b, c}]` | Indiziert das Scheitelpunkt-Array, das die Dreiecke des Handnetzes bildet. |

**handfound**: Wird ausgelöst, wenn eine Hand zum ersten Mal gefunden wird.

`handfound.detail : {id, transform, vertices, normals, attachmentPoints}`

| Eigentum         | Typ                           | Beschreibung                                                                                                                                                         |
| ---------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id               | `Nummer`                      | Eine numerische ID der gefundenen Hand.                                                                                                                              |
| transform        | `{position, rotation, scale}` | Transformieren Sie die Informationen der gefundenen Hand.                                                                                                            |
| vertices         | `[{x, y, z}]`                 | Position der Handpunkte, relativ zur Transformation.                                                                                                                 |
| normals          | `[{x, y, z}]`                 | Normale Richtung der Scheitelpunkte, relativ zur Transformation.                                                                                                     |
| handKind         | `Nummer`                      | Eine numerische Darstellung der Händigkeit der gefundenen Hand. Gültige Werte sind 0 (nicht spezifiziert), 1 (links) und 2 (rechts).                                 |
| attachmentPoints | `{{>_head.html}}`             | Siehe [`XR8.HandController.AttachmentPoints`](attachmentpoints.md) für eine Liste der verfügbaren Befestigungspunkte. `die Position` ist relativ zur Transformation. |

`transform` ist ein Objekt mit den folgenden Eigenschaften:

| Eigentum | Typ            | Beschreibung                                                                                      |
| -------- | -------------- | ------------------------------------------------------------------------------------------------- |
| position | `{x, y, z}`    | Die 3d-Position der liegenden Hand.                                                               |
| rotation | `{w, x, y, z}` | Die lokale 3d-Ausrichtung der georteten Hand.                                                     |
| scale    | `Nummer`       | Ein Skalierungsfaktor, der auf Objekte angewendet werden soll, die an dieser Hand befestigt sind. |

`attachmentPoints` ist ein Objekt mit den folgenden Eigenschaften:

| Eigentum    | Typ            | Beschreibung                                                                                                                                          |
| ----------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| name        | `String`       | Der Name des Anknüpfungspunkts. Siehe [`XR8.HandController.AttachmentPoints`](attachmentpoints.md) für eine Liste der verfügbaren Befestigungspunkte. |
| position    | `{x, y, z}`    | Die 3d-Position des Befestigungspunktes an der gefundenen Hand.                                                                                       |
| rotation    | `{w, x, y, z}` | Die Rotations-Quaternion, die den positiven Y-Vektor zum Bone-Vektor des Anheftungspunkts dreht.                                                      |
| innerPoint  | `{x, y, z}`    | Der innere Punkt eines Befestigungspunktes. (z.B. Handflächenseite)                                                                                   |
| outerPoint  | `{x, y, z}`    | Der äußere Punkt eines Befestigungspunktes. (z. B. Handrücken)                                                                                        |
| radius      | `Nummer`       | Der Radius der Fingerbefestigungspunkte.                                                                                                              |
| minorRadius | `Nummer`       | Der kürzeste Radius von der Handoberfläche bis zum Befestigungspunkt am Handgelenk.                                                                   |
| majorRadius | `Nummer`       | Der längste Radius von der Handoberfläche bis zum Befestigungspunkt am Handgelenk.                                                                    |

**handupdated**: Wird ausgelöst, wenn eine Hand nachträglich gefunden wird.

`handupdated.detail : {id, transform, vertices, normals, attachmentPoints}`

| Eigentum         | Typ                           | Beschreibung                                                                                                                                                         |
| ---------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id               | `Nummer`                      | Eine numerische ID der gefundenen Hand.                                                                                                                              |
| transform        | `{position, rotation, scale}` | Transformieren Sie die Informationen der gefundenen Hand.                                                                                                            |
| vertices         | `[{x, y, z}]`                 | Position der Handpunkte, relativ zur Transformation.                                                                                                                 |
| normals          | `[{x, y, z}]`                 | Normale Richtung der Scheitelpunkte, relativ zur Transformation.                                                                                                     |
| handKind         | `Nummer`                      | Eine numerische Darstellung der Händigkeit der gefundenen Hand. Gültige Werte sind 0 (nicht spezifiziert), 1 (links) und 2 (rechts).                                 |
| attachmentPoints | `{{>_head.html}}`             | Siehe [`XR8.HandController.AttachmentPoints`](attachmentpoints.md) für eine Liste der verfügbaren Befestigungspunkte. `die Position` ist relativ zur Transformation. |

`transform` ist ein Objekt mit den folgenden Eigenschaften:

| Eigentum | Typ            | Beschreibung                                                                                      |
| -------- | -------------- | ------------------------------------------------------------------------------------------------- |
| position | `{x, y, z}`    | Die 3d-Position der liegenden Hand.                                                               |
| rotation | `{w, x, y, z}` | Die lokale 3d-Ausrichtung der georteten Hand.                                                     |
| scale    | `Nummer`       | Ein Skalierungsfaktor, der auf Objekte angewendet werden soll, die an dieser Hand befestigt sind. |

**handlost**: Wird ausgelöst, wenn eine Hand nicht mehr geortet wird.

`handlost.detail : { id }`

| Eigentum | Typ      | Beschreibung                            |
| -------- | -------- | --------------------------------------- |
| id       | `Nummer` | Eine numerische ID der gefundenen Hand. |


## Beispiel - Hinzufügen eines Pipeline-Moduls {#example---adding-pipeline-module}

```javascript
XR8.addCameraPipelineModule(XR8.HandController.pipelineModule())
```
