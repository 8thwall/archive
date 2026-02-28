---
sidebar_label: configure()
---

# XR8.Threejs.configure()

`XR8.Threejs.configure({renderCameraTexture, layerNames})`

## Description {#description}

Configure le moteur de rendu three.js.

## Paramètres {#parameters}

| Propriété                                                                           | Type       | Défaut | Description                                                                                                                                                                                                                                                                                                         |
| ----------------------------------------------------------------------------------- | ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| renderCameraTexture [Optionnel] | `Booléen`  | `true` | Si `true`, rendre le flux de la caméra recadré à la taille du canevas dans une texture. Elle sera retournée en tant que `cameraTexture` par [`XR8.Threejs.xrScene()`](xrscene.md). Si `false` ou `null`, ne pas rendre le flux de la caméra dans une texture.       |
| layerScenes [Facultatif]        | `[Chaîne]` | `[]`   | Un tableau de noms de couches. Les couches pour lesquelles créer de nouvelles scènes three.js. Les scènes sont retournées en tant que `layerScenes` par [`XR8.Threejs.xrScene()`](xrscene.md). La seule valeur valable est `'sky'`. |

## Retourne {#returns}

Aucun

## Exemple - Rendu du flux de la caméra dans une texture {#example---render-camera-feed-to-a-texture}

```javascript
XR8.Threejs.configure({renderCameraTexture: true})
...
const {cameraTexture} = XR8.Threejs.xrScene()
```

## Exemple - Scène de ciel {#example---sky-scene}

```javascript
XR8.Threejs.configure({layerScenes : ['sky']})
...
const {layerScenes} = XR8.Threejs.xrScene()
createSkyScene(layerScenes.sky.scene, layerScenes.sky.camera)
```
