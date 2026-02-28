# onAttach()

onAttach: ({framework, canvas, GLctx, computeCtx, isWebgl2, orientation, videoWidth, videoHeight, canvasWidth, canvasHeight, status, stream, video, version, imageTargets, config})\\`

## Beschreibung {#description}

onAttach()" wird aufgerufen, bevor ein Modul zum ersten Mal Rahmenaktualisierungen erhält. Sie wird für Module aufgerufen, die entweder vor oder nach der Ausführung der Pipeline hinzugefügt wurden. Sie enthält die aktuellsten verfügbaren Daten aus:

- [OnStart()\\`](./onstart.md)
- [`beiGeräteorientierungsänderung()`](./ondeviceorientationchange.md)
- [onCanvasSizeChange()\\`](./oncanvassizechange.md)
- [`onVideoSizeChange()`](./onvideosizechange.md)
- [BeiKameraStatusÄnderung()\\`](./oncamerastatuschange.md)
- [`onAppResourcesLoaded()`](./onappresourcesloaded.md)

## Parameter {#parameters}

| Parameter                                                                   | Beschreibung                                                                                                                                                            |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rahmenwerk                                                                  | Die Framework-Bindings für dieses Modul zum Versenden von Ereignissen.                                                                                  |
| Leinwand                                                                    | Die Leinwand, die die GPU-Verarbeitung und die Benutzeranzeige unterstützt.                                                                             |
| GLctx                                                                       | Der `WebGLRenderingContext` oder `WebGL2RenderingContext` der Zeichenfläche.                                                                            |
| computeCtx                                                                  | Der `WebGLRenderingContext` oder `WebGL2RenderingContext` der Rechenleinwand.                                                                           |
| isWebgl2                                                                    | Wahr, wenn `GLctx` ein `WebGL2RenderingContext` ist.                                                                                                    |
| Orientierung                                                                | Die Drehung der Benutzeroberfläche gegenüber dem Hochformat, in Grad (-90, 0, 90, 180).                                              |
| videoBreite                                                                 | Die Breite des Kamerafeeds in Pixeln.                                                                                                                   |
| videoHöhe                                                                   | Die Höhe der Kameraübertragung in Pixeln.                                                                                                               |
| canvasWidth                                                                 | Die Breite der \\`GLctx'-Leinwand, in Pixeln.                                                                                                          |
| LeinwandHöhe                                                                | Die Höhe der \\`GLctx'-Leinwand, in Pixeln.                                                                                                            |
| Status                                                                      | Eine von [ `'requesting'`, `'hasStream'`, `'hasVideo'`, `'failed'` ]                                                |
| Strom                                                                       | Der [`MediaStream`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream), der mit der Kameraübertragung verbunden ist.                         |
| Video                                                                       | Das Video-Dom-Element, das den Stream anzeigt.                                                                                                          |
| Version [Optional]      | Die Engine-Version, z. B. 14.0.8.949, wenn App-Ressourcen geladen sind. |
| imageTargets [Optional] | Ein Array von Bildzielen mit den Feldern `{imagePath, metadata, name}`                                                                                                  |
| Konfiguration                                                               | Die Konfigurationsparameter, die an [`XR8.run()`](/api/engine/xr8) übergeben wurden.                                                                    |
