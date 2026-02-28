---
sidebar_position: 2
sidebar_label: pipelineModule()
---

# XR8.HandController.pipelineModule()

`XR8.HandController.pipelineModule()`

## Description {#description}

Crée un module de pipeline de caméra qui, lorsqu'il est installé, reçoit des rappels sur le démarrage de la caméra, les événements d'essai de la caméra et d'autres changements d'état. Ils sont utilisés pour calculer la position de la caméra.

## Paramètres {#parameters}

Aucun

## Retours {#returns}

La valeur de retour est un objet mis à la disposition de [`onUpdate`](/api/camerapipelinemodule/onupdate) en tant que :

`processCpuResult.handcontroller : { rotation, position, intrinsics, cameraFeedTexture }`

| Propriété         | Type                                                                            | Description                                                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| rotation          | `{w, x, y, z}`                                                                  | L'orientation (quaternion) de la caméra dans la scène.                                                                                                  |
| position          | `{x, y, z}`                                                                     | Position de la caméra dans la scène.                                                                                                                    |
| intrinsèques      | `[Number]`                                                                      | Matrice de projection 4x4 à 16 dimensions avec colonne majeure qui donne à la caméra de la scène le même champ de vision que celui de la caméra rendue. |
| cameraFeedTexture | [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | La texture contenant les données d'alimentation de la caméra.                                                                                           |

## Événements distribués {#dispatched-events}

**chargement manuel** : Se déclenche au début du chargement pour des ressources supplémentaires en matière d'armement manuel.

`handloading.detail : {maxDetections, pointsPerDetection, rightIndices, leftIndices}`

| Propriété          | Type          | Description                                                                         |
| ------------------ | ------------- | ----------------------------------------------------------------------------------- |
| maxDetections      | `Nombre`      | Le nombre maximum de mains qui peuvent être traitées simultanément.                 |
| pointsParDetection | `Nombre`      | Nombre de sommets qui seront extraits par main.                                     |
| indices de droite  | `[{a, b, c}]` | Index dans le tableau des sommets qui forment les triangles du maillage de la main. |
| indices de gauche  | `[{a, b, c}]` | Index dans le tableau des sommets qui forment les triangles du maillage de la main. |

**handscanning** : Se déclenche lorsque toutes les ressources Hand AR ont été chargées et que le scan a commencé.

`handscanning.detail : {maxDetections, pointsPerDetection, rightIndices, leftIndices}`

| Propriété          | Type          | Description                                                                         |
| ------------------ | ------------- | ----------------------------------------------------------------------------------- |
| maxDetections      | `Nombre`      | Le nombre maximum de mains qui peuvent être traitées simultanément.                 |
| pointsParDetection | `Nombre`      | Nombre de sommets qui seront extraits par main.                                     |
| indices de droite  | `[{a, b, c}]` | Index dans le tableau des sommets qui forment les triangles du maillage de la main. |
| indices de gauche  | `[{a, b, c}]` | Index dans le tableau des sommets qui forment les triangles du maillage de la main. |

**main trouvée** : Se déclenche lorsqu'une main est trouvée pour la première fois.

`handfound.detail : {id, transform, vertices, normals, attachmentPoints}`

| Propriété            | Type                          | Description                                                                                                                                                    |
| -------------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                   | `Nombre`                      | Un identifiant numérique de la main localisée.                                                                                                                 |
| transformer          | `{position, rotation, scale}` | Transformez les informations de la main située.                                                                                                                |
| sommets              | `[{x, y, z}]`                 | Position des points de la main par rapport à la transformation.                                                                                                |
| normales             | `[{x, y, z}]`                 | Direction normale des sommets, par rapport à la transformation.                                                                                                |
| mainKind             | `Nombre`                      | Une représentation numérique de la main de la personne localisée. Les valeurs valables sont 0 (non spécifié), 1 (gauche) et 2 (droite).                        |
| points d'attachement | `{name, position: {x,y,z}}`   | Voir [`XR8.HandController.AttachmentPoints`](attachmentpoints.md) pour la liste des points d'attache disponibles. `position` est relative à la transformation. |

`transform` est un objet ayant les propriétés suivantes :

| Propriété | Type           | Description                                                     |
| --------- | -------------- | --------------------------------------------------------------- |
| position  | `{x, y, z}`    | La position 3d de la main située.                               |
| rotation  | `{w, x, y, z}` | L'orientation locale en 3D de la main située.                   |
| échelle   | `Nombre`       | Facteur d'échelle à appliquer aux objets attachés à cette main. |

`attachmentPoints` est un objet ayant les propriétés suivantes :

| Propriété       | Type           | Description                                                                                                                                  |
| --------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| nom             | `Chaîne`       | Le nom du point d'attache. Voir [`XR8.HandController.AttachmentPoints`](attachmentpoints.md) pour la liste des points d'attache disponibles. |
| position        | `{x, y, z}`    | La position 3D du point d'attache sur la main située.                                                                                        |
| rotation        | `{w, x, y, z}` | Quaternion de rotation qui fait pivoter le vecteur Y positif vers le vecteur osseux du point d'attache.                                      |
| innerPoint      | `{x, y, z}`    | Le point intérieur d'un point d'attache. (ex. main côté paume)                                                                               |
| outerPoint      | `{x, y, z}`    | Le point extérieur d'un point d'attache. (ex. dos de la main)                                                                                |
| rayon           | `Nombre`       | Le rayon des points d'attache des doigts.                                                                                                    |
| rayon mineur    | `Nombre`       | Le rayon le plus court entre la surface de la main et le point d'attache du poignet.                                                         |
| rayon principal | `Nombre`       | Le rayon le plus long entre la surface de la main et le point d'attache du poignet.                                                          |

**handupdated** : Se déclenche lorsqu'une main est trouvée ultérieurement.

`handupdated.detail : {id, transform, vertices, normals, attachmentPoints}`

| Propriété            | Type                          | Description                                                                                                                                                    |
| -------------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                   | `Nombre`                      | Un identifiant numérique de la main localisée.                                                                                                                 |
| transformer          | `{position, rotation, scale}` | Transformez les informations de la main située.                                                                                                                |
| sommets              | `[{x, y, z}]`                 | Position des points de la main par rapport à la transformation.                                                                                                |
| normales             | `[{x, y, z}]`                 | Direction normale des sommets, par rapport à la transformation.                                                                                                |
| mainKind             | `Nombre`                      | Une représentation numérique de la main de la personne localisée. Les valeurs valables sont 0 (non spécifié), 1 (gauche) et 2 (droite).                        |
| points d'attachement | `{name, position: {x,y,z}}`   | Voir [`XR8.HandController.AttachmentPoints`](attachmentpoints.md) pour la liste des points d'attache disponibles. `position` est relative à la transformation. |

`transform` est un objet ayant les propriétés suivantes :

| Propriété | Type           | Description                                                     |
| --------- | -------------- | --------------------------------------------------------------- |
| position  | `{x, y, z}`    | La position 3d de la main située.                               |
| rotation  | `{w, x, y, z}` | L'orientation locale en 3D de la main située.                   |
| échelle   | `Nombre`       | Facteur d'échelle à appliquer aux objets attachés à cette main. |

**perte de main** : Se déclenche lorsqu'une main n'est plus suivie.

`handlost.detail : { id }`

| Propriété | Type     | Description                                    |
| --------- | -------- | ---------------------------------------------- |
| id        | `Nombre` | Un identifiant numérique de la main localisée. |


## Exemple - ajout d'un module de pipeline {#example---adding-pipeline-module}

```javascript
XR8.addCameraPipelineModule(XR8.HandController.pipelineModule())
```
