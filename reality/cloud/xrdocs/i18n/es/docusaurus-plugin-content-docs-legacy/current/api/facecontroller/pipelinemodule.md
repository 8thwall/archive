---
sidebar_position: 2
sidebar_label: pipelineModule()
---

# XR8.FaceController.pipelineModule()

`XR8.FaceController.pipelineModule()`

## Descripción {#description}

Crea un módulo de canalización de cámara que, cuando se instala, recibe llamadas de retorno sobre cuándo se ha iniciado la cámara, eventos de proceso de cámara y otros cambios de estado. Se utilizan para calcular la posición de la cámara.

## Parámetros {#parameters}

Ninguno

## Devuelve {#returns}

El valor devuelto es un objeto puesto a disposición de [`onUpdate`](/legacy/api/camerapipelinemodule/onupdate) como:

`processCpuResult.facecontroller: { rotation, position, intrinsics, cameraFeedTexture }`

| Propiedad         | Tipo                                                                            | Descripción                                                                                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| rotación          | `{w, x, y, z}`                                                                  | La orientación (cuaternión) de la cámara en la escena.                                                                                                       |
| posición          | `{x, y, z}`                                                                     | La posición de la cámara en la escena.                                                                                                                                          |
| intrínsecos       | `[Número]`                                                                      | Una matriz de proyección 4x4 de 16 dimensiones de columna mayor que proporciona a la cámara de la escena el mismo campo de visión que la alimentación de la cámara renderizada. |
| cameraFeedTexture | [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | La textura que contiene los datos de alimentación de la cámara.                                                                                                                 |

## Eventos enviados {#dispatched-events}

**Carga facial**: Se dispara cuando comienza la carga de recursos adicionales de face AR.

\`faceloading.detail : {maxDetections, pointsPerDetection, indices, uvs}\`\`

| Propiedad          | Tipo          | Descripción                                                                                                                                                                                               |
| ------------------ | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| maxDetecciones     | `Número`      | Número máximo de caras que se pueden procesar simultáneamente.                                                                                                                            |
| puntosPorDetección | `Número`      | Número de vértices que se extraerán por cara.                                                                                                                                             |
| índices            | `[{a, b, c}]` | La lista de índices de la matriz de vértices que forman los triángulos de la malla solicitada, como se especifica con `meshGeometry` en [`XR8.FaceController.configure()`](configure.md). |
| uvs                | `[{u, v}]`    | La lista de posiciones uv en un mapa de textura correspondiente a los puntos de vértice devueltos.                                                                                        |

**Escaneado de caras**: Se dispara cuando se han cargado todos los recursos de RA de caras y ha comenzado el escaneo.

\`facescanning.detail : {maxDetections, pointsPerDetection, indices, uvs}\`\`

| Propiedad          | Tipo          | Descripción                                                                                                                                                                                               |
| ------------------ | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| maxDetecciones     | `Número`      | Número máximo de caras que se pueden procesar simultáneamente.                                                                                                                            |
| puntosPorDetección | `Número`      | Número de vértices que se extraerán por cara.                                                                                                                                             |
| índices            | `[{a, b, c}]` | La lista de índices de la matriz de vértices que forman los triángulos de la malla solicitada, como se especifica con `meshGeometry` en [`XR8.FaceController.configure()`](configure.md). |
| uvs                | `[{u, v}]`    | La lista de posiciones uv en un mapa de textura correspondiente a los puntos de vértice devueltos.                                                                                        |

**Cara encontrada**: Se activa cuando se encuentra una cara por primera vez.

\`facefound.detail : {id, transform, vertices, normales, attachmentPoints}\`\`

| Propiedad        | Tipo                                                                      | Descripción                                                                                                                                                                                               |
| ---------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id               | `Número`                                                                  | Id numérico de la cara localizada.                                                                                                                                                        |
| transformar      | \`{position, rotation, scale, scaledWidth, scaledHeight, scaledDepth}\`\` | Información de transformación de la cara localizada.                                                                                                                                      |
| vértices         | `[{x, y, z}]`                                                             | Posición de los puntos de la cara, relativa a la transformación.                                                                                                                          |
| normales         | `[{x, y, z}]`                                                             | Dirección normal de los vértices, relativa a la transformación.                                                                                                                           |
| attachmentPoints | `{nombre, posición: {x,y,z}}`                                             | Consulte [`XR8.FaceController.AttachmentPoints`](attachmentpoints.md) para ver la lista de puntos de fijación disponibles. La `posición` es relativa a la transformación. |
| uvsInCameraFrame | `[{u, v}]`                                                                | La lista de posiciones uv en el fotograma de la cámara correspondientes a los puntos de vértice devueltos.                                                                                |

`transform` es un objeto con las siguientes propiedades:

| Propiedad    | Tipo           | Descripción                                                                                          |
| ------------ | -------------- | ---------------------------------------------------------------------------------------------------- |
| posición     | `{x, y, z}`    | La posición 3d de la cara localizada.                                                |
| rotación     | `{w, x, y, z}` | La orientación local 3d de la cara localizada.                                       |
| escala       | `Número`       | Factor de escala que debe aplicarse a los objetos adjuntos a esta cara.              |
| scaledWidth  | `Número`       | Anchura aproximada de la cabeza en la escena cuando se multiplica por la escala.     |
| scaledHeight | `Número`       | Altura aproximada de la cabeza en la escena multiplicada por la escala.              |
| scaledDepth  | `Número`       | Profundidad aproximada de la cabeza en la escena cuando se multiplica por la escala. |

**caraactualizada**: Se activa cuando se encuentra una cara.

\`faceupdated.detail : {id, transform, vertices, normales, attachmentPoints}\`\`

| Propiedad        | Tipo                                                                      | Descripción                                                                                                                                                                                               |
| ---------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id               | `Número`                                                                  | Id numérico de la cara localizada.                                                                                                                                                        |
| transformar      | \`{position, rotation, scale, scaledWidth, scaledHeight, scaledDepth}\`\` | Información de transformación de la cara localizada.                                                                                                                                      |
| vértices         | `[{x, y, z}]`                                                             | Posición de los puntos de la cara, relativa a la transformación.                                                                                                                          |
| normales         | `[{x, y, z}]`                                                             | Dirección normal de los vértices, relativa a la transformación.                                                                                                                           |
| attachmentPoints | `{nombre, posición: {x,y,z}}`                                             | Consulte [`XR8.FaceController.AttachmentPoints`](attachmentpoints.md) para ver la lista de puntos de fijación disponibles. La `posición` es relativa a la transformación. |
| uvsInCameraFrame | `[{u, v}]`                                                                | La lista de posiciones uv en el fotograma de la cámara correspondientes a los puntos de vértice devueltos.                                                                                |

`transform` es un objeto con las siguientes propiedades:

| Propiedad    | Tipo           | Descripción                                                                                          |
| ------------ | -------------- | ---------------------------------------------------------------------------------------------------- |
| posición     | `{x, y, z}`    | La posición 3d de la cara localizada.                                                |
| rotación     | `{w, x, y, z}` | La orientación local 3d de la cara localizada.                                       |
| escala       | `Número`       | Factor de escala que debe aplicarse a los objetos adjuntos a esta cara.              |
| scaledWidth  | `Número`       | Anchura aproximada de la cabeza en la escena cuando se multiplica por la escala.     |
| scaledHeight | `Número`       | Altura aproximada de la cabeza en la escena multiplicada por la escala.              |
| scaledDepth  | `Número`       | Profundidad aproximada de la cabeza en la escena cuando se multiplica por la escala. |

\*\*cara perdida Se dispara cuando una cara deja de ser rastreada.

`facelost.detail : { id }`

| Propiedad | Tipo     | Descripción                                        |
| --------- | -------- | -------------------------------------------------- |
| id        | `Número` | Id numérico de la cara localizada. |

**Boca abierta**: Se dispara cuando la boca de una cara rastreada se abre.

`mouthopened.detail : { id }`

| Propiedad | Tipo     | Descripción                                        |
| --------- | -------- | -------------------------------------------------- |
| id        | `Número` | Id numérico de la cara localizada. |

**boca cerrada**: Se dispara cuando se cierra la boca de una cara rastreada.

`mouthclosed.detail : { id }`

| Propiedad | Tipo     | Descripción                                        |
| --------- | -------- | -------------------------------------------------- |
| id        | `Número` | Id numérico de la cara localizada. |

**ojo izquierdo abierto**: Se dispara cuando se abre el ojo izquierdo de una cara rastreada.

`lefteyeopened.detail : { id }`

| Propiedad | Tipo     | Descripción                                        |
| --------- | -------- | -------------------------------------------------- |
| id        | `Número` | Id numérico de la cara localizada. |

**lefteyeclosed**: Se dispara cuando se cierra el ojo izquierdo de una cara rastreada.

`lefteyeclosed.detail : { id }`

| Propiedad | Tipo     | Descripción                                        |
| --------- | -------- | -------------------------------------------------- |
| id        | `Número` | Id numérico de la cara localizada. |

**Ojo derecho abierto**: Se dispara cuando se abre el ojo derecho de una cara rastreada.

`righteyeopened.detail : { id }`

| Propiedad | Tipo     | Descripción                                        |
| --------- | -------- | -------------------------------------------------- |
| id        | `Número` | Id numérico de la cara localizada. |

**ojoderechocerrado**: Se dispara cuando se cierra el ojo derecho de una cara rastreada.

`righteyeclosed.detail : { id }`

| Propiedad | Tipo     | Descripción                                        |
| --------- | -------- | -------------------------------------------------- |
| id        | `Número` | Id numérico de la cara localizada. |

**ceja izquierda levantada**: Se dispara cuando la ceja izquierda de una cara rastreada se levanta de su posición inicial cuando se encontró la cara.

`lefteyebrowraised.detail : { id }`

| Propiedad | Tipo     | Descripción                                        |
| --------- | -------- | -------------------------------------------------- |
| id        | `Número` | Id numérico de la cara localizada. |

**lefteyebrowlowered**: Se dispara cuando la ceja izquierda de una cara rastreada se baja a su posición inicial cuando se encontró la cara.

`lefteyebrowlowered.detail : { id }`

| Propiedad | Tipo     | Descripción                                        |
| --------- | -------- | -------------------------------------------------- |
| id        | `Número` | Id numérico de la cara localizada. |

**Ceja derecha levantada**: Se dispara cuando la ceja derecha de una cara rastreada se levanta de su posición cuando se encontró la cara.

`righteyebrowraised.detail : { id }`

| Propiedad | Tipo     | Descripción                                        |
| --------- | -------- | -------------------------------------------------- |
| id        | `Número` | Id numérico de la cara localizada. |

**cejaderechabajada**: Se dispara cuando la ceja derecha de una cara rastreada se baja a su posición inicial cuando se encontró la cara.

`righteyebrowlowered.detail : { id }`

| Propiedad | Tipo     | Descripción                                        |
| --------- | -------- | -------------------------------------------------- |
| id        | `Número` | Id numérico de la cara localizada. |

**parpadeo**: Se dispara cuando el ojo izquierdo de una cara rastreada se cierra y se abre en 750 ms mientras el ojo derecho permanece abierto.

`lefteyewinked.detail : { id }`

| Propiedad | Tipo     | Descripción                                        |
| --------- | -------- | -------------------------------------------------- |
| id        | `Número` | Id numérico de la cara localizada. |

**Parpadeo derecho**: Se dispara cuando el ojo derecho de una cara rastreada se cierra y se abre en 750 ms mientras el ojo izquierdo permanece abierto.

`righteyewinked.detail : { id }`

| Propiedad | Tipo     | Descripción                                        |
| --------- | -------- | -------------------------------------------------- |
| id        | `Número` | Id numérico de la cara localizada. |

**Parpadeo**: Se dispara cuando los ojos de una cara rastreada parpadean.

`blinked.detail : { id }`

| Propiedad | Tipo     | Descripción                                        |
| --------- | -------- | -------------------------------------------------- |
| id        | `Número` | Id numérico de la cara localizada. |

**Distancia entre pupilas**: Se dispara cuando se detecta por primera vez la distancia en milímetros de una cara rastreada entre los centros de cada pupila.

`interpupillarydistance.detail : {id, interpupillaryDistance}`

| Propiedad              | Tipo     | Descripción                                                                          |
| ---------------------- | -------- | ------------------------------------------------------------------------------------ |
| id                     | `Número` | Id numérico de la cara localizada.                                   |
| distancia interpupilar | `Número` | Distancia aproximada en milímetros entre los centros de cada pupila. |

Cuando `enableEars:true` la detección de orejas se ejecuta simultáneamente con los efectos faciales y envía los siguientes eventos:

**oreja encontrada**: Se dispara cuando se encuentra una oreja por primera vez.

`earfound.detail : {id, ear}`

| Propiedad | Tipo     | Descripción                                                                                |
| --------- | -------- | ------------------------------------------------------------------------------------------ |
| id        | `Número` | Identificador numérico de la cara localizada a la que está unida la oreja. |
| oído      | Cadena   | Puede ser "izquierda" o "derecha".                                         |

**punto de oreja encontrado**: Se activa cuando se encuentra por primera vez un ear attachmentPoint.

`earpointfound.detail : {id, point}`

| Propiedad | Tipo     | Descripción                                                                                                        |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| id        | `Número` | Identificador numérico de la cara localizada a la que está unido el punto de fijación de la oreja. |
| punto     | Cadena   | Puede ser `leftHelix`, `leftCanal`, `leftLobe`, `rightHelix`, `rightCanal`, o `rightLobe`.         |

**Oído perdido**: Se dispara cuando una oreja deja de ser rastreada.

`earlost.detail : {id, ear}`

| Propiedad | Tipo     | Descripción                                                                                |
| --------- | -------- | ------------------------------------------------------------------------------------------ |
| id        | `Número` | Identificador numérico de la cara localizada a la que está unida la oreja. |
| oído      | Cadena   | Puede ser "izquierda" o "derecha".                                         |

\*\*punto de oreja perdido Se activa cuando se deja de rastrear un punto de fijación de la oreja.

`earpointlost.detail : {id, point}`

| Propiedad | Tipo     | Descripción                                                                                                        |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| id        | `Número` | Identificador numérico de la cara localizada a la que está unido el punto de fijación de la oreja. |
| punto     | Cadena   | Puede ser `leftHelix`, `leftCanal`, `leftLobe`, `rightHelix`, `rightCanal`, o `rightLobe`.         |

## Ejemplo: añadir el módulo {#example---adding-pipeline-module}

```javascript
XR8.addCameraPipelineModule(XR8.FaceController.pipelineModule())
```
