---
sidebar_label: xrScene()
---

# XR8.Threejs.xrScene()

`XR8.Threejs.xrScene()`

## Descripción {#description}

Obtiene un manejador a la escena xr, cámara, renderizador, (opcional) textura de alimentación de cámara, y (opcional) layerScenes.

## Parámetros {#parameters}

Ninguno

## Devuelve {#returns}

Un objeto: `{ scene, camera, renderer, cameraTexture, layerScenes }`

| Propiedad                                                                    | Tipo                                                                   | Descripción                                                                                                                                                                                                                      |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| escena                                                                       | [`Scene`](https://threejs.org/docs/#api/en/scenes/Scene)               | La escena de los tres.js.                                                                                                                                                                        |
| cámara                                                                       | [`Camera`](https://threejs.org/docs/#api/en/cameras/Camera)            | La cámara principal three.js.                                                                                                                                                                    |
| renderizador                                                                 | [`Renderer`](https://threejs.org/docs/#api/en/renderers/WebGLRenderer) | El renderizador de three.js.                                                                                                                                                                     |
| cameraTexture [Opcional] | [`Texture`](https://threejs.org/docs/#api/en/textures/Texture)         | Una textura three.js con la imagen de la cámara recortada al tamaño del lienzo. Habilitado llamando a [`XR8.Threejs.configure({renderCameraTexture: true})`](configure.md).      |
| layerScenes [Opcional]   | `Registro<String, LayerScene>`                                         | Un mapa de nombres de capas a escenas de capas de three.js. Contendrá los registros que se habiliten llamando a [`XR8.Threejs.configure({layerScenes: ['sky']})`](configure.md). |

La `LayerScene` del objeto `layerScenes` tiene las siguientes propiedades:

| Propiedad | Tipo                                                        | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| escena    | [`Scene`](https://threejs.org/docs/#api/en/scenes/Scene)    | La escena three.js para esta capa. El contenido añadido a este cielo sólo será visible cuando se encuentre en un área de la alimentación de la cámara en la que se haya detectado esta capa. Por ejemplo, en Efectos de cielo un cubo sólo se mostrará en el cielo. Usa `XR8.LayersController.configure({layers: {sky: {invertLayerMask: true}}})` para invertir esto y hacer que el cubo sólo se muestre cuando no esté en el cielo. |
| cámara    | [`Camera`](https://threejs.org/docs/#api/en/cameras/Camera) | La cámara three.js para esta capa. Tendrá su posición y rotación sincronizadas con la cámara principal.                                                                                                                                                                                                                                                                                                                                                               |

## Ejemplo {#example}

```javascript
const {escena, cámara, renderizador, cámaraTextura} = XR8.Threejs.xrScene()
```

## Ejemplo - Escena del cielo {#example---sky-scene}

```javascript
XR8.LayersController.configure({layers: {sky: {}}})
XR8.Threejs.configure({layerScenes: ['sky']})
...
const {layerScenes} = XR8.Threejs.xrScene()
createSkyScene(layerScenes.sky.scene, layerScenes.sky.camera)
```
