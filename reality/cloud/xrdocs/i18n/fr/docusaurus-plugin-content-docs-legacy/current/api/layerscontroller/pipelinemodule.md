---
sidebar_label: pipelineModule()
---

# XR8.LayersController.pipelineModule()

`XR8.LayersController.pipelineModule()`

## Description {#description}

Crée un module de pipeline de caméra qui, une fois installé, assure la détection des couches sémantiques.

## Paramètres {#parameters}

Aucun

## Retourne {#returns}

La valeur de retour est un objet mis à la disposition de [`onUpdate`](/legacy/api/camerapipelinemodule/onupdate) comme :

`processCpuResult.layerscontroller : { rotation, position, intrinsics, cameraFeedTexture, layers }`

| Propriété         | Type                                                                            | Description                                                                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| rotation          | `{w, x, y, z}`                                                                  | L'orientation (quaternion) de la caméra dans la scène.                                                                               |
| position          | `{x, y, z}`                                                                     | Position de la caméra dans la scène.                                                                                                                    |
| intrinsèques      | `[Nombre]`                                                                      | Matrice de projection 4x4 à 16 dimensions avec colonne majeure qui donne à la caméra de la scène le même champ de vision que celui de la caméra rendue. |
| cameraFeedTexture | [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | La texture contenant les données d'alimentation de la caméra.                                                                                           |
| couches           | `Record<String, LayerOutput>`                                                   | Key est le nom de la couche, LayerOutput contient les résultats de la détection de la couche sémantique pour cette couche.                              |

`LayerOutput` est un objet avec les propriétés suivantes :

| Propriété             | Type                                                                            | Description                                                                                                                                                                                                                                                                                                                                                                                                    |
| --------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| la texture            | [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | La texture contenant les données de la couche. Les canaux r, g, b indiquent notre confiance dans la présence de la couche au niveau de ce pixel. 0.0 indique que la couche n'est pas présente et 1.0 indique qu'elle est présente. Notez que cette valeur sera inversée si `invertLayerMask` a été mis à true. |
| largeur de la texture | `Nombre`                                                                        | Largeur de la texture retournée en pixels.                                                                                                                                                                                                                                                                                                                                                     |
| hauteur de la texture | `Nombre`                                                                        | Hauteur de la texture retournée en pixels.                                                                                                                                                                                                                                                                                                                                                     |
| pourcentage           | `Nombre`                                                                        | Pourcentage de pixels classés comme étant associés à la couche. Valeur comprise dans l'intervalle [0, 1]                                                                                                                                                                                                                                   |

## Événements envoyés {#dispatched-events}

**layerloading** : Se déclenche lorsque le chargement de ressources supplémentaires pour la segmentation des couches commence.

`layerloading.detail : {}`

**layerscanning** : Se déclenche lorsque toutes les ressources de segmentation des couches ont été chargées et que l'analyse a commencé. Un événement est envoyé par couche en cours d'analyse.

`layerscanning.detail : {name}`

| Propriété | Type     | Description                                          |
| --------- | -------- | ---------------------------------------------------- |
| nom       | `Chaîne` | Nom de la couche que nous analysons. |

**couche trouvée** : Se déclenche la première fois qu'une couche a été trouvée.

`layerfound.detail : {name, percentage}`

| Propriété   | Type     | Description                                                 |
| ----------- | -------- | ----------------------------------------------------------- |
| nom         | `Chaîne` | Nom de la couche trouvée.                   |
| pourcentage | `Nombre` | Pourcentage de pixels associés à la couche. |

## Exemple - ajout d'un module de pipeline {#example---adding-pipeline-module}

```javascript
XR8.addCameraPipelineModule(XR8.LayersController.pipelineModule())
```
