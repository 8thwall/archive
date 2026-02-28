# onDeviceOrientationChange()

`onDeviceOrientationChange: ({ GLctx, computeCtx, videoWidth, videoHeight, orientation })`

## Descripción {#description}

`onDeviceOrientationChange()` se llama cuando el dispositivo cambia de orientación horizontal/vertical.

## Parámetros {#parameters}

| Parámetro   | Descripción                                                               |
| ----------- | ------------------------------------------------------------------------- |
| GLctx       | El lienzo de dibujo `WebGLRenderingContext` o `WebGL2RenderingContext`.   |
| computeCtx  | El lienzo de cálculo `WebGLRenderingContext` o `WebGL2RenderingContext`.  |
| videoWidth  | La anchura de la alimentación de la cámara, en píxeles.                   |
| videoHeight | La altura de la alimentación de la cámara, en píxeles.                    |
| orientation | La rotación de la IU respecto a la vertical, en grados (-90, 0, 90, 180). |

## Ejemplo {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onDeviceOrientationChange: ({ GLctx, videoWidth, videoHeight, orientation }) => {
    // handleResize({ GLctx, videoWidth, videoHeight, orientation })
  },
})
```
