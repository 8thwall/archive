---
sidebar_label: xrScene()
---

# XR8.Threejs.xrScene()

`XR8.Threejs.xrScene()`

## Description {#description}

Obtenir un handle sur la scène xr, la caméra, le moteur de rendu, la texture (facultative) de l'alimentation de la caméra et la couche (facultative) de la scène.

## Paramètres {#parameters}

Aucun

## Retourne {#returns}

Un objet : `{ scene, camera, renderer, cameraTexture, layerScenes }`

| Propriété                                                                      | Type                                                                   | Description                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| scène                                                                          | [`Scene`](https://threejs.org/docs/#api/en/scenes/Scene)               | La scène three.js.                                                                                                                                                                                         |
| caméra                                                                         | [`Camera`](https://threejs.org/docs/#api/en/cameras/Camera)            | La caméra principale de three.js.                                                                                                                                                                          |
| moteur de rendu                                                                | [`Renderer`](https://threejs.org/docs/#api/en/renderers/WebGLRenderer) | Le moteur de rendu three.js.                                                                                                                                                                               |
| cameraTexture [Facultatif] | [`Texture`](https://threejs.org/docs/#api/en/textures/Texture)         | Une texture three.js avec le flux de la caméra recadré à la taille de la toile. Activé en appelant [`XR8.Threejs.configure({renderCameraTexture: true})`](configure.md).                   |
| layerScenes [Facultatif]   | `Record<String, LayerScene>`                                           | Une carte des noms de couches vers les scènes de couches de three.js. Contiendra les enregistrements activés en appelant [`XR8.Threejs.configure({layerScenes : ['sky']})`](configure.md). |

L'objet `LayerScene` de l'objet `layerScenes` possède les propriétés suivantes :

| Propriété | Type                                                        | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| --------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| scène     | [`Scene`](https://threejs.org/docs/#api/en/scenes/Scene)    | La scène three.js pour cette couche. Le contenu ajouté à ce ciel ne sera visible que si l'on se trouve dans une zone du flux de la caméra dans laquelle cette couche a été détectée. Par exemple, dans les effets de ciel, un cube n'apparaîtra que dans le ciel. Utilisez `XR8.LayersController.configure({layers : {sky : {invertLayerMask: true}}})` pour inverser cela et faire en sorte que le cube n'apparaisse que lorsqu'il n'est pas dans le ciel. |
| caméra    | [`Camera`](https://threejs.org/docs/#api/en/cameras/Camera) | La caméra three.js pour cette couche. Sa position et sa rotation seront synchronisées avec la caméra principale.                                                                                                                                                                                                                                                                                                                                                                            |

## Exemple {#example}

```javascript
const {scene, camera, renderer, cameraTexture} = XR8.Threejs.xrScene()
```

## Exemple - Scène de ciel {#example---sky-scene}

```javascript
XR8.LayersController.configure({layers : {sky : {}})
XR8.Threejs.configure({layerScenes : ['sky']})
...
const {layerScenes} = XR8.Threejs.xrScene()
createSkyScene(layerScenes.sky.scene, layerScenes.sky.camera)
```
