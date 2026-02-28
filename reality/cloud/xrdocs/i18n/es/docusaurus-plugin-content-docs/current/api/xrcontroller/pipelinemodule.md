---
sidebar_label: pipelineModule()
---

# XR8.XrController.pipelineModule()

`XR8.XrController.pipelineModule()`

## Descripción {#description}

Crea un módulo de canalización de cámara que, cuando se instala, recibe llamadas de retorno sobre cuándo se ha iniciado la cámara, eventos de proceso de la cámara y otros cambios de estado. Se utilizan para calcular la posición de la cámara.

## Parámetros {#parameters}

Ninguno

## Devuelve {#returns}

El valor devuelto es un objeto puesto a disposición de [`onUpdate`](/api/camerapipelinemodule/onupdate) como:

`processCpuResult.reality: { rotation, position, intrinsics, trackingStatus, trackingReason, worldPoints, realityTexture, lighting }`

| Propiedad      | Tipo                                                                            | Descripción                                                                                                                                                                                       |
| -------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| rotation       | `{w, x, y, z}`                                                                  | La orientación (cuaternión) de la cámara en la escena.                                                                                                                                            |
| position       | `{x, y, z}`                                                                     | La posición de la cámara en la escena.                                                                                                                                                            |
| intrinsics     | `[Número]`                                                                      | Una matriz de proyección de 16 dimensiones de columna mayor 4x4 que da a la cámara de la escena el mismo campo de visión que la alimentación de la cámara renderizada.                            |
| trackingStatus | `Cadena`                                                                        | Uno de `'LIMITADO'` o `'NORMAL'`.                                                                                                                                                                 |
| trackingReason | `Cadena`                                                                        | Una de las siguientes: `'UNSPECIFIED'` o`'INITIALIZING'`.                                                                                                                                         |
| worldPoints    | `[{id, confidence, position: {x, y, z}}]`                                       | Una matriz de puntos detectados en el mundo en su ubicación en la escena. Sólo se rellena si `XrController` está configurado para devolver puntos del mundo y `trackingReason != 'INITIALIZING'`. |
| realityTexture | [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | La textura que contiene los datos de alimentación de la cámara.                                                                                                                                   |
| lighting       | `{exposure, temperature}`                                                       | Exposición de la iluminación de su entorno. Nota: la `temperatura` aún no se ha implementado.                                                                                                     |

## Eventos enviados {#dispatched-events}

**trackingStatus**: Se lanza cuando `XrController` se inicia y cambia el estado o el motivo del seguimiento.

`reality.trackingstatus : { status, reason }`

| Propiedad | Tipo     | Descripción                              |
| --------- | -------- | ---------------------------------------- |
| status    | `Cadena` | Uno de `'LIMITADO'` o `'NORMAL'`.        |
| reason    | `Cadena` | Una de `'INITIALIZING'` o `'UNDEFINED'`. |

**imageloading**: Se lanza cuando comienza la carga de la imagen de detección.

`imageloading.detail : { imageTargets: {name, type, metadata} }`

| Propiedad | Tipo     | Descripción                                    |
| --------- | -------- | ---------------------------------------------- |
| name      | `Cadena` | El nombre de la imagen.                        |
| tipo      | `Cadena` | Una de `'FLAT'`, `'CYLINDRICAL'`, `'CONICAL'`. |
| metadata  | `Objeto` | Metadatos de usuario.                          |

**imagescanning**: Se lanza cuando se han cargado todas las imágenes de detección y ha comenzado el escaneado.

`imagescanning.detail : { imageTargets: {name, type, metadata, geometry} }`

| Propiedad | Tipo     | Descripción                                                                                                                                                                                           |
| --------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name      | `Cadena` | El nombre de la imagen.                                                                                                                                                                               |
| tipo      | `Cadena` | Una de `'FLAT'`, `'CYLINDRICAL'`, `'CONICAL'`.                                                                                                                                                        |
| metadata  | `Objeto` | Metadatos de usuario.                                                                                                                                                                                 |
| geometría | `Objeto` | Objeto que contiene datos de geometría. Si tipo=FLAT: `{scaledWidth, scaledHeight}`, else if type=CYLINDRICAL or type=CONICAL: `{height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians}` |

Si tipo = `FLAT`, geometry:

| Propiedad    | Tipo     | Descripción                                                       |
| ------------ | -------- | ----------------------------------------------------------------- |
| scaledWidth  | `Número` | La anchura de la imagen en la escena, multiplicada por la escala. |
| scaledHeight | `Número` | La altura de la imagen en la escena, multiplicada por la escala.  |

Si tipo= `CYLINDRICAL` o `CONICAL`, geometry:

| Propiedad        | Tipo     | Descripción                                    |
| ---------------- | -------- | ---------------------------------------------- |
| height           | `Número` | Altura del objetivo curvo.                     |
| radiusTop        | `Número` | Radio del objetivo curvo en la parte superior. |
| radiusBottom     | `Número` | Radio del objetivo curvo en la parte inferior. |
| arcStartRadians  | `Número` | Ángulo inicial en radianes.                    |
| arcLengthRadians | `Número` | Ángulo central en radianes.                    |

**imagefound**: Se lanza cuando se encuentra por primera vez un objetivo de imagen.

`imagefound.detail : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

| Propiedad | Tipo           | Descripción                                                          |
| --------- | -------------- | -------------------------------------------------------------------- |
| name      | `Cadena`       | El nombre de la imagen.                                              |
| tipo      | `Número`       | Una de `'FLAT'`, `'CYLINDRICAL'`, `'CONICAL'`.`                     |
| position  | `{x, y, z}`    | La posición 3d de la imagen localizada.                              |
| rotation  | `{w, x, y, z}` | La orientación local 3d de la imagen localizada.                     |
| scale     | `Número`       | Factor de escala que debe aplicarse al objeto adjunto a esta imagen. |

Si tipo = `FLAT`:

| Propiedad    | Tipo     | Descripción                                                       |
| ------------ | -------- | ----------------------------------------------------------------- |
| scaledWidth  | `Número` | La anchura de la imagen en la escena, multiplicada por la escala. |
| scaledHeight | `Número` | La altura de la imagen en la escena, multiplicada por la escala.  |

Si tipo= `CILÍNDRICA` o `CÓNICA`:

| Propiedad        | Tipo     | Descripción                                    |
| ---------------- | -------- | ---------------------------------------------- |
| height           | `Número` | Altura del objetivo curvo.                     |
| radiusTop        | `Número` | Radio del objetivo curvo en la parte superior. |
| radiusBottom     | `Número` | Radio del objetivo curvo en la parte inferior. |
| arcStartRadians  | `Número` | Ángulo inicial en radianes.                    |
| arcLengthRadians | `Número` | Ángulo central en radianes.                    |

**imageupdated**: Se lanza cuando un objetivo de imagen cambia de posición, rotación o escala.

`imageupdated.detail : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

| Propiedad | Tipo           | Descripción                                                          |
| --------- | -------------- | -------------------------------------------------------------------- |
| name      | `Cadena`       | El nombre de la imagen.                                              |
| tipo      | `Número`       | Una de `'FLAT'`, `'CYLINDRICAL'`, `'CONICAL'`.`                     |
| position  | `{x, y, z}`    | La posición 3d de la imagen localizada.                              |
| rotation  | `{w, x, y, z}` | La orientación local 3d de la imagen localizada.                     |
| scale     | `Número`       | Factor de escala que debe aplicarse al objeto adjunto a esta imagen. |

Si tipo = `FLAT`:

| Propiedad    | Tipo     | Descripción                                                       |
| ------------ | -------- | ----------------------------------------------------------------- |
| scaledWidth  | `Número` | La anchura de la imagen en la escena, multiplicada por la escala. |
| scaledHeight | `Número` | La altura de la imagen en la escena, multiplicada por la escala.  |

Si tipo= `CILÍNDRICA` o `CÓNICA`:

| Propiedad        | Tipo     | Descripción                                    |
| ---------------- | -------- | ---------------------------------------------- |
| height           | `Número` | Altura del objetivo curvo.                     |
| radiusTop        | `Número` | Radio del objetivo curvo en la parte superior. |
| radiusBottom     | `Número` | Radio del objetivo curvo en la parte inferior. |
| arcStartRadians  | `Número` | Ángulo inicial en radianes.                    |
| arcLengthRadians | `Número` | Ángulo central en radianes.                    |

**imagelost**: Se lanza cuando un objetivo de imagen deja de ser rastreado.

`imagelost.detail : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

| Propiedad | Tipo           | Descripción                                                          |
| --------- | -------------- | -------------------------------------------------------------------- |
| name      | `Cadena`       | El nombre de la imagen.                                              |
| tipo      | `Número`       | Una de `'FLAT'`, `'CYLINDRICAL'`, `'CONICAL'`.`                     |
| position  | `{x, y, z}`    | La posición 3d de la imagen localizada.                              |
| rotation  | `{w, x, y, z}` | La orientación local 3d de la imagen localizada.                     |
| scale     | `Número`       | Factor de escala que debe aplicarse al objeto adjunto a esta imagen. |

Si tipo = `FLAT`:

| Propiedad    | Tipo     | Descripción                                                       |
| ------------ | -------- | ----------------------------------------------------------------- |
| scaledWidth  | `Número` | La anchura de la imagen en la escena, multiplicada por la escala. |
| scaledHeight | `Número` | La altura de la imagen en la escena, multiplicada por la escala.  |

Si tipo= `CILÍNDRICA` o `CÓNICA`:

| Propiedad        | Tipo     | Descripción                                    |
| ---------------- | -------- | ---------------------------------------------- |
| height           | `Número` | Altura del objetivo curvo.                     |
| radiusTop        | `Número` | Radio del objetivo curvo en la parte superior. |
| radiusBottom     | `Número` | Radio del objetivo curvo en la parte inferior. |
| arcStartRadians  | `Número` | Ángulo inicial en radianes.                    |
| arcLengthRadians | `Número` | Ángulo central en radianes.                    |

**meshfound**: Se lanza cuando se encuentra una malla por primera vez, ya sea después del inicio o después de un recentrado().

`xrmeshfound.detail : { id, position, rotation, geometry }`

| Propiedad | Tipo                  | Descripción                                                                                                             |
| --------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| id        | `Cadena`              | Un id para esta malla que es estable dentro de una sesión                                                               |
| position  | `{x, y, z}`           | La posición 3d de la malla localizada.                                                                                  |
| rotation  | `{w, x, y, z}`        | La orientación local 3d (cuaternión) de la malla localizada.                                                            |
| geometría | `{index, attributes}` | Un objeto que contiene datos de geometría de malla sin procesar. Los atributos contienen atributos de posición y color. |

`geometry` es un objeto con las siguientes propiedades:

| Propiedad  | Tipo                                                                                                            | Descripción                                                              |
| ---------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| index      | `Uint32Array`                                                                                                   | Los vértices de la malla donde 3 vértices contiguos forman un triángulo. |
| attributes | `[{name: 'position', array: Float32Array(), itemSize: 3}, {name: 'color', array: Float32Array(), itemSize: 3}]` | Los datos brutos de la geometría de la malla.                            |

**mallaactualizada**: Se lanza cuando una de las **primeras** mallas que encontramos cambia de posición o de rotación.

`meshupdated.detail : { id, position, rotation }`

| Propiedad | Tipo           | Descripción                                                  |
| --------- | -------------- | ------------------------------------------------------------ |
| id        | `Cadena`       | Un id para esta malla que es estable dentro de una sesión    |
| position  | `{x, y, z}`    | La posición 3d de la malla localizada.                       |
| rotation  | `{w, x, y, z}` | La orientación local 3d (cuaternión) de la malla localizada. |

**meshlost**: Se lanza cuando se llama a recentrar.

`xrmeshlost.detail : { id }`

| Propiedad | Tipo     | Descripción                                               |
| --------- | -------- | --------------------------------------------------------- |
| id        | `Cadena` | Un id para esta malla que es estable dentro de una sesión |

escaneo **de puntos** de proyecto: Se activa cuando todas las ubicaciones de proyecto se han cargado para su escaneo.

`projectwayspotscanning.detail : { wayspots: [] }`

| Propiedad | Tipo       | Descripción                                                        |
| --------- | ---------- | ------------------------------------------------------------------ |
| wayspots  | `[Objeto]` | Una matriz de objetos que contiene información sobre la ubicación. |

`wayspots` es una matriz de objetos con las siguientes propiedades:

| Propiedad | Tipo     | Descripción                                                                 |
| --------- | -------- | --------------------------------------------------------------------------- |
| id        | `Cadena` | Un id para esta Ubicación del Proyecto que es estable dentro de una sesión. |
| name      | `Cadena` | Nombre de la ubicación del proyecto.                                        |
| imageUrl  | `Cadena` | URL de una imagen representativa de este proyecto Ubicación.                |
| título    | `Cadena` | Título de la ubicación del proyecto.                                        |
| lat       | `Número` | Latitud de la ubicación de este proyecto.                                   |
| lng       | `Número` | Longitud de la ubicación de este proyecto.                                  |

**projectwayspotfound**: Se activa cuando se encuentra por primera vez una ubicación de proyecto.

`projectwayspotfound.detail : { name, position, rotation }`

| Propiedad | Tipo           | Descripción                                                                      |
| --------- | -------------- | -------------------------------------------------------------------------------- |
| name      | `Cadena`       | El nombre de la ubicación del proyecto.                                          |
| position  | `{x, y, z}`    | La posición 3d de la Ubicación del Proyecto localizada.                          |
| rotation  | `{w, x, y, z}` | La orientación local 3d (cuaternión) de la Localización del Proyecto localizada. |

**projectwayspotupdated**: Se activa cuando una ubicación de proyecto cambia de posición o rotación.

`projectwayspotupdated.detail : { name, position, rotation }`

| Propiedad | Tipo           | Descripción                                                                      |
| --------- | -------------- | -------------------------------------------------------------------------------- |
| name      | `Cadena`       | El nombre de la ubicación del proyecto.                                          |
| position  | `{x, y, z}`    | La posición 3d de la Ubicación del Proyecto localizada.                          |
| rotation  | `{w, x, y, z}` | La orientación local 3d (cuaternión) de la Localización del Proyecto localizada. |

**projectwayspotlost**: Se dispara cuando una Ubicación de Proyecto ya no está siendo rastreada.

`projectwayspotlost.detail : { name, position, rotation }`

| Propiedad | Tipo           | Descripción                                                                      |
| --------- | -------------- | -------------------------------------------------------------------------------- |
| name      | `Cadena`       | El nombre de la ubicación del proyecto.                                          |
| position  | `{x, y, z}`    | La posición 3d de la Ubicación del Proyecto localizada.                          |
| rotation  | `{w, x, y, z}` | La orientación local 3d (cuaternión) de la Localización del Proyecto localizada. |

## Ejemplo - añadir módulo canalización {#example---adding-pipeline-module}

```javascript
XR8.addCameraPipelineModule(XR8.XrController.pipelineModule())
```

## Ejemplo - Eventos enviados {#example---dispatched-events}

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
