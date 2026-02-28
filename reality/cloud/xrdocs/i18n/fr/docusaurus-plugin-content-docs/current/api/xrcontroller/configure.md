---
sidebar_label: configure()
---

# XR8.XrController.configure()

`XrController.configure({ disableWorldTracking, enableLighting, enableWorldPoints, enableVps, imageTargets: [], leftHandedAxes, mirroredDisplay, projectWayspots, scale })`

## Description {#description}

Configure le traitement effectué par `XrController` (certains paramètres peuvent avoir des répercussions sur les performances).

## Paramètres {#parameters}

| Paramètres                        | Type      | Défaut    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --------------------------------- | --------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| disableWorldTracking [Facultatif] | `Booléen` | `faux`    | Si c'est le cas, désactivez le suivi SLAM pour plus d'efficacité. Cela doit être fait **AVANT que** [`XR8.run()`](/api/xr8/run) ne soit appelé.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| enableLighting [Facultatif]       | `Booléen` | `faux`    | Si c'est le cas, `l'éclairage` sera fourni par [`XR8.XrController.pipelineModule()`](pipelinemodule.md) comme `processCpuResult.reality.lighting`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| enableWorldPoints [Facultatif]    | `Booléen` | `faux`    | Si c'est le cas, `worldPoints` sera fourni par [`XR8.XrController.pipelineModule()`](pipelinemodule.md) en tant que `processCpuResult.reality.worldPoints`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| enableVps [Facultatif]            | `Booléen` | `faux`    | Si c'est le cas, recherchez des emplacements de projet et un maillage. Le maillage renvoyé n'a aucun rapport avec les emplacements de projet et sera renvoyé même si aucun emplacement de projet n'est configuré. L'activation de VPS annule les paramètres `d’échelle` et `disableWorldTracking`.                                                                                                                                                                                                                                                                                                                                                     |
| imageTargets [Facultatif]         | `Réseau`  |           | Liste des noms de la cible d'image à détecter. Peut être modifié en cours d'exécution. Remarque : Toutes les images cible actuellement actives seront remplacées par celles spécifiées dans cette liste.                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| leftHandedAxes [Facultatif]       | `Booléen` | `faux`    | Si vrai, utilisez des coordonnées pour gaucher.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| mirroredDisplay [Facultatif]      | `Booléen` | `faux`    | Si vrai, inverser la gauche et la droite dans la sortie.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| projectWayspots [Facultatif]      | `Réseau`  | `[]`      | Sous-ensemble de noms de lieux de projets à localiser exclusivement. Si un tableau vide est fourni, nous localiserons tous les lieux de projet proches.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| échelle [Facultatif]              | `Chaîne`  | `réactif` | Soit `responsive` soit `absolute`. `responsive` renverra des valeurs de sorte que la caméra de l'image 1 soit à l'origine définie via [`XR8.XrController.updateCameraProjectionMatrix()`](updatecameraprojectionmatrix.md). `absolute` renvoie la caméra, les images cible, etc. en mètres. Lorsque vous utilisez `absolute` , la position x, la position z et la rotation de la pose de départ respectent les paramètres définis dans [`XR8.XrController.updateCameraProjectionMatrix()`](updatecameraprojectionmatrix.md) une fois que l'échelle a été estimée. La position y dépend de la hauteur physique de la caméra par rapport au plan du sol. |

**IMPORTANT :** `disableWorldTracking : true` doit être activé **AVANT** [` XR8.XrController.pipelineModule()`](pipelinemodule.md) et [`XR8.run()`](/api/xr8/run) sont appelés et ne peuvent pas être modifiés pendant que le moteur tourne.

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
// Désactiver le suivi du monde (SLAM)
XR8.XrController.configure({disableWorldTracking: true})
// Ouvrir la caméra et lancer la boucle d'exécution de la caméra
XR8.run({canvas: document.getElementById('camerafeed')})
```

## Exemple - Modifier l'ensemble des images cible actives {#example---change-active-image-target-set}

```javascript
XR8.XrController.configure({imageTargets: ['image-target1', 'image-target2', 'image-target3']})
```
