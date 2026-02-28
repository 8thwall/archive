---
sidebar_label: pipelineModule()
---

# XR8.XrController.pipelineModule()

`XR8.XrController.pipelineModule()`

## Beschreibung {#description}

Erstellt ein Kamera-Pipeline-Modul, das, wenn es installiert ist, Rückrufe empfängt, wenn die Kamera gestartet wurde, Ereignisse zur Kameraprozessierung und andere Zustandsänderungen. Diese werden verwendet, um die Position der Kamera zu berechnen.

## Parameter {#parameters}

Keine

## Rückgabe {#returns}

Rückgabewert ist ein Objekt, das für [`onUpdate`](/legacy/api/camerapipelinemodule/onupdate) als zur Verfügung gestellt wird:

`processCpuResult.reality: { rotation, position, intrinsics, trackingStatus, trackingReason, worldPoints, realityTexture, lighting }`

| Eigentum       | Typ                                                                          | Beschreibung                                                                                                                                                                                                                               |
| -------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Rotation       | `{w, x, y, z}`                                                               | Die Ausrichtung (Quaternion) der Kamera in der Szene.                                                                                                                                                   |
| Position       | {x, y, z}                                                                    | Die Position der Kamera in der Szene.                                                                                                                                                                                      |
| Intrinsics     | `[Zahl]`                                                                     | Eine 16-dimensionale spaltengroße 4x4-Projektionsmatrix, die der Szenekamera das gleiche Sichtfeld wie dem gerenderten Kamerabild gibt.                                                                                    |
| trackingStatus | `String`                                                                     | Eine der Optionen `'LIMITED'` oder `'NORMAL'`.                                                                                                                                                                             |
| trackingReason | `String`                                                                     | Eines von "UNSPECIFIED" oder "INITIALIZING".                                                                                                                                                                               |
| worldPoints    | `[{id, confidence, position: {x, y, z}}]`                                    | Ein Array von erkannten Punkten in der Welt an ihrer Position in der Szene. Nur ausgefüllt, wenn `XrController` so konfiguriert ist, dass er Weltpunkte zurückgibt und `trackingReason != 'INITIALIZING'`. |
| realitätTextur | [WebGLTextur](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | Die Textur, die die Kamerafeed-Daten enthält.                                                                                                                                                                              |
| Beleuchtung    | {exposure, temperature}                                                      | Belichtung der Beleuchtung in Ihrer Umgebung. Anmerkung: Die Option "Temperatur" wurde noch nicht eingeführt.                                                                              |

## Versendete Ereignisse {#dispatched-events}

**TrackingStatus**: Wird ausgelöst, wenn "XrController" startet und sich der Status oder der Grund für die Verfolgung ändert.

`reality.trackingstatus : { status, reason }`

| Eigentum | Typ      | Beschreibung                                                   |
| -------- | -------- | -------------------------------------------------------------- |
| Status   | `String` | Eine der Optionen `'LIMITED'` oder `'NORMAL'`. |
| Grund    | `String` | Eines von `'INITIALIZING'` oder `'UNDEFINED'`. |

**Bildladen**: Wird ausgelöst, wenn das Laden des Erkennungsbildes beginnt.

`imageloading.detail : { imageTargets: {name, type, metadata} }`

| Eigentum  | Typ      | Beschreibung                                                      |
| --------- | -------- | ----------------------------------------------------------------- |
| Name      | `String` | Der Name des Bildes.                              |
| Typ       | `String` | Eines von `'FLAT'`, `'CYLINDRICAL'`, `'CONICAL'`. |
| Metadaten | Objekt   | Benutzer-Metadaten.                               |

**Bilder scannen**: Wird ausgelöst, wenn alle Erkennungsbilder geladen wurden und das Scannen begonnen hat.

`imagescanning.detail : { imageTargets: {name, type, metadata, geometry} }`

| Eigentum  | Typ      | Beschreibung                                                                                                                                                                                                                             |
| --------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name      | `String` | Der Name des Bildes.                                                                                                                                                                                                     |
| Typ       | `String` | Eines von `'FLAT'`, `'CYLINDRICAL'`, `'CONICAL'`.                                                                                                                                                                        |
| Metadaten | Objekt   | Benutzer-Metadaten.                                                                                                                                                                                                      |
| Geometrie | Objekt   | Objekt mit Geometriedaten. Wenn type=FLAT:{scaledWidth, scaledHeight}, sonst bei type=CYLINDRICAL oder type=CONICAL: {Höhe, RadiusOben, RadiusUnten, arcStartRadians, arcLengthRadians}} |

