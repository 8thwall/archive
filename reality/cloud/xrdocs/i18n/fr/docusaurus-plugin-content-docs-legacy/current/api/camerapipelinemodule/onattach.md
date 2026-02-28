# onAttach()

`onAttach : ({framework, canvas, GLctx, computeCtx, isWebgl2, orientation, videoWidth, videoHeight, canvasWidth, canvasHeight, status, stream, video, version, imageTargets, config})`

## Description {#description}

`onAttach()` est appelé avant la première fois qu'un module reçoit des mises à jour de trame. Il est appelé sur les modules qui ont été ajoutés avant ou après l'exécution du pipeline. Il comprend toutes les données les plus récentes disponibles :

- [`onStart()`](./onstart.md)
- [`onDeviceOrientationChange()`](./ondeviceorientationchange.md)
- [`onCanvasSizeChange()`](./oncanvassizechange.md)
- [`onVideoSizeChange()`](./onvideosizechange.md)
- [`onCameraStatusChange()`](./oncamerastatuschange.md)
- [`onAppResourcesLoaded()`](./onappresourcesloaded.md)

## Paramètres {#parameters}

| Paramètres                                                                    | Description                                                                                                                                                     |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cadre                                                                         | Les liaisons de ce module avec le cadre pour l'envoi d'événements.                                                                              |
| toile                                                                         | Le canevas qui soutient le traitement du GPU et l'affichage de l'utilisateur.                                                                   |
| GLctx                                                                         | Le `WebGLRenderingContext` ou `WebGL2RenderingContext` du canevas de dessin.                                                                    |
| calculerCtx                                                                   | Le `WebGLRenderingContext` ou `WebGL2RenderingContext` du canevas de calcul.                                                                    |
| estWebgl2                                                                     | True si `GLctx` est un `WebGL2RenderingContext`.                                                                                                |
| l'orientation                                                                 | La rotation de l'interface utilisateur par rapport au portrait, en degrés (-90, 0, 90, 180).                                 |
| largeur de la vidéo                                                           | Largeur du flux de la caméra, en pixels.                                                                                                        |
| hauteur de la vidéo                                                           | Hauteur du flux de la caméra, en pixels.                                                                                                        |
| Largeur du canevas                                                            | La largeur du canevas `GLctx`, en pixels.                                                                                                       |
| Hauteur du canevas                                                            | La hauteur du canevas `GLctx`, en pixels.                                                                                                       |
| statut                                                                        | Un parmi [ `'requesting'`, `'hasStream'`, `'hasVideo'`, `'failed'` ]                                        |
| flux                                                                          | Le [`MediaStream`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) associé au flux de la caméra.                                  |
| vidéo                                                                         | L'élément dom vidéo affichant le flux.                                                                                                          |
| version [Facultatif]      | La version du moteur, par exemple 14.0.8.949, si les ressources de l'application sont chargées. |
| imageTargets [Facultatif] | Un tableau de cibles d'images avec les champs `{imagePath, metadata, name}`                                                                                     |
| config                                                                        | Les paramètres de configuration passés à [`XR8.run()`](/legacy/api/xr8/run).                                                                    |
