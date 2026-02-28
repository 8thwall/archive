# onCanvasSizeChange()

`onCanvasSizeChange: ({ GLctx, computeCtx, videoWidth, videoHeight, canvasWidth, canvasHeight })`

## Descripción {#description}

Se llama a `onCanvasSizeChange()` cuando el lienzo cambia de tamaño. Llamada con dimensiones de vídeo y lienzo.

## Parámetros {#parameters}

| Parámetro    | Descripción                                                                                  |
| ------------ | -------------------------------------------------------------------------------------------- |
| GLctx        | El `WebGLRenderingContext` o `WebGL2RenderingContext` del lienzo.            |
| computeCtx   | El `WebGLRenderingContext` o `WebGL2RenderingContext` del lienzo de cálculo. |
| videoWidth   | La anchura de la alimentación de la cámara, en píxeles.                      |
| videoHeight  | La altura de la alimentación de la cámara, en píxeles.                       |
| canvasWidth  | La anchura del lienzo `GLctx`, en píxeles.                                   |
| canvasHeight | La altura del lienzo `GLctx`, en píxeles.                                    |

## Ejemplo {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onCanvasSizeChange: ({ GLctx, videoWidth, videoHeight, canvasWidth, canvasHeight }) => {
    myHandleResize({ GLctx, videoWidth, videoHeight, canvasWidth, canvasHeight })
  },
})
```
