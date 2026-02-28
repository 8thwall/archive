# XR8.PlayCanvas

PlayCanvas (<https://www.playcanvas.com/>) est un moteur de jeu 3D open-source/un moteur d'application 3D interactif ainsi qu'une plateforme de création hébergée dans le cloud qui permet l'édition simultanée à partir de plusieurs ordinateurs via une interface basée sur un navigateur.

## Description {#description}

Fournit une intégration qui s'interface avec l'environnement et le cycle de vie de PlayCanvas pour piloter la caméra PlayCanvas afin de réaliser des superpositions virtuelles.

## Fonctions {#functions}

| Fonction                                         | Description                                                                                                 |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| [run](run.md)                                    | Ouvre la caméra avec les modules de pipeline spécifiés et commence à fonctionner dans une scène PlayCanvas. |
| [runXr (obsolète)](runxr.md)                     | Ouvre la caméra et lance le suivi du monde et/ou le suivi de l'image dans une scène PlayCanvas.             |
| [runFaceEffects (obsolète)](runfaceeffects.md)   | Ouvre la caméra et lance l'exécution des effets de visage dans une scène PlayCanvas.                        |
| [arrêter](stop.md)                               | Retirez les modules ajoutés à l'adresse [, exécutez](run.md) et arrêtez la caméra.                          |
| [stopXr (obsolète)](stopxr.md)                   | Retirez les modules ajoutés dans [runXr](runxr.md) et arrêtez la caméra.                                    |
| [stopFaceEffects (obsolète)](stopfaceeffects.md) | Retirez les modules ajoutés dans [runFaceEffects](runfaceeffects.md) et arrêtez la caméra.                  |
