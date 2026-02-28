---
id: face
sidebar_position: 2
---

# Face Events

## Eventos

### facefound

This event is emitted by Face Effects when a face is first found.

#### Propiedades

| Propiedad        | Tipo                                  | Descripción                                                                                                                                                                                                                      |
| ---------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id               | `Number`                              | A numerical id of the located face                                                                                                                                                                                               |
| transform        | [`TransformObject`](#TransformObject) | Información de transformación de la cara localizada.                                                                                                                                                             |
| vértices         | `[{x, y, z}]`                         | Posición de los puntos de la cara, relativa a la transformación.                                                                                                                                                 |
| normales         | `[{x, y, z}]`                         | Dirección normal de los vértices, relativa a la transformación.                                                                                                                                                  |
| attachmentPoints | `{ name, position: {x,y,z} }`         | See [`XR8.FaceController.AttachmentPoints`](https://www.8thwall.com/docs/api/facecontroller/attachmentpoints/) for list of available attachment points. `position` is relative to the transform. |
| uvsInCameraFrame | `[{u, v}]`                            | La lista de posiciones uv en el fotograma de la cámara correspondientes a los puntos de vértice devueltos.                                                                                                       |

##### TransformObject {#TransformObject}

| Propiedad    | Tipo           | Descripción                                                                                          |
| ------------ | -------------- | ---------------------------------------------------------------------------------------------------- |
| position     | `{x, y, z}`    | La posición 3d de la cara localizada.                                                |
| rotation     | `{w, x, y, z}` | La orientación local 3d de la cara localizada.                                       |
| escala       | `Number`       | Factor de escala que debe aplicarse a los objetos unidos a esta cara.                |
| scaledWidth  | `Number`       | Anchura aproximada de la cabeza en la escena multiplicada por la escala.             |
| scaledHeight | `Number`       | Altura aproximada de la cabeza en la escena multiplicada por la escala.              |
| scaledDepth  | `Number`       | Profundidad aproximada de la cabeza en la escena cuando se multiplica por la escala. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.facefound', (e) => {
    console.log(e)
})
```

### faceloading

This event is emitted by Face Effects when loading begins for additional face AR resources.

#### Propiedades

| Propiedad          | Tipo          | Descripción                                                                                                                                               |
| ------------------ | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| maxDetections      | `Number`      | El número máximo de caras que se pueden procesar simultáneamente.                                                                         |
| puntosPorDetección | `Number`      | Número de vértices que se extraerán por cara.                                                                                             |
| indices            | `[{a, b, c}]` | Índices en la matriz de vértices que forman los triángulos de la malla solicitada, tal como se especifica con meshGeometry en configurar. |
| uvs                | `[{u, v}]`    | posiciones uv en un mapa de textura correspondiente a los puntos de vértice devueltos.                                                    |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.faceloading', (e) => {
    console.log(e)
})
```

### facelost

This event is emitted by Face Effects when a face is no longer being tracked.

#### Propiedades

| Propiedad | Tipo     | Descripción                                                           |
| --------- | -------- | --------------------------------------------------------------------- |
| id        | `Number` | Una identificación numérica de la cara que se perdió. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.facelost', (e) => {
    console.log(e)
})
```

### facescanning

This event is emitted by Face Effects when all face AR resources have been loaded and scanning has begun.

#### Propiedades

| Propiedad          | Tipo          | Descripción                                                                                                                                               |
| ------------------ | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| maxDetections      | `Number`      | El número máximo de caras que se pueden procesar simultáneamente.                                                                         |
| puntosPorDetección | `Number`      | Número de vértices que se extraerán por cara.                                                                                             |
| indices            | `[{a, b, c}]` | Índices en la matriz de vértices que forman los triángulos de la malla solicitada, tal como se especifica con meshGeometry en configurar. |
| uvs                | `[{u, v}]`    | posiciones uv en un mapa de textura correspondiente a los puntos de vértice devueltos.                                                    |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.facescanning', (e) => {
    console.log(e)
})
```

### faceupdated

This event is emitted by Face Effects when faces are subsequently found.

#### Propiedades

| Propiedad        | Tipo                                  | Descripción                                                                                                                                                                                                                      |
| ---------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id               | `Number`                              | A numerical id of the located face                                                                                                                                                                                               |
| transform        | [`TransformObject`](#TransformObject) | Información de transformación de la cara localizada.                                                                                                                                                             |
| vértices         | `[{x, y, z}]`                         | Posición de los puntos de la cara, relativa a la transformación.                                                                                                                                                 |
| normales         | `[{x, y, z}]`                         | Dirección normal de los vértices, relativa a la transformación.                                                                                                                                                  |
| attachmentPoints | `{ name, position: {x,y,z} }`         | See [`XR8.FaceController.AttachmentPoints`](https://www.8thwall.com/docs/api/facecontroller/attachmentpoints/) for list of available attachment points. `position` is relative to the transform. |
| uvsInCameraFrame | `[{u, v}]`                            | La lista de posiciones uv en el fotograma de la cámara correspondientes a los puntos de vértice devueltos.                                                                                                       |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.faceupdated', (e) => {
    console.log(e)
})
```

### blinked

This event is emitted by Face Effects when a tracked face's eyes blink.

#### Propiedades

| Propiedad | Tipo     | Descripción                        |
| --------- | -------- | ---------------------------------- |
| id        | `Number` | A numerical id of the located face |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.blinked', (e) => {
    console.log(e)
})
```

### interpupillarydistance

This event is emitted by Face Effects when a tracked face's distance in millimeters between the centers of each pupil is first detected.

#### Propiedades

