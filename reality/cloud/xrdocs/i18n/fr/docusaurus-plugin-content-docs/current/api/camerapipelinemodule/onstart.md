# onStart()

`onStart : ({ canvas, GLctx, computeCtx, isWebgl2, orientation, videoWidth, videoHeight, canvasWidth, canvasHeight, config })`

## Description {#description}

`onStart()` est appelé lorsque le XR démarre.

## Paramètres {#parameters}

| Paramètres          | Description                                                                                    |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| support             | Le support qui soutient le traitement GPU et l'affichage utilisateur.                          |
| GLctx               | `WebGLRenderingContext` ou `WebGL2RenderingContext`.                                           |
| calculerCtx         | Le contexte de rendu du support de calcul `WebGLRenderingContext` ou `WebGL2RenderingContext`. |
| estWebgl2           | Vrai si `GLctx` est un `WebGL2RenderingContext`.                                               |
| l'orientation       | La rotation de l'interface utilisateur par rapport au portrait, en degrés (-90, 0, 90, 180).   |
| largeur de la vidéo | Hauteur du flux de la caméra, en pixels.                                                       |
| hauteur de la vidéo | Hauteur du flux de la caméra, en pixels.                                                       |
| largeur du support  | La largeur du support `GLctx` , en pixels.                                                     |
| hauteur du support  | La hauteur du support `GLctx` , en pixels.                                                     |
| config              | Les paramètres de configuration qui ont été transmis à [`XR8.run()`](/api/xr8/run).            |

## Exemple {#example}

```javascript
XR8.addCameraPipelineModule({
  name : 'mycamerapipelinemodule',
  onStart : ({canvasWidth, canvasHeight}) => {
    // Obtenez la scène three.js. Il a été créé par XR8.Threejs.pipelineModule().onStart(). La
    // raison pour laquelle nous pouvons y accéder maintenant est que 'mycamerapipelinemodule' a été installé après
    // XR8.Threejs.pipelineModule().
    const {scene, camera} = XR8.Threejs.xrScene()

    // Ajoutez quelques objets à la scène et définissez la position initiale de la caméra.
    myInitXrScene({scene, camera})

    // Synchronisez la position 6DoF du contrôleur xr et les paramètres de la caméra avec notre scène.
    XR8.XrController.updateCameraProjectionMatrix({
      origin : camera.position,
      facing : camera.quaternion,
    })
  },
})
```
