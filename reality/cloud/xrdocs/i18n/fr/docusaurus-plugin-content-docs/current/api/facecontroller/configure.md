---
sidebar_position: 1
sidebar_label: configure()
---

# XR8.FaceController.configure()

`XR8.FaceController.configure({ nearClip, farClip, meshGeometry, coordinates })`

## Description {#description}

Configure le traitement effectué par FaceController.

## Paramètres {#parameters}

| Paramètres                 | Type          | Défaut                                   | Description                                                                                                                                                                                                                              |
| -------------------------- | ------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nearClip [Facultatif]      | `Nombre`      | `0.01`                                   | La distance entre la caméra et le plan du clip le plus proche, c'est-à-dire la distance la plus proche de la caméra à laquelle les objets de la scène sont visibles.                                                                     |
| farClip [Facultatif]       | `Nombre`      | `1000`                                   | La distance entre la caméra et le plan de coupe éloigné, c'est-à-dire la distance la plus éloignée de la caméra à laquelle les objets de la scène sont visibles.                                                                         |
| meshGeometry [Optionnel]   | `Array`       | `[XR8.FaceController.MeshGeometry.FACE]` | Contrôle les parties de la géométrie de la tête qui sont visibles. Options : `[XR8.FaceController.MeshGeometry.FACE, XR8.FaceController.MeshGeometry.EYES, XR8.FaceController.MeshGeometry.IRIS, XR8.FaceController.MeshGeometry.MOUTH]` |
| maxDetections [Facultatif] | `Nombre`      | `1`                                      | Nombre maximal de visages à détecter. Les choix possibles sont 1, 2 ou 3.                                                                                                                                                                |
| enableEars [Optional]      | `Booléen`     | `faux`                                   | Si la valeur est vraie, la détection des oreilles s'effectue en même temps que les effets de visage et renvoie les points d'attache des oreilles.                                                                                        |
| uvType [Facultatif]        | `Chaîne`      | `[XR8.FaceController.UvType.STANDARD]`   | Spécifie quels uv sont renvoyés dans l'événement de scan des visages et de chargement des visages. Les options sont les suivantes : `[XR8.FaceController.UvType.STANDARD, XR8.FaceController.UvType.PROJECTED]`                          |
| coordonnées [Facultatif]   | `Coordonnées` |                                          | La configuration de la caméra.                                                                                                                                                                                                           |

L'objet `Coordinates` possède les propriétés suivantes :

| Paramètres                   | Type                                             | Défaut                                                                | Description                                              |
| ---------------------------- | ------------------------------------------------ | --------------------------------------------------------------------- | -------------------------------------------------------- |
| origine [Facultatif]         | `{position: {x, y, z}, rotation : {w, x, y, z}}` | `{position: {x: 0, y: 0, z: 0}, rotation : {w: 1, x: 0, y: 0, z: 0}}` | La position et la rotation de la caméra.                 |
| échelle [Facultatif]         | `Nombre`                                         | `1`                                                                   | Échelle de la scène.                                     |
| axes [Facultatif]            | `Chaîne`                                         | `'DROITIER'`                                                          | Peut être soit `‘GAUCHER'` ou `'DROITIER'`.              |
| mirroredDisplay [Facultatif] | `Booléen`                                        | `Faux`                                                                | Si vrai, inverser la gauche et la droite dans la sortie. |

**IMPORTANT :** [`XR8.FaceController`](./facecontroller.md) ne peut pas être utilisé en même temps que [`XR8.XrController`](../xrcontroller/xrcontroller.md).

## Retours {#returns}

Aucun

## Exemple {#example}

```javascript
  XR8.FaceController.configure({
    meshGeometry : [XR8.FaceController.MeshGeometry.FACE],
    coordinates : {
      mirroredDisplay : true,
      axes : 'LEFT_HANDED',
    },
  })
```
