# onStart()

`onStart : ({ canvas, GLctx, computeCtx, isWebgl2, orientation, videoWidth, videoHeight, canvasWidth, canvasHeight, config }) `

## Description {#description}

`onStart()` est appelé au démarrage du XR.

## Paramètres {#parameters}

| Paramètres          | Description                                                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| toile               | Le canevas qui soutient le traitement du GPU et l'affichage de l'utilisateur.                                   |
| GLctx               | Le `WebGLRenderingContext` ou `WebGL2RenderingContext` du canevas de dessin.                                    |
| calculerCtx         | Le `WebGLRenderingContext` ou `WebGL2RenderingContext` du canevas de calcul.                                    |
| estWebgl2           | True si `GLctx` est un `WebGL2RenderingContext`.                                                                |
| l'orientation       | La rotation de l'interface utilisateur par rapport au portrait, en degrés (-90, 0, 90, 180). |
| largeur de la vidéo | Largeur du flux de la caméra, en pixels.                                                                        |
| hauteur de la vidéo | Hauteur du flux de la caméra, en pixels.                                                                        |
| Largeur du canevas  | La largeur du canevas `GLctx`, en pixels.                                                                       |
| Hauteur du canevas  | La hauteur du canevas `GLctx`, en pixels.                                                                       |
| config              | Les paramètres de configuration passés à [`XR8.run()`](/legacy/api/xr8/run).                                    |

## Exemple {#example}

```javascript
XR8.addCameraPipelineModule({
  name : 'mycamerapipelinemodule',
  onStart : ({canvasWidth, canvasHeight}) => {
    // Obtenir la scène three.js. Celle-ci a été créée par XR8.Threejs.pipelineModule().onStart(). La
    // raison pour laquelle nous pouvons y accéder maintenant est que 'mycamerapipelinemodule' a été installé après
    // XR8.Threejs.pipelineModule().
    const {scene, camera} = XR8.Threejs.xrScene()

    // Ajouter quelques objets à la scène et définir la position initiale de la caméra.
    myInitXrScene({scene, camera})

    // Synchroniser la position 6DoF du contrôleur XR et les paramètres de la caméra avec notre scène.
    XR8.XrController.updateCameraProjectionMatrix({
      origin: camera.position,
      facing: camera.quaternion,
    })
  },
})
```
