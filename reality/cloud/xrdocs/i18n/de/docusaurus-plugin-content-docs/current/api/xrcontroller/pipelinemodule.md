---
sidebar_label: pipelineModule()
---

# XR8.XrController.pipelineModule()

`XR8.XrController.pipelineModule()`

## Beschreibung {#description}

Erstellt ein Kamera-Pipelinemodul, das nach der Installierung Rückrufe empfängt, wenn die Kamera gestartet wurde, Ereignisse der Kameraprozessierung und andere Statusänderungen. Diese werden verwendet, um die Position der Kamera zu berechnen.

## Parameter {#parameters}

Keine

## Returns {#returns}

Return-Wert ist ein Objekt, das [`onUpdate`](/api/camerapipelinemodule/onupdate) als zur Verfügung gestellt wird:

`processCpuResult.reality: { rotation, position, intrinsics, trackingStatus, trackingReason, worldPoints, realityTexture, lighting }`

| Eigentum       | Typ                                                                            | Beschreibung                                                                                                                                                                                              |
| -------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| rotation       | `{w, x, y, z}`                                                                 | Die Ausrichtung (Quaternion) der Kamera in der Szene.                                                                                                                                                     |
| position       | `{x, y, z}`                                                                    | Die Position der Kamera in der Szene.                                                                                                                                                                     |
| intrinsisch    | `[Nummer]`                                                                     | Eine 16-dimensionale 4x4-Spalten-Projektionsmatrix, die der Szenekamera das gleiche Sichtfeld wie dem gerenderten Kamerabild gibt.                                                                        |
| trackingStatus | `String`                                                                       | Eine von `'LIMITED'` oder `'NORMAL'`.                                                                                                                                                                     |
| trackingReason | `String`                                                                       | Eins von `'UNSPECIFIED'` oder`'INITIALIZING'`.                                                                                                                                                            |
| worldPoints    | `[{id, confidence, position: {x, y, z}}]`                                      | Ein Array von erkannten Punkten in der Welt an ihrer Position in der Szene. Nur ausgefüllt, wenn `XrController` für die Rückgabe von Weltpunkten konfiguriert ist und `trackingReason != 'INITIALIZING'`. |
| realityTexture | [`WebGLTextur`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | Die Textur, die die Kamerafeed-Daten enthält.                                                                                                                                                             |
| lighting       | `{exposure, temperature}`                                                      | Belichtung der Beleuchtung in Ihrer Umgebung. Hinweis: `Temperatur` wurde noch nicht implementiert.                                                                                                       |

## Versendete Ereignisse {#dispatched-events}

**trackingStatus**: Wird ausgelöst, wenn `XrController` startet und sich der Tracking-Status oder der Grund ändert.

`reality.trackingstatus : { status, reason }`

| Eigentum | Typ      | Beschreibung                                  |
| -------- | -------- | --------------------------------------------- |
| status   | `String` | Eine von `'LIMITED'` oder `'NORMAL'`.         |
| reason   | `String` | Eine von `'INITIALIZING'` oder `'UNDEFINED'`. |

**imageloading**: Wird ausgelöst, wenn das Laden der Erkennungsbilder beginnt.

`imageloading.detail : { imageTargets: {name, type, metadata} }`

| Eigentum  | Typ      | Beschreibung                                     |
| --------- | -------- | ------------------------------------------------ |
| name      | `String` | Der Name des Bildes.                             |
| typ       | `String` | Eine von `'FLAT'`, `'CYLINDRICAL'`, `'CONICAL'`. |
| metadaten | `Objekt` | Benutzer-Metadaten.                              |

**imagescanning**: Wird ausgelöst, wenn alle Erkennungsbilder geladen wurden und der Scanvorgang begonnen hat.

`imagescanning.detail : { imageTargets: {name, type, metadata, geometry} }`

| Eigentum  | Typ      | Beschreibung                                                                                                                                                                                    |
| --------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name      | `String` | Der Name des Bildes.                                                                                                                                                                            |
| typ       | `String` | Eine von `'FLAT'`, `'CYLINDRICAL'`, `'CONICAL'`.                                                                                                                                                |
| metadaten | `Objekt` | Benutzer-Metadaten.                                                                                                                                                                             |
| geometry  | `Objekt` | Objekt mit Geometriedaten. Wenn type=FLAT: `{scaledWidth, scaledHeight}`, sonst wenn type=CYLINDRICAL oder type=CONICAL: `{height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians}` |

Wenn Typ = `FLAT`, Geometrie:

| Eigentum     | Typ      | Beschreibung                                                                     |
| ------------ | -------- | -------------------------------------------------------------------------------- |
| scaledWidth  | `Nummer` | Die Breite des Bildes in der Szene, wenn sie mit dem Maßstab multipliziert wird. |
| scaledHeight | `Nummer` | Die Höhe des Bildes in der Szene, wenn sie mit dem Maßstab multipliziert wird.   |

Wenn type= `CYLINDRICAL` oder `CONICAL`, Geometrie:

| Eigentum         | Typ      | Beschreibung                                 |
| ---------------- | -------- | -------------------------------------------- |
| height           | `Nummer` | Höhe des gebogenen Ziels.                    |
| radiusTop        | `Nummer` | Radius des gebogenen Ziels oben.             |
| radiusBottom     | `Nummer` | Radius des gekrümmten Ziels am unteren Rand. |
| arcStartRadians  | `Nummer` | Startwinkel in Radiant.                      |
| arcLengthRadians | `Nummer` | Zentraler Winkel in Radiant.                 |

**imagefound**: Wird ausgelöst, wenn ein Bildziel zum ersten Mal gefunden wird.

`imagefound.detail : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

| Eigentum | Typ            | Beschreibung                                                                                |
| -------- | -------------- | ------------------------------------------------------------------------------------------- |
| name     | `String`       | Der Name des Bildes.                                                                        |
| typ      | `Nummer`       | Eine von `'FLAT'`, `'CYLINDRICAL'`, `'CONICAL'`.`                                          |
| position | `{x, y, z}`    | Die 3d-Position des georteten Bildes.                                                       |
| rotation | `{w, x, y, z}` | Die lokale 3d-Ausrichtung des georteten Bildes.                                             |
| scale    | `Nummer`       | Ein Skalierungsfaktor, der auf das an dieses Bild angehängte Objekt angewendet werden soll. |

Wenn Typ = `FLAT`:

| Eigentum     | Typ      | Beschreibung                                                                     |
| ------------ | -------- | -------------------------------------------------------------------------------- |
| scaledWidth  | `Nummer` | Die Breite des Bildes in der Szene, wenn sie mit dem Maßstab multipliziert wird. |
| scaledHeight | `Nummer` | Die Höhe des Bildes in der Szene, wenn sie mit dem Maßstab multipliziert wird.   |

Wenn type= `CYLINDRICAL` oder `CONICAL`:

| Eigentum         | Typ      | Beschreibung                                 |
| ---------------- | -------- | -------------------------------------------- |
| height           | `Nummer` | Höhe des gebogenen Ziels.                    |
| radiusTop        | `Nummer` | Radius des gebogenen Ziels oben.             |
| radiusBottom     | `Nummer` | Radius des gekrümmten Ziels am unteren Rand. |
| arcStartRadians  | `Nummer` | Startwinkel in Radiant.                      |
| arcLengthRadians | `Nummer` | Zentraler Winkel in Radiant.                 |

**imageupdated**: Wird ausgelöst, wenn ein Bildziel seine Position, Drehung oder Skalierung ändert.

`imageupdated.detail : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

| Eigentum | Typ            | Beschreibung                                                                                |
| -------- | -------------- | ------------------------------------------------------------------------------------------- |
| name     | `String`       | Der Name des Bildes.                                                                        |
| typ      | `Nummer`       | Eine von `'FLAT'`, `'CYLINDRICAL'`, `'CONICAL'`.`                                          |
| position | `{x, y, z}`    | Die 3d-Position des georteten Bildes.                                                       |
| rotation | `{w, x, y, z}` | Die lokale 3d-Ausrichtung des georteten Bildes.                                             |
| scale    | `Nummer`       | Ein Skalierungsfaktor, der auf das an dieses Bild angehängte Objekt angewendet werden soll. |

Wenn Typ = `FLAT`:

| Eigentum     | Typ      | Beschreibung                                                                     |
| ------------ | -------- | -------------------------------------------------------------------------------- |
| scaledWidth  | `Nummer` | Die Breite des Bildes in der Szene, wenn sie mit dem Maßstab multipliziert wird. |
| scaledHeight | `Nummer` | Die Höhe des Bildes in der Szene, wenn sie mit dem Maßstab multipliziert wird.   |

Wenn type= `CYLINDRICAL` oder `CONICAL`:

| Eigentum         | Typ      | Beschreibung                                 |
| ---------------- | -------- | -------------------------------------------- |
| height           | `Nummer` | Höhe des gebogenen Ziels.                    |
| radiusTop        | `Nummer` | Radius des gebogenen Ziels oben.             |
| radiusBottom     | `Nummer` | Radius des gekrümmten Ziels am unteren Rand. |
| arcStartRadians  | `Nummer` | Startwinkel in Radiant.                      |
| arcLengthRadians | `Nummer` | Zentraler Winkel in Radiant.                 |

**imagelost**: Wird ausgelöst, wenn ein Bildziel nicht mehr verfolgt wird.

`imagelost.detail : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

| Eigentum | Typ            | Beschreibung                                                                                |
| -------- | -------------- | ------------------------------------------------------------------------------------------- |
| name     | `String`       | Der Name des Bildes.                                                                        |
| typ      | `Nummer`       | Eine von `'FLAT'`, `'CYLINDRICAL'`, `'CONICAL'`.`                                          |
| position | `{x, y, z}`    | Die 3d-Position des georteten Bildes.                                                       |
| rotation | `{w, x, y, z}` | Die lokale 3d-Ausrichtung des georteten Bildes.                                             |
| scale    | `Nummer`       | Ein Skalierungsfaktor, der auf das an dieses Bild angehängte Objekt angewendet werden soll. |

Wenn Typ = `FLAT`:

| Eigentum     | Typ      | Beschreibung                                                                     |
| ------------ | -------- | -------------------------------------------------------------------------------- |
| scaledWidth  | `Nummer` | Die Breite des Bildes in der Szene, wenn sie mit dem Maßstab multipliziert wird. |
| scaledHeight | `Nummer` | Die Höhe des Bildes in der Szene, wenn sie mit dem Maßstab multipliziert wird.   |

Wenn type= `CYLINDRICAL` oder `CONICAL`:

| Eigentum         | Typ      | Beschreibung                                 |
| ---------------- | -------- | -------------------------------------------- |
| height           | `Nummer` | Höhe des gebogenen Ziels.                    |
| radiusTop        | `Nummer` | Radius des gebogenen Ziels oben.             |
| radiusBottom     | `Nummer` | Radius des gekrümmten Ziels am unteren Rand. |
| arcStartRadians  | `Nummer` | Startwinkel in Radiant.                      |
| arcLengthRadians | `Nummer` | Zentraler Winkel in Radiant.                 |

**meshfound**: Wird ausgelöst, wenn ein Mesh zum ersten Mal gefunden wird, entweder nach dem Start oder nach einem recenter().

`xrmeshfound.detail : { id, position, rotation, geometry }`

| Eigentum | Typ                   | Beschreibung                                                                                          |
| -------- | --------------------- | ----------------------------------------------------------------------------------------------------- |
| id       | `String`              | Eine ID für dieses Mesh, die innerhalb einer Sitzung stabil ist                                       |
| position | `{x, y, z}`           | Die 3d-Position des georteten Meshes.                                                                 |
| rotation | `{w, x, y, z}`        | Die lokale 3D-Ausrichtung (Quaternion) des lokalisierten Meshes.                                      |
| geometry | `{index, attributes}` | Ein Objekt, das Rohdaten zur Meshgeometrie enthält. Attribute enthalten Positions- und Farbattribute. |

`geometry` ist ein Objekt mit den folgenden Eigenschaften:

| Eigentum  | Typ                                                                                                             | Beschreibung                                                                                 |
| --------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| index     | `Uint32Array`                                                                                                   | Die Scheitelpunkte des Mesh, bei denen 3 zusammenhängende Scheitelpunkte ein Dreieck bilden. |
| attribute | `[{name: 'position', array: Float32Array(), itemSize: 3}, {name: 'color', array: Float32Array(), itemSize: 3}]` | Die Rohdaten der Meshgeometrie.                                                              |

**meshupdated**: Wird ausgelöst, wenn ein **erstes** Mesh, das wir gefunden haben, seine Position oder Rotation ändert.

`meshupdated.detail : { id, position, rotation }`

| Eigentum | Typ            | Beschreibung                                                    |
| -------- | -------------- | --------------------------------------------------------------- |
| id       | `String`       | Eine ID für dieses Mesh, die innerhalb einer Sitzung stabil ist |
| position | `{x, y, z}`    | Die 3d-Position des georteten Meshes.                           |
| rotation | `{w, x, y, z}` | Die lokale 3D-Ausrichtung (Quaternion) des lokalisierten Mesh.  |

**meshlost**: Wird ausgelöst, wenn recenter aufgerufen wird.

`xrmeshlost.detail : { id }`

| Eigentum | Typ      | Beschreibung                                                    |
| -------- | -------- | --------------------------------------------------------------- |
| id       | `String` | Eine ID für dieses Mesh, die innerhalb einer Sitzung stabil ist |

**projectwayspotscanning**: Wird ausgelöst, wenn alle Projektstandorte zum Scannen geladen wurden.

`projectwayspotscanning.detail : { wayspots: [] }`

| Eigentum | Typ        | Beschreibung                                      |
| -------- | ---------- | ------------------------------------------------- |
| wayspots | `[Objekt]` | Ein Array von Objekten mit Standortinformationen. |

`wayspots` ist ein Array von Objekten mit den folgenden Eigenschaften:

| Eigentum | Typ      | Beschreibung                                                               |
| -------- | -------- | -------------------------------------------------------------------------- |
| id       | `String` | Eine ID für diesen Projektstandort, die innerhalb einer Sitzung stabil ist |
| name     | `String` | Name des Projektstandorts.                                                 |
| imageUrl | `String` | URL zu einem repräsentativen Bild für diesen Projektstandort.              |
| titel    | `String` | Titel des Projektstandorts.                                                |
| lat      | `Nummer` | Breitengrad dieses Projektstandorts.                                       |
| lng      | `Nummer` | Längengrad dieses Projektstandorts.                                        |

**projectwayspotfound**: Wird ausgelöst, wenn ein Projektstandort zum ersten Mal gefunden wird.

`projectwayspotfound.detail : { name, position, rotation }`

| Eigentum | Typ            | Beschreibung                                                  |
| -------- | -------------- | ------------------------------------------------------------- |
| name     | `String`       | Der Name des Projektstandorts.                                |
| position | `{x, y, z}`    | Die 3d-Position des Projektstandorts.                         |
| rotation | `{w, x, y, z}` | Die lokale 3D-Orientierung (Quaternion) des Projektstandorts. |

**projectwayspotupdated**: Wird ausgelöst, wenn ein Projektstandort seine Position oder Drehung ändert.

`projectwayspotupdated.detail : { name, position, rotation }`

| Eigentum | Typ            | Beschreibung                                                  |
| -------- | -------------- | ------------------------------------------------------------- |
| name     | `String`       | Der Name des Projektstandorts.                                |
| position | `{x, y, z}`    | Die 3d-Position des Projektstandorts.                         |
| rotation | `{w, x, y, z}` | Die lokale 3D-Orientierung (Quaternion) des Projektstandorts. |

**projectwayspotlost**: Wird ausgelöst, wenn ein Projektstandort nicht mehr verfolgt wird.

`projectwayspotlost.detail : { name, position, rotation }`

| Eigentum | Typ            | Beschreibung                                                  |
| -------- | -------------- | ------------------------------------------------------------- |
| name     | `String`       | Der Name des Projektstandorts.                                |
| position | `{x, y, z}`    | Die 3d-Position des Projektstandorts.                         |
| rotation | `{w, x, y, z}` | Die lokale 3D-Orientierung (Quaternion) des Projektstandorts. |

## Beispiel - Hinzufügen eines Pipeline-Moduls {#example---adding-pipeline-module}

```javascript
XR8.addCameraPipelineModule(XR8.XrController.pipelineModule())
```

## Beispiel - versendete Ereignisse {#example---dispatched-events}

```javascript
const logEvent = ({name, detail}) => {
  console.log(`Handling event ${name}, got detail, ${JSON.stringify(detail)}`)
}

XR8.addCameraPipelineModule({
  name: 'eventlogger',
  listeners: [
    {event: 'reality.imageloading', process: logEvent},
    {event: 'reality.imagescanning', process: logEvent},
    {event: 'reality.imagefound', process: logEvent},
    {event: 'reality.imageupdated', process: logEvent},
    {event: 'reality.imagelost', process: logEvent},
  ],
})
```