Wenn Typ = `FLAT`, Geometrie:

| Eigentum        | Typ    | Beschreibung                                                                                   |
| --------------- | ------ | ---------------------------------------------------------------------------------------------- |
| skalierteBreite | Nummer | Die Breite des Bildes in der Szene, multipliziert mit dem Maßstab.             |
| scaledHeight    | Nummer | Die Höhe des Bildes in der Szene, wenn sie mit dem Maßstab multipliziert wird. |

Wenn type= `CYLINDRICAL` oder `CONICAL`, Geometrie:

| Eigentum         | Typ    | Beschreibung                                                       |
| ---------------- | ------ | ------------------------------------------------------------------ |
| Höhe             | Nummer | Höhe der gekrümmten Zielscheibe.                   |
| radiusTop        | Nummer | Radius der gekrümmten Zielscheibe am oberen Rand.  |
| radiusBottom     | Nummer | Radius der gekrümmten Zielscheibe am unteren Rand. |
| arcStartRadian   | Nummer | Startwinkel in Radiant.                            |
| arcLengthRadians | Nummer | Zentralwinkel in Radiant.                          |

**Bild gefunden**: Wird ausgelöst, wenn ein Bildziel zum ersten Mal gefunden wird.

`imagefound.detail : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

| Eigentum | Typ            | Beschreibung                                                                                                |
| -------- | -------------- | ----------------------------------------------------------------------------------------------------------- |
| Name     | `String`       | Der Name des Bildes.                                                                        |
| Typ      | Nummer         | Eine von "FLAT", "CYLINDRICAL", "CONICAL".                                                  |
| Position | {x, y, z}      | Die 3d-Position des georteten Bildes.                                                       |
| Rotation | `{w, x, y, z}` | Die lokale 3D-Ausrichtung des georteten Bildes.                                             |
| Skala    | Nummer         | Ein Skalierungsfaktor, der auf das an dieses Bild angehängte Objekt angewendet werden soll. |

Wenn Typ = `FLAT`:

| Eigentum        | Typ    | Beschreibung                                                                                   |
| --------------- | ------ | ---------------------------------------------------------------------------------------------- |
| skalierteBreite | Nummer | Die Breite des Bildes in der Szene, multipliziert mit dem Maßstab.             |
| scaledHeight    | Nummer | Die Höhe des Bildes in der Szene, wenn sie mit dem Maßstab multipliziert wird. |

Wenn type= `CYLINDRICAL` oder `CONICAL`:

| Eigentum         | Typ    | Beschreibung                                                       |
| ---------------- | ------ | ------------------------------------------------------------------ |
| Höhe             | Nummer | Höhe der gekrümmten Zielscheibe.                   |
| radiusTop        | Nummer | Radius der gekrümmten Zielscheibe am oberen Rand.  |
| radiusBottom     | Nummer | Radius der gekrümmten Zielscheibe am unteren Rand. |
| arcStartRadian   | Nummer | Startwinkel in Radiant.                            |
| arcLengthRadians | Nummer | Zentralwinkel in Radiant.                          |

**imageupdated**: Wird ausgelöst, wenn ein Bildziel seine Position, Drehung oder Skalierung ändert.

`imageupdated.detail : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

| Eigentum | Typ            | Beschreibung                                                                                                |
| -------- | -------------- | ----------------------------------------------------------------------------------------------------------- |
| Name     | `String`       | Der Name des Bildes.                                                                        |
| Typ      | Nummer         | Eine von "FLAT", "CYLINDRICAL", "CONICAL".                                                  |
| Position | {x, y, z}      | Die 3d-Position des georteten Bildes.                                                       |
| Rotation | `{w, x, y, z}` | Die lokale 3D-Ausrichtung des georteten Bildes.                                             |
| Skala    | Nummer         | Ein Skalierungsfaktor, der auf das an dieses Bild angehängte Objekt angewendet werden soll. |

