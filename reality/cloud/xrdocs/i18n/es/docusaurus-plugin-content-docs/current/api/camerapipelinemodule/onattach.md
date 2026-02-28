# onAttach()

`onAttach: ({framework, canvas, GLctx, computeCtx, isWebgl2, orientation, videoWidth, videoHeight, canvasWidth, canvasHeight, status, stream, video, version, imageTargets, config})`

## Descripción {#description}

`onAttach()` se llama antes de la primera vez que un módulo recibe actualizaciones de tramas. Se llama a los módulos que se han añadido antes o después de que se ejecute la canalización. Incluye todos los datos disponibles más recientes:

* [`onStart()`](./onstart.md)
* [`onDeviceOrientationChange()`](./ondeviceorientationchange.md)
* [`onCanvasSizeChange()`](./oncanvassizechange.md)
* [`onVideoSizeChange()`](./onvideosizechange.md)
* [`onCameraStatusChange()`](./oncamerastatuschange.md)
* [`onAppResourcesLoaded()`](./onappresourcesloaded.md)

## Parámetros {#parameters}

| Parámetro               | Descripción                                                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| framework               | Los enlaces del marco de este módulo para enviar eventos.                                                                 |
| canvas                  | El lienzo que respalda el procesamiento de la GPU y la visualización del usuario.                                         |
| GLctx                   | El lienzo de dibujo `WebGLRenderingContext` o `WebGL2RenderingContext`.                                                   |
| computeCtx              | El lienzo de cálculo `WebGLRenderingContext` o `WebGL2RenderingContext`.                                                  |
| isWebgl2                | Verdadero si `GLctx` es un `WebGL2RenderingContext`.                                                                      |
| orientation             | La rotación de la IU respecto a la vertical, en grados (-90, 0, 90, 180).                                                 |
| videoWidth              | La altura de la alimentación de la cámara, en píxeles.                                                                    |
| videoHeight             | La altura de la alimentación de la cámara, en píxeles.                                                                    |
| canvasWidth             | La anchura del lienzo `GLctx`, en píxeles.                                                                                |
| canvasHeight            | La altura del lienzo `GLctx`, en píxeles.                                                                                 |
| status                  | Uno de [ `'requesting'`, `'hasStream'`, `'hasVideo'`, `'failed'` ]                                                        |
| stream                  | El [`MediaStream`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) asociado a la alimentación de la cámara. |
| video                   | El elemento dom de vídeo que muestra el flujo.                                                                            |
| version [Opcional]      | La versión del motor, por ejemplo 14.0.8.949, si se cargan recursos de la app.                                            |
| imageTargets [Opcional] | Una matriz de objetivos de imagen con los campos `{imagePath, metadata, name}`                                            |
| config                  | Los parámetros de configuración que se pasaron a [`XR8.run()`](/api/xr8/run).                                             |
