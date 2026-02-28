---
id: face
sidebar_position: 1
---

# Efectos faciales Eventos

## Tipos {#types}

### TransformObjeto {#TransformObject}

| Propiedad    | Tipo           | Descripción                                                                                          |
| ------------ | -------------- | ---------------------------------------------------------------------------------------------------- |
| posición     | `{x, y, z}`    | La posición 3d de la cara localizada.                                                |
| rotación     | `{w, x, y, z}` | La orientación local 3d de la cara localizada.                                       |
| escala       | `Número`       | Factor de escala que debe aplicarse a los objetos adjuntos a esta cara.              |
| scaledWidth  | `Número`       | Anchura aproximada de la cabeza en la escena cuando se multiplica por la escala.     |
| scaledHeight | `Número`       | Altura aproximada de la cabeza en la escena multiplicada por la escala.              |
| scaledDepth  | `Número`       | Profundidad aproximada de la cabeza en la escena cuando se multiplica por la escala. |

## Eventos

### cara encontrada {#facefound}

Este evento es emitido por Face Effects cuando se encuentra una cara por primera vez.

#### Propiedades

| Propiedad        | Tipo                                  | Descripción                                                                                                                                                                                                                                             |
| ---------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id               | `Número`                              | Un identificador numérico de la cara localizada                                                                                                                                                                                                         |
| transformar      | [`TransformObject`](#TransformObject) | Información de transformación de la cara localizada.                                                                                                                                                                                    |
| vértices         | `[{x, y, z}]`                         | Posición de los puntos de la cara, relativa a la transformación.                                                                                                                                                                        |
| normales         | `[{x, y, z}]`                         | Dirección normal de los vértices, relativa a la transformación.                                                                                                                                                                         |
| attachmentPoints | `{ nombre, posición: {x,y,z} }`       | Consulte [`XR8.FaceController.AttachmentPoints`](https://www.8thwall.com/docs/api/facecontroller/attachmentpoints/) para ver la lista de puntos de fijación disponibles. La `posición` es relativa a la transformación. |
| uvsInCameraFrame | `[{u, v}]`                            | La lista de posiciones uv en el fotograma de la cámara correspondientes a los puntos de vértice devueltos.                                                                                                                              |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.facefound', (e) => {
    console.log(e)
})
```

### carga frontal {#faceloading}

Este evento es emitido por Face Effects cuando comienza la carga de recursos adicionales de Face AR.

#### Propiedades

| Propiedad          | Tipo          | Descripción                                                                                                                                          |
| ------------------ | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| maxDetecciones     | `Número`      | Número máximo de caras que se pueden procesar simultáneamente.                                                                       |
| puntosPorDetección | `Número`      | Número de vértices que se extraerán por cara.                                                                                        |
| índices            | `[{a, b, c}]` | Índices en la matriz de vértices que forman los triángulos de la malla solicitada, como se especifica con meshGeometry en configure. |
| uvs                | `[{u, v}]`    | posiciones uv en un mapa de textura correspondiente a los puntos de vértice devueltos.                                               |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.faceloading', (e) => {
    console.log(e)
})
```

### facelost {#facelost}

Este evento es emitido por Face Effects cuando una cara deja de ser rastreada.

#### Propiedades

| Propiedad | Tipo     | Descripción                                                           |
| --------- | -------- | --------------------------------------------------------------------- |
| id        | `Número` | Identificación numérica de la cara que se ha perdido. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.facelost', (e) => {
    console.log(e)
})
```

### escaneo de caras {#facescanning}

Este evento es emitido por Face Effects cuando se han cargado todos los recursos de RA facial y ha comenzado el escaneado.

#### Propiedades

| Propiedad          | Tipo          | Descripción                                                                                                                                          |
| ------------------ | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| maxDetecciones     | `Número`      | Número máximo de caras que se pueden procesar simultáneamente.                                                                       |
| puntosPorDetección | `Número`      | Número de vértices que se extraerán por cara.                                                                                        |
| índices            | `[{a, b, c}]` | Índices en la matriz de vértices que forman los triángulos de la malla solicitada, como se especifica con meshGeometry en configure. |
| uvs                | `[{u, v}]`    | posiciones uv en un mapa de textura correspondiente a los puntos de vértice devueltos.                                               |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.facescanning', (e) => {
    console.log(e)
})
```

