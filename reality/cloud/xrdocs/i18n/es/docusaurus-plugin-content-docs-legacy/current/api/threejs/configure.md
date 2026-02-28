---
sidebar_label: configurar()
---

# XR8.Threejs.configure()

`XR8.Threejs.configure({renderCameraTexture, layerNames})`

## Descripción {#description}

Configura el renderizador de three.js.

## Parámetros {#parameters}

| Propiedad                                                                              | Tipo       | Por defecto | Descripción                                                                                                                                                                                                                                                                                                  |
| -------------------------------------------------------------------------------------- | ---------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| renderizarCameraTexture [Opcional] | Booleano   | `true`      | Si es `true`, renderiza la imagen de la cámara recortada al tamaño del lienzo en una textura. Esta será devuelta como `cameraTexture` por [`XR8.Threejs.xrScene()`](xrscene.md). Si es `false` o `null`, no renderiza la imagen de la cámara en una textura. |
| layerScenes [Opcional]             | `[Cadena]` | `[]`        | Una matriz de nombres de capas. Las capas para las que crear nuevas escenas three.js. Las escenas son devueltas como `layerScenes` por [`XR8.Threejs.xrScene()`](xrscene.md). El único valor válido es `'sky'`.              |

## Devuelve {#returns}

Ninguno

## Ejemplo - Renderizar la alimentación de la cámara a una textura {#example---render-camera-feed-to-a-texture}

```javascript
XR8.Threejs.configure({renderCameraTexture: true})
...
const {cameraTexture} = XR8.Threejs.xrScene()
```

## Ejemplo - Escena del cielo {#example---sky-scene}

```javascript
XR8.Threejs.configure({layerScenes: ['sky']})
...
const {layerScenes} = XR8.Threejs.xrScene()
createSkyScene(layerScenes.sky.scene, layerScenes.sky.camera)
```
