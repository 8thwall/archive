---
id: vps
sidebar_position: 1
---

# VPS Events

## Eventos

### locationfound

Este evento se emite cuando se encuentra por primera vez una Ubicación de Proyecto.

#### Propiedades

| Propiedad | Tipo           | Descripción                                                                                                         |
| --------- | -------------- | ------------------------------------------------------------------------------------------------------------------- |
| name      | `Cadena`       | El nombre de la ubicación del proyecto.                                                             |
| position  | `{x, y, z}`    | La posición 3d de la Ubicación del Proyecto localizada.                                             |
| rotation  | `{w, x, y, z}` | La orientación local 3d (cuaternión) de la Localización del Proyecto localizada. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'reality.locationfound', (e) => {
    console.log(e)
})
```

### locationlost

Este evento se emite cuando una Ubicación de Proyecto deja de ser rastreada.

#### Propiedades

| Propiedad | Tipo           | Descripción                                                                                                         |
| --------- | -------------- | ------------------------------------------------------------------------------------------------------------------- |
| name      | `Cadena`       | El nombre de la ubicación del proyecto.                                                             |
| position  | `{x, y, z}`    | La posición 3d de la Ubicación del Proyecto localizada.                                             |
| rotation  | `{w, x, y, z}` | La orientación local 3d (cuaternión) de la Localización del Proyecto localizada. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'reality.locationlost', (e) => {
    console.log(e)
})
```

### locationscanning

Este evento se emite cuando todas las Ubicaciones de Proyecto han sido cargadas para su escaneo.

#### Propiedades

| Propiedad | Tipo                                  | Descripción                                         |
| --------- | ------------------------------------- | --------------------------------------------------- |
| locations | [`[LocationObject]`](#LocationObject) | An array of objects containing Location information |

##### LocationObject {#LocationObject}

`LocationObject` is an object with the following properties:

| Propiedad | Tipo     | Descripción                                                                                 |
| --------- | -------- | ------------------------------------------------------------------------------------------- |
| id        | `Cadena` | Un id para esta Ubicación del Proyecto que es estable dentro de una sesión. |
| name      | `Cadena` | Nombre de la ubicación del proyecto.                                        |
| imagenUrl | `Cadena` | URL de una imagen representativa de este proyecto Ubicación.                |
| título    | `Cadena` | Título de la ubicación del proyecto.                                        |
| lat       | `Number` | Latitud de la ubicación de este proyecto.                                   |
| lng       | `Number` | Longitud de la ubicación de este proyecto.                                  |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'reality.locationscanning', (e) => {
    console.log(e)
})
```

### meshfound

This event is emitted when a mesh is first found either after start or after a `recenter()`.

#### Propiedades

| Propiedad | Tipo             | Descripción                                                                                                                                             |
| --------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id        | `Cadena`         | Un id para esta malla que es estable dentro de una sesión.                                                                              |
| position  | `{x, y, z}`      | La posición 3d de la Ubicación del Proyecto localizada.                                                                                 |
| rotation  | `{w, x, y, z}`   | La orientación local 3d (cuaternión) de la Localización del Proyecto localizada.                                     |
| geometry  | `GeometryObject` | Un objeto que contiene datos de geometría de malla sin procesar. Los atributos contienen atributos de posición y color. |

##### GeometryObject {#GeometryObject}

| Propiedad  | Tipo                                              | Descripción                                                                |
| ---------- | ------------------------------------------------- | -------------------------------------------------------------------------- |
| index      | `Cadena`                                          | Un id para esta malla que es estable dentro de una sesión. |
| attributes | `[PositionAttributeObject, ColorAttributeObject]` | Los datos brutos de la geometría de la malla.              |

##### PositionAttributeObject {#PositionAttributeObject}

| Propiedad | Tipo             | Descripción                                                   |
| --------- | ---------------- | ------------------------------------------------------------- |
| name      | `Cadena`         | The object name                                               |
| array     | `Float32Array()` | Los datos brutos de la geometría de la malla. |
| itemSize  | `Integer`        | The number of items in the object                             |

##### ColorAttributeObject {#ColorAttributeObject}

| Propiedad | Tipo             | Descripción                                                   |
| --------- | ---------------- | ------------------------------------------------------------- |
| name      | `Cadena`         | The object name                                               |
| array     | `Float32Array()` | Los datos brutos de la geometría de la malla. |
| itemSize  | `Integer`        | The number of items in the object                             |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'reality.meshfound', (e) => {
    console.log(e)
})
```

### meshlost

This event is emitted when `recenter()` is called.

#### Propiedades

| Propiedad | Tipo     | Descripción                                                                |
| --------- | -------- | -------------------------------------------------------------------------- |
| id        | `Cadena` | Un id para esta malla que es estable dentro de una sesión. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'reality.meshlost', (e) => {
    console.log(e)
})
```
