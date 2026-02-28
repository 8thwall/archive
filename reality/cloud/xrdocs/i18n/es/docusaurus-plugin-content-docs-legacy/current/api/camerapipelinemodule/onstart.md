# onStart()

`onStart: ({ canvas, GLctx, computeCtx, isWebgl2, orientation, videoWidth, videoHeight, canvasWidth, canvasHeight, config })`

## Descripción {#description}

Se llama a `onStart()` cuando se inicia XR.

## Parámetros {#parameters}

| Parámetro    | Descripción                                                                                                                       |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| lona         | El lienzo que respalda el procesamiento de la GPU y la visualización del usuario.                                 |
| GLctx        | El `WebGLRenderingContext` o `WebGL2RenderingContext` del lienzo.                                                 |
| computeCtx   | El `WebGLRenderingContext` o `WebGL2RenderingContext` del lienzo de cálculo.                                      |
| isWebgl2     | True si `GLctx` es un `WebGL2RenderingContext`.                                                                   |
| orientación  | La rotación de la interfaz de usuario con respecto a la vertical, en grados (-90, 0, 90, 180). |
| videoWidth   | La anchura de la alimentación de la cámara, en píxeles.                                                           |
| videoHeight  | La altura de la alimentación de la cámara, en píxeles.                                                            |
| canvasWidth  | La anchura del lienzo `GLctx`, en píxeles.                                                                        |
| canvasHeight | La altura del lienzo `GLctx`, en píxeles.                                                                         |
| config       | Los parámetros de configuración que se pasaron a [`XR8.run()`](/legacy/api/xr8/run).                              |

## Ejemplo {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onStart: ({canvasWidth, canvasHeight}) => {
    // Obtén la escena three.js. Esto fue creado por XR8.Threejs.pipelineModule().onStart(). La
    // razón por la que podemos acceder a ella ahora es porque 'mycamerapipelinemodule' fue instalado después de
    // XR8.Threejs.pipelineModule().
    const {scene, camera} = XR8.Threejs.xrScene()

    // Añade algunos objetos a la escena y fija la posición inicial de la cámara.
    myInitXrScene({scene, camera})

    // Sincroniza la posición 6DoF del controlador xr y los parámetros de la cámara con nuestra escena.
    XR8.XrController.updateCameraProjectionMatrix({
      origin: camera.position,
      facing: camera.quaternion,
    })
  },
})
```
