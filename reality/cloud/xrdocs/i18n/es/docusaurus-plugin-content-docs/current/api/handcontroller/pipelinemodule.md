---
sidebar_position: 2
sidebar_label: pipelineModule()
---

# XR8.HandController.pipelineModule()

`XR8.HandController.pipelineModule()`

## Descripción {#description}

Crea un módulo de canalización de cámara que, cuando se instala, recibe llamadas de retorno sobre cuándo se ha iniciado la cámara, eventos de proceso de la cámara y otros cambios de estado. Se utilizan para calcular la posición de la cámara.

## Parámetros {#parameters}

Ninguno

## Devuelve {#returns}

El valor devuelto es un objeto puesto a disposición de [`onUpdate`](/api/camerapipelinemodule/onupdate) como:

`processCpuResult.handcontroller: { rotation, position, intrinsics, cameraFeedTexture }`

| Propiedad         | Tipo                                                                            | Descripción                                                                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| rotation          | `{w, x, y, z}`                                                                  | La orientación (cuaternión) de la cámara en la escena.                                                                                                                 |
| position          | `{x, y, z}`                                                                     | La posición de la cámara en la escena.                                                                                                                                 |
| intrinsics        | `[Número]`                                                                      | Una matriz de proyección de 16 dimensiones de columna mayor 4x4 que da a la cámara de la escena el mismo campo de visión que la alimentación de la cámara renderizada. |
| cameraFeedTexture | [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | La textura que contiene los datos de alimentación de la cámara.                                                                                                        |

## Eventos enviados {#dispatched-events}

**carga manual**: se dispara cuando comienza la carga para obtener recursos adicionales de AR manual.

`handloading.detail : {maxDetections, pointsPerDetection, rightIndices, leftIndices}`

| Propiedad          | Tipo          | Descripción                                                                        |
| ------------------ | ------------- | ---------------------------------------------------------------------------------- |
| maxDetections      | `Número`      | El número máximo de manos que se pueden procesar simultáneamente.                  |
| puntosPorDetección | `Número`      | Número de vértices que se extraerán por mano.                                      |
| rightIndices       | `[{a, b, c}]` | Índices de la matriz de vértices que forman los triángulos de la malla de la mano. |
| leftIndices        | `[{a, b, c}]` | Índices de la matriz de vértices que forman los triángulos de la malla de la mano. |

**escaneado manual**: se dispara cuando se han cargado todos los recursos de AR de manos y ha comenzado la exploración.

`handscanning.detail : {maxDetections, pointsPerDetection, rightIndices, leftIndices}`

| Propiedad          | Tipo          | Descripción                                                                        |
| ------------------ | ------------- | ---------------------------------------------------------------------------------- |
| maxDetections      | `Número`      | El número máximo de manos que se pueden procesar simultáneamente.                  |
| puntosPorDetección | `Número`      | Número de vértices que se extraerán por mano.                                      |
| rightIndices       | `[{a, b, c}]` | Índices de la matriz de vértices que forman los triángulos de la malla de la mano. |
| leftIndices        | `[{a, b, c}]` | Índices de la matriz de vértices que forman los triángulos de la malla de la mano. |

**mano encontrada**: se activa cuando se encuentra una mano por primera vez.

`handfound.detail : {id, transform, vertices, normals, attachmentPoints}`

| Propiedad        | Tipo                          | Descripción                                                                                                                                                            |
| ---------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id               | `Número`                      | Un identificador numérico de la mano localizada.                                                                                                                       |
| transform        | `{position, rotation, scale}` | Transforma la información de la mano localizada.                                                                                                                       |
| vértices         | `[{x, y, z}]`                 | Posición de los puntos de la mano, relativa a la transformación.                                                                                                       |
| normales         | `[{x, y, z}]`                 | Dirección normal de los vértices, relativa a la transformación.                                                                                                        |
| handKind         | `Número`                      | Una representación numérica de la lateralidad de la mano localizada. Los valores válidos son 0 (sin especificar), 1 (izquierda) y 2 (derecha).                         |
| attachmentPoints | `{name, position: {x,y,z}}}`  | Consulta [`XR8.HandController.AttachmentPoints`](attachmentpoints.md) para ver la lista de puntos de fijación disponibles. `position` es relativa a la transformación. |

`transform` es un objeto con las siguientes propiedades:

| Propiedad | Tipo           | Descripción                                                           |
| --------- | -------------- | --------------------------------------------------------------------- |
| position  | `{x, y, z}`    | La posición 3d de la mano localizada.                                 |
| rotation  | `{w, x, y, z}` | La orientación local 3d de la mano localizada.                        |
| escala    | `Number`       | Factor de escala que debe aplicarse a los objetos unidos a esta mano. |

`attachmentPoints` es un objeto con las siguientes propiedades:

| Propiedad   | Tipo           | Descripción                                                                                                                                                 |
| ----------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name        | `Cadena`       | El nombre del punto de fijación. Consulte [`XR8.HandController.AttachmentPoints`](attachmentpoints.md) para ver la lista de puntos de fijación disponibles. |
| posición    | `{x, y, z}`    | La posición 3d del punto de enganche en la mano localizada.                                                                                                 |
| rotación    | `{w, x, y, z}` | El cuaternión de rotación que gira el vector Y positivo al vector hueso del punto de fijación.                                                              |
| innerPoint  | `{x, y, z}`    | El punto interior de un punto de enganche. (ej. mano palma lado)                                                                                            |
| outerPoint  | `{x, y, z}`    | El punto exterior de un punto de enganche. (ej. dorso de la mano)                                                                                           |
| radio       | `Number`       | El radio de los puntos de fijación de los dedos.                                                                                                            |
| radio menor | `Número`       | El radio más corto desde la superficie de la mano hasta el punto de fijación de la muñeca.                                                                  |
| radioMayor  | `Número`       | El radio más largo desde la superficie de la mano hasta el punto de fijación de la muñeca.                                                                  |

**manoactualizada**: se activa cuando se encuentra una mano.

`handupdated.detail : {id, transform, vertices, normals, attachmentPoints}`

| Propiedad        | Tipo                          | Descripción                                                                                                                                                            |
| ---------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id               | `Número`                      | Un identificador numérico de la mano localizada.                                                                                                                       |
| transform        | `{position, rotation, scale}` | Transforma la información de la mano localizada.                                                                                                                       |
| vértices         | `[{x, y, z}]`                 | Posición de los puntos de la mano, relativa a la transformación.                                                                                                       |
| normales         | `[{x, y, z}]`                 | Dirección normal de los vértices, relativa a la transformación.                                                                                                        |
| handKind         | `Número`                      | Una representación numérica de la lateralidad de la mano localizada. Los valores válidos son 0 (sin especificar), 1 (izquierda) y 2 (derecha).                         |
| attachmentPoints | `{name, position: {x,y,z}}`  | Consulta [`XR8.HandController.AttachmentPoints`](attachmentpoints.md) para ver la lista de puntos de fijación disponibles. `position` es relativa a la transformación. |

`transform` es un objeto con las siguientes propiedades:

| Propiedad | Tipo           | Descripción                                                           |
| --------- | -------------- | --------------------------------------------------------------------- |
| position  | `{x, y, z}`    | La posición 3d de la mano localizada.                                 |
| rotation  | `{w, x, y, z}` | La orientación local 3d de la mano localizada.                        |
| escala    | `Number`       | Factor de escala que debe aplicarse a los objetos unidos a esta mano. |

**mano perdida**: se dispara cuando se deja de seguir una mano.

`handlost.detail : { id }`

| Propiedad | Tipo     | Descripción                                      |
| --------- | -------- | ------------------------------------------------ |
| id        | `Número` | Un identificador numérico de la mano localizada. |


## Ejemplo - añadir módulo canalización {#example---adding-pipeline-module}

```javascript
XR8.addCameraPipelineModule(XR8.HandController.pipelineModule())
```
