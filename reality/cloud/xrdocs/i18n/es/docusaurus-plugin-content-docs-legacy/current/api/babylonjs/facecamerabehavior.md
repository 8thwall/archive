---
sidebar_label: faceCameraBehavior()
---

# XR8.Babylonjs.faceCameraBehavior()

`XR8.Babylonjs.faceCameraBehavior(config, faceConfig)`

## Descripción {#description}

Obtén un comportamiento que puede ser adjuntado a una cámara Babylon de la siguiente manera: `camera.addBehavior(XR8.Babylonjs.faceCameraBehavior())`

## Parámetros {#parameters}

| Parámetro                                                                 | Descripción                                                                                            |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| config [Opcional]     | Parámetros de configuración para pasar a [`XR8.run()`](/legacy/api/xr8/run)                            |
| faceConfig [Opcional] | Parámetros de configuración de la cara para pasar a [`XR8.FaceController`](/legacy/api/facecontroller) |

`config` [Opcional] es un objeto con las siguientes propiedades:

| Propiedad                                                                                                | Tipo                                                   | Por defecto                                                                                                                      | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                        |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| webgl2 [Opcional]                                    | Booleano                                               | `false`                                                                                                                          | Si es true, utiliza WebGL2 si está disponible, de lo contrario, vuelve a WebGL1.  Si es false, utiliza siempre WebGL1.                                                                                                                                                                                                                                                                             |
| ownRunLoop [Opcional]                                | Booleano                                               | `true`                                                                                                                           | Si es verdadero, XR debe utilizar su propio bucle de ejecución.  Si es falso, usted proporcionará su propio bucle de ejecución y será responsable de llamar a [`runPreRender`](/legacy/api/xr8/runprerender) y [`runPostRender`](/legacy/api/xr8/runpostrender) usted mismo [Sólo usuarios avanzados].                                         |
| cameraConfig: {direction} [Opcional] | Objeto                                                 | \`{dirección: XR8.XrConfig.camera().BACK}\`\` | Cámara deseada. Los valores admitidos para `direction` son `XR8.XrConfig.camera().BACK` o `XR8.XrConfig.camera().FRONT`.                                                                                                                                                                                                                                                                           |
| glContextConfig [Opcional]                           | WebGLContextAttributes                                 | "null                                                                                                                            | Los atributos para configurar el contexto del lienzo WebGL.                                                                                                                                                                                                                                                                                                                                                        |
| dispositivospermitidos [Opcional]                    | [`XR8.XrConfig.device()`](/legacy/api/xrconfig/device) | `XR8.XrConfig.device().MOBILE`                                                                                                   | Especifique la clase de dispositivos en los que debe ejecutarse la canalización.  Si el dispositivo actual no pertenece a esa clase, la ejecución fallará antes de abrir la cámara. Si allowedDevices es `XR8.XrConfig.device().ANY`, abre siempre la cámara. Tenga en cuenta que el seguimiento mundial sólo puede utilizarse con `XR8.XrConfig.device().MOBILE`. |

`faceConfig` [Opcional] es un objeto con las siguientes propiedades:

| Parámetro                                                                     | Descripción                                                                                                                                                                                                                                                                                                                                                                       |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nearClip [Opcional]       | La distancia desde la cámara del plano de clip cercano. Por defecto utilizará la cámara Babylon.minZ                                                                                                                                                                                                                                              |
| farClip [Opcional]        | La distancia desde la cámara del plano del clip lejano. Por defecto utilizará la cámara Babylon.maxZ                                                                                                                                                                                                                                              |
| meshGeometry [Opcional]   | Lista que contiene qué partes de la geometría de la cabeza son visibles.  Las opciones son: `[XR8.FaceController.MeshGeometry.FACE, XR8.FaceController.MeshGeometry.EYES, XR8.FaceController.MeshGeometry.MOUTH, XR8.FaceController.MeshGeometry.IRIS]`. Por defecto es `[XR8.FaceController.MeshGeometry.FACE]`. |
| maxDetecciones [Opcional] | Número máximo de caras a detectar. Las opciones disponibles son 1, 2 o 3. El valor por defecto es 1.                                                                                                                                                                                                                              |
| uvType [Opcional]         | Especifica qué uvs se devuelven en el evento facescanning y faceloading. Las opciones son: `[XR8.FaceController.UvType.STANDARD, XR8.FaceController.UvType.PROJECTED]`. El valor predeterminado es `[XR8.FaceController.UvType.STANDARD]`.                                                                        |
| leftHandedAxes [Opcional] | Si es true, usa coordenadas a la izquierda.                                                                                                                                                                                                                                                                                                                       |
| imageTargets [Opcional]   | Si es true, voltea a izquierda y derecha en la salida.                                                                                                                                                                                                                                                                                                            |

## Devuelve {#returns}

Un comportamiento de Babylon JS que conecta el motor de Face Effects a la cámara de Babylon e inicia la alimentación y el seguimiento de la cámara.

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

  // Añade una luz a la escena
  const directionalLight =
  new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(-5, -10, 7), scene)
  directionalLight.intensity = 0.5

  // Mesh logic
  const faceMesh = new BABYLON.Mesh("face", scene);
  const material = new BABYLON.StandardMaterial("boxMaterial", scene)
  material.diffuseColor = new BABYLON.Color3(173 / 255.0, 80 / 255.0, 255 / 255.0)
  faceMesh.material = material

  let facePoints = []

  const runConfig = {
    cameraConfig: {XR8.XrConfig.camera().FRONT},
    allowedDevices: XR8.XrConfig.device().ANY,
    verbose: true,
  }

  camera.addBehavior(XR8.Babylonjs.faceCameraBehavior(runConfig)) // Conecta la cámara al XR y muestra la imagen de la cámara.

  engine.runRenderLoop(() => {
    scene.render()
  })
}
```
