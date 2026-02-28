# xrimagescanning

## Descripción {#description}

Este evento lo emite [`xrweb`](/api/aframe/#world-tracking-image-targets-andor-lightship-vps) cuando se han cargado todas las imágenes de detección y ha comenzado el escaneado.

`imagescanning.detail : { imageTargets: {name, type, metadata, geometry} }`

| Propiedad | Descripción                                                                                                                                                                                         |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name      | El nombre de la imagen.                                                                                                                                                                             |
| type      | Una de `'FLAT'`, `'CYLINDRICAL'`, `'CONICAL'`.                                                                                                                                                      |
| metadata  | Metadatos de usuario.                                                                                                                                                                               |
| geometry  | Objeto que contiene datos de geometría. Si type=FLAT: `{scaledWidth, scaledHeight}`, lse si type=CYLINDRICAL o type=CONICAL: `{height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians}` |

Si type = `FLAT`, geometry:

| Propiedad    | Descripción                                                       |
| ------------ | ----------------------------------------------------------------- |
| scaledWidth  | La anchura de la imagen en la escena, multiplicada por la escala. |
| scaledHeight | La altura de la imagen en la escena, multiplicada por la escala.  |

Si tipo= `CYLINDRICAL` o `CONICAL`, geometry:

| Propiedad        | Descripción                                    |
| ---------------- | ---------------------------------------------- |
| height           | Altura del objetivo curvo.                     |
| radiusTop        | Radio del objetivo curvo en la parte superior. |
| radiusBottom     | Radio del objetivo curvo en la parte inferior. |
| arcStartRadians  | Ángulo inicial en radianes.                    |
| arcLengthRadians | Ángulo central en radianes.                    |
