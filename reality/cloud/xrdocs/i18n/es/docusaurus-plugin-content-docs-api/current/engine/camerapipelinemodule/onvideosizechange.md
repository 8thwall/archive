# onVideoSizeChange()

`onVideoSizeChange: ({ GLctx, computeCtx, videoWidth, videoHeight, canvasWidth, canvasHeight, orientation })`

## Descripción {#description}

Se llama a `onVideoSizeChange()` cuando el lienzo cambia de tamaño. Llamada con las dimensiones del vídeo y el lienzo, así como la orientación del dispositivo.

## Parámetros {#parameters}

| Parámetros   | Descripción                                                                                                                       |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| GLctx        | El `WebGLRenderingContext` o `WebGL2RenderingContext` del lienzo.                                                 |
| computeCtx   | El `WebGLRenderingContext` o `WebGL2RenderingContext` del lienzo de cálculo.                                      |
| videoWidth   | La anchura de la alimentación de la cámara, en píxeles.                                                           |
| videoHeight  | La altura de la alimentación de la cámara, en píxeles.                                                            |
| canvasWidth  | La anchura del lienzo `GLctx`, en píxeles.                                                                        |
| canvasHeight | La altura del lienzo `GLctx`, en píxeles.                                                                         |
| orientación  | La rotación de la interfaz de usuario con respecto a la vertical, en grados (-90, 0, 90, 180). |

## Ejemplo {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onVideoSizeChange: ({ GLctx, videoWidth, videoHeight, canvasWidth, canvasHeight }) => {
    myHandleResize({ GLctx, videoWidth, videoHeight, canvasWidth, canvasHeight })
  },
})
```
