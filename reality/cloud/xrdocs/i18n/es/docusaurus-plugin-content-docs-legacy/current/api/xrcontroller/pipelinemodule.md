---
sidebar_label: pipelineModule()
---

# XR8.XrController.pipelineModule()

`XR8.XrController.pipelineModule()`

## Descripción {#description}

Crea un módulo de canalización de cámara que, cuando se instala, recibe llamadas de retorno sobre cuándo se ha iniciado la cámara, eventos de proceso de cámara y otros cambios de estado. Se utilizan para calcular la posición de la cámara.

## Parámetros {#parameters}

Ninguno

## Devuelve {#returns}

El valor devuelto es un objeto puesto a disposición de [`onUpdate`](/legacy/api/camerapipelinemodule/onupdate) como:

`processCpuResult.reality: { rotation, position, intrinsics, trackingStatus, trackingReason, worldPoints, realityTexture, lighting }`

| Propiedad       | Tipo                                                                            | Descripción                                                                                                                                                                                                                       |
| --------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| rotación        | `{w, x, y, z}`                                                                  | La orientación (cuaternión) de la cámara en la escena.                                                                                                                                         |
| posición        | `{x, y, z}`                                                                     | La posición de la cámara en la escena.                                                                                                                                                                            |
| intrínsecos     | `[Número]`                                                                      | Una matriz de proyección 4x4 de 16 dimensiones de columna mayor que proporciona a la cámara de la escena el mismo campo de visión que la alimentación de la cámara renderizada.                                   |
| trackingStatus  | Cadena                                                                          | Una de "LIMITADO" o "NORMAL".                                                                                                                                                                                     |
| trackingReason  | Cadena                                                                          | Una de `'UNSPECIFIED'` o `'INITIALIZING'`.                                                                                                                                                                        |
| worldPoints     | `[{id, confidence, position: {x, y, z}}]`                                       | Una matriz de puntos detectados en el mundo en su ubicación en la escena. Sólo se rellena si `XrController` está configurado para devolver puntos del mundo y `trackingReason != 'INITIALIZING'`. |
| realidadTextura | [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | La textura que contiene los datos de alimentación de la cámara.                                                                                                                                                   |
| iluminación     | `{exposure, temperature}`                                                       | Exposición de la iluminación de tu entorno. Nota: `temperatura` aún no se ha implementado.                                                                                        |

## Eventos enviados {#dispatched-events}

**TrackingStatus**: Se dispara cuando `XrController` se inicia y el estado de seguimiento o la razón cambia.

`reality.trackingstatus : { status, reason }`

| Propiedad | Tipo   | Descripción                                                 |
| --------- | ------ | ----------------------------------------------------------- |
| estado    | Cadena | Una de "LIMITADO" o "NORMAL".               |
| motivo    | Cadena | Una de `'INICIALIZANDO'` o `'DESDEFINIDO'`. |

**Carga de imágenes**: Se dispara cuando comienza la carga de imágenes de detección.

`imageloading.detail : { imageTargets: {name, type, metadata} }`

| Propiedad | Tipo   | Descripción                                             |
| --------- | ------ | ------------------------------------------------------- |
| nombre    | Cadena | El nombre de la imagen.                 |
| tipo      | Cadena | Una de "PLANA", "CILÍNDRICA", "CÓNICA". |
| metadatos | Objeto | Metadatos del usuario.                  |

**Exploración de imágenes**: Se dispara cuando se han cargado todas las imágenes de detección y se ha iniciado la exploración.

`imagescanning.detail : {imagenObjetivos: {nombre, tipo, metadatos, geometría} }`

| Propiedad | Tipo   | Descripción                                                                                                                                                                                                                                                             |
| --------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nombre    | Cadena | El nombre de la imagen.                                                                                                                                                                                                                                 |
| tipo      | Cadena | Una de "PLANA", "CILÍNDRICA", "CÓNICA".                                                                                                                                                                                                                 |
| metadatos | Objeto | Metadatos del usuario.                                                                                                                                                                                                                                  |
| geometría | Objeto | Objeto que contiene datos de geometría. Si type=FLAT: `{scaledWidth, scaledHeight}`, si no, si type=CYLINDRICAL o type=CONICAL: `{height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians}`. |

Si tipo = `FLAT`, geometría:

| Propiedad    | Tipo     | Descripción                                                                       |
| ------------ | -------- | --------------------------------------------------------------------------------- |
| scaledWidth  | `Número` | La anchura de la imagen en la escena, multiplicada por la escala. |
| scaledHeight | `Número` | La altura de la imagen en la escena, multiplicada por la escala.  |

Si type= `CYLINDRICAL` o `CONICAL`, geometría:

| Propiedad        | Tipo     | Descripción                                                   |
| ---------------- | -------- | ------------------------------------------------------------- |
| altura           | `Número` | Altura del blanco curvo.                      |
| radiusTop        | `Número` | Radio de la diana curva en la parte superior. |
| radiusBottom     | `Número` | Radio de la diana curva en la parte inferior. |
| arcStartRadians  | `Número` | Ángulo inicial en radianes.                   |
| arcLengthRadians | `Número` | Ángulo central en radianes.                   |

**Imagen encontrada**: Se activa cuando se encuentra por primera vez un objetivo de imagen.

`imagefound.detail : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

| Propiedad | Tipo           | Descripción                                                                               |
| --------- | -------------- | ----------------------------------------------------------------------------------------- |
| nombre    | Cadena         | El nombre de la imagen.                                                   |
| tipo      | `Número`       | Una de `'PLANA'`, `'CILÍNDRICA'`, `'CÓNICA'`.                             |
| posición  | `{x, y, z}`    | La posición 3d de la imagen localizada.                                   |
| rotación  | `{w, x, y, z}` | La orientación local 3d de la imagen localizada.                          |
| escala    | `Número`       | Factor de escala que debe aplicarse a los objetos adjuntos a esta imagen. |

Si tipo = `FLAT`:

| Propiedad    | Tipo     | Descripción                                                                       |
| ------------ | -------- | --------------------------------------------------------------------------------- |
| scaledWidth  | `Número` | La anchura de la imagen en la escena, multiplicada por la escala. |
| scaledHeight | `Número` | La altura de la imagen en la escena, multiplicada por la escala.  |

Si type= `CYLINDRICAL` o `CONICAL`:

| Propiedad        | Tipo     | Descripción                                                   |
| ---------------- | -------- | ------------------------------------------------------------- |
| altura           | `Número` | Altura del blanco curvo.                      |
| radiusTop        | `Número` | Radio de la diana curva en la parte superior. |
| radiusBottom     | `Número` | Radio de la diana curva en la parte inferior. |
| arcStartRadians  | `Número` | Ángulo inicial en radianes.                   |
| arcLengthRadians | `Número` | Ángulo central en radianes.                   |

**imagenactualizada**: Se activa cuando una imagen cambia de posición, rotación o escala.

`imageupdated.detail : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

| Propiedad | Tipo           | Descripción                                                                               |
| --------- | -------------- | ----------------------------------------------------------------------------------------- |
| nombre    | Cadena         | El nombre de la imagen.                                                   |
| tipo      | `Número`       | Una de `'PLANA'`, `'CILÍNDRICA'`, `'CÓNICA'`.                             |
| posición  | `{x, y, z}`    | La posición 3d de la imagen localizada.                                   |
| rotación  | `{w, x, y, z}` | La orientación local 3d de la imagen localizada.                          |
| escala    | `Número`       | Factor de escala que debe aplicarse a los objetos adjuntos a esta imagen. |

Si tipo = `FLAT`:

| Propiedad    | Tipo     | Descripción                                                                       |
| ------------ | -------- | --------------------------------------------------------------------------------- |
| scaledWidth  | `Número` | La anchura de la imagen en la escena, multiplicada por la escala. |
| scaledHeight | `Número` | La altura de la imagen en la escena, multiplicada por la escala.  |

Si type= `CYLINDRICAL` o `CONICAL`:

| Propiedad        | Tipo     | Descripción                                                   |
| ---------------- | -------- | ------------------------------------------------------------- |
| altura           | `Número` | Altura del blanco curvo.                      |
| radiusTop        | `Número` | Radio de la diana curva en la parte superior. |
| radiusBottom     | `Número` | Radio de la diana curva en la parte inferior. |
| arcStartRadians  | `Número` | Ángulo inicial en radianes.                   |
| arcLengthRadians | `Número` | Ángulo central en radianes.                   |

**imagen perdida**: Se dispara cuando un objetivo de imagen ya no está siendo rastreado.

`imagelost.detail : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

| Propiedad | Tipo           | Descripción                                                                               |
| --------- | -------------- | ----------------------------------------------------------------------------------------- |
| nombre    | Cadena         | El nombre de la imagen.                                                   |
| tipo      | `Número`       | Una de `'PLANA'`, `'CILÍNDRICA'`, `'CÓNICA'`.                             |
| posición  | `{x, y, z}`    | La posición 3d de la imagen localizada.                                   |
| rotación  | `{w, x, y, z}` | La orientación local 3d de la imagen localizada.                          |
| escala    | `Número`       | Factor de escala que debe aplicarse a los objetos adjuntos a esta imagen. |

Si tipo = `FLAT`:

| Propiedad    | Tipo     | Descripción                                                                       |
| ------------ | -------- | --------------------------------------------------------------------------------- |
| scaledWidth  | `Número` | La anchura de la imagen en la escena, multiplicada por la escala. |
| scaledHeight | `Número` | La altura de la imagen en la escena, multiplicada por la escala.  |

Si type= `CYLINDRICAL` o `CONICAL`:

| Propiedad        | Tipo     | Descripción                                                   |
| ---------------- | -------- | ------------------------------------------------------------- |
| altura           | `Número` | Altura del blanco curvo.                      |
| radiusTop        | `Número` | Radio de la diana curva en la parte superior. |
| radiusBottom     | `Número` | Radio de la diana curva en la parte inferior. |
| arcStartRadians  | `Número` | Ángulo inicial en radianes.                   |
| arcLengthRadians | `Número` | Ángulo central en radianes.                   |

**malla encontrada**: Se dispara cuando se encuentra una malla por primera vez, ya sea después del inicio o después de un recenter().

`xrmeshfound.detail : { id, position, rotation, geometry }`

| Propiedad | Tipo                  | Descripción                                                                                                                                             |
| --------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id        | Cadena                | Un id para esta malla que es estable dentro de una sesión                                                                                               |
| posición  | `{x, y, z}`           | La posición 3d de la malla localizada.                                                                                                  |
| rotación  | `{w, x, y, z}`        | La orientación local 3d (cuaternión) de la malla localizada.                                                         |
| geometría | `{index, attributes}` | Un objeto que contiene datos de geometría de malla sin procesar. Los atributos contienen atributos de posición y color. |

`geometry` es un objeto con las siguientes propiedades:

| Propiedad | Tipo                                                                                                                               | Descripción                                                                              |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| índice    | `Uint32Array`                                                                                                                      | Los vértices de la malla donde 3 vértices contiguos forman un triángulo. |
| atributos | `[{nombre: 'posición', array: Float32Array(), itemSize: 3}, {name: 'color', array: Float32Array(), itemSize: 3}]`. | Los datos brutos de la geometría de la malla.                            |

**mallaactualizada**: Se activa cuando la **primera** malla que encontramos cambia de posición o rotación.

`meshupdated.detail : { id, position, rotation }`

| Propiedad | Tipo           | Descripción                                                                                     |
| --------- | -------------- | ----------------------------------------------------------------------------------------------- |
| id        | Cadena         | Un id para esta malla que es estable dentro de una sesión                                       |
| posición  | `{x, y, z}`    | La posición 3d de la malla localizada.                                          |
| rotación  | `{w, x, y, z}` | La orientación local 3d (cuaternión) de la malla localizada. |

**meshlost**: Se dispara cuando se llama a recenter.

`xrmeshlost.detail : { id }`

| Propiedad | Tipo   | Descripción                                               |
| --------- | ------ | --------------------------------------------------------- |
| id        | Cadena | Un id para esta malla que es estable dentro de una sesión |

**escaneo de ubicaciones de proyecto**: Se activa cuando todas las ubicaciones de proyecto se han cargado para su escaneo.

`projectwayspotscanning.detail : { wayspots: [] }`

| Propiedad | Tipo       | Descripción                                                                        |
| --------- | ---------- | ---------------------------------------------------------------------------------- |
| wayspots  | `[Objeto]` | Una matriz de objetos que contiene información sobre la ubicación. |

`wayspots` es un array de objetos con las siguientes propiedades:

| Propiedad | Tipo     | Descripción                                                                                 |
| --------- | -------- | ------------------------------------------------------------------------------------------- |
| id        | Cadena   | Un id para esta Ubicación del Proyecto que es estable dentro de una sesión. |
| nombre    | Cadena   | Nombre de la ubicación del proyecto.                                        |
| imageUrl  | Cadena   | URL de una imagen representativa de este proyecto Ubicación.                |
| título    | Cadena   | Título de la ubicación del proyecto.                                        |
| lat       | `Número` | Latitud de la ubicación de este proyecto.                                   |
| lng       | `Número` | Longitud de la ubicación de este proyecto.                                  |

**proyectosencontrados**: Se activa cuando se encuentra por primera vez una Ubicación de Proyecto.

`projectwayspotfound.detail : { name, position, rotation }`

| Propiedad | Tipo           | Descripción                                                                                                         |
| --------- | -------------- | ------------------------------------------------------------------------------------------------------------------- |
| nombre    | Cadena         | El nombre de la ubicación del proyecto.                                                             |
| posición  | `{x, y, z}`    | La posición 3d de la Ubicación del Proyecto localizada.                                             |
| rotación  | `{w, x, y, z}` | La orientación local 3d (cuaternión) de la Localización del Proyecto localizada. |

**puntodeproyectoactualizado**: Se dispara cuando una Ubicación de Proyecto cambia de posición o rotación.

`projectwayspotupdated.detail : { name, position, rotation }`

| Propiedad | Tipo           | Descripción                                                                                                         |
| --------- | -------------- | ------------------------------------------------------------------------------------------------------------------- |
| nombre    | Cadena         | El nombre de la ubicación del proyecto.                                                             |
| posición  | `{x, y, z}`    | La posición 3d de la Ubicación del Proyecto localizada.                                             |
| rotación  | `{w, x, y, z}` | La orientación local 3d (cuaternión) de la Localización del Proyecto localizada. |

\*\*Proyecto perdido: Se dispara cuando una Ubicación de Proyecto ya no está siendo rastreada.

`projectwayspotlost.detail : { name, position, rotation }`

| Propiedad | Tipo           | Descripción                                                                                                         |
| --------- | -------------- | ------------------------------------------------------------------------------------------------------------------- |
| nombre    | Cadena         | El nombre de la ubicación del proyecto.                                                             |
| posición  | `{x, y, z}`    | La posición 3d de la Ubicación del Proyecto localizada.                                             |
| rotación  | `{w, x, y, z}` | La orientación local 3d (cuaternión) de la Localización del Proyecto localizada. |

## Ejemplo: añadir el módulo {#example---adding-pipeline-module}

```javascript
XR8.addCameraPipelineModule(XR8.XrController.pipelineModule())
```

## Ejemplo - eventos enviados {#example---dispatched-events}

```javascript
const logEvent = ({name, detail}) => {
  console.log(`Handling event ${name}, got detail, ${JSON.stringify(detail)}`)
}

XR8.addCameraPipelineModule({
  name: 'eventlogger',
  listeners: [
    {event: 'reality.imageloading', process: logEvent},
    {event: 'reality.imagescanning', process: logEvent},
    {event: 'reality.imagefound', process: logEvent},
    {event: 'reality.imageupdated', process: logEvent},
    {event: 'reality.imagelost', process: logEvent},
  ],
})
```
