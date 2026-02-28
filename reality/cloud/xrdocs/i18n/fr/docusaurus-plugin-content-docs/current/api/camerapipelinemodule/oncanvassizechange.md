# onCanvasSizeChange()

`onCanvasSizeChange : ({ GLctx, computeCtx, videoWidth, videoHeight, canvasWidth, canvasHeight })`

## Description {#description}

`onCanvasSizeChange()` est appelé lorsque la taille du support change. Appelé avec les dimensions de la vidéo et du support.

## Paramètres {#parameters}

| Paramètres          | Description                                                                                    |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| GLctx               | `WebGLRenderingContext` ou `WebGL2RenderingContext`.                                           |
| calculerCtx         | Le contexte de rendu du support de calcul `WebGLRenderingContext` ou `WebGL2RenderingContext`. |
| largeur de la vidéo | Largeur du flux de la caméra, en pixels.                                                       |
| hauteur de la vidéo | Hauteur du flux de la caméra, en pixels.                                                       |
| largeur du support  | La largeur du support `GLctx` , en pixels.                                                     |
| hauteur du support  | La hauteur du support `GLctx` , en pixels.                                                     |

## Exemple {#example}

```javascript
XR8.addCameraPipelineModule({
  name : 'mycamerapipelinemodule',
  onCanvasSizeChange : ({ GLctx, videoWidth, videoHeight, canvasWidth, canvasHeight }) => {
    myHandleResize({ GLctx, videoWidth, videoHeight, canvasWidth, canvasHeight })
  },
})
```
