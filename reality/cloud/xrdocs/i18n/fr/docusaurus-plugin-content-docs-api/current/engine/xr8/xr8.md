# XR8

## Description {#description}

Point d'entrée pour l'API Javascript de 8th Wall

## Fonctions {#functions}

| Fonction                                                      | Description                                                                                                                                                                                                                                                 |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [addCameraPipelineModule](addcamerapipelinemodule.md)         | Ajoute un module au pipeline de caméras qui recevra des rappels d'événements pour chaque étape du pipeline de caméras.                                                                                                                      |
| [addCameraPipelineModules](addcamerapipelinemodules.md)       | Ajouter plusieurs modules de pipeline de caméras. Il s'agit d'une méthode pratique qui appelle [addCameraPipelineModule](addcamerapipelinemodule.md) dans l'ordre pour chaque élément du tableau d'entrée.                  |
| [clearCameraPipelineModules](clearcamerapipelinemodules.md)   | Retirer tous les modules de canalisation de la caméra de la boucle de la caméra.                                                                                                                                                            |
| [initialiser](initialize.md)                                  | Renvoie une promesse qui est remplie lorsque le WebAssembly de l'AR Engine est initialisé.                                                                                                                                                  |
| [isInitialized](isinitialized.md)                             | Indique si le WebAssembly du moteur AR est initialisé ou non.                                                                                                                                                                               |
| [isPaused](ispaused.md)                                       | Indique si la session XR est en pause ou non.                                                                                                                                                                                               |
| [pause](pause.md)                                             | Mettre en pause la session XR en cours.  En cas de pause, le flux de la caméra est interrompu et les mouvements de l'appareil ne sont pas suivis.                                                                           |
| [resume](resume.md)                                           | Reprendre la session XR en cours.                                                                                                                                                                                                           |
| [removeCameraPipelineModule](removecamerapipelinemodule.md)   | Supprime un module du pipeline de la caméra.                                                                                                                                                                                                |
| [removeCameraPipelineModules](removecamerapipelinemodules.md) | Supprimer les modules de canalisation des caméras multiples. Il s'agit d'une méthode pratique qui appelle [removeCameraPipelineModule](removecamerapipelinemodule.md) dans l'ordre pour chaque élément du tableau d'entrée. |
| [requiredPermissions](requiredpermissions.md)                 | Renvoie une liste des autorisations requises par l'application.                                                                                                                                                                             |
| courir                                                        | Ouvrez l'appareil photo et lancez la boucle d'exécution de l'appareil photo.                                                                                                                                                                |
| [runPreRender](runprerender.md)                               | Exécute toutes les mises à jour du cycle de vie qui doivent avoir lieu avant le rendu.                                                                                                                                                      |
| [runPostRender](runpostrender.md)                             | Exécute toutes les mises à jour du cycle de vie qui doivent avoir lieu après le rendu.                                                                                                                                                      |
| [stop](stop.md)                                               | Arrête la session XR en cours.  Lorsque l'appareil est arrêté, le flux de la caméra est fermé et les mouvements de l'appareil ne sont pas suivis.                                                                           |
| [version](version.md)                                         | Obtenir la version du moteur Web du 8e mur.                                                                                                                                                                                                 |

## Événements {#events}

| Événement émis | Description                                                             |
| -------------- | ----------------------------------------------------------------------- |
| xrloaded       | Cet événement est émis une fois que `XR8` a été chargé. |

<!-- ## Modules {#modules}

Module | Description
-------- | -----------
[CameraPixelArray](../camerapixelarray/camerapixelarray.md) | Provides a camera pipeline module that gives access to camera data as a grayscale or color uint8 array.
[CanvasScreenshot](../canvasscreenshot/canvasscreenshot.md) | Provides a camera pipeline module that can generate screenshots of the current scene.
[Vps](../vps/vps.md) | Utilities to talk to Vps services.
[XrDevice](../xrdevice/xrdevice.md) | Provides information about device compatibility and characteristics.
[XrPermissions](../xrpermissions/xrpermissions.md) | Utilities for specifying permissions required by a pipeline module. -->
