# onVideoSizeChange()

`onVideoSizeChange : ({ GLctx, computeCtx, videoWidth, videoHeight, canvasWidth, canvasHeight, orientation })`

## Description {#description}

`onVideoSizeChange()` est appelé lorsque le canevas change de taille. Appelé avec les dimensions de la vidéo et de la toile ainsi que l'orientation de l'appareil.

## Paramètres {#parameters}

| Paramètres          | Description                                                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| GLctx               | Le `WebGLRenderingContext` ou `WebGL2RenderingContext` du canevas de dessin.                                    |
| calculerCtx         | Le `WebGLRenderingContext` ou `WebGL2RenderingContext` du canevas de calcul.                                    |
| largeur de la vidéo | Largeur du flux de la caméra, en pixels.                                                                        |
| hauteur de la vidéo | Hauteur du flux de la caméra, en pixels.                                                                        |
| Largeur du canevas  | La largeur du canevas `GLctx`, en pixels.                                                                       |
| Hauteur du canevas  | La hauteur du canevas `GLctx`, en pixels.                                                                       |
| l'orientation       | La rotation de l'interface utilisateur par rapport au portrait, en degrés (-90, 0, 90, 180). |

## Exemple {#example}

```javascript
XR8.addCameraPipelineModule({
  name : 'mycamerapipelinemodule',
  onVideoSizeChange : ({ GLctx, videoWidth, videoHeight, canvasWidth, canvasHeight }) => {
    myHandleResize({ GLctx, videoWidth, videoHeight, canvasWidth, canvasHeight })
  },
})
```
