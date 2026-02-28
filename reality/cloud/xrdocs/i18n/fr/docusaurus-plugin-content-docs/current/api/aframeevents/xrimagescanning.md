# xrimagescanning

## Description {#description}

Cet événement est émis par [`xrweb`](/api/aframe/#world-tracking-image-targets-andor-lightship-vps) lorsque toutes les images de détection ont été chargées et que le scan a commencé.

`imagescanning.detail : { imageTargets: {name, type, metadata, geometry} }`

| Propriété   | Description                                                                                                                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nom         | Nom de l'image.                                                                                                                                                                                         |
| type        | Un des éléments suivants : `'FLAT'`, `'CYLINDRIQUE'`, `'CONIQUE'`.                                                                                                                                      |
| métadonnées | Métadonnées de l'utilisateur.                                                                                                                                                                           |
| géométrie   | Objet contenant des données géométriques. Si type=FLAT : `{scaledWidth, scaledHeight}` lse si type=CYLINDRIQUE ou type=CONIQUE : `{height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians}` |

Si le type = `FLAT`, la géométrie :

| Propriété                | Description                                                    |
| ------------------------ | -------------------------------------------------------------- |
| largeur mise à l'échelle | La largeur de l'image dans la scène, multipliée par l'échelle. |
| hauteur mise à l'échelle | Hauteur de l'image dans la scène, multipliée par l'échelle.    |

Si type= `CYLINDRIQUE` ou `CONIQUE`, géométrie :

| Propriété        | Description                         |
| ---------------- | ----------------------------------- |
| hauteur          | Hauteur de la cible incurvée.       |
| radiusTop        | Rayon de la cible incurvée en haut. |
| radiusBottom     | Rayon de la cible incurvée en bas.  |
| arcStartRadians  | Angle de départ en radians.         |
| arcLengthRadians | Angle central en radians.           |
