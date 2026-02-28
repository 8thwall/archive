# onDeviceOrientationChange()

`onDeviceOrientationChange: ({ GLctx, computeCtx, videoWidth, videoHeight, orientation })`

## Beschreibung {#description}

Die Funktion "onDeviceOrientationChange()" wird aufgerufen, wenn das Gerät die Ausrichtung im Quer- oder Hochformat ändert.

## Parameter {#parameters}

| Parameter    | Beschreibung                                                                                                               |
| ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| GLctx        | Der `WebGLRenderingContext` oder `WebGL2RenderingContext` der Zeichenfläche.                               |
| computeCtx   | Der `WebGLRenderingContext` oder `WebGL2RenderingContext` der Rechenleinwand.                              |
| videoBreite  | Die Breite des Kamerafeeds in Pixeln.                                                                      |
| videoHöhe    | Die Höhe der Kameraübertragung in Pixeln.                                                                  |
| Orientierung | Die Drehung der Benutzeroberfläche gegenüber dem Hochformat, in Grad (-90, 0, 90, 180). |

## Beispiel {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onDeviceOrientationChange: ({ GLctx, videoWidth, videoHeight, orientation }) => {
    // handleResize({ GLctx, videoWidth, videoHeight, orientation })
  },
})
```
