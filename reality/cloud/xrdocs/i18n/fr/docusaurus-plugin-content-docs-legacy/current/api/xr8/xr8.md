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
| [run](run.md)                                                 | Ouvrez l'appareil photo et lancez la boucle d'exécution de l'appareil photo.                                                                                                                                                                |
| [runPreRender](runprerender.md)                               | Exécute toutes les mises à jour du cycle de vie qui doivent avoir lieu avant le rendu.                                                                                                                                                      |
| [runPostRender](runpostrender.md)                             | Exécute toutes les mises à jour du cycle de vie qui doivent avoir lieu après le rendu.                                                                                                                                                      |
| [stop](stop.md)                                               | Arrête la session XR en cours.  Lorsque l'appareil est arrêté, le flux de la caméra est fermé et les mouvements de l'appareil ne sont pas suivis.                                                                           |
| [version](version.md)                                         | Obtenir la version du moteur Web du 8e mur.                                                                                                                                                                                                 |

## Événements {#events}

| Événement émis | Description                                                             |
| -------------- | ----------------------------------------------------------------------- |
| xrloaded       | Cet événement est émis une fois que `XR8` a été chargé. |

## Modules {#modules}

| Module                                                         | Description                                                                                                                                                                         |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [AFrame](../aframe/aframe.md)                                  | Point d'entrée pour l'intégration du cadre A avec le 8e mur Web.                                                                                                    |
| [Babylonjs](../babylonjs/babylonjs.md)                         | Point d'entrée pour l'intégration de Babylon.js avec 8th Wall Web.                                                                                  |
| [CameraPixelArray](../camerapixelarray/camerapixelarray.md)    | Fournit un module de pipeline de caméra qui donne accès aux données de la caméra sous la forme d'un tableau uint8 en niveaux de gris ou en couleurs.                |
| [CanvasScreenshot](../canvasscreenshot/canvasscreenshot.md)    | Fournit un module de pipeline de caméra qui peut générer des captures d'écran de la scène actuelle.                                                                 |
| [FaceController](../facecontroller/facecontroller.md)          | Il permet la détection des visages et le maillage, ainsi que des interfaces pour la configuration du suivi.                                                         |
| [GlTextureRenderer](../gltexturerenderer/gltexturerenderer.md) | Fournit un module de pipeline de caméra qui dessine le flux de la caméra sur un canevas ainsi que des utilitaires supplémentaires pour les opérations de dessin GL. |
| [HandController](../handcontroller/handcontroller.md)          | Il permet la détection et le maillage des mains, ainsi que des interfaces pour la configuration du suivi.                                                           |
| [LayersController](../layerscontroller/layerscontroller.md)    | Fournit un module de pipeline de caméra qui permet la détection sémantique des couches et des interfaces pour configurer le rendu des couches.                      |
| [MediaRecorder](../mediarecorder/mediarecorder.md)             | Fournit un module de pipeline de caméra qui vous permet d'enregistrer une vidéo au format MP4.                                                                      |
| [PlayCanvas](../playcanvas/playcanvas.md)                      | Point d'entrée pour l'intégration de PlayCanvas avec 8th Wall Web.                                                                                                  |
| [Threejs](../threejs/threejs.md)                               | Fournit un module de pipeline de caméra qui pilote la caméra three.js pour réaliser des superpositions virtuelles.                                  |
| [Vps](../vps/vps.md)                                           | Les services publics pour parler aux services Vps.                                                                                                                  |
| [XrConfig](../xrconfig/xrconfig.md)                            | Spécification de la classe d'appareils et de caméras sur lesquels les modules de pipeline doivent être exécutés.                                                    |
| [XrController](../xrcontroller/xrcontroller.md)                | `XrController` fournit un suivi de caméra 6DoF et des interfaces pour configurer le suivi.                                                                          |
| [XrDevice](../xrdevice/xrdevice.md)                            | Fournit des informations sur la compatibilité et les caractéristiques des appareils.                                                                                |
| [XrPermissions](../xrpermissions/xrpermissions.md)             | Utilitaires permettant de spécifier les autorisations requises par un module de pipeline.                                                                           |
