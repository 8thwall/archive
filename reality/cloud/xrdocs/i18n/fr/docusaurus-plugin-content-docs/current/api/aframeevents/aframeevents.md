# Événements AFrame

Cette section décrit les événements émis par les composants `xrweb`, `xrface` et `xrhand` A-Frame.

Vous pouvez écouter ces événements dans votre application web pour appeler une fonction qui gère l'événement.

## Événements émis par [`xrconfig`](/api/aframe/#configuring-the-camera) {#events-emitted}

Les événements suivants sont émis par `xrconfig` (qui est automatiquement ajouté si vous n'utilisez que `xrweb`, `xrface`, `xrhand` ou `xrlayers`) :

| Événement émis                                          | Description                                                                                                                                                                                                                                                                           |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [changement d'état de la caméra](camerastatuschange.md) | Cet événement est émis lorsque l'état de la caméra change. Voir [`onCameraStatusChange`](/api/camerapipelinemodule/oncamerastatuschange) from [`XR8.addCameraPipelineModule()`](/api/xr8/addcamerapipelinemodule) pour plus d'informations sur les états possibles.                   |
| [erreur de réalité](realityerror.md)                    | Cet événement est émis lorsqu'une erreur s'est produite lors de l'initialisation de 8th Wall Web. Il s'agit du délai recommandé pour l'affichage des messages d'erreur. L'API [`XR8.XrDevice()` ](/api/xrdevice) peut vous aider à déterminer le type de message d'erreur à afficher. |
| [prêt pour la réalité](realityready.md)                 | Cet événement est émis lorsque 8th Wall Web a été initialisé et qu'au moins une image a été traitée avec succès. Il s'agit du délai recommandé pour masquer les éléments de chargement.                                                                                               |
| [erreur d'écran](screenshoterror.md)                    | Cet événement est émis en réponse à l'événement [`screenshotrequest`](/api/aframeeventlisenters/screenshotrequest) qui aboutit à une erreur.                                                                                                                                          |
| [capture d'écran](screenshotready.md)                   | Cet événement est émis en réponse à l'événement [`screenshotrequest`](/api/aframeeventlisenters/screenshotrequest) qui s'est terminé avec succès. L'image compressée JPEG du support AFrame sera fournie.                                                                             |

## Événements émis par [`xrweb`](/api/aframe/#world-tracking-image-targets-andor-lightship-vps) {#events-emitted-by-xrweb}

| Événement émis                                          | Description                                                                                                                              |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| [xrimageloading](xrimageloading.md)                     | Cet événement est émis lorsque le chargement de l'image détectée commence.                                                               |
| [xrimagescanning](xrimagescanning.md)                   | Cet événement est émis lorsque toutes les images détectées ont été chargées et que le scan a commencé.                                   |
| [xrimagefound](xrimagefound.md)                         | Cet événement est émis lorsqu'une image cible est trouvée pour la première fois.                                                         |
| [xrimageupdated](xrimageupdated.md)                     | Cet événement est émis lorsqu'une image cible change de position, de rotation ou d'échelle.                                              |
| [xrimagelost](xrimagelost.md)                           | Cet événement est émis lorsqu'une image cible n'est plus suivie.                                                                         |
| [xrmeshfound](xrmeshfound.md)                           | Cet événement est émis lorsqu'un maillage est trouvé pour la première fois, soit après le démarrage, soit après un recentrage().         |
| [xrmeshupdated](xrmeshupdated.md)                       | Cet événement est émis lorsque la**première maille** trouvée change de position ou de rotation.                                          |
| [xrmeshlost](xrmeshlost.md)                             | Cet événement est émis lorsque `recenter()` est appelé.                                                                                  |
| [xrprojectwayspotscanning](xrprojectwayspotscanning.md) | Cet événement est émis lorsque tous les Wayspots du projet ont été chargés pour être scannés.                                            |
| [xrprojectwayspotfound](xrprojectwayspotfound.md)       | Cet événement est émis lorsqu'un wayspot du projet est trouvé pour la première fois.                                                     |
| [xrprojectwayspotupdated](xrprojectwayspotupdated.md)   | Cet événement est émis lorsqu'un projet Wayspot change de position ou de rotation.                                                       |
| [xrprojectwayspotlost](xrprojectwayspotlost.md)         | Cet événement est émis lorsqu'un projet Wayspot n'est plus suivi.                                                                        |
| [xrtrackingstatus](xrtrackingstatus.md)                 | Cet événement est émis lorsque [`XR8.XrController`](/api/xrcontroller) démarre et à chaque fois que l'état ou la raison du suivi change. |

## Événements émis par [`xrface`](/api/aframe/#face-effects) {#events-emitted-by-xrface}

| Événement émis                                          | Description                                                                                                                                         |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| [xrfaceloading](xrfaceloading.md)                       | Cet événement est émis lorsque le chargement commence pour des ressources face AR supplémentaires.                                                  |
| [xrfacescanning](xrfacescanning.md)                     | Cet événement est émis lorsque les ressources AR ont été chargées et que le scan a commencé.                                                        |
| [xrfacefound](xrfacefound.md)                           | Cet événement est émis lorsqu'un visage est trouvé pour la première fois.                                                                           |
| [xrfaceupdated](xrfaceupdated.md)                       | Cet événement est émis lorsque le visage est trouvé par la suite.                                                                                   |
| [xrfacelost](xrfacelost.md)                             | Cet événement est émis lorsqu'un visage n'est plus suivi.                                                                                           |
| [xrmouthopened](xrmouthopened.md)                       | Cet événement est émis lorsque la bouche d'un visage suivi s'ouvre.                                                                                 |
| [xrmouthclosed](xrmouthclosed.md)                       | Cet événement est émis lorsque la bouche d'un visage suivi se ferme.                                                                                |
| [xrlefteyeopened](xrlefteyeopened.md)                   | Cet événement est émis lorsque l'œil gauche d'un visage suivi s'ouvre.                                                                              |
| [xrlefteyeclosed](xrlefteyeclosed.md)                   | Cet événement est émis lorsque l'œil gauche d'un visage suivi se ferme.                                                                             |
| [xrrighteyeopened](xrrighteyeopened.md)                 | Cet événement est émis lorsque l'œil droit d'un visage suivi s'ouvre.                                                                               |
| [xrrighteyeclosed](xrrighteyeclosed.md)                 | Cet événement est émis lorsque l'œil droit d'un visage suivi se ferme.                                                                              |
| [xrlefteyebrowraised](xrlefteyebrowraised.md)           | Cet événement se produit lorsque le sourcil gauche d'un visage suivi est relevé par rapport à sa position initiale lorsque le visage a été trouvé.  |
| [xrlefteyebrowlowered](xrlefteyebrowlowered.md)         | Cet événement est émis lorsque le sourcil gauche d'un visage suivi est abaissé à sa position initiale lorsque le visage a été trouvé.               |
| [xrrighteyebrowraised](xrrighteyebrowraised.md)         | Cet événement se produit lorsque le sourcil droit d'un visage suivi est relevé par rapport à sa position initiale lorsque le visage a été trouvé.   |
| [xrrighteyebrowlowered](xrrighteyebrowlowered.md)       | Cet événement est émis lorsque le sourcil droit d'un visage suivi est abaissé à sa position initiale lorsque le visage a été trouvé.                |
| [xrlefteyewinked](xrlefteyewinked.md)                   | Cet événement est émis lorsque l'œil gauche d'un visage suivi se ferme et s'ouvre dans un délai de 750 ms alors que l'œil droit reste ouvert.       |
| [xrrighteyewinked](xrrighteyewinked.md)                 | Cet événement est émis lorsque l'œil droit d'un visage suivi se ferme et s'ouvre dans un délai de 750 ms alors que l'œil gauche reste ouvert.       |
| [xrblinked](xrblinked.md)                               | Cet événement est émis lorsque les yeux d'un visage suivi clignotent.                                                                               |
| [xrinterpupillarydistance](xrinterpupillarydistance.md) | Cet événement est émis lorsque la distance en millimètres entre les centres de chaque pupille d'un visage suivi est détectée pour la première fois. |

## Événements émis par [`xrhand`](/api/aframe/#hand-tracking) {#events-emitted-by-xrhand}

| Événement émis                      | Description                                                                                        |
| ----------------------------------- | -------------------------------------------------------------------------------------------------- |
| [xrhandloading](xrhandloading.md)   | Cet événement est émis lorsque le chargement commence pour les ressources Hand AR supplémentaires. |
| [xrhandscanning](xrhandscanning.md) | Cet événement est émis lorsque les ressources AR ont été chargées et que le scan a commencé.       |
| [xrhandfound](xrhandfound.md)       | Cet événement est émis lorsqu'une main est trouvée pour la première fois.                          |
| [xrhandupdated](xrhandupdated.md)   | Cet événement est émis lorsque la main est retrouvée par la suite.                                 |
| [xrhandlost](xrhandlost.md)         | Cet événement est émis lorsqu'une main n'est plus suivie.                                          |
