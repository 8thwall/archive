# onStart()

`onStart: ({ canvas, GLctx, computeCtx, isWebgl2, orientation, videoWidth, videoHeight, canvasWidth, canvasHeight, config })`

## Beschreibung {#description}

`onStart()` wird aufgerufen, wenn XR startet.

## Parameter {#parameters}

| Parameter    | Beschreibung                                                                            |
| ------------ | --------------------------------------------------------------------------------------- |
| canvas       | Die Leinwand, die die GPU-Verarbeitung und die Benutzeranzeige unterstützt.             |
| GLctx        | Der `WebGLRenderingContext` oder `WebGL2RenderingContext` der Zeichenfläche.            |
| computeCtx   | Der `WebGLRenderingContext` oder `WebGL2RenderingContext` des Compute Canvas.           |
| isWebgl2     | Wahr, wenn `GLctx` ein `WebGL2RenderingContext` ist.                                    |
| orientierung | Die Drehung der Benutzeroberfläche gegenüber dem Hochformat, in Grad (-90, 0, 90, 180). |
| videoWidth   | Die Höhe des Kamerafeeds in Pixeln.                                                     |
| videoHeight  | Die Höhe des Kamerafeeds in Pixeln.                                                     |
| canvasWidth  | Die Breite der `GLctx` Leinwand in Pixeln.                                              |
| canvasHeight | Die Höhe der `GLctx` Leinwand in Pixeln.                                                |
| config       | Die Konfigurationsparameter, die an [`XR8.run()`](/api/xr8/run) übergeben wurden.       |

## Beispiel {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onStart: ({canvasWidth, canvasHeight}) => {
    // Holen Sie sich die three.js Szene. Dies wurde von XR8.Threejs.pipelineModule().onStart() erstellt. Der
    // Grund, warum wir hier jetzt darauf zugreifen können, ist, dass 'mycamerapipelinemodule' nach
    // XR8.Threejs.pipelineModule() installiert wurde.
    const {scene, camera} = XR8.Threejs.xrScene()

    // Fügen Sie der Szene einige Objekte hinzu und legen Sie die Startposition der Kamera fest.
    myInitXrScene({scene, camera})

    // Synchronisieren Sie die 6DoF-Position und die Kameraparameter des XR-Controllers mit unserer Szene.
    XR8.XrController.updateCameraProjectionMatrix({
      origin: camera.position,
      facing: camera.quaternion,
    })
  },
})
```
