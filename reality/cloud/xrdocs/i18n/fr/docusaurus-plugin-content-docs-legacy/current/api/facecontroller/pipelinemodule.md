---
sidebar_position: 2
sidebar_label: pipelineModule()
---

# XR8.FaceController.pipelineModule()

`XR8.FaceController.pipelineModule()`

## Description {#description}

Crée un module de pipeline de caméra qui, lorsqu'il est installé, reçoit des rappels sur le démarrage de la caméra, les événements d'essai de la caméra et d'autres changements d'état. Ils sont utilisés pour calculer la position de la caméra.

## Paramètres {#parameters}

Aucun

## Retourne {#returns}

La valeur de retour est un objet mis à la disposition de [`onUpdate`](/legacy/api/camerapipelinemodule/onupdate) comme :

`processCpuResult.facecontroller : { rotation, position, intrinsics, cameraFeedTexture }`

| Propriété         | Type                                                                            | Description                                                                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| rotation          | `{w, x, y, z}`                                                                  | L'orientation (quaternion) de la caméra dans la scène.                                                                               |
| position          | `{x, y, z}`                                                                     | Position de la caméra dans la scène.                                                                                                                    |
| intrinsèques      | `[Nombre]`                                                                      | Matrice de projection 4x4 à 16 dimensions avec colonne majeure qui donne à la caméra de la scène le même champ de vision que celui de la caméra rendue. |
| cameraFeedTexture | [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | La texture contenant les données d'alimentation de la caméra.                                                                                           |

## Événements envoyés {#dispatched-events}

**faceloading** : Se déclenche lorsque le chargement commence pour les ressources supplémentaires de face AR.

`faceloading.detail : {maxDetections, pointsPerDetection, indices, uvs}`

| Propriété          | Type          | Description                                                                                                                                                                                              |
| ------------------ | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| maxDetections      | `Nombre`      | Nombre maximal de visages pouvant être traités simultanément.                                                                                                                            |
| pointsParDetection | `Nombre`      | Nombre de sommets qui seront extraits par face.                                                                                                                                          |
| indices            | `[{a, b, c}]` | La liste des index dans le tableau des vertices qui forment les triangles du maillage demandé, comme spécifié avec `meshGeometry` dans [`XR8.FaceController.configure()`](configure.md). |
| uvs                | `[{u, v}]`    | La liste des positions uv dans une carte de texture correspondant aux points de vertex renvoyés.                                                                                         |

**facescanning** : Se déclenche lorsque toutes les ressources AR des visages ont été chargées et que le balayage a commencé.

`facescanning.detail : {maxDetections, pointsPerDetection, indices, uvs}`

| Propriété          | Type          | Description                                                                                                                                                                                              |
| ------------------ | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| maxDetections      | `Nombre`      | Nombre maximal de visages pouvant être traités simultanément.                                                                                                                            |
| pointsParDetection | `Nombre`      | Nombre de sommets qui seront extraits par face.                                                                                                                                          |
| indices            | `[{a, b, c}]` | La liste des index dans le tableau des vertices qui forment les triangles du maillage demandé, comme spécifié avec `meshGeometry` dans [`XR8.FaceController.configure()`](configure.md). |
| uvs                | `[{u, v}]`    | La liste des positions uv dans une carte de texture correspondant aux points de vertex renvoyés.                                                                                         |

**facefound** : Se déclenche lorsqu'un visage est trouvé pour la première fois.

`facefound.detail : {id, transform, vertices, normals, attachmentPoints}`

| Propriété            | Type                                                                                                             | Description                                                                                                                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                   | `Nombre`                                                                                                         | Un identifiant numérique de la face localisée.                                                                                                                                 |
| transformer          | `{position, rotation, échelle, largeur mise à l'échelle, hauteur mise à l'échelle, profondeur mise à l'échelle}` | Informations sur la transformation de la face localisée.                                                                                                                       |
| sommets              | `[{x, y, z}]`                                                                                                    | Position des points du visage par rapport à la transformation.                                                                                                                 |
| normales             | `[{x, y, z}]`                                                                                                    | Direction normale des sommets, par rapport à la transformation.                                                                                                                |
| points d'attachement | `{nom, position : {x,y,z}}`                                                                                      | Voir [`XR8.FaceController.AttachmentPoints`](attachmentpoints.md) pour la liste des points d'attache disponibles. `position` est relative à la transformation. |
| uvsInCameraFrame     | `[{u, v}]`                                                                                                       | La liste des positions uv dans l'image de la caméra correspondant aux points de vertex renvoyés.                                                                               |

`transform` est un objet avec les propriétés suivantes :

| Propriété                   | Type           | Description                                                                                  |
| --------------------------- | -------------- | -------------------------------------------------------------------------------------------- |
| position                    | `{x, y, z}`    | La position 3D de la face située.                                            |
| rotation                    | `{w, x, y, z}` | L'orientation locale en 3D de la face localisée.                             |
| échelle                     | `Nombre`       | Facteur d'échelle à appliquer aux objets attachés à cette face.              |
| largeur mise à l'échelle    | `Nombre`       | Largeur approximative de la tête dans la scène, multipliée par l'échelle.    |
| hauteur mise à l'échelle    | `Nombre`       | Hauteur approximative de la tête dans la scène, multipliée par l'échelle.    |
| profondeur mise à l'échelle | `Nombre`       | Profondeur approximative de la tête dans la scène, multipliée par l'échelle. |

**faceupdated** : Se déclenche lorsqu'un visage est trouvé ultérieurement.

`faceupdated.detail : {id, transform, vertices, normals, attachmentPoints}`

| Propriété            | Type                                                                                                             | Description                                                                                                                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                   | `Nombre`                                                                                                         | Un identifiant numérique de la face localisée.                                                                                                                                 |
| transformer          | `{position, rotation, échelle, largeur mise à l'échelle, hauteur mise à l'échelle, profondeur mise à l'échelle}` | Informations sur la transformation de la face localisée.                                                                                                                       |
| sommets              | `[{x, y, z}]`                                                                                                    | Position des points du visage par rapport à la transformation.                                                                                                                 |
| normales             | `[{x, y, z}]`                                                                                                    | Direction normale des sommets, par rapport à la transformation.                                                                                                                |
| points d'attachement | `{nom, position : {x,y,z}}`                                                                                      | Voir [`XR8.FaceController.AttachmentPoints`](attachmentpoints.md) pour la liste des points d'attache disponibles. `position` est relative à la transformation. |
| uvsInCameraFrame     | `[{u, v}]`                                                                                                       | La liste des positions uv dans l'image de la caméra correspondant aux points de vertex renvoyés.                                                                               |

`transform` est un objet avec les propriétés suivantes :

| Propriété                   | Type           | Description                                                                                  |
| --------------------------- | -------------- | -------------------------------------------------------------------------------------------- |
| position                    | `{x, y, z}`    | La position 3D de la face située.                                            |
| rotation                    | `{w, x, y, z}` | L'orientation locale en 3D de la face localisée.                             |
| échelle                     | `Nombre`       | Facteur d'échelle à appliquer aux objets attachés à cette face.              |
| largeur mise à l'échelle    | `Nombre`       | Largeur approximative de la tête dans la scène, multipliée par l'échelle.    |
| hauteur mise à l'échelle    | `Nombre`       | Hauteur approximative de la tête dans la scène, multipliée par l'échelle.    |
| profondeur mise à l'échelle | `Nombre`       | Profondeur approximative de la tête dans la scène, multipliée par l'échelle. |

**facelost** : Se déclenche lorsqu'un visage n'est plus suivi.

`facelost.detail : { id }`

| Propriété | Type     | Description                                                    |
| --------- | -------- | -------------------------------------------------------------- |
| id        | `Nombre` | Un identifiant numérique de la face localisée. |

**mouthopened** : Se déclenche lorsque la bouche d'un visage suivi s'ouvre.

`mouthopened.detail : { id }`

| Propriété | Type     | Description                                                    |
| --------- | -------- | -------------------------------------------------------------- |
| id        | `Nombre` | Un identifiant numérique de la face localisée. |

**bouche fermée** : Se déclenche lorsque la bouche d'un visage suivi se ferme.

`mouthclosed.detail : { id }`

| Propriété | Type     | Description                                                    |
| --------- | -------- | -------------------------------------------------------------- |
| id        | `Nombre` | Un identifiant numérique de la face localisée. |

**lefteyeopened** : Se déclenche lorsque l'œil gauche d'un visage suivi s'ouvre.

`lefteyeopened.detail : { id }`

| Propriété | Type     | Description                                                    |
| --------- | -------- | -------------------------------------------------------------- |
| id        | `Nombre` | Un identifiant numérique de la face localisée. |

**lefteyeclosed** : Se déclenche lorsque l'œil gauche d'un visage suivi se ferme.

`lefteyeclosed.detail : { id }`

| Propriété | Type     | Description                                                    |
| --------- | -------- | -------------------------------------------------------------- |
| id        | `Nombre` | Un identifiant numérique de la face localisée. |

**righteyeopened** : Se déclenche lorsque l'œil droit d'un visage suivi s'ouvre.

`righteyeopened.detail : { id }`

| Propriété | Type     | Description                                                    |
| --------- | -------- | -------------------------------------------------------------- |
| id        | `Nombre` | Un identifiant numérique de la face localisée. |

**righteyeclosed** : Se déclenche lorsque l'œil droit d'un visage suivi se ferme.

`righteyeclosed.detail : { id }`

| Propriété | Type     | Description                                                    |
| --------- | -------- | -------------------------------------------------------------- |
| id        | `Nombre` | Un identifiant numérique de la face localisée. |

**lefteyebrowraised** : Se déclenche lorsque le sourcil gauche d'un visage suivi est relevé par rapport à sa position initiale lorsque le visage a été trouvé.

`lefteyebrowraised.detail : { id }`

| Propriété | Type     | Description                                                    |
| --------- | -------- | -------------------------------------------------------------- |
| id        | `Nombre` | Un identifiant numérique de la face localisée. |

**lefteyebrowlowered** : Se déclenche lorsque le sourcil gauche d'un visage suivi est abaissé à sa position initiale lorsque le visage a été trouvé.

`lefteyebrowlowered.detail : { id }`

| Propriété | Type     | Description                                                    |
| --------- | -------- | -------------------------------------------------------------- |
| id        | `Nombre` | Un identifiant numérique de la face localisée. |

**righteyebrowraised** : Se déclenche lorsque le sourcil droit d'un visage suivi est relevé par rapport à sa position lors de la recherche du visage.

`righteyebrowraised.detail : { id }`

| Propriété | Type     | Description                                                    |
| --------- | -------- | -------------------------------------------------------------- |
| id        | `Nombre` | Un identifiant numérique de la face localisée. |

**righteyebrowlowered** : Se déclenche lorsque le sourcil droit d'un visage suivi est abaissé à sa position initiale lorsque le visage a été trouvé.

`righyebrowlowered.detail : { id }`

| Propriété | Type     | Description                                                    |
| --------- | -------- | -------------------------------------------------------------- |
| id        | `Nombre` | Un identifiant numérique de la face localisée. |

**lefteyewinked** : Se déclenche lorsque l'œil gauche d'un visage suivi se ferme et s'ouvre dans un délai de 750 ms alors que l'œil droit reste ouvert.

`lefteyewinked.detail : { id }`

| Propriété | Type     | Description                                                    |
| --------- | -------- | -------------------------------------------------------------- |
| id        | `Nombre` | Un identifiant numérique de la face localisée. |

**righteyewinked** : Se déclenche lorsque l'œil droit d'un visage suivi se ferme et s'ouvre dans un délai de 750 ms alors que l'œil gauche reste ouvert.

`righteyewinked.detail : { id }`

| Propriété | Type     | Description                                                    |
| --------- | -------- | -------------------------------------------------------------- |
| id        | `Nombre` | Un identifiant numérique de la face localisée. |

**cligné** : Se déclenche lorsque les yeux d'un visage suivi clignotent.

`blinked.detail : { id }`

| Propriété | Type     | Description                                                    |
| --------- | -------- | -------------------------------------------------------------- |
| id        | `Nombre` | Un identifiant numérique de la face localisée. |

**interpupillarydistance** : Se déclenche lorsque la distance en millimètres entre les centres de chaque pupille d'un visage suivi est détectée pour la première fois.

`interpupillarydistance.detail : {id, interpupillaryDistance}`

| Propriété                | Type     | Description                                                                                |
| ------------------------ | -------- | ------------------------------------------------------------------------------------------ |
| id                       | `Nombre` | Un identifiant numérique de la face localisée.                             |
| distance interpupillaire | `Nombre` | Distance approximative en millimètres entre les centres de chaque pupille. |

Lorsque `enableEars:true` la détection des oreilles s'exécute en même temps que les effets de visage et déclenche les événements suivants :

**earfound** : Se déclenche lorsqu'une oreille est trouvée pour la première fois.

`earfound.detail : {id, ear}`

| Propriété | Type     | Description                                                                                      |
| --------- | -------- | ------------------------------------------------------------------------------------------------ |
| id        | `Nombre` | Un identifiant numérique de la face localisée à laquelle l'oreille est attachée. |
| oreille   | `Chaîne` | Peut être soit `gauche`, soit `droite`.                                          |

**earpointfound** : Se déclenche lorsqu'un point d'attachement d'oreille est trouvé pour la première fois.

`earpointfound.detail : {id, point}`

| Propriété | Type     | Description                                                                                                                  |
| --------- | -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| id        | `Nombre` | Un numéro d'identification de la face localisée à laquelle les points d'attache de l'oreille sont attachés.  |
| point     | `Chaîne` | Peut être soit `hélix gauche`, `canal gauche`, `lobe gauche`, `hélix droit`, `canal droit`, ou `lobe droit`. |

**earlost** : Se déclenche lorsqu'une oreille n'est plus suivie.

`earlost.detail : {id, ear}`

| Propriété | Type     | Description                                                                                      |
| --------- | -------- | ------------------------------------------------------------------------------------------------ |
| id        | `Nombre` | Un identifiant numérique de la face localisée à laquelle l'oreille est attachée. |
| oreille   | `Chaîne` | Peut être soit `gauche`, soit `droite`.                                          |

**earpointlost** : Se déclenche lorsqu'un point d'attache d'oreille n'est plus suivi.

`earpointlost.detail : {id, point}`

| Propriété | Type     | Description                                                                                                                  |
| --------- | -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| id        | `Nombre` | Un numéro d'identification de la face localisée à laquelle les points d'attache de l'oreille sont attachés.  |
| point     | `Chaîne` | Peut être soit `hélix gauche`, `canal gauche`, `lobe gauche`, `hélix droit`, `canal droit`, ou `lobe droit`. |

## Exemple - ajout d'un module de pipeline {#example---adding-pipeline-module}

```javascript
XR8.addCameraPipelineModule(XR8.FaceController.pipelineModule())
```
