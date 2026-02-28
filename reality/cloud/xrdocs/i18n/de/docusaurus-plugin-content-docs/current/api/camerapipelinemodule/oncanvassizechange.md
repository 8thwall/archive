# onCanvasSizeChange()

`onCanvasSizeChange: ({ GLctx, computeCtx, videoWidth, videoHeight, canvasWidth, canvasHeight })`

## Beschreibung {#description}

`onCanvasSizeChange()` wird aufgerufen, wenn sich die Größe der Leinwand ändert. Aufgerufen mit den Abmessungen von Video und Leinwand.

## Parameter {#parameters}

| Parameter    | Beschreibung                                                                  |
| ------------ | ----------------------------------------------------------------------------- |
| GLctx        | Der `WebGLRenderingContext` oder `WebGL2RenderingContext` der Zeichenfläche.  |
| computeCtx   | Der `WebGLRenderingContext` oder `WebGL2RenderingContext` des Compute Canvas. |
| videoWidth   | Die Breite des Kamerafeeds in Pixeln.                                         |
| videoHeight  | Die Höhe des Kamerafeeds in Pixeln.                                           |
| canvasWidth  | Die Breite der `GLctx` Leinwand in Pixeln.                                    |
| canvasHeight | Die Höhe der `GLctx` Leinwand in Pixeln.                                      |

## Beispiel {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onCanvasSizeChange: ({ GLctx, videoWidth, videoHeight, canvasWidth, canvasHeight }) => {
    myHandleResize({ GLctx, videoWidth, videoHeight, canvasWidth, canvasHeight })
  },
})
```
