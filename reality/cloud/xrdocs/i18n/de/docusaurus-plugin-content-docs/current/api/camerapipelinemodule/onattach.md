# onAttach()

`onAttach: ({framework, canvas, GLctx, computeCtx, isWebgl2, orientation, videoWidth, videoHeight, canvasWidth, canvasHeight, status, stream, video, version, imageTargets, config})`

## Beschreibung {#description}

`onAttach()` wird aufgerufen, bevor ein Modul zum ersten Mal Rahmenaktualisierungen erhält. Sie wird für Module aufgerufen, die entweder vor oder nach der Ausführung der Pipeline hinzugefügt wurden. Sie enthält die neuesten verfügbaren Daten von:

* [`onStart()`](./onstart.md)
* [`onDeviceOrientationChange()`](./ondeviceorientationchange.md)
* [`onCanvasSizeChange()`](./oncanvassizechange.md)
* [`onVideoSizeChange()`](./onvideosizechange.md)
* [`onCameraStatusChange()`](./oncamerastatuschange.md)
* [`onAppResourcesLoaded()`](./onappresourcesloaded.md)

## Parameter {#parameters}

| Parameter               | Beschreibung                                                                                                               |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| framework               | Die Framework-Bindungen für dieses Modul zum Versenden von Ereignissen.                                                    |
| canvas                  | Die Leinwand, die die GPU-Verarbeitung und die Benutzeranzeige unterstützt.                                                |
| GLctx                   | Der `WebGLRenderingContext` oder `WebGL2RenderingContext` der Zeichenfläche.                                               |
| computeCtx              | Der `WebGLRenderingContext` oder `WebGL2RenderingContext` des Compute Canvas.                                              |
| isWebgl2                | Wahr, wenn `GLctx` ein `WebGL2RenderingContext` ist.                                                                       |
| orientierung            | Die Drehung der Benutzeroberfläche gegenüber dem Hochformat, in Grad (-90, 0, 90, 180).                                    |
| videoWidth              | Die Höhe des Kamerafeeds in Pixeln.                                                                                        |
| videoHeight             | Die Höhe des Kamerafeeds in Pixeln.                                                                                        |
| canvasWidth             | Die Breite der `GLctx` Leinwand in Pixeln.                                                                                 |
| canvasHeight            | Die Höhe der `GLctx` Leinwand in Pixeln.                                                                                   |
| status                  | Eine von [ `'requesting'`, `'hasStream'`, `'hasVideo'`, `'failed'` ]                                                       |
| stream                  | Der [`MediaStream`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) , der mit dem Kamera-Feed verbunden ist. |
| video                   | Das Video-Dom-Element, das den Stream anzeigt.                                                                             |
| version [Optional]      | Die Engine-Version, z.B. 14.0.8.949, wenn App-Ressourcen geladen sind.                                                     |
| imageTargets [Optional] | Ein Array von Bildzielen mit den Feldern `{imagePath, metadata, name}`                                                     |
| config                  | Die Konfigurationsparameter, die an [`XR8.run()`](/api/xr8/run) übergeben wurden.                                          |
