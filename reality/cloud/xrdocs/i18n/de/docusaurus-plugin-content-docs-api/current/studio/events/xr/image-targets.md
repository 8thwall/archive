---
id: image-targets
sidebar_position: 2
---

# Bildziel Ereignisse

## Typen {#types}

### ImagePropertiesObject {#ImagePropertiesObject}

ImagePropertiesObject" ist ein Objekt mit den folgenden Eigenschaften:

| Eigentum       | Typ      | Beschreibung                                     |
| -------------- | -------- | ------------------------------------------------ |
| Breite         | Nummer   | Breite des Zielbildes.           |
| Höhe           | Nummer   | Höhe des Zielbildes.             |
| originalBreite | Nummer   | Breite des hochgeladenen Bildes. |
| originalHöhe   | Nummer   | Höhe des hochgeladenen Bildes.   |
| isRotated      | boolesch | Ob das Bildziel gedreht wurde.   |

## Veranstaltungen

### imagefound {#imagefound}

Dieses Ereignis wird ausgelöst, wenn ein Bildziel zum ersten Mal gefunden wird.

#### Eigenschaften

| Eigentum         | Typ                                             | Beschreibung                                                                                                                                 |
| ---------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Name             | `String`                                        | Der Name des Bildes.                                                                                                         |
| Typ              | `String`                                        | Eines von `FLAT`, `CYLINDRICAL`, `CONICAL`.                                                                                  |
| Position         | {x, y, z}                                       | Die 3d-Position des georteten Bildes.                                                                                        |
| Rotation         | `{w, x, y, z}`                                  | Die lokale 3D-Ausrichtung des georteten Bildes.                                                                              |
| Skala            | Nummer                                          | Ein Skalierungsfaktor, der auf das an dieses Bild angehängte Objekt angewendet werden soll.                                  |
| Eigenschaften    | [ImagePropertiesObject](#ImagePropertiesObject) | Zusätzliche Bildzieleigenschaften.                                                                                           |
| skalierteBreite  | Nummer                                          | **Nur anwendbar auf `FLAT`**. Die Breite des Bildes in der Szene, multipliziert mit dem Maßstab.             |
| scaledHeight     | Nummer                                          | **Nur anwendbar auf `FLAT`**. Die Höhe des Bildes in der Szene, wenn sie mit dem Maßstab multipliziert wird. |
| Höhe             | Nummer                                          | **Nur anwendbar auf `CYLINDRICAL` oder `CONICAL`**. Höhe der gekrümmten Zielscheibe.                         |
| radiusTop        | Nummer                                          | **Nur anwendbar auf `CYLINDRICAL` oder `CONICAL`**. Radius der gekrümmten Zielscheibe am oberen Rand.        |
| radiusBottom     | Nummer                                          | **Nur anwendbar auf `CYLINDRICAL` oder `CONICAL`**. Radius der gekrümmten Zielscheibe am unteren Rand.       |
| arcStartRadian   | Nummer                                          | **Nur anwendbar auf `CYLINDRICAL` oder `CONICAL`**. Startwinkel in Radiant.                                  |
| arcLengthRadians | Nummer                                          | **Nur anwendbar auf `CYLINDRICAL` oder `CONICAL`**. Zentralwinkel in Radiant.                                |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'reality.imagefound', (e) => {
    console.log(e)
})
```

### imageloading {#imageloading}

Dieses Ereignis wird ausgelöst, wenn das Laden des Erkennungsbildes beginnt.

#### Eigenschaften

| Eigentum  | Typ      | Beschreibung                                                |
| --------- | -------- | ----------------------------------------------------------- |
| Name      | `String` | Der Name des Bildes.                        |
| Typ       | `String` | Eines von `FLAT`, `CYLINDRICAL`, `CONICAL`. |
| Metadaten | Objekt   | Benutzer-Metadaten.                         |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'reality.imageloading', (e) => {
    console.log(e)
})
```

### imagelost {#imagelost}

Dieses Ereignis wird ausgelöst, wenn ein Bildziel nicht mehr verfolgt wird.

#### Eigenschaften

