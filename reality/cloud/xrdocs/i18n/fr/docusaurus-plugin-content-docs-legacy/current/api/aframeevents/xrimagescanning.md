# xrimagescanning

## Description {#description}

Cet événement est émis par [`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps) lorsque toutes les images de détection ont été chargées et que l'analyse a commencé.

`imagescanning.detail : { imageTargets : {nom, type, métadonnées, géométrie} }`

| Propriété   | Description                                                                                                                                                                                                                                                               |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nom         | Nom de l'image.                                                                                                                                                                                                                                           |
| type        | L'un des éléments suivants : `'FLAT'', `'CYLINDRICAL'', \\`'CONICAL''.                                                                                                                                                                   |
| métadonnées | Métadonnées de l'utilisateur.                                                                                                                                                                                                                             |
| géométrie   | Objet contenant des données géométriques. Si type=FLAT : `{scaledWidth, scaledHeight}`, lse if type=CYLINDRICAL or type=CONICAL : `{height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians}`. |

Si type = `FLAT`, géométrie :

| Propriété                | Description                                                                    |
| ------------------------ | ------------------------------------------------------------------------------ |
| largeur mise à l'échelle | La largeur de l'image dans la scène, multipliée par l'échelle. |
| hauteur mise à l'échelle | Hauteur de l'image dans la scène, multipliée par l'échelle.    |

Si type= `CYLINDRICAL` ou `CONICAL`, géométrie :

| Propriété        | Description                                         |
| ---------------- | --------------------------------------------------- |
| hauteur          | Hauteur de la cible incurvée.       |
| radiusTop        | Rayon de la cible incurvée en haut. |
| radiusBottom     | Rayon de la cible incurvée en bas.  |
| arcStartRadians  | Angle de départ en radians.         |
| arcLengthRadians | Angle central en radians.           |
