---
id: vps
sidebar_position: 1
---

# VPS-Ereignisse

## Ereignisse

### Standort gefunden

Dieses Ereignis wird ausgelöst, wenn ein Projektstandort zum ersten Mal gefunden wird.

#### Eigenschaften

| Eigenschaft | Typ            | Beschreibung                                                                                     |
| ----------- | -------------- | ------------------------------------------------------------------------------------------------ |
| name        | `String`       | Der Name des Projektstandorts.                                                   |
| position    | {x, y, z}      | Die 3d-Position des Projektstandorts.                                            |
| rotation    | `{w, x, y, z}` | Die lokale 3D-Orientierung (Quaternion) des Projektstandorts. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'reality.locationfound', (e) => {
    console.log(e)
})
```

### standortlos

Dieses Ereignis wird ausgelöst, wenn ein Projektstandort nicht mehr verfolgt wird.

#### Eigenschaften

| Eigenschaft | Typ            | Beschreibung                                                                                     |
| ----------- | -------------- | ------------------------------------------------------------------------------------------------ |
| name        | `String`       | Der Name des Projektstandorts.                                                   |
| position    | {x, y, z}      | Die 3d-Position des Projektstandorts.                                            |
| rotation    | `{w, x, y, z}` | Die lokale 3D-Orientierung (Quaternion) des Projektstandorts. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'reality.locationlost', (e) => {
    console.log(e)
})
```

### Standort-Scanning

Dieses Ereignis wird ausgelöst, wenn alle Projektstandorte zum Scannen geladen wurden.

#### Eigenschaften

| Eigenschaft | Typ                                   | Beschreibung                                     |
| ----------- | ------------------------------------- | ------------------------------------------------ |
| Standorte   | [`[LocationObject]`](#LocationObject) | Ein Array von Objekten mit Standortinformationen |

##### StandortObjekt {#LocationObject}

LocationObject" ist ein Objekt mit den folgenden Eigenschaften:

| Eigenschaft | Typ      | Beschreibung                                                                  |
| ----------- | -------- | ----------------------------------------------------------------------------- |
| ID          | `String` | Eine ID für diesen Projektstandort, die innerhalb einer Sitzung stabil ist    |
| name        | `String` | Name des Projektstandorts.                                    |
| imageUrl    | `String` | URL zu einem repräsentativen Bild für diesen Projektstandort. |
| titel       | `String` | Titel des Projektstandorts.                                   |
| lat         | Nummer   | Breitengrad dieses Projektstandorts.                          |
| lng         | Nummer   | Längengrad dieses Projektstandorts.                           |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'reality.locationscanning', (e) => {
    console.log(e)
})
```

### meshfound

Dieses Ereignis wird ausgelöst, wenn ein Netz zum ersten Mal gefunden wird, entweder nach dem Start oder nach einem `recenter()`.

#### Eigenschaften

| Eigenschaft | Typ            | Beschreibung                                                                                                                          |
| ----------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| ID          | `String`       | Eine ID für dieses Mesh, die innerhalb einer Sitzung stabil ist.                                                      |
| position    | {x, y, z}      | Die 3d-Position des Projektstandorts.                                                                                 |
| rotation    | `{w, x, y, z}` | Die lokale 3D-Orientierung (Quaternion) des Projektstandorts.                                      |
| geometry    | GeometryObject | Ein Objekt, das Rohdaten zur Meshgeometrie enthält. Attribute enthalten Positions- und Farbattribute. |

##### GeometryObject {#GeometryObject}

| Eigenschaft | Typ                                                                                                   | Beschreibung                                                                     |
| ----------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| index       | `String`                                                                                              | Eine ID für dieses Mesh, die innerhalb einer Sitzung stabil ist. |
| attribute   | [PositionAttributeObject, ColorAttributeObject]\` | Die Rohdaten der Meshgeometrie.                                  |

##### PositionsAttributObjekt {#PositionAttributeObject}

| Eigenschaft | Typ                                 | Beschreibung                                    |
| ----------- | ----------------------------------- | ----------------------------------------------- |
| name        | `String`                            | Der Objektname                                  |
| Array       | Float32Array()\` | Die Rohdaten der Meshgeometrie. |
| itemSize    | Ganzzahl                            | Die Anzahl der Positionen im Objekt             |

##### ColorAttributeObject {#ColorAttributeObject}

| Eigenschaft | Typ                                 | Beschreibung                                    |
| ----------- | ----------------------------------- | ----------------------------------------------- |
| name        | `String`                            | Der Objektname                                  |
| Array       | Float32Array()\` | Die Rohdaten der Meshgeometrie. |
| itemSize    | Ganzzahl                            | Die Anzahl der Positionen im Objekt             |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'reality.meshfound', (e) => {
    console.log(e)
})
```

### meshlost

Dieses Ereignis wird ausgelöst, wenn "recenter()" aufgerufen wird.

#### Eigenschaften

| Eigenschaft | Typ      | Beschreibung                                                                     |
| ----------- | -------- | -------------------------------------------------------------------------------- |
| ID          | `String` | Eine ID für dieses Mesh, die innerhalb einer Sitzung stabil ist. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'reality.meshlost', (e) => {
    console.log(e)
})
```
