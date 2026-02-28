---
sidebar_label: updateCameraProjectionMatrix()
---

# XR8.XrController.updateCameraProjectionMatrix()

`XR8.XrController.updateCameraProjectionMatrix({ cam, origin, facing })`

## Description {#description}

Réinitialise la géométrie d'affichage de la scène et la position initiale de la caméra dans la scène. La géométrie d'affichage est nécessaire pour superposer correctement la position des objets dans la scène virtuelle à leur position correspondante dans l'image de la caméra. La position de départ indique l'endroit où la caméra sera placée et orientée au début de la session.

## Paramètres {#parameters}

| Paramètres                                                               | Type                                                                              | Défaut                                        | Description                                                                                        |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| cam [Facultatif]     | `{pixelRectWidth, pixelRectHeight, nearClipPlane, farClipPlane}`. | `{nearClipPlane: 0.01, farClipPlane: 1000.0}` | La configuration de la caméra.                                                     |
| origine [Facultatif] | `{x, y, z}`                                                                       | `{x: 0, y: 2, z: 0}`                          | Position initiale de la caméra dans la scène.                                      |
| face [Facultatif]    | `{w, x, y, z}`                                                                    | `{w : 1, x : 0, y : 0, z : 0}`                | La direction de départ (quaternion) de la caméra dans la scène. |

`cam` a les paramètres suivants :

| Paramètres           | Type     | Description                                                                                             |
| -------------------- | -------- | ------------------------------------------------------------------------------------------------------- |
| pixelRectWidth       | `Nombre` | Largeur de la toile qui affiche le flux de la caméra.                                   |
| pixelRectHeight      | `Nombre` | Hauteur de la toile qui affiche le flux de la caméra.                                   |
| plan proche du clip  | `Nombre` | Distance la plus proche de la caméra à laquelle les objets de la scène sont visibles.   |
| plan du clip éloigné | `Nombre` | Distance la plus éloignée de la caméra à laquelle les objets de la scène sont visibles. |

## Retourne {#returns}

Aucun

## Exemple {#example}

```javascript
XR8.XrController.updateCameraProjectionMatrix({
  origin : { x: 1, y: 4, z: 0 },
  facing : { w : 0.9856, x : 0, y : 0.169, z : 0 }
})
```
