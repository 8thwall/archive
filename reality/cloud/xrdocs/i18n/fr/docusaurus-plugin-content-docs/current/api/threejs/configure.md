---
sidebar_label: configure()
---

# XR8.Threejs.configure()

`XR8.Threejs.configure({renderCameraTexture, layerNames})`

## Description {#description}

Configure le moteur de rendu three.js.

## Paramètres {#parameters}

| Propriété                       | Type       | Défaut | Description                                                                                                                                                                                                                                                |
| ------------------------------- | ---------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| renderCameraTexture [Optionnel] | `Booléen`  | `vrai` | Si `vrai`, rendez le flux de la caméra recadré à la taille du support dans une texture. Elle sera renvoyée en tant que `cameraTexture` par [`XR8.Threejs.xrScene()`](xrscene.md). Si `faux` ou `nul`, ne rendez pas le flux de la caméra dans une texture. |
| layerScenes [Facultatif]        | `[String]` | `[]`   | Un tableau de noms de couches. Les couches pour lesquelles créer de nouvelles scènes three.js. Les scènes sont renvoyées en tant que `layerScenes` par [`XR8.Threejs.xrScene()`](xrscene.md). La seule valeur valable est `"sky"`.                         |

## Retours {#returns}

Aucun

## Exemple - Rendu du flux de la caméra dans une texture {#example---render-camera-feed-to-a-texture}

```javascript
XR8.Threejs.configure({renderCameraTexture: true})
...
const {cameraTexture} = XR8.Threejs.xrScene()
```

## Exemple - Scène de ciel {#example---sky-scene}

```javascript
XR8.Threejs.configure({layerScenes: ['sky']})
...
const {layerScenes} = XR8.Threejs.xrScene()
createSkyScene(layerScenes.sky.scene, layerScenes.sky.camera)
```