| Propiedad              | Tipo     | Descripción                                                                          |
| ---------------------- | -------- | ------------------------------------------------------------------------------------ |
| id                     | `Number` | Un identificador numérico de la cara localizada.                     |
| interpupillaryDistance | `Number` | Distancia aproximada en milímetros entre los centros de cada pupila. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.interpupillarydistance', (e) => {
    console.log(e)
})
```

### lefteyebrowlowered

This event is emitted by Face Effects when a tracked face's distance in millimeters between the centers of each pupil is first detected.

#### Propiedades

| Propiedad | Tipo     | Descripción                                                      |
| --------- | -------- | ---------------------------------------------------------------- |
| id        | `Number` | Un identificador numérico de la cara localizada. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyebrowlowered', (e) => {
    console.log(e)
})
```

### lefteyebrowraised

This event is emitted by Face Effects when a tracked face's left eyebrow is raised from its initial position when the face was found.

#### Propiedades

| Propiedad | Tipo     | Descripción                                                      |
| --------- | -------- | ---------------------------------------------------------------- |
| id        | `Number` | Un identificador numérico de la cara localizada. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyebrowraised', (e) => {
    console.log(e)
})
```

### lefteyeclosed

This event is emitted by Face Effects when a tracked face's left eye closes.

#### Propiedades

| Propiedad | Tipo     | Descripción                                                      |
| --------- | -------- | ---------------------------------------------------------------- |
| id        | `Number` | Un identificador numérico de la cara localizada. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyeclosed', (e) => {
    console.log(e)
})
```

### lefteyeopened

This event is emitted by Face Effects when a tracked face's left eye opens.

#### Propiedades

| Propiedad | Tipo     | Descripción                                                      |
| --------- | -------- | ---------------------------------------------------------------- |
| id        | `Number` | Un identificador numérico de la cara localizada. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyeopened', (e) => {
    console.log(e)
})
```

### lefteyewinked

This event is emitted by Face Effects when a tracked face's left eye closes and opens within 750ms while the right eye remains open.

#### Propiedades

| Propiedad | Tipo     | Descripción                                                      |
| --------- | -------- | ---------------------------------------------------------------- |
| id        | `Number` | Un identificador numérico de la cara localizada. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyewinked', (e) => {
    console.log(e)
})
```

### mouthclosed

This event is emitted by Face Effects when a tracked face's mouth closes.

#### Propiedades

| Propiedad | Tipo     | Descripción                                                      |
| --------- | -------- | ---------------------------------------------------------------- |
| id        | `Number` | Un identificador numérico de la cara localizada. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.mouthclosed', (e) => {
    console.log(e)
})
```

### mouthopened

This event is emitted by Face Effects when a tracked face's mouth opens.

#### Propiedades

| Propiedad | Tipo     | Descripción                                                      |
| --------- | -------- | ---------------------------------------------------------------- |
| id        | `Number` | Un identificador numérico de la cara localizada. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.mouthopened', (e) => {
    console.log(e)
})
```

### righteyebrowlowered

This event is emitted by Face Effects when a tracked face's right eyebrow is lowered to its initial position when the face was found.

#### Propiedades

| Propiedad | Tipo     | Descripción                                                      |
| --------- | -------- | ---------------------------------------------------------------- |
| id        | `Number` | Un identificador numérico de la cara localizada. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyebrowlowered', (e) => {
    console.log(e)
})
```

### righteyebrowraised

This event is emitted by Face Effects when a tracked face's right eyebrow is raised from its initial position when the face was found.

#### Propiedades

| Propiedad | Tipo     | Descripción                                                      |
| --------- | -------- | ---------------------------------------------------------------- |
| id        | `Number` | Un identificador numérico de la cara localizada. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyebrowraised', (e) => {
    console.log(e)
})
```

### righteyeclosed

This event is emitted by Face Effects when a tracked face's right eye closes.

#### Propiedades

| Propiedad | Tipo     | Descripción                                                      |
| --------- | -------- | ---------------------------------------------------------------- |
| id        | `Number` | Un identificador numérico de la cara localizada. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyeclosed', (e) => {
    console.log(e)
})
```

### righteyeopened

This event is emitted by Face Effects when a tracked face's right eye opens.

#### Propiedades

| Propiedad | Tipo     | Descripción                                                      |
| --------- | -------- | ---------------------------------------------------------------- |
| id        | `Number` | Un identificador numérico de la cara localizada. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyeopened', (e) => {
    console.log(e)
})
```

### righteyewinked

This event is emitted by Face Effects when a tracked face's right eye closes and opens within 750ms while the left eye remains open.

#### Propiedades

| Propiedad | Tipo     | Descripción                                                      |
| --------- | -------- | ---------------------------------------------------------------- |
| id        | `Number` | Un identificador numérico de la cara localizada. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyewinked', (e) => {
    console.log(e)
})
```

### earpointfound

This event is emitted by Face Effects when an ear point is found.

#### Propiedades

| Propiedad | Tipo     | Descripción                                                                                                                                         |
| --------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| id        | `Number` | A numerical id of the located face                                                                                                                  |
| point     | `Cadena` | Ear point name. One of the following: `leftLobe`, `leftCanal`, `leftHelix`, `rightLobe`, `rightCanal`, `rightHelix` |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.earpointfound', (e) => {
    console.log(e)
})
```

### earpointlost

This event is emitted by Face Effects when an ear point is lost.

#### Propiedades

| Propiedad | Tipo     | Descripción                                                                                                                                         |
| --------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| id        | `Number` | A numerical id of the located face                                                                                                                  |
| point     | `Cadena` | Ear point name. One of the following: `leftLobe`, `leftCanal`, `leftHelix`, `rightLobe`, `rightCanal`, `rightHelix` |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'facecontroller.earpointfound', (e) => {
    console.log(e)
})
```
