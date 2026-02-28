---
sidebar_position: 2
sidebar_label: pipelineModule()
---

# XR8.FaceController.pipelineModule()

`XR8.FaceController.pipelineModule()`

## Descripción {#description}

Crea un módulo de canalización de cámara que, cuando se instala, recibe llamadas de retorno sobre cuándo se ha iniciado la cámara, eventos de proceso de la cámara y otros cambios de estado. Se utilizan para calcular la posición de la cámara.

## Parámetros {#parameters}

Ninguno

## Devuelve {#returns}

El valor devuelto es un objeto puesto a disposición de [`onUpdate`](/api/camerapipelinemodule/onupdate) como:

`processCpuResult.facecontroller: { rotation, position, intrinsics, cameraFeedTexture }`

| Propiedad         | Tipo                                                                            | Descripción                                                                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| rotation          | `{w, x, y, z}`                                                                  | La orientación (cuaternión) de la cámara en la escena.                                                                                                                 |
| position          | `{x, y, z}`                                                                     | La posición de la cámara en la escena.                                                                                                                                 |
| intrinsics        | `[Número]`                                                                      | Una matriz de proyección de 16 dimensiones de columna mayor 4x4 que da a la cámara de la escena el mismo campo de visión que la alimentación de la cámara renderizada. |
| cameraFeedTexture | [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | La textura que contiene los datos de alimentación de la cámara.                                                                                                        |

## Eventos enviados {#dispatched-events}

**faceloading**: Se dispara cuando comienza la carga de recursos adicionales de cara AR.

`faceloading.detail : {maxDetections, pointsPerDetection, indices, uvs}`

| Propiedad          | Tipo          | Descripción                                                                                                                                                                                   |
| ------------------ | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| maxDetections      | `Number`      | El número máximo de caras que se pueden procesar simultáneamente.                                                                                                                             |
| pointsPerDetection | `Number`      | Número de vértices que se extraerán por cara.                                                                                                                                                 |
| indices            | `[{a, b, c}]` | La lista de índices de la matriz de vértices que forman los triángulos de la malla solicitada, tal como se especifica con `meshGeometry` en [`XR8.FaceController.configure()`](configure.md). |
| uvs                | `[{u, v}]`    | La lista de posiciones uv en un mapa de textura correspondiente a los puntos de vértice devueltos.                                                                                            |

**facescanning**: Se activa cuando se han cargado todos los recursos de AR de caras y ha comenzado el escaneado.

`facescanning.detail : {maxDetections, pointsPerDetection, indices, uvs}`

| Propiedad          | Tipo          | Descripción                                                                                                                                                                                   |
| ------------------ | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| maxDetections      | `Number`      | El número máximo de caras que se pueden procesar simultáneamente.                                                                                                                             |
| pointsPerDetection | `Number`      | Número de vértices que se extraerán por cara.                                                                                                                                                 |
| indices            | `[{a, b, c}]` | La lista de índices de la matriz de vértices que forman los triángulos de la malla solicitada, tal como se especifica con `meshGeometry` en [`XR8.FaceController.configure()`](configure.md). |
| uvs                | `[{u, v}]`    | La lista de posiciones uv en un mapa de textura correspondiente a los puntos de vértice devueltos.                                                                                            |

**facefound**: Se activa cuando se encuentra una cara por primera vez.

`facefound.detail : {id, transform, vertices, normals, attachmentPoints}`

| Propiedad        | Tipo                                                                  | Descripción                                                                                                                                                            |
| ---------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id               | `Number`                                                              | Un identificador numérico de la cara localizada.                                                                                                                       |
| transform        | `{position, rotation, scale, scaledWidth, scaledHeight, scaledDepth}` | Información de transformación de la cara localizada.                                                                                                                   |
| vertices         | `[{x, y, z}]`                                                         | Posición de los puntos de la cara, relativa a la transformación.                                                                                                       |
| normals          | `[{x, y, z}]`                                                         | Dirección normal de los vértices, relativa a la transformación.                                                                                                        |
| attachmentPoints | `{name, position: {x,y,z}}`                                           | Consulta [`XR8.FaceController.AttachmentPoints`](attachmentpoints.md) para ver la lista de puntos de fijación disponibles. `position` es relativa a la transformación. |
| uvsInCameraFrame | `[{u, v}]`                                                            | La lista de posiciones uv en el fotograma de la cámara correspondientes a los puntos de vértice devueltos.                                                             |

`transform` es un objeto con las siguientes propiedades:

| Propiedad    | Tipo           | Descripción                                                                          |
| ------------ | -------------- | ------------------------------------------------------------------------------------ |
| position     | `{x, y, z}`    | La posición 3d de la cara localizada.                                                |
| rotation     | `{w, x, y, z}` | La orientación local 3d de la cara localizada.                                       |
| scale        | `Number`       | Factor de escala que debe aplicarse a los objetos unidos a esta cara.                |
| scaledWidth  | `Number`       | Anchura aproximada de la cabeza en la escena multiplicada por la escala.             |
| scaledHeight | `Number`       | Altura aproximada de la cabeza en la escena multiplicada por la escala.              |
| scaledDepth  | `Number`       | Profundidad aproximada de la cabeza en la escena cuando se multiplica por la escala. |

**faceupdated**: Se activa cuando se encuentra una cara.

`faceupdated.detail : {id, transform, vertices, normals, attachmentPoints}`

| Propiedad        | Tipo                                                                  | Descripción                                                                                                                                                            |
| ---------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id               | `Number`                                                              | Un identificador numérico de la cara localizada.                                                                                                                       |
| transform        | `{position, rotation, scale, scaledWidth, scaledHeight, scaledDepth}` | Información de transformación de la cara localizada.                                                                                                                   |
| vertices         | `[{x, y, z}]`                                                         | Posición de los puntos de la cara, relativa a la transformación.                                                                                                       |
| normals          | `[{x, y, z}]`                                                         | Dirección normal de los vértices, relativa a la transformación.                                                                                                        |
| attachmentPoints | `{name, position: {x,y,z}}`                                           | Consulta [`XR8.FaceController.AttachmentPoints`](attachmentpoints.md) para ver la lista de puntos de fijación disponibles. `position` es relativa a la transformación. |
| uvsInCameraFrame | `[{u, v}]`                                                            | La lista de posiciones uv en el fotograma de la cámara correspondientes a los puntos de vértice devueltos.                                                             |

`transform` es un objeto con las siguientes propiedades:

| Propiedad    | Tipo           | Descripción                                                                          |
| ------------ | -------------- | ------------------------------------------------------------------------------------ |
| position     | `{x, y, z}`    | La posición 3d de la cara localizada.                                                |
| rotation     | `{w, x, y, z}` | La orientación local 3d de la cara localizada.                                       |
| scale        | `Number`       | Factor de escala que debe aplicarse a los objetos unidos a esta cara.                |
| scaledWidth  | `Number`       | Anchura aproximada de la cabeza en la escena multiplicada por la escala.             |
| scaledHeight | `Number`       | Altura aproximada de la cabeza en la escena multiplicada por la escala.              |
| scaledDepth  | `Number`       | Profundidad aproximada de la cabeza en la escena cuando se multiplica por la escala. |

**facelost**: Se activa cuando se deja de seguir una cara.

`facelost.detail : { id }`

| Propiedad | Tipo     | Descripción                                      |
| --------- | -------- | ------------------------------------------------ |
| id        | `Number` | Un identificador numérico de la cara localizada. |

**mouthopened**: Se dispara cuando se abre la boca de una cara rastreada.

`mouthopened.detail : { id }`

| Propiedad | Tipo     | Descripción                                      |
| --------- | -------- | ------------------------------------------------ |
| id        | `Number` | Un identificador numérico de la cara localizada. |

**mouthclosed**: Se dispara cuando se cierra la boca de una cara rastreada.

`mouthclosed.detail : { id }`

| Propiedad | Tipo     | Descripción                                      |
| --------- | -------- | ------------------------------------------------ |
| id        | `Number` | Un identificador numérico de la cara localizada. |

**lefteyeopened**: Se dispara cuando se abre el ojo izquierdo de una cara rastreada.

`lefteyeopened.detail : { id }`

| Propiedad | Tipo     | Descripción                                      |
| --------- | -------- | ------------------------------------------------ |
| id        | `Number` | Un identificador numérico de la cara localizada. |

**lefteyeclosed**: Se dispara cuando se cierra el ojo izquierdo de una cara rastreada.

`lefteyeclosed.detail : { id }`

| Propiedad | Tipo     | Descripción                                      |
| --------- | -------- | ------------------------------------------------ |
| id        | `Number` | Un identificador numérico de la cara localizada. |

**righteyeopened**: Se dispara cuando se abre el ojo derecho de una cara rastreada.

`righteyeopened.detail : { id }`

| Propiedad | Tipo     | Descripción                                      |
| --------- | -------- | ------------------------------------------------ |
| id        | `Number` | Un identificador numérico de la cara localizada. |

**righteyeclosed**: Se dispara cuando se cierra el ojo derecho de una cara rastreada.

`righteyeclosed.detail : { id }`

| Propiedad | Tipo     | Descripción                                      |
| --------- | -------- | ------------------------------------------------ |
| id        | `Number` | Un identificador numérico de la cara localizada. |

**lefteyebrowraised**: Se dispara cuando la ceja izquierda de una cara rastreada se levanta respecto a su posición inicial cuando se encontró la cara.

`lefteyebrowraised.detail : { id }`

| Propiedad | Tipo     | Descripción                                      |
| --------- | -------- | ------------------------------------------------ |
| id        | `Number` | Un identificador numérico de la cara localizada. |

**lefteyebrowlowered**: Se dispara cuando la ceja izquierda de una cara rastreada se baja a su posición inicial cuando se encontró la cara.

`lefteyebrowlowered.detail : { id }`

| Propiedad | Tipo     | Descripción                                      |
| --------- | -------- | ------------------------------------------------ |
| id        | `Number` | Un identificador numérico de la cara localizada. |

**righteyebrowraised**: Se dispara cuando la ceja derecha de una cara rastreada se levanta respecto a su posición cuando se encontró la cara.

`righteyebrowraised.detail : { id }`

| Propiedad | Tipo     | Descripción                                      |
| --------- | -------- | ------------------------------------------------ |
| id        | `Number` | Un identificador numérico de la cara localizada. |

**righteyebrowlowered**: Se dispara cuando la ceja derecha de una cara rastreada se baja a su posición inicial cuando se encontró la cara.

`righteyebrowlowered.detail : { id }`

| Propiedad | Tipo     | Descripción                                      |
| --------- | -------- | ------------------------------------------------ |
| id        | `Number` | Un identificador numérico de la cara localizada. |

**lefteyewinked**: Se dispara cuando el ojo izquierdo de una cara rastreada se cierra y se abre en un plazo de 750 ms, mientras que el ojo derecho permanece abierto.

`lefteyewinked.detail : { id }`

| Propiedad | Tipo     | Descripción                                      |
| --------- | -------- | ------------------------------------------------ |
| id        | `Number` | Un identificador numérico de la cara localizada. |

**righteyewinked**: Se dispara cuando el ojo derecho de una cara rastreada se cierra y se abre en un plazo de 750 ms, mientras que el ojo izquierdo permanece abierto.

`righteyewinked.detail : { id }`

| Propiedad | Tipo     | Descripción                                      |
| --------- | -------- | ------------------------------------------------ |
| id        | `Number` | Un identificador numérico de la cara localizada. |

**blinked**: Se dispara cuando los ojos de una cara rastreada parpadean.

`blinked.detail : { id }`

| Propiedad | Tipo     | Descripción                                      |
| --------- | -------- | ------------------------------------------------ |
| id        | `Number` | Un identificador numérico de la cara localizada. |

**interpupillarydistance**: Se dispara cuando se detecta por primera vez la distancia en milímetros entre los centros de cada pupila de una cara rastreada.

`interpupillarydistance.detail : {id, interpupillaryDistance}`

| Propiedad              | Tipo     | Descripción                                                          |
| ---------------------- | -------- | -------------------------------------------------------------------- |
| id                     | `Number` | Un identificador numérico de la cara localizada.                     |
| interpupillaryDistance | `Number` | Distancia aproximada en milímetros entre los centros de cada pupila. |

Con `enableEars:true`, la detección de orejas se ejecuta simultáneamente con los efectos faciales y envía los siguientes eventos:

**earfound**: Se activa cuando se encuentra una oreja por primera vez.

`earfound.detail : {id, ear}`

| Propiedad | Tipo     | Descripción                                                                |
| --------- | -------- | -------------------------------------------------------------------------- |
| id        | `Number` | Identificador numérico de la cara localizada a la que está unida la oreja. |
| ear       | `String` | Puede ser `left` o `right`.                                                |

**earpointfound**: Se activa cuando se encuentra por primera vez un attachmentPoint de oreja.

`earpointfound.detail : {id, point}`

| Propiedad | Tipo     | Descripción                                                                                          |
| --------- | -------- | ---------------------------------------------------------------------------------------------------- |
| id        | `Number` | Identificador numérico de la cara localizada a la que están unidos los attachmentPoints de la oreja. |
| point     | `String` | Puede ser `leftHelix`, `leftCanal`, `leftLobe`, `rightHelix`, `rightCanal` o `rightLobe`.            |

**earlost**: Se activa cuando una oreja deja de ser rastreada.

`earlost.detail : {id, ear}`

| Propiedad | Tipo     | Descripción                                                                |
| --------- | -------- | -------------------------------------------------------------------------- |
| id        | `Number` | Identificador numérico de la cara localizada a la que está unida la oreja. |
| ear       | `String` | Puede ser `left` o `right`.                                                |

**earpointlost**: Se activa cuando un attachmentPoint de oreja deja de ser rastreado.

`earpointlost.detail : {id, point}`

| Propiedad | Tipo     | Descripción                                                                                          |
| --------- | -------- | ---------------------------------------------------------------------------------------------------- |
| id        | `Number` | Identificador numérico de la cara localizada a la que están unidos los attachmentPoints de la oreja. |
| point     | `String` | Puede ser `leftHelix`, `leftCanal`, `leftLobe`, `rightHelix`, `rightCanal` o `rightLobe`.            |

## Ejemplo - añadir módulo pipeline {#example---adding-pipeline-module}

```javascript
XR8.addCameraPipelineModule(XR8.FaceController.pipelineModule())
```
