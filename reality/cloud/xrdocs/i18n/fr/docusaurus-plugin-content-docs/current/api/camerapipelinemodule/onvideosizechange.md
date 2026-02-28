# onVideoSizeChange()

`onVideoSizeChange : ({ GLctx, computeCtx, videoWidth, videoHeight, canvasWidth, canvasHeight, orientation })`

## Description {#description}

`onVideoSizeChange()` est appelé lorsque le support change de taille. Appelé avec les dimensions de la vidéo et du support ainsi que l'orientation de l'appareil.

## Paramètres {#parameters}

| Paramètres          | Description                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| GLctx               | `WebGLRenderingContext` ou `WebGL2RenderingContext`.                                            |
| calculerCtx         | Le contexte de rendu de la toile de calcul `WebGLRenderingContext` ou `WebGL2RenderingContext`. |
| largeur de la vidéo | Largeur du flux de la caméra, en pixels.                                                        |
| hauteur de la vidéo | Hauteur du flux de la caméra, en pixels.                                                        |
| largeur du support  | La largeur du support `GLctx` , en pixels.                                                      |
| hauteur du support  | La hauteur du support `GLctx` , en pixels.                                                      |
| l'orientation       | La rotation de l'interface utilisateur par rapport au portrait, en degrés (-90, 0, 90, 180).    |

## Exemple {#example}

```javascript
XR8.addCameraPipelineModule({
  name : 'mycamerapipelinemodule',
  onVideoSizeChange : ({ GLctx, videoWidth, videoHeight, canvasWidth, canvasHeight }) => {
    myHandleResize({ GLctx, videoWidth, videoHeight, canvasWidth, canvasHeight })
  },
})
```
