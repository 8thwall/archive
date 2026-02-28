# xrimagescanning

## Descripción {#description}

Este evento es emitido por [`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps) cuando todas las imágenes de detección han sido cargadas y el escaneo ha comenzado.

`imagescanning.detail : {imagenObjetivos: {nombre, tipo, metadatos, geometría} }`

| Propiedad | Descripción                                                                                                                                                                                                                                                          |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nombre    | El nombre de la imagen.                                                                                                                                                                                                                              |
| tipo      | Una de "PLANA", "CILÍNDRICA", "CÓNICA".                                                                                                                                                                                                              |
| metadatos | Metadatos del usuario.                                                                                                                                                                                                                               |
| geometría | Objeto que contiene datos de geometría. Si type=FLAT: `{scaledWidth, scaledHeight}`, lse si type=CYLINDRICAL o type=CONICAL: `{height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians}`. |

Si tipo = `FLAT`, geometría:

| Propiedad    | Descripción                                                                       |
| ------------ | --------------------------------------------------------------------------------- |
| scaledWidth  | La anchura de la imagen en la escena, multiplicada por la escala. |
| scaledHeight | La altura de la imagen en la escena, multiplicada por la escala.  |

Si type= `CYLINDRICAL` o `CONICAL`, geometría:

| Propiedad        | Descripción                                                   |
| ---------------- | ------------------------------------------------------------- |
| altura           | Altura del blanco curvo.                      |
| radiusTop        | Radio de la diana curva en la parte superior. |
| radiusBottom     | Radio de la diana curva en la parte inferior. |
| arcStartRadians  | Ángulo inicial en radianes.                   |
| arcLengthRadians | Ángulo central en radianes.                   |