Wenn Typ = `FLAT`:

| Eigentum        | Typ    | Beschreibung                                                                                   |
| --------------- | ------ | ---------------------------------------------------------------------------------------------- |
| skalierteBreite | Nummer | Die Breite des Bildes in der Szene, multipliziert mit dem Maßstab.             |
| scaledHeight    | Nummer | Die Höhe des Bildes in der Szene, wenn sie mit dem Maßstab multipliziert wird. |

Wenn type= `CYLINDRICAL` oder `CONICAL`:

| Eigentum         | Typ    | Beschreibung                                                       |
| ---------------- | ------ | ------------------------------------------------------------------ |
| Höhe             | Nummer | Höhe der gekrümmten Zielscheibe.                   |
| radiusTop        | Nummer | Radius der gekrümmten Zielscheibe am oberen Rand.  |
| radiusBottom     | Nummer | Radius der gekrümmten Zielscheibe am unteren Rand. |
| arcStartRadian   | Nummer | Startwinkel in Radiant.                            |
| arcLengthRadians | Nummer | Zentralwinkel in Radiant.                          |

**Bildverlust**: Wird ausgelöst, wenn ein Bildziel nicht mehr verfolgt wird.

`imagelost.detail : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

| Eigentum | Typ            | Beschreibung                                                                                                |
| -------- | -------------- | ----------------------------------------------------------------------------------------------------------- |
| Name     | `String`       | Der Name des Bildes.                                                                        |
| Typ      | Nummer         | Eine von "FLAT", "CYLINDRICAL", "CONICAL".                                                  |
| Position | {x, y, z}      | Die 3d-Position des georteten Bildes.                                                       |
| Rotation | `{w, x, y, z}` | Die lokale 3D-Ausrichtung des georteten Bildes.                                             |
| Skala    | Nummer         | Ein Skalierungsfaktor, der auf das an dieses Bild angehängte Objekt angewendet werden soll. |

Wenn Typ = `FLAT`:

| Eigentum        | Typ    | Beschreibung                                                                                   |
| --------------- | ------ | ---------------------------------------------------------------------------------------------- |
| skalierteBreite | Nummer | Die Breite des Bildes in der Szene, multipliziert mit dem Maßstab.             |
| scaledHeight    | Nummer | Die Höhe des Bildes in der Szene, wenn sie mit dem Maßstab multipliziert wird. |

Wenn type= `CYLINDRICAL` oder `CONICAL`:

| Eigentum         | Typ    | Beschreibung                                                       |
| ---------------- | ------ | ------------------------------------------------------------------ |
| Höhe             | Nummer | Höhe der gekrümmten Zielscheibe.                   |
| radiusTop        | Nummer | Radius der gekrümmten Zielscheibe am oberen Rand.  |
| radiusBottom     | Nummer | Radius der gekrümmten Zielscheibe am unteren Rand. |
| arcStartRadian   | Nummer | Startwinkel in Radiant.                            |
| arcLengthRadians | Nummer | Zentralwinkel in Radiant.                          |

**Meshfound**: Wird ausgelöst, wenn ein Netz zum ersten Mal gefunden wird, entweder nach dem Start oder nach einem recenter().

`xrmeshfound.detail : { id, position, rotation, geometry }`

| Eigentum  | Typ                 | Beschreibung                                                                                                                       |
| --------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| id        | `String`            | Eine ID für dieses Netz, die innerhalb einer Sitzung stabil ist                                                                    |
| Position  | {x, y, z}           | Die 3D-Position des lokalisierten Netzes.                                                                          |
| Rotation  | `{w, x, y, z}`      | Die lokale 3D-Orientierung (Quaternion) des lokalisierten Netzes.                               |
| Geometrie | {index, attributes} | Ein Objekt, das rohe Netzgeometriedaten enthält. Attribute enthalten Positions- und Farbattribute. |

Geometrie" ist ein Objekt mit den folgenden Eigenschaften:

| Eigentum      | Typ                                                                                                             | Beschreibung                                                                                              |
| ------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Index         | `Uint32Array`                                                                                                   | Die Scheitelpunkte des Netzes, wenn 3 zusammenhängende Scheitelpunkte ein Dreieck bilden. |
| Eigenschaften | `[{Name: 'Position', array: Float32Array(), itemSize: 3}, {name: 'color', array: Float32Array(), itemSize: 3}]` | Die Rohdaten der Netzgeometrie.                                                           |

**Meshupdated**: Wird ausgelöst, wenn das **erste** Netz, das wir gefunden haben, seine Position oder Rotation ändert.

`meshupdated.detail : { id, position, rotation }`

| Eigentum | Typ            | Beschreibung                                                                                         |
| -------- | -------------- | ---------------------------------------------------------------------------------------------------- |
| id       | `String`       | Eine ID für dieses Netz, die innerhalb einer Sitzung stabil ist                                      |
| Position | {x, y, z}      | Die 3D-Position des lokalisierten Netzes.                                            |
| Rotation | `{w, x, y, z}` | Die lokale 3D-Orientierung (Quaternion) des lokalisierten Netzes. |

**Meshlost**: Wird ausgelöst, wenn recenter aufgerufen wird.

`xrmeshlost.detail : { id }`

| Eigentum | Typ      | Beschreibung                                                    |
| -------- | -------- | --------------------------------------------------------------- |
| id       | `String` | Eine ID für dieses Netz, die innerhalb einer Sitzung stabil ist |

**projectwayspotscanning**: Wird ausgelöst, wenn alle Projektstandorte zum Scannen geladen wurden.

`projectwayspotscanning.detail : { wayspots: [] }`

| Eigentum  | Typ        | Beschreibung                                                      |
| --------- | ---------- | ----------------------------------------------------------------- |
| Wegweiser | `[Objekt]` | Ein Array von Objekten mit Standortinformationen. |

wayspots" ist eine Reihe von Objekten mit den folgenden Eigenschaften:

| Eigentum | Typ      | Beschreibung                                                                  |
| -------- | -------- | ----------------------------------------------------------------------------- |
| id       | `String` | Eine ID für diesen Projektstandort, die innerhalb einer Sitzung stabil ist    |
| Name     | `String` | Name des Projektstandorts.                                    |
| imageUrl | `String` | URL zu einem repräsentativen Bild für diesen Projektstandort. |
| Titel    | `String` | Titel des Projektstandorts.                                   |
| lat      | Nummer   | Breitengrad dieses Projektstandorts.                          |
| lng      | Nummer   | Längengrad dieses Projektstandorts.                           |

**projectwayspotfound**: Wird ausgelöst, wenn ein Projektstandort zum ersten Mal gefunden wird.

`projectwayspotfound.detail : { name, position, rotation }`

| Eigentum | Typ            | Beschreibung                                                                                     |
| -------- | -------------- | ------------------------------------------------------------------------------------------------ |
| Name     | `String`       | Der Name des Projektstandorts.                                                   |
| Position | {x, y, z}      | Die 3d-Position des Projektstandorts.                                            |
| Rotation | `{w, x, y, z}` | Die lokale 3D-Orientierung (Quaternion) des Projektstandorts. |

**projectwayspotupdated**: Wird ausgelöst, wenn ein Projektstandort seine Position oder Drehung ändert.

`projectwayspotupdated.detail : { name, position, rotation }`

| Eigentum | Typ            | Beschreibung                                                                                     |
| -------- | -------------- | ------------------------------------------------------------------------------------------------ |
| Name     | `String`       | Der Name des Projektstandorts.                                                   |
| Position | {x, y, z}      | Die 3d-Position des Projektstandorts.                                            |
| Rotation | `{w, x, y, z}` | Die lokale 3D-Orientierung (Quaternion) des Projektstandorts. |

**projectwayspotlost**: Wird ausgelöst, wenn ein Projektstandort nicht mehr verfolgt wird.

`projectwayspotlost.detail : { name, position, rotation }`

| Eigentum | Typ            | Beschreibung                                                                                     |
| -------- | -------------- | ------------------------------------------------------------------------------------------------ |
| Name     | `String`       | Der Name des Projektstandorts.                                                   |
| Position | {x, y, z}      | Die 3d-Position des Projektstandorts.                                            |
| Rotation | `{w, x, y, z}` | Die lokale 3D-Orientierung (Quaternion) des Projektstandorts. |

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
