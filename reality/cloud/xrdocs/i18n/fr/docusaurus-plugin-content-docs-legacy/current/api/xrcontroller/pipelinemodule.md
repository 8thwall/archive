---
sidebar_label: pipelineModule()
---

# XR8.XrController.pipelineModule()

`XR8.XrController.pipelineModule()`

## Description {#description}

Crée un module de pipeline de caméra qui, lorsqu'il est installé, reçoit des rappels sur le démarrage de la caméra, les événements d'essai de la caméra et d'autres changements d'état. Ils sont utilisés pour calculer la position de la caméra.

## Paramètres {#parameters}

Aucun

## Retourne {#returns}

La valeur de retour est un objet mis à la disposition de [`onUpdate`](/legacy/api/camerapipelinemodule/onupdate) comme :

`processCpuResult.reality : { rotation, position, intrinsics, trackingStatus, trackingReason, worldPoints, realityTexture, lighting }`

| Propriété       | Type                                                                            | Description                                                                                                                                                                                                                              |
| --------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| rotation        | `{w, x, y, z}`                                                                  | L'orientation (quaternion) de la caméra dans la scène.                                                                                                                                                |
| position        | `{x, y, z}`                                                                     | Position de la caméra dans la scène.                                                                                                                                                                                     |
| intrinsèques    | `[Nombre]`                                                                      | Matrice de projection 4x4 à 16 dimensions avec colonne majeure qui donne à la caméra de la scène le même champ de vision que celui de la caméra rendue.                                                                  |
| état du suivi   | `Chaîne`                                                                        | L'une des options suivantes : "LIMITÉE" ou "NORMALE".                                                                                                                                                    |
| motif de suivi  | `Chaîne`                                                                        | Un des choix suivants : "UNSPECIFIED" ou "INITIALIZING".                                                                                                                                                 |
| points mondiaux | \`[{id, confidence, position : {x, y, z}}]\`\\`                              | Tableau de points détectés dans le monde à leur emplacement dans la scène. Rempli uniquement si `XrController` est configuré pour renvoyer des points de monde et si `trackingReason != 'INITIALIZING'`. |
| realityTexture  | [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | La texture contenant les données d'alimentation de la caméra.                                                                                                                                                            |
| l'éclairage     | `{exposure, temperature}`                                                       | Exposition de l'éclairage dans votre environnement. Note : `temperature` n'a pas encore été implémenté.                                                                                  |

## Événements envoyés {#dispatched-events}

**trackingStatus** : Se déclenche lorsque `XrController` démarre et que le statut ou la raison du suivi change.

`reality.trackingstatus : { status, reason }`

| Propriété | Type     | Description                                                                           |
| --------- | -------- | ------------------------------------------------------------------------------------- |
| statut    | `Chaîne` | L'une des options suivantes : "LIMITÉE" ou "NORMALE". |
| raison    | `Chaîne` | L'un de `'INITIALIZING'' ou `'UNDEFINED''.                            |

**imageloading** : Se déclenche lorsque le chargement de l'image de détection commence.

`imageloading.detail : { imageTargets : {name, type, metadata} }`

| Propriété   | Type     | Description                                                                                             |
| ----------- | -------- | ------------------------------------------------------------------------------------------------------- |
| nom         | `Chaîne` | Nom de l'image.                                                                         |
| type        | `Chaîne` | L'un des éléments suivants : `'FLAT'', `'CYLINDRICAL'', \\`'CONICAL''. |
| métadonnées | `Objet`  | Métadonnées de l'utilisateur.                                                           |

**imagescanning** : Se déclenche lorsque toutes les images de détection ont été chargées et que la numérisation a commencé.

`imagescanning.detail : { imageTargets : {nom, type, métadonnées, géométrie} }`

| Propriété   | Type     | Description                                                                                                                                                                                                                                                                 |
| ----------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nom         | `Chaîne` | Nom de l'image.                                                                                                                                                                                                                                             |
| type        | `Chaîne` | L'un des éléments suivants : `'FLAT'', `'CYLINDRICAL'', \\`'CONICAL''.                                                                                                                                                                     |
| métadonnées | `Objet`  | Métadonnées de l'utilisateur.                                                                                                                                                                                                                               |
| géométrie   | `Objet`  | Objet contenant des données géométriques. Si type=FLAT : `{scaledWidth, scaledHeight}`, sinon si type=CYLINDRICAL ou type=CONICAL : `{height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians}`. |

Si type = `FLAT`, géométrie :

| Propriété                | Type     | Description                                                                    |
| ------------------------ | -------- | ------------------------------------------------------------------------------ |
| largeur mise à l'échelle | `Nombre` | La largeur de l'image dans la scène, multipliée par l'échelle. |
| hauteur mise à l'échelle | `Nombre` | Hauteur de l'image dans la scène, multipliée par l'échelle.    |

Si type= `CYLINDRICAL` ou `CONICAL`, géométrie :

| Propriété        | Type     | Description                                         |
| ---------------- | -------- | --------------------------------------------------- |
| hauteur          | `Nombre` | Hauteur de la cible incurvée.       |
| radiusTop        | `Nombre` | Rayon de la cible incurvée en haut. |
| radiusBottom     | `Nombre` | Rayon de la cible incurvée en bas.  |
| arcStartRadians  | `Nombre` | Angle de départ en radians.         |
| arcLengthRadians | `Nombre` | Angle central en radians.           |

**imagefound** : Se déclenche lorsqu'une cible d'image est trouvée pour la première fois.

`imagefound.detail : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

| Propriété | Type           | Description                                                                         |
| --------- | -------------- | ----------------------------------------------------------------------------------- |
| nom       | `Chaîne`       | Nom de l'image.                                                     |
| type      | `Nombre`       | Un des éléments suivants : `'FLAT'', `'CYLINDRICAL'', `'CONICAL''.` |
| position  | `{x, y, z}`    | La position 3D de l'image localisée.                                |
| rotation  | `{w, x, y, z}` | L'orientation locale 3D de l'image localisée.                       |
| échelle   | `Nombre`       | Facteur d'échelle à appliquer aux objets attachés à cette image.    |

Si type = `FLAT` :

| Propriété                | Type     | Description                                                                    |
| ------------------------ | -------- | ------------------------------------------------------------------------------ |
| largeur mise à l'échelle | `Nombre` | La largeur de l'image dans la scène, multipliée par l'échelle. |
| hauteur mise à l'échelle | `Nombre` | Hauteur de l'image dans la scène, multipliée par l'échelle.    |

Si type= `CYLINDRICAL` ou `CONICAL` :

| Propriété        | Type     | Description                                         |
| ---------------- | -------- | --------------------------------------------------- |
| hauteur          | `Nombre` | Hauteur de la cible incurvée.       |
| radiusTop        | `Nombre` | Rayon de la cible incurvée en haut. |
| radiusBottom     | `Nombre` | Rayon de la cible incurvée en bas.  |
| arcStartRadians  | `Nombre` | Angle de départ en radians.         |
| arcLengthRadians | `Nombre` | Angle central en radians.           |

**imageupdated** : Se déclenche lorsqu'une image cible change de position, de rotation ou d'échelle.

`imageupdated.detail : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

| Propriété | Type           | Description                                                                         |
| --------- | -------------- | ----------------------------------------------------------------------------------- |
| nom       | `Chaîne`       | Nom de l'image.                                                     |
| type      | `Nombre`       | Un des éléments suivants : `'FLAT'', `'CYLINDRICAL'', `'CONICAL''.` |
| position  | `{x, y, z}`    | La position 3D de l'image localisée.                                |
| rotation  | `{w, x, y, z}` | L'orientation locale 3D de l'image localisée.                       |
| échelle   | `Nombre`       | Facteur d'échelle à appliquer aux objets attachés à cette image.    |

Si type = `FLAT` :

| Propriété                | Type     | Description                                                                    |
| ------------------------ | -------- | ------------------------------------------------------------------------------ |
| largeur mise à l'échelle | `Nombre` | La largeur de l'image dans la scène, multipliée par l'échelle. |
| hauteur mise à l'échelle | `Nombre` | Hauteur de l'image dans la scène, multipliée par l'échelle.    |

Si type= `CYLINDRICAL` ou `CONICAL` :

| Propriété        | Type     | Description                                         |
| ---------------- | -------- | --------------------------------------------------- |
| hauteur          | `Nombre` | Hauteur de la cible incurvée.       |
| radiusTop        | `Nombre` | Rayon de la cible incurvée en haut. |
| radiusBottom     | `Nombre` | Rayon de la cible incurvée en bas.  |
| arcStartRadians  | `Nombre` | Angle de départ en radians.         |
| arcLengthRadians | `Nombre` | Angle central en radians.           |

**imagelost** : Se déclenche lorsqu'une image cible n'est plus suivie.

`imagelost.detail : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

| Propriété | Type           | Description                                                                         |
| --------- | -------------- | ----------------------------------------------------------------------------------- |
| nom       | `Chaîne`       | Nom de l'image.                                                     |
| type      | `Nombre`       | Un des éléments suivants : `'FLAT'', `'CYLINDRICAL'', `'CONICAL''.` |
| position  | `{x, y, z}`    | La position 3D de l'image localisée.                                |
| rotation  | `{w, x, y, z}` | L'orientation locale 3D de l'image localisée.                       |
| échelle   | `Nombre`       | Facteur d'échelle à appliquer aux objets attachés à cette image.    |

Si type = `FLAT` :

| Propriété                | Type     | Description                                                                    |
| ------------------------ | -------- | ------------------------------------------------------------------------------ |
| largeur mise à l'échelle | `Nombre` | La largeur de l'image dans la scène, multipliée par l'échelle. |
| hauteur mise à l'échelle | `Nombre` | Hauteur de l'image dans la scène, multipliée par l'échelle.    |

Si type= `CYLINDRICAL` ou `CONICAL` :

| Propriété        | Type     | Description                                         |
| ---------------- | -------- | --------------------------------------------------- |
| hauteur          | `Nombre` | Hauteur de la cible incurvée.       |
| radiusTop        | `Nombre` | Rayon de la cible incurvée en haut. |
| radiusBottom     | `Nombre` | Rayon de la cible incurvée en bas.  |
| arcStartRadians  | `Nombre` | Angle de départ en radians.         |
| arcLengthRadians | `Nombre` | Angle central en radians.           |

**meshfound** : Se déclenche lorsqu'un maillage est trouvé pour la première fois, soit après le démarrage, soit après un recentrage().

`xrmeshfound.detail : { id, position, rotation, geometry }`

| Propriété | Type                  | Description                                                                                                                                                            |
| --------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id        | `Chaîne`              | Un identifiant pour ce maillage qui est stable au sein d'une session                                                                                                   |
| position  | `{x, y, z}`           | La position 3D de la maille localisée.                                                                                                                 |
| rotation  | `{w, x, y, z}`        | L'orientation locale 3D (quaternion) du maillage localisé.                                                                          |
| géométrie | `{index, attributes}` | Un objet contenant des données brutes sur la géométrie du maillage. Les attributs contiennent des attributs de position et de couleur. |

`geometry` est un objet avec les propriétés suivantes :

| Propriété | Type                                                                                                                 | Description                                                                        |
| --------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| index     | `Uint32Array`                                                                                                        | Les sommets du maillage où 3 sommets contigus forment un triangle. |
| attributs | `[{nom : 'position', array : Float32Array(), itemSize : 3}, {name : 'color', array : Float32Array(), itemSize : 3}]` | Les données géométriques brutes du maillage.                       |

**meshupdated** : Se déclenche lorsque le **premier** maillage trouvé change de position ou de rotation.

`meshupdated.detail : { id, position, rotation }`

| Propriété | Type           | Description                                                                                   |
| --------- | -------------- | --------------------------------------------------------------------------------------------- |
| id        | `Chaîne`       | Un identifiant pour ce maillage qui est stable au sein d'une session                          |
| position  | `{x, y, z}`    | La position 3D de la maille localisée.                                        |
| rotation  | `{w, x, y, z}` | L'orientation locale 3D (quaternion) du maillage localisé. |

**meshlost** : Se déclenche lorsque le recentrage est appelé.

`xrmeshlost.detail : { id }`

| Propriété | Type     | Description                                                          |
| --------- | -------- | -------------------------------------------------------------------- |
| id        | `Chaîne` | Un identifiant pour ce maillage qui est stable au sein d'une session |

**analyse des chemins de projet** : Se déclenche lorsque tous les emplacements de projet ont été chargés pour la numérisation.

`projectwayspotscanning.detail : { wayspots : [] }`

| Propriété        | Type      | Description                                                                       |
| ---------------- | --------- | --------------------------------------------------------------------------------- |
| points de repère | `[Objet]` | Un tableau d'objets contenant des informations sur l'emplacement. |

`wayspots` est un tableau d'objets ayant les propriétés suivantes :

| Propriété | Type     | Description                                                                        |
| --------- | -------- | ---------------------------------------------------------------------------------- |
| id        | `Chaîne` | Un identifiant pour cet emplacement de projet qui est stable au sein d'une session |
| nom       | `Chaîne` | Nom de l'emplacement du projet.                                    |
| imageUrl  | `Chaîne` | URL d'une image représentative de l'emplacement du projet.         |
| titre     | `Chaîne` | Titre de l'emplacement du projet.                                  |
| lat       | `Nombre` | Latitude de l'emplacement du projet.                               |
| lng       | `Nombre` | Longitude de l'emplacement du projet.                              |

**projectwayspotfound** : Se déclenche lorsqu'un emplacement de projet est trouvé pour la première fois.

`projetwayspotfound.detail : { name, position, rotation }`

| Propriété | Type           | Description                                                                                                  |
| --------- | -------------- | ------------------------------------------------------------------------------------------------------------ |
| nom       | `Chaîne`       | Le nom de l'emplacement du projet.                                                           |
| position  | `{x, y, z}`    | La position 3d de l'emplacement du projet localisé.                                          |
| rotation  | `{w, x, y, z}` | L'orientation locale 3D (quaternion) de l'emplacement du projet localisé. |

**projectwayspotupdated** : Se déclenche lorsqu'un emplacement de projet change de position ou de rotation.

`projetwayspotupdated.detail : { name, position, rotation }`

| Propriété | Type           | Description                                                                                                  |
| --------- | -------------- | ------------------------------------------------------------------------------------------------------------ |
| nom       | `Chaîne`       | Le nom de l'emplacement du projet.                                                           |
| position  | `{x, y, z}`    | La position 3d de l'emplacement du projet localisé.                                          |
| rotation  | `{w, x, y, z}` | L'orientation locale 3D (quaternion) de l'emplacement du projet localisé. |

**projectwayspotlost** : Se déclenche lorsqu'un emplacement de projet n'est plus suivi.

`projectwayspotlost.detail : { name, position, rotation }`

| Propriété | Type           | Description                                                                                                  |
| --------- | -------------- | ------------------------------------------------------------------------------------------------------------ |
| nom       | `Chaîne`       | Le nom de l'emplacement du projet.                                                           |
| position  | `{x, y, z}`    | La position 3d de l'emplacement du projet localisé.                                          |
| rotation  | `{w, x, y, z}` | L'orientation locale 3D (quaternion) de l'emplacement du projet localisé. |

## Exemple - ajout d'un module de pipeline {#example---adding-pipeline-module}

```javascript
XR8.addCameraPipelineModule(XR8.XrController.pipelineModule())
```

## Exemple - événements envoyés {#example---dispatched-events}

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
