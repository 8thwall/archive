# onDeviceOrientationChange()

`onDeviceOrientationChange : ({ GLctx, computeCtx, videoWidth, videoHeight, orientation })`

## Description {#description}

`onDeviceOrientationChange()` est appelé lorsque l'appareil change d'orientation (paysage/portrait).

## Paramètres {#parameters}

| Paramètres          | Description                                                                                    |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| GLctx               | `WebGLRenderingContext` ou `WebGL2RenderingContext`.                                           |
| calculerCtx         | Le contexte de rendu du support de calcul `WebGLRenderingContext` ou `WebGL2RenderingContext`. |
| largeur de la vidéo | Largeur du flux de la caméra, en pixels.                                                       |
| hauteur de la vidéo | Hauteur du flux de la caméra, en pixels.                                                       |
| l'orientation       | La rotation de l'interface utilisateur par rapport au portrait, en degrés (-90, 0, 90, 180).   |

## Exemple {#example}

```javascript
XR8.addCameraPipelineModule({
  name : 'mycamerapipelinemodule',
  onDeviceOrientationChange : ({ GLctx, videoWidth, videoHeight, orientation }) => {
    // handleResize({ GLctx, videoWidth, videoHeight, orientation })
  },
})
```
