# XR8.PlayCanvas

PlayCanvas (<https://www.playcanvas.com/>) est un moteur de jeu 3D open-source/un moteur d'application 3D interactive
ainsi qu'une plateforme de création propriétaire hébergée dans le nuage qui permet
l'édition simultanée à partir de plusieurs ordinateurs via une interface basée sur un navigateur.

## Description {#description}

Fournit une intégration qui s'interface avec l'environnement et le cycle de vie de PlayCanvas pour piloter la caméra PlayCanvas
afin de réaliser des superpositions virtuelles.

## Fonctions {#functions}

| Fonction                                                              | Description                                                                                                                 |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| [run](run.md)                                                         | Ouvre la caméra avec les modules de pipeline spécifiés et commence à fonctionner dans une scène PlayCanvas. |
| [runXr (deprecated)](runxr.md)                     | Ouvre la caméra et lance le suivi du monde et/ou le suivi de l'image dans une scène PlayCanvas.             |
| [runFaceEffects (deprecated)](runfaceeffects.md)   | Ouvre la caméra et lance l'exécution des effets de visage dans une scène PlayCanvas.                        |
| [stop](stop.md)                                                       | Retirez les modules ajoutés dans [run](run.md) et arrêtez la caméra.                                        |
| [stopXr (obsolète)](stopxr.md)                     | Retirez les modules ajoutés dans [runXr](runxr.md) et arrêtez la caméra.                                    |
| [stopFaceEffects (deprecated)](stopfaceeffects.md) | Retirez les modules ajoutés dans [runFaceEffects](runfaceeffects.md) et arrêtez la caméra.                  |
