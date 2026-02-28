# onVideoSizeChange()

onVideoSizeChange: ({ GLctx, computeCtx, videoWidth, videoHeight, canvasWidth, canvasHeight, orientation })\\`

## Beschreibung {#description}

Die Funktion "onVideoSizeChange()" wird aufgerufen, wenn sich die Größe der Leinwand ändert. Aufgerufen mit den Abmessungen von Video und Leinwand sowie der Geräteausrichtung.

## Parameter {#parameters}

| Parameter    | Beschreibung                                                                                                               |
| ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| GLctx        | Der `WebGLRenderingContext` oder `WebGL2RenderingContext` der Zeichenfläche.                               |
| computeCtx   | Der `WebGLRenderingContext` oder `WebGL2RenderingContext` der Rechenleinwand.                              |
| videoBreite  | Die Breite des Kamerafeeds in Pixeln.                                                                      |
| videoHöhe    | Die Höhe der Kameraübertragung in Pixeln.                                                                  |
| canvasWidth  | Die Breite der \\`GLctx'-Leinwand, in Pixeln.                                                             |
| LeinwandHöhe | Die Höhe der \\`GLctx'-Leinwand, in Pixeln.                                                               |
| Orientierung | Die Drehung der Benutzeroberfläche gegenüber dem Hochformat, in Grad (-90, 0, 90, 180). |

## Beispiel {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onVideoSizeChange: ({ GLctx, videoWidth, videoHeight, canvasWidth, canvasHeight }) => {
    myHandleResize({ GLctx, videoWidth, videoHeight, canvasWidth, canvasHeight })
  },
})
```
