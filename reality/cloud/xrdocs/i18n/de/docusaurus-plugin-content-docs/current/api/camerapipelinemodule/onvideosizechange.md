# onVideoSizeChange()

`onVideoSizeChange: ({ GLctx, computeCtx, videoWidth, videoHeight, canvasWidth, canvasHeight, orientation })`

## Beschreibung {#description}

`onVideoSizeChange()` wird aufgerufen, wenn sich die Größe der Leinwand ändert. Aufgerufen mit den Abmessungen von Video und Leinwand sowie der Geräteausrichtung.

## Parameter {#parameters}

| Parameter    | Beschreibung                                                                            |
| ------------ | --------------------------------------------------------------------------------------- |
| GLctx        | Der `WebGLRenderingContext` oder `WebGL2RenderingContext` der Zeichenfläche.            |
| computeCtx   | Der `WebGLRenderingContext` oder `WebGL2RenderingContext` des Compute Canvas.           |
| videoWidth   | Die Breite des Kamerafeeds in Pixeln.                                                   |
| videoHeight  | Die Höhe des Kamerafeeds in Pixeln.                                                     |
| canvasWidth  | Die Breite der `GLctx` Leinwand in Pixeln.                                              |
| canvasHeight | Die Höhe der `GLctx` Leinwand in Pixeln.                                                |
| orientierung | Die Drehung der Benutzeroberfläche gegenüber dem Hochformat, in Grad (-90, 0, 90, 180). |

## Beispiel {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onVideoSizeChange: ({ GLctx, videoWidth, videoHeight, canvasWidth, canvasHeight }) => {
    myHandleResize({ GLctx, videoWidth, videoHeight, canvasWidth, canvasHeight })
  },
})
```
