# onAttach()

onAttach: ({framework, canvas, GLctx, computeCtx, isWebgl2, orientation, videoWidth, videoHeight, canvasWidth, canvasHeight, status, stream, video, version, imageTargets, config})\`)

## Descripción {#description}

Se llama a `onAttach()` antes de la primera vez que un módulo recibe actualizaciones de trama. Se llama a los módulos que se han añadido antes o después de que se ejecute el canal. Incluye todos los datos disponibles más recientes:

- [`onStart()`](./onstart.md)
- [`onDeviceOrientationChange()`](./ondeviceorientationchange.md)
- [`onCanvasSizeChange()`](./oncanvassizechange.md)
- [`onVideoSizeChange()`](./onvideosizechange.md)
- [`onCameraStatusChange()`](./oncamerastatuschange.md)
- [`onAppResourcesLoaded()`](./onappresourcesloaded.md)

## Parámetros {#parameters}

| Parámetro                                                                   | Descripción                                                                                                                                           |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| marco                                                                       | Los enlaces de este módulo para el envío de eventos.                                                                                  |
| lona                                                                        | El lienzo que respalda el procesamiento de la GPU y la visualización del usuario.                                                     |
| GLctx                                                                       | El `WebGLRenderingContext` o `WebGL2RenderingContext` del lienzo.                                                                     |
| computeCtx                                                                  | El `WebGLRenderingContext` o `WebGL2RenderingContext` del lienzo de cálculo.                                                          |
| isWebgl2                                                                    | True si `GLctx` es un `WebGL2RenderingContext`.                                                                                       |
| orientación                                                                 | La rotación de la interfaz de usuario con respecto a la vertical, en grados (-90, 0, 90, 180).                     |
| videoWidth                                                                  | La anchura de la alimentación de la cámara, en píxeles.                                                                               |
| videoHeight                                                                 | La altura de la alimentación de la cámara, en píxeles.                                                                                |
| canvasWidth                                                                 | La anchura del lienzo `GLctx`, en píxeles.                                                                                            |
| canvasHeight                                                                | La altura del lienzo `GLctx`, en píxeles.                                                                                             |
| estado                                                                      | Uno de [ `'requesting'`, `'hasStream'`, `'hasVideo'`, `'failed'` ]                                |
| flujo                                                                       | El [`MediaStream`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) asociado a la alimentación de la cámara.             |
| vídeo                                                                       | El elemento dom de vídeo que muestra el flujo.                                                                                        |
| versión [Opcional]      | La versión del motor, por ejemplo 14.0.8.949, si se cargan recursos de la aplicación. |
| imageTargets [Opcional] | Una matriz de objetivos de imagen con los campos `{imagePath, metadata, name}`                                                                        |
| config                                                                      | Los parámetros de configuración que se pasaron a [`XR8.run()`](/legacy/api/xr8/run).                                                  |
