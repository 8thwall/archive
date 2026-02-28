# onCanvasSizeChange()

`onCanvasSizeChange: ({ GLctx, computeCtx, videoWidth, videoHeight, canvasWidth, canvasHeight })`

## Descripción {#description}

`onCanvasSizeChange()` se llama cuando el lienzo cambia de tamaño. Llamada con dimensiones de vídeo y lienzo.

## Parámetros {#parameters}

| Parámetro    | Descripción                                                              |
| ------------ | ------------------------------------------------------------------------ |
| GLctx        | El lienzo de dibujo `WebGLRenderingContext` o `WebGL2RenderingContext`.  |
| computeCtx   | El lienzo de cálculo `WebGLRenderingContext` o `WebGL2RenderingContext`. |
| videoWidth   | La anchura de la alimentación de la cámara, en píxeles.                  |
| videoHeight  | La altura de la alimentación de la cámara, en píxeles.                   |
| canvasWidth  | La anchura del lienzo `GLctx`, en píxeles.                               |
| canvasHeight | La altura del lienzo `GLctx`, en píxeles.                                |

## Ejemplo {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onCanvasSizeChange: ({ GLctx, videoWidth, videoHeight, canvasWidth, canvasHeight }) => {
    myHandleResize({ GLctx, videoWidth, videoHeight, canvasWidth, canvasHeight })
 },
})
```
