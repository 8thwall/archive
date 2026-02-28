---
sidebar_label: xrCameraBehavior()
---

# XR8.Babylonjs.xrCameraBehavior()

`XR8.Babylonjs.xrCameraBehavior(config, xrConfig)`

## Descripción {#description}

Obtén un comportamiento que se puede adjuntar a una cámara Babylon de esta manera `camera.addBehavior(XR8.Babylonjs.xrCameraBehavior())`

## Parámetros {#parameters}

| Parámetro                                                               | Descripción                                                                             |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| config [Opcional]   | Parámetros de configuración para pasar a [`XR8.run()`](/legacy/api/xr8/run)             |
| xrConfig [Opcional] | Parámetros de configuración para pasar a [`XR8.XrController`](/legacy/api/xrcontroller) |

`config` [Opcional] es un objeto con las siguientes propiedades:

| Propiedad                                                                                                | Tipo                                                   | Por defecto                                                                                                                      | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                        |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| webgl2 [Opcional]                                    | Booleano                                               | `false`                                                                                                                          | Si es true, utiliza WebGL2 si está disponible, de lo contrario, vuelve a WebGL1.  Si es false, utiliza siempre WebGL1.                                                                                                                                                                                                                                                                             |
| ownRunLoop [Opcional]                                | Booleano                                               | `false`                                                                                                                          | Si es verdadero, XR debe utilizar su propio bucle de ejecución.  Si es falso, usted proporcionará su propio bucle de ejecución y será responsable de llamar a [`runPreRender`](/legacy/api/xr8/runprerender) y [`runPostRender`](/legacy/api/xr8/runpostrender) usted mismo [Sólo usuarios avanzados].                                         |
| cameraConfig: {direction} [Opcional] | Objeto                                                 | \`{dirección: XR8.XrConfig.camera().BACK}\`\` | Cámara deseada. Los valores admitidos para `direction` son `XR8.XrConfig.camera().BACK` o `XR8.XrConfig.camera().FRONT`.                                                                                                                                                                                                                                                                           |
| glContextConfig [Opcional]                           | WebGLContextAttributes                                 | "null                                                                                                                            | Los atributos para configurar el contexto del lienzo WebGL.                                                                                                                                                                                                                                                                                                                                                        |
| dispositivospermitidos [Opcional]                    | [`XR8.XrConfig.device()`](/legacy/api/xrconfig/device) | `XR8.XrConfig.device().MOBILE`                                                                                                   | Especifique la clase de dispositivos en los que debe ejecutarse la canalización.  Si el dispositivo actual no pertenece a esa clase, la ejecución fallará antes de abrir la cámara. Si allowedDevices es `XR8.XrConfig.device().ANY`, abre siempre la cámara. Tenga en cuenta que el seguimiento mundial sólo puede utilizarse con `XR8.XrConfig.device().MOBILE`. |

`xrConfig` [Opcional] es un objeto con las siguientes propiedades:

| Parámetro                                                                           | Descripción                                                                                                                                                                                                                                                                  |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enableLighting [Opcional]       | Si es true, devuelve una estimación de la información de iluminación.                                                                                                                                                                                        |
| enableWorldPoints [Opcional]    | Si es true, devuelve los puntos del mapa utilizados para el seguimiento.                                                                                                                                                                                     |
| disableWorldTracking [Opcional] | Si es true, desactiva el seguimiento SLAM por eficiencia.                                                                                                                                                                                                    |
| imageTargets [Opcional]         | Lista de nombres del objetivo de imagen a detectar. Puede modificarse en tiempo de ejecución. Nota: Todos los objetivos de imagen actualmente activos serán sustituidos por los especificados en esta lista. |
| leftHandedAxes [Opcional]       | Si es true, usa coordenadas a la izquierda.                                                                                                                                                                                                                  |
| imageTargets [Opcional]         | Si es true, voltea a izquierda y derecha en la salida.                                                                                                                                                                                                       |

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

  // Conecta la cámara al motor XR y muestra la imagen de la cámara
  camera.addBehavior(XR8.Babylonjs.xrCameraBehavior())

  engine.runRenderLoop(() => {
    scene.render()
  })

  window.addEventListener('resize', () => {
    engine.resize()
  })
}
```
