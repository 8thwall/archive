---
sidebar_position: 1
sidebar_label: configure()
---

# XR8.HandController.configure()

`XR8.HandController.configure({ nearClip, farClip, coordinates })`

## Description {#description}

Configure le traitement effectué par le HandController.

## Paramètres {#parameters}

| Paramètres                                                                     | Type          | Défaut  | Description                                                                                                                                                                          |
| ------------------------------------------------------------------------------ | ------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| nearClip [Facultatif]      | `Nombre`      | `0.01`  | La distance entre la caméra et le plan du clip le plus proche, c'est-à-dire la distance la plus proche de la caméra à laquelle les objets de la scène sont visibles. |
| farClip [Facultatif]       | `Nombre`      | `1000`  | La distance entre la caméra et le plan de coupe éloigné, c'est-à-dire la distance la plus éloignée de la caméra à laquelle les objets de la scène sont visibles.     |
| maxDetections [Facultatif] | `Nombre`      | `1`     | Le nombre maximum de mains à détecter. La seule option possible est 1.                                                                               |
| enableWrists [Facultatif]  | `Booléen`     | `false` | Si true, la détection du poignet s'effectue en même temps que le suivi de la main et renvoie les points d'attache du poignet.                                        |
| coordonnées [Facultatif]   | `Coordinates` |         | La configuration de la caméra.                                                                                                                                       |

L'objet `Coordinates` possède les propriétés suivantes :

| Paramètres                                                                       | Type                                              | Défaut                                                                     | Description                                                                                |
| -------------------------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| origine [Facultatif]         | `{position : {x, y, z}, rotation : {w, x, y, z}}` | `{position : {x: 0, y: 0, z: 0}, rotation : {w : 1, x : 0, y : 0, z : 0}}` | La position et la rotation de la caméra.                                   |
| échelle [Facultatif]         | `Nombre`                                          | `1`                                                                        | Échelle de la scène.                                                       |
| axes [Facultatif]            | `Chaîne`                                          | `'DROITIER'` \\`                                                          | Peut être soit `'LEFT_HANDED'' soit `'RIGHT_HANDED''. |
| mirroredDisplay [Facultatif] | `Booléen`                                         | `False`                                                                    | Si vrai, inverser la gauche et la droite dans la sortie.                   |

**IMPORTANT:** [`XR8.HandController`](./handcontroller.md) ne peut pas être utilisé en même temps que [`XR8.XrController`](../xrcontroller/xrcontroller.md).

## Retourne {#returns}

Aucun

## Exemple {#example}

```javascript
  XR8.HandController.configure({
    coordinates : {mirroredDisplay: false},
})
```
