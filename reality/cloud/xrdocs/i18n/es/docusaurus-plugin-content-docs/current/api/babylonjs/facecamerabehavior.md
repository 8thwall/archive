---
sidebar_label: faceCameraBehavior()
---

# XR8.Babylonjs.faceCameraBehavior()

`XR8.Babylonjs.faceCameraBehavior(config, faceConfig)`

## Descripción {#description}

Obtén un comportamiento que pueda adjuntarse a una cámara Babylon de la siguiente manera: `camera.addBehavior(XR8.Babylonjs.faceCameraBehavior())`

## Parámetros {#parameters}

| Parámetro             | Descripción                                                                                     |
| --------------------- | ----------------------------------------------------------------------------------------------- |
| config [Opcional]     | Parámetros de configuración para pasar a [`XR8.run()`](/api/xr8/run)                            |
| faceConfig [Opcional] | Parámetros de configuración de la cara para pasar a [`XR8.FaceController`](/api/facecontroller) |

`config` [Opcional] es un objeto con las siguientes propiedades:

| Propiedad                            | Tipo                                            | Por defecto                               | Descripción                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------------ | ----------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| webgl2 [Opcional]                    | `Booleano`                                      | `false`                                   | Si es verdadero, utiliza WebGL2 si está disponible; si no, pasa a WebGL1.  Si es falso, utiliza siempre WebGL1.                                                                                                                                                                                                                                                  |
| ownRunLoop [Opcional]                | `Boolean`                                       | `true`                                    | Si es verdadero, XR debe utilizar su propio bucle de ejecución.  Si es falso, proporcionarás tu propio bucle de ejecución y serás responsable de llamar tú mismo a [`runPreRender`](/api/xr8/runprerender) y [`runPostRender`](/api/xr8/runpostrender) [Sólo usuarios avanzados]                                                                                 |
| cameraConfig: {direction} [Opcional] | `Objeto`                                        | `{direction: XR8.XrConfig.camera().BACK}` | Cámara que desea utilizar. Los valores admitidos para la `dirección` son `XR8.XrConfig.camera().BACK` o `XR8.XrConfig.camera().FRONT`                                                                                                                                                                                                                            |
| glContextConfig [Opcional]           | `WebGLContextAttributes`                        | `nulo`                                    | Los atributos para configurar el contexto del lienzo WebGL.                                                                                                                                                                                                                                                                                                      |
| allowedDevices [Optional]            | [`XR8.XrConfig.device()`](/api/xrconfig/device) | `XR8.XrConfig.device().MOBILE`            | Especifique la clase de dispositivos en los que debe ejecutarse la canalización.  Si el dispositivo actual no pertenece a esa clase, la ejecución fallará antes de abrir la cámara. Si allowedDevices es `XR8.XrConfig.device().ANY`, abra siempre la cámara. Ten en cuenta que el seguimiento mundial sólo puede utilizarse con `XR8.XrConfig.device().MOBILE`. |

`faceConfig` [Opcional] es un objeto con las siguientes propiedades:

| Parámetro                 | Descripción                                                                                                                                                                                                                                                                                                      |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nearClip [Opcional]       | La distancia desde la cámara del plano del clip cercano. Por defecto utilizará la cámara Babylon.minZ                                                                                                                                                                                                            |
| farClip [Opcional]        | La distancia desde la cámara del plano del clip lejano. Por defecto utilizará la cámara Babylon.maxZ                                                                                                                                                                                                             |
| meshGeometry [Opcional]   | Lista que contiene qué partes de la geometría de la cabeza son visibles.  Las opciones son: `[XR8.FaceController.MeshGeometry.FACE, XR8.FaceController.MeshGeometry.EYES, XR8.FaceController.MeshGeometry.MOUTH, XR8.FaceController.MeshGeometry.IRIS]`. Por defecto es `[XR8.FaceController.MeshGeometry.FACE]` |
| maxDetections [Opcional]  | El número máximo de caras a detectar. Las opciones disponibles son 1, 2 ó 3. El valor por defecto es 1.                                                                                                                                                                                                          |
| uvType [Opcional]         | Especifica qué uvs se devuelven en el evento de escaneo de caras y carga de caras. Las opciones son: `[XR8.FaceController.UvType.STANDARD, XR8.FaceController.UvType.PROJECTED]`. El valor predeterminado es `[XR8.FaceController.UvType.STANDARD]`.                                                             |
| leftHandedAxes [Opcional] | Si es verdadero, utiliza coordenadas zurdas.                                                                                                                                                                                                                                                                     |
| imageTargets [Opcional]   | Si es verdadero, voltea a izquierda y derecha en la salida.                                                                                                                                                                                                                                                      |

## Devuelve {#returns}

Un comportamiento JS de Babylon que conecta el motor de Efectos Faciales a la cámara de Babylon e inicia la alimentación y el seguimiento de la cámara.

## Ejemplo {#example}

```javascript
const startScene = (canvas) => {
  const engine = new BABYLON.Engine(canvas, true /* antialias */)
  const scene = new BABYLON.Scene(engine)
  scene.useRightHandedSystem = false

  const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 0, 0), scene)
  camera.rotation = new BABYLON.Vector3(0, scene.useRightHandedSystem ? Math.PI : 0, 0)
  camera.minZ = 0.0001
  camera.maxZ = 10000

  // Add a light to the scene
  const directionalLight =
  new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(-5, -10, 7), scene)
  directionalLight.intensity = 0.5

  // Lógica de la malla
  const faceMesh = new BABYLON.Mesh("face", scene);
  const material = new BABYLON.StandardMaterial("boxMaterial", scene)
  material.diffuseColor = new BABYLON.Color3(173 / 255.000 80 / 255.0, 255 / 255.0)
  faceMesh.material = material

  let facePoints = []

  const runConfig = {
    cameraConfig: {XR8.XrConfig.camera().FRONT},
    allowedDevices: XR8.XrConfig.device().ANY,
    verbose: true,
  }

  camera.addBehavior(XR8.Babylonjs.faceCameraBehavior(runConfig)) // Conecta la cámara al XR y muestra el contenido de la cámara.

  engine.runRenderLoop(() => {
    scene.render()
  })
}
```
