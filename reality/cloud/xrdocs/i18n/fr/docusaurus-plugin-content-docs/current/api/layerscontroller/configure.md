---
sidebar_label: configure()
---

# XR8.LayersController.configure()

`XR8.LayersController.configure({ nearClip, farClip, coordinates, layers })`

## Description {#description}

Configure le traitement effectué par `LayersController`.

## Paramètres {#parameters}

| Paramètres               | Type             | Défaut | Description                                                                                                                                                                                             |
| ------------------------ | ---------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nearClip [Facultatif]    | `Nombre`         | `0.01` | La distance entre la caméra et le plan du clip le plus proche, c'est-à-dire la distance la plus proche de la caméra à laquelle les objets de la scène sont visibles.                                    |
| farClip [Facultatif]     | `Nombre`         | `1000` | La distance entre la caméra et le plan de coupe éloigné, c'est-à-dire la distance la plus éloignée de la caméra à laquelle les objets de la scène sont visibles.                                        |
| coordonnées [Facultatif] | `Coordonnées`    |        | La configuration de la caméra.                                                                                                                                                                          |
| couches [Facultatif]     | `Enregistrement` | `{}`   | Couches sémantiques à détecter. La clé est le nom de la couche. Pour supprimer une couche, passez `nul` au lieu de `LayerOptions`. Le seul nom de couche pris en charge à l'heure actuelle est `'sky'`. |

L'objet `Coordinates` possède les propriétés suivantes :

| Paramètres                   | Type                                             | Défaut                                                                | Description                                              |
| ---------------------------- | ------------------------------------------------ | --------------------------------------------------------------------- | -------------------------------------------------------- |
| origine [Facultatif]         | `{position: {x, y, z}, rotation : {w, x, y, z}}` | `{position: {x: 0, y: 2, z: 0}, rotation : {w: 1, x: 0, y: 0, z: 0}}` | La position et la rotation de la caméra.                 |
| échelle [Facultatif]         | `Nombre`                                         | `2`                                                                   | Échelle de la scène.                                     |
| axes [Facultatif]            | `Chaîne`                                         | `'DROITIER'`                                                          | Peut être soit `‘GAUCHER'` ou `'DROITIER'`.              |
| mirroredDisplay [Facultatif] | `Booléen`                                        | `faux`                                                                | Si vrai, inverser la gauche et la droite dans la sortie. |

L'objet `LayerOptions` possède les propriétés suivantes :

| Paramètres                   | Type      | Défaut | Description                                                                                                                                                                                                                                 |
| ---------------------------- | --------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| invertLayerMask [Facultatif] | `Booléen` | `faux` | Si `vrai`, le contenu que vous placez dans votre scène sera visible dans les zones sans ciel. Si `faux`, le contenu que vous placez dans votre scène sera visible dans les zones de ciel. Pour rétablir la valeur par défaut, passez `nul`. |
| edgeSmoothness [Facultatif]  | `Nombre`  | `0`    | Montant pour lisser les bords de la couche. Les valeurs valables sont comprises entre [0-1]. Pour rétablir la valeur par défaut, passez `nul`.                                                                                              |

**IMPORTANT :** [`XR8.LayersController`](./layerscontroller.md) ne peut pas être utilisé en même temps que [`XR8.FaceController`](../facecontroller/facecontroller.md).

## Retours {#returns}

Aucun

## Exemple {#example}

```javascript
XR8.LayersController.configure({layers: {sky: {invertLayerMask: true, edgeSmoothness: 0.8}}})
```
