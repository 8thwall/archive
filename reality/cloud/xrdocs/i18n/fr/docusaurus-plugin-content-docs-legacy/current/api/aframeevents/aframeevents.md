# Événements AFrame

Cette section décrit les événements émis par les composants A-Frame `xrweb`, `xrface` et `xrhand`.

Vous pouvez écouter ces événements dans votre application web pour appeler une fonction qui gère l'événement.

## Événements émis par `xrconfig` {#events-emitted}

Les événements suivants sont émis par `xrconfig` (qui est automatiquement ajouté si vous n'utilisez que `xrweb`, `xrface`, `xrhand` ou `xrlayers`) :

| Événement émis                              | Description                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [camerastatuschange](camerastatuschange.md) | Cet événement est émis lorsque l'état de la caméra change. Voir [`onCameraStatusChange`](/legacy/api/camerapipelinemodule/oncamerastatuschange) de [`XR8.addCameraPipelineModule()`](/legacy/api/xr8/addcamerapipelinemodule) pour plus d'informations sur les statuts possibles.                                                                                              |
| [realityerror](realityerror.md)             | Cet événement est émis lorsqu'une erreur s'est produite lors de l'initialisation de 8th Wall Web. Il s'agit du délai recommandé pour l'affichage des messages d'erreur. L'API [`XR8.XrDevice()`] (/legacy/api/xrdevice) peut aider à déterminer le type de message d'erreur à afficher. |
| [realityready](realityready.md)             | Cet événement est émis lorsque 8th Wall Web a été initialisé et qu'au moins une image a été traitée avec succès. Il s'agit du délai recommandé pour masquer les éléments de chargement.                                                                                                                                                                                        |
| [screenshoterror](screenshoterror.md)       | Cet événement est émis en réponse à l'événement [`screenshotrequest`](/legacy/api/aframeeventlisenters/screenshotrequest) qui aboutit à une erreur.                                                                                                                                                                                                                                            |
| [screenshotready](screenshotready.md)       | Cet événement est émis en réponse à l'événement [`screenshotrequest`](/legacy/api/aframeeventlisenters/screenshotrequest) qui s'est terminé avec succès. L'image compressée JPEG de la toile AFrame sera fournie.                                                                                                                                                              |

## Événements émis par `xrweb` {#events-emitted-by-xrweb}

| Événement émis                                          | Description                                                                                                                                                         |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [xrimageloading](xrimageloading.md)                     | Cet événement est émis lorsque le chargement de l'image de détection commence.                                                                      |
| [xrimagescanning](xrimagescanning.md)                   | Cet événement est émis lorsque toutes les images de détection ont été chargées et que le balayage a commencé.                                       |
| [xrimagefound](xrimagefound.md)                         | Cet événement est émis lorsqu'une cible d'image est trouvée pour la première fois.                                                                  |
| [xrimageupdated](xrimageupdated.md)                     | Cet événement est émis lorsqu'une cible d'image change de position, de rotation ou d'échelle.                                                       |
| [xrimagelost](xrimagelost.md)                           | Cet événement est émis lorsqu'une cible d'image n'est plus suivie.                                                                                  |
| [xrmeshfound](xrmeshfound.md)                           | Cet événement est émis lorsqu'un maillage est trouvé pour la première fois, soit après le démarrage, soit après un recentrage(). |
| [xrmeshupdated](xrmeshupdated.md)                       | Cet événement est émis lorsque la **première** maille trouvée change de position ou de rotation.                                                    |
| [xrmeshlost](xrmeshlost.md)                             | Cet événement est émis lorsque la fonction `recenter()` est appelée.                                                                                |
| [xrprojectwayspotscanning](xrprojectwayspotscanning.md) | Cet événement est émis lorsque tous les Wayspots du projet ont été chargés pour être scannés.                                                       |
| [xrprojectwayspotfound](xrprojectwayspotfound.md)       | Cet événement est émis lorsqu'un projet Wayspot est trouvé pour la première fois.                                                                   |
| [xrprojectwayspotupdated](xrprojectwayspotupdated.md)   | Cet événement est émis lorsqu'un projet Wayspot change de position ou de rotation.                                                                  |
| [xrprojectwayspotlost](xrprojectwayspotlost.md)         | Cet événement est émis lorsqu'un projet Wayspot n'est plus suivi.                                                                                   |
| [xrtrackingstatus](xrtrackingstatus.md)                 | Cet événement est émis lorsque [`XR8.XrController`](/legacy/api/xrcontroller) démarre et à chaque fois que l'état ou la raison du suivi change.     |

## Événements émis par `xrface` {#events-emitted-by-xrface}

| Événement émis                                          | Description                                                                                                                                                         |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [xrfaceloading](xrfaceloading.md)                       | Cet événement est émis lorsque le chargement de ressources face AR supplémentaires commence.                                                        |
| [xrfacescanning](xrfacescanning.md)                     | Cet événement est émis lorsque les ressources AR ont été chargées et que le balayage a commencé.                                                    |
| [xrfacefound](xrfacefound.md)                           | Cet événement est émis lorsqu'un visage est trouvé pour la première fois.                                                                           |
| [xrfaceupdated](xrfaceupdated.md)                       | Cet événement est émis lorsque le visage est trouvé par la suite.                                                                                   |
| [xrfacelost](xrfacelost.md)                             | Cet événement est émis lorsqu'un visage n'est plus suivi.                                                                                           |
| [xrmouthopened](xrmouthopened.md)                       | Cet événement est émis lorsque la bouche d'un visage suivi s'ouvre.                                                                                 |
| [xrmouthclosed](xrmouthclosed.md)                       | Cet événement est émis lorsque la bouche d'un visage suivi se ferme.                                                                                |
| [xrlefteyeopened](xrlefteyeopened.md)                   | Cet événement est émis lorsque l'œil gauche d'un visage suivi s'ouvre.                                                                              |
| [xrlefteyeclosed](xrlefteyeclosed.md)                   | Cet événement est émis lorsque l'œil gauche d'un visage suivi se ferme.                                                                             |
| [xrrighteyeopened](xrrighteyeopened.md)                 | Cet événement est émis lorsque l'œil droit d'un visage suivi s'ouvre.                                                                               |
| [xrrighteyeclosed](xrrighteyeclosed.md)                 | Cet événement est émis lorsque l'œil droit d'un visage suivi se ferme.                                                                              |
| [xrlefteyebrowraised](xrlefteyebrowraised.md)           | Cet événement se produit lorsque le sourcil gauche d'un visage suivi est relevé par rapport à sa position initiale lors de la découverte du visage. |
| [xrlefteyebrowlowered](xrlefteyebrowlowered.md)         | Cet événement est émis lorsque le sourcil gauche d'un visage suivi est abaissé à sa position initiale lorsque le visage a été trouvé.               |
| [xrrighteyebrowraised](xrrighteyebrowraised.md)         | Cet événement est émis lorsque le sourcil droit d'un visage suivi est relevé par rapport à sa position initiale lorsque le visage a été trouvé.     |
| [xrrighteyebrowlowered](xrrighteyebrowlowered.md)       | Cet événement est émis lorsque le sourcil droit d'un visage suivi est abaissé à sa position initiale lorsque le visage a été trouvé.                |
| [xrlefteyewinked](xrlefteyewinked.md)                   | Cet événement est émis lorsque l'œil gauche d'un visage suivi se ferme et s'ouvre dans un délai de 750 ms alors que l'œil droit reste ouvert.       |
| [xrrighteyewinked](xrrighteyewinked.md)                 | Cet événement est émis lorsque l'œil droit d'un visage suivi se ferme et s'ouvre dans un délai de 750 ms alors que l'œil gauche reste ouvert.       |
| [xrblinked](xrblinked.md)                               | Cet événement est émis lorsque les yeux d'un visage suivi clignotent.                                                                               |
| [xrinterpupillarydistance](xrinterpupillarydistance.md) | Cet événement est émis lorsque la distance en millimètres entre les centres de chaque pupille d'un visage suivi est détectée pour la première fois. |

## Événements émis par `xrhand` {#events-emitted-by-xrhand}

| Événement émis                      | Description                                                                                                           |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| [xrhandloading](xrhandloading.md)   | Cet événement est émis lorsque le chargement commence pour les ressources supplémentaires de hand AR. |
| [xrhandscanning](xrhandscanning.md) | Cet événement est émis lorsque les ressources AR ont été chargées et que le balayage a commencé.      |
| [xrhandfound](xrhandfound.md)       | Cet événement est émis lorsqu'une main est trouvée pour la première fois.                             |
| [xrhandupdated](xrhandupdated.md)   | Cet événement est émis lorsque la main est trouvée par la suite.                                      |
| [xrhandlost](xrhandlost.md)         | Cet événement est émis lorsqu'une main n'est plus suivie.                                             |
