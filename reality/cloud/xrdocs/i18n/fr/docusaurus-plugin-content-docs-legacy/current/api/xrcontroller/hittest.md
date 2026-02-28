---
sidebar_label: hitTest()
---

# XR8.XrController.hitTest()

`XrController.hitTest(X, Y, includedTypes = [])`

## Description {#description}

Estimer la position 3D d'un point sur le flux de la caméra. X et Y sont des nombres compris entre 0 et 1, où (0, 0) est le coin supérieur gauche et (1, 1) est le coin inférieur droit du flux de la caméra tel qu'il a été rendu dans la caméra spécifiée par [`XR8.XrController.updateCameraProjectionMatrix()`](updatecameraprojectionmatrix.md). Plusieurs estimations de la position 3D peuvent être renvoyées pour un seul test de collision, en fonction de la source de données utilisée pour estimer la position. La source de données utilisée pour estimer la position est indiquée par le paramètre `hitTest.type`.

## Paramètres {#parameters}

| Paramètres   | Type       | Description                                                                                                                       |
| ------------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------- |
| X            | `Nombre`   | Valeur comprise entre 0 et 1 qui représente la position horizontale sur le flux de la caméra, de gauche à droite. |
| Y            | `Nombre`   | Valeur comprise entre 0 et 1 qui représente la position verticale sur le flux de la caméra, de haut en bas.       |
| types inclus | `[Chaîne]` | Liste devant contenir \\`'FEATURE_POINT''.                                                  |

## Retourne {#returns}

Un tableau de positions 3D estimées à partir du test de collision :

\`[{ type, position, rotation, distance }]\`\\`.

| Paramètres | Type           | Description                                                                                                                                                         |
| ---------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type       | `Chaîne`       | Un des éléments suivants : `'FEATURE_POINT'', `'ESTIMATED_SURFACE'', `'DETECTED_SURFACE'', ou `'UNSPECIFIED''. |
| position   | `{x, y, z}`    | Position 3D estimée du point interrogé sur le flux de la caméra.                                                                                    |
| rotation   | `{x, y, z, w}` | La rotation 3D estimée du point interrogé sur le flux de la caméra.                                                                                 |
| distance   | `Nombre`       | Distance estimée entre l'appareil et le point interrogé sur l'image de la caméra.                                                                   |

## Exemple {#example}

```javascript
const hitTestHandler = (e) => {
  const x = e.touches[0].clientX / window.innerWidth
  const y = e.touches[0].clientY / window.innerHeight
  const hitTestResults = XR8.XrController.hitTest(x, y, ['FEATURE_POINT'])
}
```
