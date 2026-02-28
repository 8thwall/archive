---
id: vps
sidebar_position: 3
---

# VPS-Ereignisse

## Typen {#types}

### StandortObjekt {#LocationObject}

| Eigentum | Typ      | Beschreibung                                                                  |
| -------- | -------- | ----------------------------------------------------------------------------- |
| id       | `String` | Eine ID für diesen Projektstandort, die innerhalb einer Sitzung stabil ist    |
| Name     | `String` | Name des Projektstandorts.                                    |
| imageUrl | `String` | URL zu einem repräsentativen Bild für diesen Projektstandort. |
| Titel    | `String` | Titel des Projektstandorts.                                   |
| lat      | Nummer   | Breitengrad dieses Projektstandorts.                          |
| lng      | Nummer   | Längengrad dieses Projektstandorts.                           |

### PositionsAttributObjekt {#PositionAttributeObject}

| Eigentum | Typ                                   | Beschreibung                                    |
| -------- | ------------------------------------- | ----------------------------------------------- |
| Name     | `String`                              | Der Objektname                                  |
| Array    | Float32Array()\\` | Die Rohdaten der Netzgeometrie. |
| itemSize | Ganzzahl                              | Die Anzahl der Positionen im Objekt             |

### ColorAttributeObject {#ColorAttributeObject}

| Eigentum | Typ                                   | Beschreibung                                    |
| -------- | ------------------------------------- | ----------------------------------------------- |
| Name     | `String`                              | Der Objektname                                  |
| Array    | Float32Array()\\` | Die Rohdaten der Netzgeometrie. |
| itemSize | Ganzzahl                              | Die Anzahl der Positionen im Objekt             |

### GeometryObject {#GeometryObject}

| Eigentum      | Typ                                                                                                            | Beschreibung                                                                     |
| ------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Index         | `String`                                                                                                       | Eine ID für dieses Netz, die innerhalb einer Sitzung stabil ist. |
| Eigenschaften | `[`[`PositionAttributeObject`](#PositionAttributeObject)`,` [`ColorAttributeObject`](#ColorAttributeObject)`]` | Die Rohdaten der Netzgeometrie.                                  |

## Veranstaltungen

### Standort gefunden {#locationfound}

Dieses Ereignis wird ausgelöst, wenn ein Projektstandort zum ersten Mal gefunden wird.

#### Eigenschaften

| Eigentum | Typ            | Beschreibung                                                                                     |
| -------- | -------------- | ------------------------------------------------------------------------------------------------ |
| Name     | `String`       | Der Name des Projektstandorts.                                                   |
| Position | {x, y, z}      | Die 3d-Position des Projektstandorts.                                            |
| Rotation | `{w, x, y, z}` | Die lokale 3D-Orientierung (Quaternion) des Projektstandorts. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'reality.locationfound', (e) => {
    console.log(e)
})
```

### standortlos {#locationlost}

Dieses Ereignis wird ausgelöst, wenn ein Projektstandort nicht mehr verfolgt wird.

#### Eigenschaften

| Eigentum | Typ            | Beschreibung                                                                                     |
| -------- | -------------- | ------------------------------------------------------------------------------------------------ |
| Name     | `String`       | Der Name des Projektstandorts.                                                   |
| Position | {x, y, z}      | Die 3d-Position des Projektstandorts.                                            |
| Rotation | `{w, x, y, z}` | Die lokale 3D-Orientierung (Quaternion) des Projektstandorts. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'reality.locationlost', (e) => {
    console.log(e)
})
```

### Standort-Scanning {#locationscanning}

Dieses Ereignis wird ausgelöst, wenn alle Projektstandorte zum Scannen geladen wurden.

#### Eigenschaften

| Eigentum  | Typ                                  | Beschreibung                                     |
| --------- | ------------------------------------ | ------------------------------------------------ |
| Standorte | `[`[`OrtObjekt`](#LocationObject)`]` | Ein Array von Objekten mit Standortinformationen |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'reality.locationscanning', (e) => {
    console.log(e)
})
```

### meshfound {#meshfound}

Dieses Ereignis wird ausgelöst, wenn ein Netz zum ersten Mal gefunden wird, entweder nach dem Start oder nach einem `recenter()`.

#### Eigenschaften

| Eigentum  | Typ                                   | Beschreibung                                                                                                                       |
| --------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| id        | `String`                              | Eine ID für dieses Netz, die innerhalb einer Sitzung stabil ist.                                                   |
| Position  | {x, y, z}                             | Die 3d-Position des Projektstandorts.                                                                              |
| Rotation  | `{w, x, y, z}`                        | Die lokale 3D-Orientierung (Quaternion) des Projektstandorts.                                   |
| Geometrie | [GeometryObject\\`](#GeometryObject) | Ein Objekt, das rohe Netzgeometriedaten enthält. Attribute enthalten Positions- und Farbattribute. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'reality.meshfound', (e) => {
    console.log(e)
})
```

### meshlost {#meshlost}

Dieses Ereignis wird ausgelöst, wenn "recenter()" aufgerufen wird.

#### Eigenschaften

| Eigentum | Typ      | Beschreibung                                                                     |
| -------- | -------- | -------------------------------------------------------------------------------- |
| id       | `String` | Eine ID für dieses Netz, die innerhalb einer Sitzung stabil ist. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'reality.meshlost', (e) => {
    console.log(e)
})
```
