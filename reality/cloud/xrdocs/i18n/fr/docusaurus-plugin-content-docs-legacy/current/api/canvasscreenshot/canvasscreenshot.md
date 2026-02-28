# XR8.CanvasCapture d'écran

## Description {#description}

Fournit un module de pipeline de caméra qui peut générer des captures d'écran de la scène actuelle.

## Fonctions {#functions}

| Fonction                                      | Description                                                                                                                                                                                    |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [configure](configure.md)                     | Configure le résultat attendu des captures d'écran de la toile.                                                                                                                |
| [pipelineModule](pipelinemodule.md)           | Crée un module de pipeline de caméra qui, lorsqu'il est installé, reçoit des rappels lorsque la caméra a démarré et lorsque la taille de la toile a changé.                    |
| [setForegroundCanvas](setforegroundcanvas.md) | Définit un canevas d'avant-plan à afficher au-dessus du canevas de la caméra. Les dimensions doivent être identiques à celles de la toile de l'appareil photo. |
| [takeScreenshot](takescreenshot.md)           | Renvoie une promesse qui, une fois résolue, fournit un tampon contenant l'image compressée JPEG. En cas de rejet, un message d'erreur est fourni.              |