### caraactualizada {#faceupdated}

Este evento es emitido por Face Effects cuando se encuentran caras posteriormente.

#### Propiedades

| Propiedad          | Tipo                                  | Descripción                                                                                                                                                                                                                                             |
| ------------------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                 | `Número`                              | Un identificador numérico de la cara localizada                                                                                                                                                                                                         |
| transformar        | [`TransformObject`](#TransformObject) | Información de transformación de la cara localizada.                                                                                                                                                                                    |
| vértices           | `[{x, y, z}]`                         | Posición de los puntos de la cara, relativa a la transformación.                                                                                                                                                                        |
| normales           | `[{x, y, z}]`                         | Dirección normal de los vértices, relativa a la transformación.                                                                                                                                                                         |
| puntos de fijación | `{ nombre, posición: {x,y,z} }`       | Consulte [`XR8.FaceController.AttachmentPoints`](https://www.8thwall.com/docs/api/facecontroller/attachmentpoints/) para ver la lista de puntos de fijación disponibles. La `posición` es relativa a la transformación. |
| uvsInCameraFrame   | `[{u, v}]`                            | La lista de posiciones uv en el fotograma de la cámara correspondientes a los puntos de vértice devueltos.                                                                                                                              |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.faceupdated', (e) => {
    console.log(e)
})
```

### parpadeó {#blinked}

Este evento es emitido por Face Effects cuando los ojos de una cara rastreada parpadean.

#### Propiedades

| Propiedad | Tipo     | Descripción                                     |
| --------- | -------- | ----------------------------------------------- |
| id        | `Número` | Un identificador numérico de la cara localizada |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.blinked', (e) => {
    console.log(e)
})
```

### distancia interpupilar {#interpupillarydistance}

Este evento es emitido por Face Effects cuando se detecta por primera vez la distancia en milímetros entre los centros de cada pupila de un rostro rastreado.

#### Propiedades

| Propiedad              | Tipo     | Descripción                                                                          |
| ---------------------- | -------- | ------------------------------------------------------------------------------------ |
| id                     | `Número` | Id numérico de la cara localizada.                                   |
| distancia interpupilar | `Número` | Distancia aproximada en milímetros entre los centros de cada pupila. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.interpupillarydistance', (e) => {
    console.log(e)
})
```

### lefteyebrowlowered {#lefteyebrowlowered}

Este evento es emitido por Face Effects cuando se detecta por primera vez la distancia en milímetros entre los centros de cada pupila de un rostro rastreado.

#### Propiedades

| Propiedad | Tipo     | Descripción                                        |
| --------- | -------- | -------------------------------------------------- |
| id        | `Número` | Id numérico de la cara localizada. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyebrowlowered', (e) => {
    console.log(e)
})
```

### lefteyebrowraised {#lefteyebrowraised}

Este evento es emitido por Face Effects cuando la ceja izquierda de una cara rastreada se levanta de su posición inicial cuando se encontró la cara.

#### Propiedades

| Propiedad | Tipo     | Descripción                                        |
| --------- | -------- | -------------------------------------------------- |
| id        | `Número` | Id numérico de la cara localizada. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyebrowraised', (e) => {
    console.log(e)
})
```

### lefteyeclosed {#lefteyeclosed}

Este evento es emitido por Face Effects cuando se cierra el ojo izquierdo de una cara rastreada.

#### Propiedades

| Propiedad | Tipo     | Descripción                                        |
| --------- | -------- | -------------------------------------------------- |
| id        | `Número` | Id numérico de la cara localizada. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyeclosed', (e) => {
    console.log(e)
})
```

### lefteyeopened {#lefteyeopened}

Este evento es emitido por Face Effects cuando se abre el ojo izquierdo de una cara rastreada.

#### Propiedades

| Propiedad | Tipo     | Descripción                                        |
| --------- | -------- | -------------------------------------------------- |
| id        | `Número` | Id numérico de la cara localizada. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyeopened', (e) => {
    console.log(e)
})
```

### lefteyewinked {#lefteyewinked}

Este evento es emitido por Face Effects cuando el ojo izquierdo de una cara rastreada se cierra y se abre en un plazo de 750 ms mientras que el ojo derecho permanece abierto.

#### Propiedades

| Propiedad | Tipo     | Descripción                                        |
| --------- | -------- | -------------------------------------------------- |
| id        | `Número` | Id numérico de la cara localizada. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyewinked', (e) => {
    console.log(e)
})
```

