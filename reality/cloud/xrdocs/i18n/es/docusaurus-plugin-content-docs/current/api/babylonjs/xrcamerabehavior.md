---
sidebar_label: xrCameraBehavior()
---

# XR8.Babylonjs.xrCameraBehavior()

`XR8.Babylonjs.xrCameraBehavior(config, xrConfig)`

## Descripción {#description}

Obtén un comportamiento que pueda adjuntarse a una cámara Babylon de la siguiente manera: `camera.addBehavior(XR8.Babylonjs.xrCameraBehavior())`

## Parámetros {#parameters}

| Parámetro           | Descripción                                                                      |
| ------------------- | -------------------------------------------------------------------------------- |
| config [Opcional]   | Parámetros de configuración para pasar a [`XR8.run()`](/api/xr8/run)             |
| xrConfig [Opcional] | Parámetros de configuración para pasar a [`XR8.XrController`](/api/xrcontroller) |

`config` [Opcional] es un objeto con las siguientes propiedades:

| Propiedad                            | Tipo                                            | Por defecto                               | Descripción                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------------ | ----------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| webgl2 [Opcional]                    | `Booleano`                                      | `false`                                   | Si es verdadero, utiliza WebGL2 si está disponible; si no, pasa a WebGL1.  Si es falso, utiliza siempre WebGL1.                                                                                                                                                                                                                                                  |
| ownRunLoop [Opcional]                | `Booleano`                                      | `false`                                   | Si es verdadero, XR debe utilizar su propio bucle de ejecución.  Si es falso, proporcionarás tu propio bucle de ejecución y serás responsable de llamar tú mismo a [`runPreRender`](/api/xr8/runprerender) y [`runPostRender`](/api/xr8/runpostrender) [Sólo usuarios avanzados]                                                                                 |
| cameraConfig: {direction} [Opcional] | `Objeto`                                        | `{direction: XR8.XrConfig.camera().BACK}` | Cámara que desea utilizar. Los valores admitidos para la `dirección` son `XR8.XrConfig.camera().BACK` o `XR8.XrConfig.camera().FRONT`                                                                                                                                                                                                                            |
| glContextConfig [Opcional]           | `WebGLContextAttributes`                        | `nulo`                                    | Los atributos para configurar el contexto del lienzo WebGL.                                                                                                                                                                                                                                                                                                      |
| allowedDevices [Optional]            | [`XR8.XrConfig.device()`](/api/xrconfig/device) | `XR8.XrConfig.device().MOBILE`            | Especifique la clase de dispositivos en los que debe ejecutarse la canalización.  Si el dispositivo actual no pertenece a esa clase, la ejecución fallará antes de abrir la cámara. Si allowedDevices es `XR8.XrConfig.device().ANY`, abra siempre la cámara. Ten en cuenta que el seguimiento mundial sólo puede utilizarse con `XR8.XrConfig.device().MOBILE`. |

`xrConfig` [Opcional] es un objeto con las siguientes propiedades:

| Parámetro                       | Descripción                                                                                                                                                                                                  |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| enableLighting [Opcional]       | Si es verdadero, devuelve una estimación de la información de iluminación.                                                                                                                                   |
| enableWorldPoints [Opcional]    | Si es verdadero, devuelve los puntos del mapa utilizados para el seguimiento.                                                                                                                                |
| disableWorldTracking [Opcional] | Si es verdadero, desactiva el seguimiento SLAM para mayor eficiencia.                                                                                                                                        |
| imageTargets [Opcional]         | Lista de nombres del objetivo de imagen a detectar. Puede modificarse en tiempo de ejecución. Nota: Todos los objetivos de imagen actualmente activos serán sustituidos por los especificados en esta lista. |
| leftHandedAxes [Opcional]       | Si es verdadero, utiliza coordenadas zurdas.                                                                                                                                                                 |
| imageTargets [Opcional]         | Si es verdadero, voltea a izquierda y derecha en la salida.                                                                                                                                                  |

## Devuelve {#returns}

Un comportamiento Babylon JS que conecta el motor XR a la cámara Babylon e inicia la alimentación y el seguimiento de la cámara.

## Ejemplo {#example}

```javascript
let surface, engine, scene, camera

const startScene = () => {
  const canvas = document.getElementById('renderCanvas')

  engine = new BABYLON.Engine(canvas, true, { stencil: true, preserveDrawingBuffer: true })
  engine.enableOfflineSupport = false

  scene = new BABYLON.Scene(engine)
  camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 3, 0), scene)

  initXrScene({ scene, camera }) // Añade objetos a la escena y fija la posición inicial de la cámara.

  // Conecta la cámara al motor XR y muestra el contenido de la cámara
  camera.addBehavior(XR8.Babylonjs.xrCameraBehavior())

  engine.runRenderLoop(() => {
    scene.render()
  })

  window.addEventListener('resize', () => {
    engine.resize()
  })
}
```
