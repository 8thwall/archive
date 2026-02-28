# onStart()

`onStart: ({ canvas, GLctx, computeCtx, isWebgl2, orientation, videoWidth, videoHeight, canvasWidth, canvasHeight, config })`

## Descripción {#description}

`onStart()` se llama cuando se inicia XR.

## Parámetros {#parameters}

| Parámetro    | Descripción                                                                       |
| ------------ | --------------------------------------------------------------------------------- |
| canvas       | El lienzo que respalda el procesamiento de la GPU y la visualización del usuario. |
| GLctx        | El lienzo de dibujo `WebGLRenderingContext` o `WebGL2RenderingContext`.           |
| computeCtx   | El lienzo de cálculo `WebGLRenderingContext` o `WebGL2RenderingContext`.          |
| isWebgl2     | Verdadero si `GLctx` es un `WebGL2RenderingContext`.                              |
| orientation  | La rotación de la IU respecto a la vertical, en grados (-90, 0, 90, 180).         |
| videoWidth   | La altura de la alimentación de la cámara, en píxeles.                            |
| videoHeight  | La altura de la alimentación de la cámara, en píxeles.                            |
| canvasWidth  | La anchura del lienzo `GLctx`, en píxeles.                                        |
| canvasHeight | La altura del lienzo `GLctx`, en píxeles.                                         |
| config       | Los parámetros de configuración que se pasaron a [`XR8.run()`](/api/xr8/run).     |

## Ejemplo {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onStart: ({canvasWidth, canvasHeight}) => {
 // Obtén la escena three.js. Esto fue creado por XR8.Threejs.pipelineModule().onStart(). La
 // razón por la que podemos acceder a él aquí ahora es porque 'mycamerapipelinemodule' se instaló después de
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
