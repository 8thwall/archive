# onCanvasSizeChange()

`onCanvasSizeChange : ({ GLctx, computeCtx, videoWidth, videoHeight, canvasWidth, canvasHeight })`

## Description {#description}

`onCanvasSizeChange()` est appelé lorsque le canevas change de taille. Appelé avec les dimensions de la vidéo et de la toile.

## Paramètres {#parameters}

| Paramètres          | Description                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------------- |
| GLctx               | Le `WebGLRenderingContext` ou `WebGL2RenderingContext` du canevas de dessin. |
| calculerCtx         | Le `WebGLRenderingContext` ou `WebGL2RenderingContext` du canevas de calcul. |
| largeur de la vidéo | Largeur du flux de la caméra, en pixels.                                     |
| hauteur de la vidéo | Hauteur du flux de la caméra, en pixels.                                     |
| Largeur du canevas  | La largeur du canevas `GLctx`, en pixels.                                    |
| Hauteur du canevas  | La hauteur du canevas `GLctx`, en pixels.                                    |

## Exemple {#example}

```javascript
XR8.addCameraPipelineModule({
  name : 'mycamerapipelinemodule',
  onCanvasSizeChange : ({ GLctx, videoWidth, videoHeight, canvasWidth, canvasHeight }) => {
    myHandleResize({ GLctx, videoWidth, videoHeight, canvasWidth, canvasHeight })
  },
})
```
