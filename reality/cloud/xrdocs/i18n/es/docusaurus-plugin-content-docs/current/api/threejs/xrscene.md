---
sidebar_label: xrScene()
---

# XR8.Threejs.xrScene()

`XR8.Threejs.xrScene()`

## Descripción {#description}

Obtiene un manejador de la escena xr, la cámara, el renderizador, la textura de alimentación de la cámara (opcional) y  layerScenes (opcional).

## Parámetros {#parameters}

Ninguno

## Vuelta {#returns}

Un objeto: `{ scene, camera, renderer, cameraTexture, layerScenes }`

| Propiedad                | Tipo                                                                       | Descripción                                                                                                                                                                      |
| ------------------------ | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| scene                    | [`Escena`](https://threejs.org/docs/#api/en/scenes/Scene)                  | La escena tres.js.                                                                                                                                                               |
| camera                   | [`Cámara`](https://threejs.org/docs/#api/en/cameras/Camera)                | La cámara principal tres.js.                                                                                                                                                     |
| renderer                 | [`Renderizador`](https://threejs.org/docs/#api/en/renderers/WebGLRenderer) | El renderizador de three.js.                                                                                                                                                     |
| cameraTexture [Opcional] | [`Textura`](https://threejs.org/docs/#api/en/textures/Texture)             | Una textura three.js con la imagen de la cámara recortada al tamaño del lienzo. Se activa llamando a [`XR8.Threejs.configure({renderCameraTexture: true})`](configure.md).       |
| layerScenes [Opcional]   | `Record<String, LayerScene<`                                         | Un mapa de nombres de capas a escenas de capas de three.js. Contendrá los registros que se habiliten llamando a [`XR8.Threejs.configure({layerScenes: ['sky']})`](configure.md). |

La `LayerScene` en el objeto `layerScenes` tiene las siguientes propiedades:

| Propiedad | Tipo                                                        | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                         |
| --------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| scene     | [`Escena`](https://threejs.org/docs/#api/en/scenes/Scene)   | La escena three.js para esta capa. El contenido añadido a este cielo sólo será visible cuando se encuentre en una zona de la alimentación de la cámara en la que se haya detectado esta capa. Por ejemplo, en Efectos Cielo un cubo sólo aparecerá en el cielo. Utiliza `XR8.LayersController.configure({layers: {sky: {invertLayerMask: true}}})` para invertir esto y hacer que el cubo sólo aparezca cuando no esté en el cielo. |
| camera    | [`Cámara`](https://threejs.org/docs/#api/en/cameras/Camera) | La cámara three.js para esta capa. Tendrá su posición y rotación sincronizadas con la cámara principal.                                                                                                                                                                                                                                                                                                                             |

## Ejemplo {#example}

```javascript
const {scene, camera, renderer, cameraTexture} = XR8.Threejs.xrScene()
```

## Ejemplo - Escena del cielo {#example---sky-scene}

```javascript
XR8.LayersController.configure({layers: {sky: {}}})
XR8.Threejs.configure({layerScenes: ['sky']})
...
const {layerScenes} = XR8.Threejs.xrScene()
createSkyScene(layerScenes.sky.scene, layerScenes.sky.camera)
```