### cerrado a cal y canto {#mouthclosed}

Este evento es emitido por Face Effects cuando se cierra la boca de una cara rastreada.

#### Propiedades

| Propiedad | Tipo     | Descripción                                        |
| --------- | -------- | -------------------------------------------------- |
| id        | `Número` | Id numérico de la cara localizada. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.mouthclosed', (e) => {
    console.log(e)
})
```

### mouthopened {#mouthopened}

Este evento es emitido por Face Effects cuando se abre la boca de una cara rastreada.

#### Propiedades

| Propiedad | Tipo     | Descripción                                        |
| --------- | -------- | -------------------------------------------------- |
| id        | `Número` | Id numérico de la cara localizada. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.mouthopened', (e) => {
    console.log(e)
})
```

### righteyebrowlowered {#righteyebrowlowered}

Este evento es emitido por Face Effects cuando la ceja derecha de una cara rastreada se baja a su posición inicial cuando se encontró la cara.

#### Propiedades

| Propiedad | Tipo     | Descripción                                        |
| --------- | -------- | -------------------------------------------------- |
| id        | `Número` | Id numérico de la cara localizada. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyebrowlowered', (e) => {
    console.log(e)
})
```

### righteyebrowraised {#righteyebrowraised}

Este evento es emitido por Face Effects cuando la ceja derecha de una cara rastreada se levanta de su posición inicial cuando se encontró la cara.

#### Propiedades

| Propiedad | Tipo     | Descripción                                        |
| --------- | -------- | -------------------------------------------------- |
| id        | `Número` | Id numérico de la cara localizada. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyebrowraised', (e) => {
    console.log(e)
})
```

### rightteyeclosed {#righteyeclosed}

Este evento es emitido por Face Effects cuando se cierra el ojo derecho de una cara rastreada.

#### Propiedades

| Propiedad | Tipo     | Descripción                                        |
| --------- | -------- | -------------------------------------------------- |
| id        | `Número` | Id numérico de la cara localizada. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyeclosed', (e) => {
    console.log(e)
})
```

### rectificado {#righteyeopened}

Este evento es emitido por Face Effects cuando se abre el ojo derecho de una cara rastreada.

#### Propiedades

| Propiedad | Tipo     | Descripción                                        |
| --------- | -------- | -------------------------------------------------- |
| id        | `Número` | Id numérico de la cara localizada. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyeopened', (e) => {
    console.log(e)
})
```

### rightteyewinked {#righteyewinked}

Este evento es emitido por Face Effects cuando el ojo derecho de un rostro rastreado se cierra y se abre en un plazo de 750 ms mientras que el ojo izquierdo permanece abierto.

#### Propiedades

| Propiedad | Tipo     | Descripción                                        |
| --------- | -------- | -------------------------------------------------- |
| id        | `Número` | Id numérico de la cara localizada. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyewinked', (e) => {
    console.log(e)
})
```

### earpointfound {#earpointfound}

Este evento es emitido por Face Effects cuando se encuentra un punto auricular.

#### Propiedades

| Propiedad | Tipo     | Descripción                                                                                                                                                                                                        |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| id        | `Número` | Un identificador numérico de la cara localizada                                                                                                                                                                    |
| punto     | Cadena   | Nombre del punto auricular. Uno de los siguientes: `Lóbulo izquierdo`, `Canal izquierdo`, `Hélice izquierda`, `Lóbulo derecho`, `Canal derecho`, `Hélice derecha`. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.earpointfound', (e) => {
    console.log(e)
})
```

### earpointlost {#earpointlost}

Este evento es emitido por Face Effects cuando se pierde un punto auricular.

#### Propiedades

| Propiedad | Tipo     | Descripción                                                                                                                                                                                                        |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| id        | `Número` | Un identificador numérico de la cara localizada                                                                                                                                                                    |
| punto     | Cadena   | Nombre del punto auricular. Uno de los siguientes: `Lóbulo izquierdo`, `Canal izquierdo`, `Hélice izquierda`, `Lóbulo derecho`, `Canal derecho`, `Hélice derecha`. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.earpointlost', (e) => {
    console.log(e)
})
```
