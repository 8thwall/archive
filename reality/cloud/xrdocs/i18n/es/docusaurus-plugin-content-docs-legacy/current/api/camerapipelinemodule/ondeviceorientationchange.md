# onCambioOrientaciónDispositivo()

`onDeviceOrientationChange: ({ GLctx, computeCtx, videoWidth, videoHeight, orientation })`

## Descripción {#description}

Se llama a `onDeviceOrientationChange()` cuando el dispositivo cambia de orientación horizontal/vertical.

## Parámetros {#parameters}

| Parámetro   | Descripción                                                                                                                       |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------- |
| GLctx       | El `WebGLRenderingContext` o `WebGL2RenderingContext` del lienzo.                                                 |
| computeCtx  | El `WebGLRenderingContext` o `WebGL2RenderingContext` del lienzo de cálculo.                                      |
| videoWidth  | La anchura de la alimentación de la cámara, en píxeles.                                                           |
| videoHeight | La altura de la alimentación de la cámara, en píxeles.                                                            |
| orientación | La rotación de la interfaz de usuario con respecto a la vertical, en grados (-90, 0, 90, 180). |

## Ejemplo {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onDeviceOrientationChange: ({ GLctx, videoWidth, videoHeight, orientation }) => {
    // handleResize({ GLctx, videoWidth, videoHeight, orientation })
  },
})
```
