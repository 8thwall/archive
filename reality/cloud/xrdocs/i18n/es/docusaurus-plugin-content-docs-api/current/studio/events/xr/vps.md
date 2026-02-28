---
id: vps
sidebar_position: 3
---

# Eventos VPS

## Tipos {#types}

### LocationObject {#LocationObject}

| Propiedad | Tipo     | Descripción                                                                                 |
| --------- | -------- | ------------------------------------------------------------------------------------------- |
| id        | Cadena   | Un id para esta Ubicación del Proyecto que es estable dentro de una sesión. |
| nombre    | Cadena   | Nombre de la ubicación del proyecto.                                        |
| imageUrl  | Cadena   | URL de una imagen representativa de este proyecto Ubicación.                |
| título    | Cadena   | Título de la ubicación del proyecto.                                        |
| lat       | `Número` | Latitud de la ubicación de este proyecto.                                   |
| lng       | "Número  | Longitud de la ubicación de este proyecto.                                  |

### PositionAttributeObject {#PositionAttributeObject}

| Propiedad | Tipo             | Descripción                                                   |
| --------- | ---------------- | ------------------------------------------------------------- |
| nombre    | Cadena           | El nombre del objeto                                          |
| matriz    | `Float32Array()` | Los datos brutos de la geometría de la malla. |
| itemSize  | `Integer`        | Número de elementos del objeto                                |

### ColorAttributeObject {#ColorAttributeObject}

| Propiedad | Tipo             | Descripción                                                   |
| --------- | ---------------- | ------------------------------------------------------------- |
| nombre    | Cadena           | El nombre del objeto                                          |
| matriz    | `Float32Array()` | Los datos brutos de la geometría de la malla. |
| itemSize  | `Integer`        | Número de elementos del objeto                                |

### GeometryObject {#GeometryObject}

| Propiedad | Tipo                                                                                                           | Descripción                                                                |
| --------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| índice    | Cadena                                                                                                         | Un id para esta malla que es estable dentro de una sesión. |
| atributos | `[`[`PositionAttributeObject`](#PositionAttributeObject)`,` [`ColorAttributeObject`](#ColorAttributeObject)`]` | Los datos brutos de la geometría de la malla.              |

## Eventos

### localizaciónencontrar {#locationfound}

Este evento se emite cuando se encuentra por primera vez una Ubicación de Proyecto.

#### Propiedades

| Propiedad | Tipo           | Descripción                                                                                                         |
| --------- | -------------- | ------------------------------------------------------------------------------------------------------------------- |
| nombre    | Cadena         | El nombre de la ubicación del proyecto.                                                             |
| posición  | `{x, y, z}`    | La posición 3d de la Ubicación del Proyecto localizada.                                             |
| rotación  | `{w, x, y, z}` | La orientación local 3d (cuaternión) de la Localización del Proyecto localizada. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'reality.locationfound', (e) => {
    console.log(e)
})
```

### ubicaciónperdida {#locationlost}

Este evento se emite cuando una Ubicación de Proyecto deja de ser rastreada.

#### Propiedades

| Propiedad | Tipo           | Descripción                                                                                                         |
| --------- | -------------- | ------------------------------------------------------------------------------------------------------------------- |
| nombre    | Cadena         | El nombre de la ubicación del proyecto.                                                             |
| posición  | `{x, y, z}`    | La posición 3d de la Ubicación del Proyecto localizada.                                             |
| rotación  | `{w, x, y, z}` | La orientación local 3d (cuaternión) de la Localización del Proyecto localizada. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'reality.locationlost', (e) => {
    console.log(e)
})
```

### búsqueda de ubicaciones {#locationscanning}

Este evento se emite cuando todas las Ubicaciones de Proyecto han sido cargadas para su escaneo.

#### Propiedades

| Propiedad | Tipo                                      | Descripción                                                       |
| --------- | ----------------------------------------- | ----------------------------------------------------------------- |
| lugares   | `[`[`LocationObject`](#LocationObject)`]` | Una matriz de objetos que contiene información sobre la ubicación |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'reality.locationscanning', (e) => {
    console.log(e)
})
```

### búsqueda de malla {#meshfound}

Este evento se emite cuando se encuentra una malla por primera vez, ya sea después del inicio o después de un `recenter()`.

#### Propiedades

| Propiedad | Tipo                                | Descripción                                                                                                                                             |
| --------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id        | Cadena                              | Un id para esta malla que es estable dentro de una sesión.                                                                              |
| posición  | `{x, y, z}`                         | La posición 3d de la Ubicación del Proyecto localizada.                                                                                 |
| rotación  | `{w, x, y, z}`                      | La orientación local 3d (cuaternión) de la Localización del Proyecto localizada.                                     |
| geometría | [`GeometryObject`](#GeometryObject) | Un objeto que contiene datos de geometría de malla sin procesar. Los atributos contienen atributos de posición y color. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'reality.meshfound', (e) => {
    console.log(e)
})
```

### meshlost {#meshlost}

Este evento se emite cuando se llama a `recenter()`.

#### Propiedades

| Propiedad | Tipo   | Descripción                                                                |
| --------- | ------ | -------------------------------------------------------------------------- |
| id        | Cadena | Un id para esta malla que es estable dentro de una sesión. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'reality.meshlost', (e) => {
    console.log(e)
})
```
