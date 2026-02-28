---
sidebar_position: 2
sidebar_label: pipelineModule()
---

# XR8.HandController.pipelineModule()

`XR8.HandController.pipelineModule()`

## Descripción {#description}

Crea un módulo de canalización de cámara que, cuando se instala, recibe llamadas de retorno sobre cuándo se ha iniciado la cámara, eventos de proceso de cámara y otros cambios de estado. Se utilizan para calcular la posición de la cámara.

## Parámetros {#parameters}

Ninguno

## Devuelve {#returns}

El valor devuelto es un objeto puesto a disposición de [`onUpdate`](/legacy/api/camerapipelinemodule/onupdate) como:

`processCpuResult.handcontroller: { rotation, position, intrinsics, cameraFeedTexture }`

| Propiedad         | Tipo                                                                            | Descripción                                                                                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| rotación          | `{w, x, y, z}`                                                                  | La orientación (cuaternión) de la cámara en la escena.                                                                                                       |
| posición          | `{x, y, z}`                                                                     | La posición de la cámara en la escena.                                                                                                                                          |
| intrínsecos       | `[Número]`                                                                      | Una matriz de proyección 4x4 de 16 dimensiones de columna mayor que proporciona a la cámara de la escena el mismo campo de visión que la alimentación de la cámara renderizada. |
| cameraFeedTexture | [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | La textura que contiene los datos de alimentación de la cámara.                                                                                                                 |

## Eventos enviados {#dispatched-events}

**Carga manual**: Se dispara cuando comienza la carga para obtener recursos adicionales de AR manual.

\`handloading.detail : {maxDetections, pointsPerDetection, rightIndices, leftIndices}\`\`

| Propiedad          | Tipo          | Descripción                                                                                        |
| ------------------ | ------------- | -------------------------------------------------------------------------------------------------- |
| maxDetecciones     | `Número`      | El número máximo de manos que se pueden procesar simultáneamente.                  |
| puntosPorDetección | `Número`      | Número de vértices que se extraerán por mano.                                      |
| rightIndices       | `[{a, b, c}]` | Índices en la matriz de vértices que forman los triángulos de la malla de la mano. |
| leftIndices        | `[{a, b, c}]` | Índices en la matriz de vértices que forman los triángulos de la malla de la mano. |

**Escaneado manual**: Se dispara cuando se han cargado todos los recursos AR manuales y ha comenzado la exploración.

\`handscanning.detail : {maxDetections, pointsPerDetection, rightIndices, leftIndices}\`\`

| Propiedad          | Tipo          | Descripción                                                                                        |
| ------------------ | ------------- | -------------------------------------------------------------------------------------------------- |
| maxDetecciones     | `Número`      | El número máximo de manos que se pueden procesar simultáneamente.                  |
| puntosPorDetección | `Número`      | Número de vértices que se extraerán por mano.                                      |
| rightIndices       | `[{a, b, c}]` | Índices en la matriz de vértices que forman los triángulos de la malla de la mano. |
| leftIndices        | `[{a, b, c}]` | Índices en la matriz de vértices que forman los triángulos de la malla de la mano. |

**Mano encontrada**: Se activa cuando se encuentra una mano por primera vez.

\`handfound.detail : {id, transform, vertices, normales, attachmentPoints}\`\`

| Propiedad        | Tipo                          | Descripción                                                                                                                                                                                                                         |
| ---------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id               | `Número`                      | Id numérico de la mano localizada.                                                                                                                                                                                  |
| transformar      | `{position, rotation, scale}` | Transformar información de la mano localizada.                                                                                                                                                                      |
| vértices         | `[{x, y, z}]`                 | Posición de los puntos de la mano, relativa a la transformación.                                                                                                                                                    |
| normales         | `[{x, y, z}]`                 | Dirección normal de los vértices, relativa a la transformación.                                                                                                                                                     |
| handKind         | `Número`                      | Representación numérica de la lateralidad de la mano localizada. Los valores válidos son 0 (sin especificar), 1 (izquierda) y 2 (derecha). |
| attachmentPoints | `{nombre, posición: {x,y,z}}` | Véase [`XR8.HandController.AttachmentPoints`](attachmentpoints.md) para consultar la lista de puntos de fijación disponibles. La `posición` es relativa a la transformación.                        |

`transform` es un objeto con las siguientes propiedades:

| Propiedad | Tipo           | Descripción                                                                           |
| --------- | -------------- | ------------------------------------------------------------------------------------- |
| posición  | `{x, y, z}`    | La posición 3d de la mano localizada.                                 |
| rotación  | `{w, x, y, z}` | La orientación local 3d de la mano localizada.                        |
| escala    | `Número`       | Factor de escala que debe aplicarse a los objetos unidos a esta mano. |

`attachmentPoints` es un objeto con las siguientes propiedades:

| Propiedad   | Tipo           | Descripción                                                                                                                                                                                 |
| ----------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nombre      | Cadena         | Nombre del punto de fijación. Véase [`XR8.HandController.AttachmentPoints`](attachmentpoints.md) para consultar la lista de puntos de fijación disponibles. |
| posición    | `{x, y, z}`    | La posición 3d del punto de enganche en la mano localizada.                                                                                                                 |
| rotación    | `{w, x, y, z}` | El cuaternión de rotación que rota el vector Y positivo al vector óseo del punto de fijación.                                                                               |
| innerPoint  | `{x, y, z}`    | Punto interior de un punto de enganche. (ej. mano palma lado)                                                                            |
| outerPoint  | `{x, y, z}`    | Punto exterior de un punto de enganche. (ej. dorso de la mano)                                                                           |
| radio       | `Número`       | El radio de los puntos de fijación de los dedos.                                                                                                                            |
| minorRadius | `Número`       | El radio más corto desde la superficie de la mano hasta el punto de fijación de la muñeca.                                                                                  |
| majorRadius | `Número`       | El radio más largo desde la superficie de la mano hasta el punto de fijación de la muñeca.                                                                                  |

**manoactualizada**: Se activa cuando se encuentra una mano.

\`handupdated.detail : {id, transform, vertices, normales, attachmentPoints}\`\`

| Propiedad        | Tipo                          | Descripción                                                                                                                                                                                                                         |
| ---------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id               | `Número`                      | Id numérico de la mano localizada.                                                                                                                                                                                  |
| transformar      | `{position, rotation, scale}` | Transformar información de la mano localizada.                                                                                                                                                                      |
| vértices         | `[{x, y, z}]`                 | Posición de los puntos de la mano, relativa a la transformación.                                                                                                                                                    |
| normales         | `[{x, y, z}]`                 | Dirección normal de los vértices, relativa a la transformación.                                                                                                                                                     |
| handKind         | `Número`                      | Representación numérica de la lateralidad de la mano localizada. Los valores válidos son 0 (sin especificar), 1 (izquierda) y 2 (derecha). |
| attachmentPoints | `{nombre, posición: {x,y,z}}` | Véase [`XR8.HandController.AttachmentPoints`](attachmentpoints.md) para consultar la lista de puntos de fijación disponibles. La `posición` es relativa a la transformación.                        |

`transform` es un objeto con las siguientes propiedades:

| Propiedad | Tipo           | Descripción                                                                           |
| --------- | -------------- | ------------------------------------------------------------------------------------- |
| posición  | `{x, y, z}`    | La posición 3d de la mano localizada.                                 |
| rotación  | `{w, x, y, z}` | La orientación local 3d de la mano localizada.                        |
| escala    | `Número`       | Factor de escala que debe aplicarse a los objetos unidos a esta mano. |

\*\*Mano perdida: Se dispara cuando una mano deja de ser rastreada.

`handlost.detail : { id }`

| Propiedad | Tipo     | Descripción                                        |
| --------- | -------- | -------------------------------------------------- |
| id        | `Número` | Id numérico de la mano localizada. |

## Ejemplo: añadir el módulo {#example---adding-pipeline-module}

```javascript
XR8.addCameraPipelineModule(XR8.HandController.pipelineModule())
```
