# Événements PlayCanvas

Cette section décrit les événements déclenchés par 8th Wall dans un environnement PlayCanvas.

Vous pouvez écouter ces événements dans votre application web.

## Événements émis {#events-emitted}

| Événement émis                                   | Description                                                                                                                                                                                                                                                                           |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [xr:camerastatuschange](xrcamerastatuschange.md) | Cet événement est émis lorsque l'état de la caméra change. Voir [`onCameraStatusChange`](/api/camerapipelinemodule/oncamerastatuschange) from [`XR8.addCameraPipelineModule()`](/api/xr8/addcamerapipelinemodule) pour plus d'informations sur les états possibles.                   |
| [xr:erreur de réalité](xrrealityerror.md)        | Cet événement est émis lorsqu'une erreur s'est produite lors de l'initialisation de 8th Wall Web. Il s'agit du délai recommandé pour l'affichage des messages d'erreur. L'API [`XR8.XrDevice()` ](/api/xrdevice) peut vous aider à déterminer le type de message d'erreur à afficher. |
| [xr:realityready](xrrealityready.md)             | Cet événement est émis lorsque 8th Wall Web a été initialisé et qu'au moins une image a été traitée avec succès. Il s'agit du délai recommandé pour masquer les éléments de chargement.                                                                                               |
| [xr:screenshoterror](xrscreenshoterror.md)       | Cet événement est émis en réponse à la demande de capture d'écran [``](/api/aframeeventlisenters/screenshotrequest) qui aboutit à une erreur.                                                                                                                                         |
| [xr:screenshotready](xrscreenshotready.md)       | Cet événement est émis en réponse à l'événement [`screenshotrequest`](/api/aframeeventlisenters/screenshotrequest) qui s'est terminé avec succès. L'image compressée JPEG du support AFrame sera fournie.                                                                             |

## Événements émis par XR8.XrController {#xrcontroller-events-emitted}

Lorsque `XR8.XrController.pipelineModule()` est ajouté en le passant dans `extraModules` à `XR8.PlayCanvas.run()` ces événements sont émis :

| Événement émis                                           | Description                                                                                                                      |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [xr:imageloading](playcanvas-image-target-events.md)     | Cet événement est émis lorsque le chargement de l'image détectée commence.                                                       |
| [xr:imagescanning](playcanvas-image-target-events.md)    | Cet événement est émis lorsque toutes les images détectées ont été chargées et que le scan a commencé.                           |
| [xr:imagefound](playcanvas-image-target-events.md)       | Cet événement est émis lorsqu'une image cible est trouvée pour la première fois.                                                 |
| [xr:imageupdated](playcanvas-image-target-events.md)     | Cet événement est émis lorsqu'une image cible change de position, de rotation ou d'échelle.                                      |
| [xr:imagelost](playcanvas-image-target-events.md)        | Cet événement est émis lorsqu'une image cible n'est plus suivie.                                                                 |
| [xr:meshfound](xrmeshfound.md)                           | Cet événement est émis lorsqu'un maillage est trouvé pour la première fois, soit après le démarrage, soit après un recentrage(). |
| [xr:meshupdated](xrmeshupdated.md)                       | Cet événement est émis lorsque la**première maille** trouvée change de position ou de rotation.                                  |
| [xr:meshlost](xrmeshlost.md)                             | Cet événement est émis lorsque `recenter()` est appelé.                                                                          |
| [xr:projectwayspotscanning](xrprojectwayspotscanning.md) | Cet événement est émis lorsque tous les emplacements de projet ont été chargés pour la numérisation.                             |
| [xr:projectwayspotfound](xrprojectwayspotfound.md)       | Cet événement est émis lorsqu'un emplacement de projet est trouvé pour la première fois.                                         |
| [xr:projectwayspotupdated](xrprojectwayspotupdated.md)   | Cet événement est émis lorsqu'un emplacement de projet change de position ou de rotation.                                        |
| [xr:projectwayspotlost](xrprojectwayspotlost.md)         | Cet événement est émis lorsqu'un lieu de projet n'est plus suivi.                                                                |

## XR8.LayersController Événements émis {#layerscontroller-events-emitted}

Lorsque `XR8.LayersController.pipelineModule()` est ajouté en le passant dans `extraModules` à `XR8.PlayCanvas.run()` ces événements sont émis :

| Événement émis                               | Description                                                                                                                                                               |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [xr:layerloading](xrlayerloading.md)         | Se déclenche lorsque le chargement commence pour les ressources de segmentation des couches supplémentaires.                                                              |
| [xr:balayage de couches](xrlayerscanning.md) | Se déclenche lorsque toutes les ressources de segmentation des couches ont été chargées et que le scan a commencé. Un événement est envoyé par couche en cours d'analyse. |
| [xr:layerfound](xrlayerfound.md)             | Se déclenche lorsqu'une couche est trouvée pour la première fois.                                                                                                         |

## Événements émis par XR8.FaceController {#facecontroller-events-emitted}

Lorsque `XR8.FaceController.pipelineModule()` est ajouté en le passant dans `extraModules` à `XR8.PlayCanvas.run()` ces événements sont émis :

| Événement émis                                                   | Description                                                                                       |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [xr:faceloading](playcanvas-face-effects-events.md)              | Se déclenche lorsque le chargement commence pour les ressources supplémentaires de face AR.       |
| [xr:numérisation des visages](playcanvas-face-effects-events.md) | Se déclenche lorsque toutes les ressources AR de face ont été chargées et que le scan a commencé. |
| [xr:facefound](playcanvas-face-effects-events.md)                | Se déclenche lorsqu'un visage est trouvé pour la première fois.                                   |
| [xr:faceupdated](playcanvas-face-effects-events.md)              | Se déclenche lorsqu'un visage est trouvé par la suite.                                            |
| [xr:facelost](playcanvas-face-effects-events.md)                 | Se déclenche lorsqu'un visage n'est plus suivi.                                                   |

## Événements émis par XR8.HandController {#handcontroller-events-emitted}

Lorsque `XR8.HandController.pipelineModule()` est ajouté en le passant dans `extraModules` à `XR8.PlayCanvas.run()` ces événements sont émis :

| Événement émis                                             | Description                                                                                         |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [xr:chargement manuel](playcanvas-hand-tracking-events.md) | Se déclenche au début du chargement pour les ressources supplémentaires de l'AR manuel.             |
| [xr:handscanning](playcanvas-hand-tracking-events.md)      | Se déclenche lorsque toutes les ressources AR manuelles ont été chargées et que le scan a commencé. |
| [xr:handfound](playcanvas-hand-tracking-events.md)         | Se déclenche lorsqu'une main est trouvée pour la première fois.                                     |
| [xr:handupdated](playcanvas-hand-tracking-events.md)       | Se déclenche lorsqu'une main est trouvée par la suite.                                              |
| [xr:handlost](playcanvas-hand-tracking-events.md)          | Se déclenche lorsqu'une main n'est plus suivie.                                                     |
