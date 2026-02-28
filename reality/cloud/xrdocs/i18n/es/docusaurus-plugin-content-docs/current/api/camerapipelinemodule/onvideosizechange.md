# onVideoSizeChange()

`onVideoSizeChange: ({ GLctx, computeCtx, videoWidth, videoHeight, canvasWidth, canvasHeight, orientation })`

## Descripción {#description}

`onVideoSizeChange()` se llama cuando el lienzo cambia de tamaño. Llamada con las dimensiones del vídeo y del lienzo, así como la orientación del dispositivo.

## Parámetros {#parameters}

| Parámetros   | Descripción                                                               |
| ------------ | ------------------------------------------------------------------------- |
| GLctx        | El lienzo de dibujo `WebGLRenderingContext` o `WebGL2RenderingContext`.   |
| computeCtx   | El lienzo de cálculo `WebGLRenderingContext` o `WebGL2RenderingContext`.  |
| videoWidth   | La anchura de la alimentación de la cámara, en píxeles.                   |
| videoHeight  | La altura de la alimentación de la cámara, en píxeles.                    |
| canvasWidth  | La anchura del lienzo `GLctx`, en píxeles.                                |
| canvasHeight | La altura del lienzo `GLctx`, en píxeles.                                 |
| orientation  | La rotación de la IU respecto a la vertical, en grados (-90, 0, 90, 180). |

## Ejemplo {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onVideoSizeChange: ({ GLctx, videoWidth, videoHeight, canvasWidth, canvasHeight }) => {
    myHandleResize({ GLctx, videoWidth, videoHeight, canvasWidth, canvasHeight })
  },
})
```
