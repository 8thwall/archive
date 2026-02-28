---
sidebar_label: pipelineModule()
---

# XR8.XrController.pipelineModule()

`XR8.XrController.pipelineModule()`

## Description {#description}

Crée un module de pipeline de caméra qui, lorsqu'il est installé, reçoit des rappels sur le démarrage de la caméra, les événements d'essai de la caméra et d'autres changements d'état. Ils sont utilisés pour calculer la position de la caméra.

## Paramètres {#parameters}

Aucun

## Retours {#returns}

La valeur de retour est un objet mis à la disposition de [`onUpdate`](/api/camerapipelinemodule/onupdate) en tant que :

`processCpuResult.reality : { rotation, position, intrinsics, trackingStatus, trackingReason, worldPoints, realityTexture, lighting }`

| Propriété       | Type                                                                            | Description                                                                                                                                                                                              |
| --------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| rotation        | `{w, x, y, z}`                                                                  | L'orientation (quaternion) de la caméra dans la scène.                                                                                                                                                   |
| position        | `{x, y, z}`                                                                     | Position de la caméra dans la scène.                                                                                                                                                                     |
| intrinsèques    | `[Number]`                                                                      | Matrice de projection 4x4 à 16 dimensions avec colonne majeure qui donne à la caméra de la scène le même champ de vision que celui de la caméra rendue.                                                  |
| état du suivi   | `Chaîne`                                                                        | Un des éléments suivants : `'LIMITED'` ou `'NORMAL'`.                                                                                                                                                    |
| motif de suivi  | `Chaîne`                                                                        | Un des éléments suivants : `"UNSPECIFIED"` ou`"INITIALIZING"`.                                                                                                                                           |
| points mondiaux | `[{id, confidence, position: {x, y, z}}]`                                       | Un tableau de points détectés dans le monde à leur emplacement dans la scène. Rempli uniquement si `XrController` est configuré pour renvoyer des points du monde et `trackingReason != 'INITIALIZING'`. |
| realityTexture  | [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | La texture contenant les données d'alimentation de la caméra.                                                                                                                                            |
| éclairage       | `{exposure, temperature}`                                                       | Exposition de l'éclairage dans votre environnement. Remarque : la température `` n'a pas encore été mise en œuvre.                                                                                       |

## Événements distribués {#dispatched-events}

**trackingStatus** : Se déclenche lorsque `XrController` démarre et que l'état ou la raison du suivi change.

`reality.trackingstatus : { status, reason }`

| Propriété | Type     | Description                                                   |
| --------- | -------- | ------------------------------------------------------------- |
| statut    | `Chaîne` | Un des éléments suivants : `'LIMITED'` ou `'NORMAL'`.         |
| raison    | `Chaîne` | Un des éléments suivants : `'INITIALIZING'` ou `'UNDEFINED'`. |

**imageloading** : Se déclenche lorsque le chargement de l'image de détection commence.

`imageloading.detail : { imageTargets: {name, type, metadata} }`

| Propriété   | Type     | Description                                                        |
| ----------- | -------- | ------------------------------------------------------------------ |
| nom         | `Chaîne` | Nom de l'image.                                                    |
| type        | `Chaîne` | Un des éléments suivants : `'FLAT'`, `'CYLINDRIQUE'`, `'CONIQUE'`. |
| métadonnées | `Objet`  | Métadonnées de l'utilisateur.                                      |

**imagescanning** : Se déclenche lorsque toutes les images de détection ont été chargées et que la numérisation a commencé.

`imagescanning.detail : { imageTargets: {name, type, metadata, geometry} }`

| Propriété   | Type     | Description                                                                                                                                                                                               |
| ----------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nom         | `Chaîne` | Nom de l'image.                                                                                                                                                                                           |
| type        | `Chaîne` | Un des éléments suivants : `'FLAT'`, `'CYLINDRIQUE'`, `'CONIQUE'`.                                                                                                                                        |
| métadonnées | `Objet`  | Métadonnées de l'utilisateur.                                                                                                                                                                             |
| géométrie   | `Objet`  | Objet contenant des données géométriques. Si type=FLAT : `{scaledWidth, scaledHeight}` sinon si type=CYLINDRIQUE ou type=CONIQUE : `{height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians}` |

Si le type = `FLAT`, la géométrie :

| Propriété                | Type     | Description                                                    |
| ------------------------ | -------- | -------------------------------------------------------------- |
| largeur mise à l'échelle | `Nombre` | La largeur de l'image dans la scène, multipliée par l'échelle. |
| hauteur mise à l'échelle | `Nombre` | Hauteur de l'image dans la scène, multipliée par l'échelle.    |

Si type= `CYLINDRIQUE` ou `CONIQUE`, géométrie :

| Propriété        | Type     | Description                         |
| ---------------- | -------- | ----------------------------------- |
| hauteur          | `Nombre` | Hauteur de la cible incurvée.       |
| radiusTop        | `Nombre` | Rayon de la cible incurvée en haut. |
| radiusBottom     | `Nombre` | Rayon de la cible incurvée en bas.  |
| arcStartRadians  | `Nombre` | Angle de départ en radians.         |
| arcLengthRadians | `Nombre` | Angle central en radians.           |

**imagefound** : Se déclenche lorsqu'une image cible est trouvée pour la première fois.

`imagefound.detail : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

| Propriété | Type           | Description                                                          |
| --------- | -------------- | -------------------------------------------------------------------- |
| nom       | `Chaîne`       | Nom de l'image.                                                      |
| type      | `Nombre`       | Un des éléments suivants : `'FLAT'`, `'CYLINDRICAL'`, `'CONICAL'`.` |
| position  | `{x, y, z}`    | La position 3D de l'image localisée.                                 |
| rotation  | `{w, x, y, z}` | L'orientation locale 3D de l'image localisée.                        |
| échelle   | `Nombre`       | Facteur d'échelle à appliquer aux objets attachés à cette image.     |

Si le type = `FLAT` :

| Propriété                | Type     | Description                                                    |
| ------------------------ | -------- | -------------------------------------------------------------- |
| largeur mise à l'échelle | `Nombre` | La largeur de l'image dans la scène, multipliée par l'échelle. |
| hauteur mise à l'échelle | `Nombre` | Hauteur de l'image dans la scène, multipliée par l'échelle.    |

Si type= `CYLINDRICAL` ou `CONICAL` :

| Propriété        | Type     | Description                         |
| ---------------- | -------- | ----------------------------------- |
| hauteur          | `Nombre` | Hauteur de la cible incurvée.       |
| radiusTop        | `Nombre` | Rayon de la cible incurvée en haut. |
| radiusBottom     | `Nombre` | Rayon de la cible incurvée en bas.  |
| arcStartRadians  | `Nombre` | Angle de départ en radians.         |
| arcLengthRadians | `Nombre` | Angle central en radians.           |

**imageupdated**: Se déclenche lorsqu'une cible d'image change de position, de rotation ou d'échelle.

`imageupdated.detail : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

| Propriété | Type           | Description                                                          |
| --------- | -------------- | -------------------------------------------------------------------- |
| nom       | `Chaîne`       | Nom de l'image.                                                      |
| type      | `Nombre`       | Un des éléments suivants : `'FLAT'`, `'CYLINDRICAL'`, `'CONICAL'`.` |
| position  | `{x, y, z}`    | La position 3D de l'image localisée.                                 |
| rotation  | `{w, x, y, z}` | L'orientation locale 3D de l'image localisée.                        |
| échelle   | `Nombre`       | Facteur d'échelle à appliquer aux objets attachés à cette image.     |

Si le type = `FLAT` :

| Propriété                | Type     | Description                                                    |
| ------------------------ | -------- | -------------------------------------------------------------- |
| largeur mise à l'échelle | `Nombre` | La largeur de l'image dans la scène, multipliée par l'échelle. |
| hauteur mise à l'échelle | `Nombre` | Hauteur de l'image dans la scène, multipliée par l'échelle.    |

Si type= `CYLINDRICAL` ou `CONICAL` :

| Propriété        | Type     | Description                         |
| ---------------- | -------- | ----------------------------------- |
| hauteur          | `Nombre` | Hauteur de la cible incurvée.       |
| radiusTop        | `Nombre` | Rayon de la cible incurvée en haut. |
| radiusBottom     | `Nombre` | Rayon de la cible incurvée en bas.  |
| arcStartRadians  | `Nombre` | Angle de départ en radians.         |
| arcLengthRadians | `Nombre` | Angle central en radians.           |

**imagelost** : Se déclenche lorsqu'une cible d'image n'est plus suivie.

`imagelost.detail : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

| Propriété | Type           | Description                                                          |
| --------- | -------------- | -------------------------------------------------------------------- |
| nom       | `Chaîne`       | Nom de l'image.                                                      |
| type      | `Nombre`       | Un des éléments suivants : `'FLAT'`, `'CYLINDRICAL'`, `'CONICAL'`.` |
| position  | `{x, y, z}`    | La position 3D de l'image localisée.                                 |
| rotation  | `{w, x, y, z}` | L'orientation locale 3D de l'image localisée.                        |
| échelle   | `Nombre`       | Facteur d'échelle à appliquer aux objets attachés à cette image.     |

Si le type = `FLAT` :

| Propriété                | Type     | Description                                                    |
| ------------------------ | -------- | -------------------------------------------------------------- |
| largeur mise à l'échelle | `Nombre` | La largeur de l'image dans la scène, multipliée par l'échelle. |
| hauteur mise à l'échelle | `Nombre` | Hauteur de l'image dans la scène, multipliée par l'échelle.    |

Si type= `CYLINDRICAL` ou `CONICAL` :

| Propriété        | Type     | Description                         |
| ---------------- | -------- | ----------------------------------- |
| hauteur          | `Nombre` | Hauteur de la cible incurvée.       |
| radiusTop        | `Nombre` | Rayon de la cible incurvée en haut. |
| radiusBottom     | `Nombre` | Rayon de la cible incurvée en bas.  |
| arcStartRadians  | `Nombre` | Angle de départ en radians.         |
| arcLengthRadians | `Nombre` | Angle central en radians.           |

**meshfound** : Se déclenche lorsqu'un maillage est trouvé pour la première fois, soit après le démarrage, soit après un recentrage().

`xrmeshfound.detail : { id, position, rotation, geometry }`

| Propriété | Type                  | Description                                                                                                                            |
| --------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| id        | `Chaîne`              | Un identifiant pour ce maillage qui est stable au sein d'une session                                                                   |
| position  | `{x, y, z}`           | La position 3D de la maille localisée.                                                                                                 |
| rotation  | `{w, x, y, z}`        | L'orientation locale 3D (quaternion) du maillage localisé.                                                                             |
| géométrie | `{index, attributes}` | Un objet contenant des données brutes sur la géométrie du maillage. Les attributs contiennent des attributs de position et de couleur. |

`la géométrie` est un objet ayant les propriétés suivantes :

| Propriété | Type                                                                                                            | Description                                                        |
| --------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| index     | `Tableau Uint32`                                                                                                | Les sommets du maillage où 3 sommets contigus forment un triangle. |
| attributs | `[{name: 'position', array: Float32Array(), itemSize: 3}, {name: 'color', array: Float32Array(), itemSize: 3}]` | Les données géométriques brutes du maillage.                       |

**meshupdated** : Se déclenche lorsqu'un **premier** maillage que nous avons trouvé change de position ou de rotation.

`meshupdated.detail : { id, position, rotation }`

| Propriété | Type           | Description                                                          |
| --------- | -------------- | -------------------------------------------------------------------- |
| id        | `Chaîne`       | Un identifiant pour ce maillage qui est stable au sein d'une session |
| position  | `{x, y, z}`    | La position 3D de la maille localisée.                               |
| rotation  | `{w, x, y, z}` | L'orientation locale 3D (quaternion) du maillage localisé.           |

**meshlost** : Se déclenche lorsque le recentrage est appelé.

`xrmeshlost.detail : { id }`

| Propriété | Type     | Description                                                          |
| --------- | -------- | -------------------------------------------------------------------- |
| id        | `Chaîne` | Un identifiant pour ce maillage qui est stable au sein d'une session |

**projectwayspotscanning**: Se déclenche lorsque tous les emplacements de projet ont été chargés pour la numérisation.

`projectwayspotscanning.detail : { wayspots: [] }`

| Propriété | Type       | Description                                                       |
| --------- | ---------- | ----------------------------------------------------------------- |
| wayspots  | `[Object]` | Un tableau d'objets contenant des informations sur l'emplacement. |

`wayspots` est un tableau d'objets ayant les propriétés suivantes :

| Propriété | Type     | Description                                                                        |
| --------- | -------- | ---------------------------------------------------------------------------------- |
| id        | `Chaîne` | Un identifiant pour cet emplacement de projet qui est stable au sein d'une session |
| nom       | `Chaîne` | Nom de l'emplacement du projet.                                                    |
| imageUrl  | `Chaîne` | URL d'une image représentative de l'emplacement du projet.                         |
| titre     | `Chaîne` | Titre de l'emplacement du projet.                                                  |
| lat       | `Nombre` | Latitude de l'emplacement du projet.                                               |
| lng       | `Nombre` | Longitude de l'emplacement du projet.                                              |

**projectwayspotfound**: Se déclenche lorsqu'un emplacement de projet est trouvé pour la première fois.

`projectwayspotfound.detail : { name, position, rotation }`

| Propriété | Type           | Description                                                               |
| --------- | -------------- | ------------------------------------------------------------------------- |
| nom       | `Chaîne`       | Le nom de l'emplacement du projet.                                        |
| position  | `{x, y, z}`    | La position 3d de l'emplacement du projet localisé.                       |
| rotation  | `{w, x, y, z}` | L'orientation locale 3D (quaternion) de l'emplacement du projet localisé. |

**projectwayspotupdated**: Se déclenche lorsqu'un emplacement de projet change de position ou de rotation.

`projectwayspotupdated.detail : { name, position, rotation }`

| Propriété | Type           | Description                                                               |
| --------- | -------------- | ------------------------------------------------------------------------- |
| nom       | `Chaîne`       | Le nom de l'emplacement du projet.                                        |
| position  | `{x, y, z}`    | La position 3d de l'emplacement du projet localisé.                       |
| rotation  | `{w, x, y, z}` | L'orientation locale 3D (quaternion) de l'emplacement du projet localisé. |

**projectwayspotlost**: Se déclenche lorsqu'un emplacement de projet n'est plus suivi.

`projectwayspotlost.detail : { name, position, rotation }`

| Propriété | Type           | Description                                                               |
| --------- | -------------- | ------------------------------------------------------------------------- |
| nom       | `Chaîne`       | Le nom de l'emplacement du projet.                                        |
| position  | `{x, y, z}`    | La position 3d de l'emplacement du projet localisé.                       |
| rotation  | `{w, x, y, z}` | L'orientation locale 3D (quaternion) de l'emplacement du projet localisé. |

## Exemple - ajout d'un module de pipeline {#example---adding-pipeline-module}

```javascript
XR8.addCameraPipelineModule(XR8.XrController.pipelineModule())
```

## Exemple - événements distribués {#example---dispatched-events}

```javascript
const logEvent = ({name, detail}) => {
  console.log(`Gestion de l'événement ${name}, got detail, ${JSON.stringify(detail)}`)
}

XR8.addCameraPipelineModule({
  name : 'eventlogger',
  listeners : [
    {event: 'reality.imageloading', process: logEvent},
    {event: 'reality.imagescanning', process: logEvent},
    {event: 'reality.imagefound', process: logEvent},
    {event: 'reality.imageupdated', process: logEvent},
    {event: 'reality.imagelost', process: logEvent},
  ],
})
```
