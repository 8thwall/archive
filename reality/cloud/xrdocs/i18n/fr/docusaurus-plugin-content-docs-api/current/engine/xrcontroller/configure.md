---
sidebar_label: configure()
---

# XR8.XrController.configure()

`XrController.configure({ disableWorldTracking, enableLighting, enableWorldPoints, enableVps, imageTargets : [], leftHandedAxes, mirroredDisplay, projectWayspots, scale })`

## Description {#description}

Configure le traitement effectué par `XrController` (certains réglages peuvent avoir des conséquences sur les performances).

## Paramètres (tous facultatifs) {#parameters-all-optional}

| Aucun                                                                                                                                      | Types d'audio | Polices par défaut | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| disableWorldTracking [Facultatif] (désactivation du suivi du monde) | `Booléen`     | `false`            | Si c'est le cas, le suivi SLAM est désactivé pour des raisons d'efficacité. Ceci doit être fait **AVANT** que [`XR8.run()`](/legacy/api/xr8/run) soit appelé.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| enableLighting [Facultatif]                                                            | `Booléen`     | `false`            | Si true, `lighting` sera fourni par [`XR8.XrController.pipelineModule()`](pipelinemodule.md) comme `processCpuResult.reality.lighting`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| enableWorldPoints [Facultatif]                                                         | `Booléen`     | `false`            | Si true, `worldPoints` sera fourni par [`XR8.XrController.pipelineModule()`](pipelinemodule.md) comme `processCpuResult.reality.worldPoints`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| enableVps [Facultatif]                                                                 | `Booléen`     | `false`            | Si c'est le cas, recherchez des emplacements de projet et un maillage. Le maillage renvoyé n'a aucun rapport avec les emplacements de projet et sera renvoyé même si aucun emplacement de projet n'est configuré. L'activation de VPS annule les réglages de `scale` et `disableWorldTracking`.                                                                                                                                                                                                                                                                                                                                                                                                    |
| imageTargets [Facultatif]                                                              | `Array`       |                    | Liste des noms de la cible d'image à détecter. Peut être modifié en cours d'exécution. Remarque : Toutes les cibles d'image actuellement actives seront remplacées par celles spécifiées dans cette liste.                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| leftHandedAxes [Facultatif]                                                            | `Booléen`     | `false`            | Si c'est le cas, utiliser des coordonnées gauches.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| mirroredDisplay [Facultatif]                                                           | `Booléen`     | `false`            | Si vrai, inverser la gauche et la droite dans la sortie.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| projectWayspots [Facultatif]                                                           | `Array`       | `[]`               | Sous-ensemble de noms de lieux de projets à localiser exclusivement. Si un tableau vide est fourni, nous localiserons tous les lieux de projet proches.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| échelle [Facultatif]                                                                   | `Chaîne`      | `réactif`          | Soit `responsive`, soit `absolute`. `responsive` renverra des valeurs telles que la caméra de l'image 1 soit à l'origine définie par [`XR8.XrController.updateCameraProjectionMatrix()`](updatecameraprojectionmatrix.md). `absolute` renvoie la caméra, les cibles de l'image, etc. en mètres. En utilisant `absolute`, la position x, la position z et la rotation de la pose de départ respecteront les paramètres définis dans [`XR8.XrController.updateCameraProjectionMatrix()`](updatecameraprojectionmatrix.md) une fois que l'échelle a été estimée. La position y dépend de la hauteur physique de la caméra par rapport au plan du sol. |

**IMPORTANT:** `disableWorldTracking : true` doit être mis **AVANT** que [`XR8.XrController.pipelineModule()`](pipelinemodule.md) et [`XR8.run()`](/legacy/api/xr8/run) soient appelés et ne puissent pas être modifiés pendant que le moteur tourne.

## Retours {#returns}

Aucun

## Exemple {#example}

```javascript
XR8.XrController.configure({enableLighting: true, disableWorldTracking: false, scale: 'absolute'})
```

## Exemple - Activer VPS {#example---enable-vps}

```javascript
XR8.XrController.configure({enableVps: true})
```

## Exemple - Désactiver le suivi du monde {#example---disable-world-tracking}

```javascript
// Disable world tracking (SLAM)
XR8.XrController.configure({disableWorldTracking: true})
// Open the camera and start running the camera run loop
XR8.run({canvas: document.getElementById('camerafeed')})
```

## Exemple - Modifier l'ensemble des cibles de l'image active {#example---change-active-image-target-set}

```javascript
XR8.XrController.configure({imageTargets: ['image-target1', 'image-target2', 'image-target3']})
```