| Eigentum         | Typ                                             | Beschreibung                                                                                                                                 |
| ---------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Name             | `String`                                        | Der Name des Bildes.                                                                                                         |
| Typ              | `String`                                        | Eines von `FLAT`, `CYLINDRICAL`, `CONICAL`.                                                                                  |
| Position         | {x, y, z}                                       | Die 3d-Position des georteten Bildes.                                                                                        |
| Rotation         | `{w, x, y, z}`                                  | Die lokale 3D-Ausrichtung des georteten Bildes.                                                                              |
| Skala            | Nummer                                          | Ein Skalierungsfaktor, der auf das an dieses Bild angehängte Objekt angewendet werden soll.                                  |
| Eigenschaften    | [ImagePropertiesObject](#ImagePropertiesObject) | Zusätzliche Bildzieleigenschaften.                                                                                           |
| skalierteBreite  | Nummer                                          | **Nur anwendbar auf `FLAT`**. Die Breite des Bildes in der Szene, multipliziert mit dem Maßstab.             |
| scaledHeight     | Nummer                                          | **Nur anwendbar auf `FLAT`**. Die Höhe des Bildes in der Szene, wenn sie mit dem Maßstab multipliziert wird. |
| Höhe             | Nummer                                          | **Nur anwendbar auf `CYLINDRICAL` oder `CONICAL`**. Höhe der gekrümmten Zielscheibe.                         |
| radiusTop        | Nummer                                          | **Nur anwendbar auf `CYLINDRICAL` oder `CONICAL`**. Radius der gekrümmten Zielscheibe am oberen Rand.        |
| radiusBottom     | Nummer                                          | **Nur anwendbar auf `CYLINDRICAL` oder `CONICAL`**. Radius der gekrümmten Zielscheibe am unteren Rand.       |
| arcStartRadian   | Nummer                                          | **Nur anwendbar auf `CYLINDRICAL` oder `CONICAL`**. Startwinkel in Radiant.                                  |
| arcLengthRadians | Nummer                                          | **Nur anwendbar auf `CYLINDRICAL` oder `CONICAL`**. Zentralwinkel in Radiant.                                |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'reality.imagelost', (e) => {
    console.log(e)
})
```

### Bilder scannen {#imagescanning}

Dieses Ereignis wird ausgelöst, wenn alle Erkennungsbilder geladen wurden und der Scanvorgang begonnen hat.

#### Eigenschaften

| Eigentum         | Typ      | Beschreibung                                                                                                                                                                                                                              |
| ---------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name             | `String` | Der Name des Bildes.                                                                                                                                                                                                      |
| Typ              | `String` | Eines von `FLAT`, `CYLINDRICAL`, `CONICAL`.                                                                                                                                                                               |
| Metadaten        | Objekt   | Benutzer-Metadaten.                                                                                                                                                                                                       |
| Geometrie        | Objekt   | Objekt mit Geometriedaten. Wenn type=FLAT:{scaledWidth, scaledHeight}, sonst bei type=CYLINDRICAL oder type=CONICAL: {Höhe, RadiusOben, RadiusUnten, BogenStartRadian, BogenLängeRadian}} |
| skalierteBreite  | Nummer   | **Nur anwendbar auf `FLAT`**. Die Breite des Bildes in der Szene, multipliziert mit dem Maßstab.                                                                                                          |
| scaledHeight     | Nummer   | **Nur anwendbar auf `FLAT`**. Die Höhe des Bildes in der Szene, wenn sie mit dem Maßstab multipliziert wird.                                                                                              |
| Höhe             | Nummer   | **Nur anwendbar auf `CYLINDRICAL` oder `CONICAL`**. Höhe der gekrümmten Zielscheibe.                                                                                                                      |
| radiusTop        | Nummer   | **Nur anwendbar auf `CYLINDRICAL` oder `CONICAL`**. Radius der gekrümmten Zielscheibe am oberen Rand.                                                                                                     |
| radiusBottom     | Nummer   | **Nur anwendbar auf `CYLINDRICAL` oder `CONICAL`**. Radius der gekrümmten Zielscheibe am unteren Rand.                                                                                                    |
| arcStartRadian   | Nummer   | **Nur anwendbar auf `CYLINDRICAL` oder `CONICAL`**. Startwinkel in Radiant.                                                                                                                               |
| arcLengthRadians | Nummer   | **Nur anwendbar auf `CYLINDRICAL` oder `CONICAL`**. Zentralwinkel in Radiant.                                                                                                                             |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'reality.imagescanning', (e) => {
    console.log(e)
})
```

### Bildaktualisierung {#imageupdated}

Dieses Ereignis wird ausgelöst, wenn ein Bildziel seine Position, Drehung oder Skalierung ändert.

#### Eigenschaften

| Eigentum         | Typ                                             | Beschreibung                                                                                                                                 |
| ---------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Name             | `String`                                        | Der Name des Bildes.                                                                                                         |
| Typ              | `String`                                        | Eines von `FLAT`, `CYLINDRICAL`, `CONICAL`.                                                                                  |
| Position         | {x, y, z}                                       | Die 3d-Position des georteten Bildes.                                                                                        |
| Rotation         | `{w, x, y, z}`                                  | Die lokale 3D-Ausrichtung des georteten Bildes.                                                                              |
| Skala            | Nummer                                          | Ein Skalierungsfaktor, der auf das an dieses Bild angehängte Objekt angewendet werden soll.                                  |
| Eigenschaften    | [ImagePropertiesObject](#ImagePropertiesObject) | Zusätzliche Bildzieleigenschaften.                                                                                           |
| skalierteBreite  | Nummer                                          | **Nur anwendbar auf `FLAT`**. Die Breite des Bildes in der Szene, multipliziert mit dem Maßstab.             |
| scaledHeight     | Nummer                                          | **Nur anwendbar auf `FLAT`**. Die Höhe des Bildes in der Szene, wenn sie mit dem Maßstab multipliziert wird. |
| Höhe             | Nummer                                          | **Nur anwendbar auf `CYLINDRICAL` oder `CONICAL`**. Höhe der gekrümmten Zielscheibe.                         |
| radiusTop        | Nummer                                          | **Nur anwendbar auf `CYLINDRICAL` oder `CONICAL`**. Radius der gekrümmten Zielscheibe am oberen Rand.        |
| radiusBottom     | Nummer                                          | **Nur anwendbar auf `CYLINDRICAL` oder `CONICAL`**. Radius der gekrümmten Zielscheibe am unteren Rand.       |
| arcStartRadian   | Nummer                                          | **Nur anwendbar auf `CYLINDRICAL` oder `CONICAL`**. Startwinkel in Radiant.                                  |
| arcLengthRadians | Nummer                                          | **Nur anwendbar auf `CYLINDRICAL` oder `CONICAL`**. Zentralwinkel in Radiant.                                |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'reality.imageupdated', (e) => {
    console.log(e)
})
```
